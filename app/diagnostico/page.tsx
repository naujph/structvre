"use client";

import { useEffect, useMemo, useState } from "react";
import { Welcome } from "@/components/diagnostic/welcome";
import { QuestionCard } from "@/components/diagnostic/question-card";
import { ContactForm, ContactData } from "@/components/diagnostic/contact-form";
import { ResultCard } from "@/components/diagnostic/result-card";
import { SiteHeader } from "@/components/mobile-nav";
import {
  DiagnosticQuestion,
  groupByStage,
} from "@/lib/diagnostic/questions";
import { resolveBackground } from "@/lib/diagnostic/backgrounds";
import { formatCurrency } from "@/lib/format";

interface Recommendation {
  kit_id: number;
  name: string;
  slug: string;
  category: string;
  total_price: number;
  image_url?: string | null;
  score: number;
  score_breakdown: Record<string, number>;
  explanation: string;
  reasons: string[];
  products: {
    id: number;
    name: string;
    brand: string;
    category: string;
    price: number;
    quantity: number;
    affiliate_url?: string;
    marketplace_url?: string;
    image_url?: string | null;
    requires_professional: boolean;
    difficulty: string;
  }[];
}

export default function DiagnosticPage() {
  const [questions, setQuestions] = useState<DiagnosticQuestion[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [sessionId, setSessionId] = useState<number | null>(null);

  const [view, setView] = useState<"welcome" | "quiz" | "contact" | "result" | "loading">(
    "welcome"
  );

  const [stageIndex, setStageIndex] = useState(0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [answers, setAnswers] = useState<
    Record<string, string | string[] | null>
  >({});
  const [lastAnsweredCode, setLastAnsweredCode] = useState<string | null>(null);
  const [detectedPersona, setDetectedPersona] = useState<string | null>(null);
  const [pricePreview, setPricePreview] = useState<number | null>(null);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(
    null
  );

  const stages = useMemo(() => groupByStage(questions), [questions]);

  // Carrega perguntas
  useEffect(() => {
    fetch("/api/v1/diagnostic/questions")
      .then((r) => r.json())
      .then((data) => {
        setQuestions(data.questions || []);
      })
      .catch((err) => {
        console.error("Erro ao carregar perguntas:", err);
      })
      .finally(() => setLoadingQuestions(false));
  }, []);

  const currentStage = stages[stageIndex];
  const currentQuestion = currentStage?.questions[questionIndex];

  const backgroundImage = useMemo(() => {
    const stageKey = currentStage?.key || view;
    return resolveBackground(
      stageKey,
      answers,
      lastAnsweredCode,
      detectedPersona
    );
  }, [currentStage, view, answers, lastAnsweredCode, detectedPersona]);

  function createSession() {
    return fetch("/api/v1/diagnostic/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ channel: "web" }),
    }).then((r) => r.json());
  }

  async function saveAnswers(nextAnswers: Record<string, string | string[] | null>) {
    if (!sessionId) return;
    const payload = Object.entries(nextAnswers)
      .filter(([_, value]) => value !== null && value !== undefined && value !== "")
      .map(([code, value]) => ({ question_code: code, value }));

    try {
      const resp = await fetch(`/api/v1/diagnostic/sessions/${sessionId}/answers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: payload }),
      });
      const data = await resp.json();
      if (data.detected_persona) setDetectedPersona(data.detected_persona);
      if (data.price_preview != null) setPricePreview(data.price_preview);
    } catch (err) {
      console.error("Erro ao salvar respostas:", err);
    }
  }

  async function handleStart() {
    setLoadingQuestions(true);
    try {
      const data = await createSession();
      setSessionId(data.session_id);
      setView("quiz");
      setStageIndex(0);
      setQuestionIndex(0);
    } catch (err) {
      console.error("Erro ao iniciar:", err);
      alert("Não foi possível iniciar o diagnóstico.");
    } finally {
      setLoadingQuestions(false);
    }
  }

  function advance() {
    if (!currentStage) return;
    setDirection(1);
    if (questionIndex < currentStage.questions.length - 1) {
      setQuestionIndex((i) => i + 1);
    } else if (stageIndex < stages.length - 1) {
      setStageIndex((i) => i + 1);
      setQuestionIndex(0);
    } else {
      setView("contact");
    }
  }

  function goBack() {
    setDirection(-1);
    if (questionIndex > 0) {
      setQuestionIndex((i) => i - 1);
    } else if (stageIndex > 0) {
      setStageIndex((i) => i - 1);
      setQuestionIndex(stages[stageIndex - 1].questions.length - 1);
    }
  }

  function skipStage() {
    if (!currentStage?.optional) return;
    for (const q of currentStage.questions) {
      if (answers[q.code] === undefined) {
        setAnswers((a) => ({ ...a, [q.code]: null }));
      }
    }
    advance();
  }

  async function handleAnswerChange(value: string | string[]) {
    const nextAnswers = { ...answers, [currentQuestion!.code]: value };
    setAnswers(nextAnswers);
    setLastAnsweredCode(currentQuestion!.code);
    await saveAnswers(nextAnswers);

    if (currentQuestion!.type === "single") {
      setTimeout(() => advance(), 420);
    }
  }

  async function handleContactSubmit(contact: ContactData) {
    setView("loading");
    try {
      const resp = await fetch(
        `/api/v1/diagnostic/sessions/${sessionId}/recommendations`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            limit: 3,
            save_project: true,
            contact,
          }),
        }
      );
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || "Erro ao carregar recomendação");
      setRecommendation(data.top_recommendations?.[0] || null);
      setView("result");
    } catch (err: any) {
      console.error(err);
      alert("Erro ao carregar recomendação: " + err.message);
      setView("contact");
    }
  }

  const progress = useMemo(() => {
    const total = questions.length + 2;
    const answered = Object.values(answers).filter(
      (v) => v !== null && v !== undefined && (Array.isArray(v) ? v.length > 0 : v !== "")
    ).length;
    return Math.min(100, Math.round((answered / total) * 100));
  }, [answers, questions.length]);

  if (loadingQuestions) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-400">
        Carregando diagnóstico...
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Dynamic background */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-cover bg-center transition-all duration-1000"
        style={{ backgroundImage: `url('${backgroundImage}')` }}
      >
        <div className="absolute inset-0 bg-slate-950/70" />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/30 via-transparent to-slate-950/80" />
      </div>

      <SiteHeader />

      {/* Progress bar shown on quiz/contact */}
      {(view === "quiz" || view === "contact") && (
        <div className="sticky top-[65px] z-40 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
          <div className="mx-auto flex max-w-3xl items-center gap-3 px-4 py-2.5 sm:px-6">
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-cyan-400 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-slate-400">{progress}%</span>
          </div>
        </div>
      )}

      <main className="relative z-10 flex min-h-[calc(100vh-80px)] flex-col items-center justify-center px-4 py-10 sm:px-6 sm:py-12">
        {view === "welcome" && <Welcome onStart={handleStart} />}

        {view === "quiz" && currentQuestion && currentStage && (
          <div className="w-full">
            <div className="mb-8 flex items-center justify-center gap-2">
              {stages.map((s, i) => (
                <button
                  key={s.key}
                  onClick={() => {
                    if (i < stageIndex || (i === stageIndex && questionIndex > 0)) {
                      setDirection(-1);
                      setStageIndex(i);
                      setQuestionIndex(
                        i < stageIndex ? s.questions.length - 1 : 0
                      );
                    }
                  }}
                  className={`h-2.5 rounded-full transition-all ${
                    i === stageIndex
                      ? "w-8 bg-cyan-400"
                      : i < stageIndex
                      ? "w-2.5 bg-cyan-400/50"
                      : "w-2.5 bg-white/20"
                  }`}
                  aria-label={`Etapa ${s.label}`}
                />
              ))}
            </div>

            <QuestionCard
              question={currentQuestion}
              stageLabel={currentStage.label}
              stageSubtitle={currentStage.subtitle}
              currentIndex={questionIndex}
              total={currentStage.questions.length}
              value={answers[currentQuestion.code]}
              onChange={handleAnswerChange}
              direction={direction}
            />

            <div className="mx-auto mt-6 flex w-full max-w-3xl flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <button
                onClick={goBack}
                className="rounded-full border border-white/20 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 sm:px-6"
              >
                ← Voltar
              </button>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                {currentStage.optional && (
                  <button
                    onClick={skipStage}
                    className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-slate-300 transition hover:bg-white/10"
                  >
                    Pular etapa
                  </button>
                )}
                {currentQuestion.type === "multi" && (
                  <button
                    onClick={advance}
                    disabled={
                      !answers[currentQuestion.code] ||
                      (Array.isArray(answers[currentQuestion.code]) &&
                        (answers[currentQuestion.code] as string[]).length === 0)
                    }
                    className="rounded-full bg-cyan-400 px-5 py-3 text-sm font-bold text-slate-950 shadow-[0_0_20px_rgba(34,211,238,0.3)] transition hover:bg-cyan-300 disabled:opacity-40 sm:px-6"
                  >
                    Avançar →
                  </button>
                )}
              </div>
            </div>

            {pricePreview !== null && (
              <div className="mx-auto mt-6 flex w-full max-w-3xl justify-end">
                <div className="rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-300">
                  Investimento estimado: {formatCurrency(pricePreview)}
                </div>
              </div>
            )}
          </div>
        )}

        {view === "contact" && (
          <ContactForm
            onSubmit={handleContactSubmit}
            onBack={() => setView("quiz")}
          />
        )}

        {view === "loading" && (
          <div className="text-center text-white">
            <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-cyan-400/20 border-t-cyan-400" />
            Preparando sua recomendação...
          </div>
        )}

        {view === "result" && recommendation && (
          <ResultCard
            recommendation={recommendation}
            personaName="seu perfil"
          />
        )}
      </main>
    </div>
  );
}
