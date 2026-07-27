import type { SVGProps } from "react";

/**
 * Strucvre — logo (redesign)
 *
 * Marca: "S" geometrico desenhado como um fluxo/trilha (stroke arredondado),
 * com um pequeno no (node) branco no terminal superior — referencia sutil a
 * automacao/fluxo conectado, sem apelar para glow ou gradiente cromado.
 * Wordmark: "Strucvre" em Inter/system, peso 600, tracking leve negativo.
 * Acento cyan (#22d3ee) aparece apenas na marca; o texto segue a cor do tema
 * (--text) para funcionar sobre fundo escuro (header/footer).
 *
 * Server component (sem estado/animacao). viewBox 160x44. className via prop
 * (ex.: "h-7" no header).
 */
export function Logo({ className = "", ...props }: { className?: string } & SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 160 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="Strucvre"
      {...props}
    >
      {/* Marca — S geometrico + no de automacao */}
      <g>
        <path
          d="M32.2 11.2c0-2.7-3.1-4.6-7.7-4.6-5.1 0-8.8 2.2-8.8 6.5 0 4.2 3.6 6.2 8.8 7.9 5.1 1.6 8.7 3.6 8.7 7.9 0 4.3-3.7 6.5-8.8 6.5-4.5 0-7.9-1.7-9-4.2"
          stroke="#22d3ee"
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* no / ponto acentuado (branco) no terminal superior do S */}
        <circle cx="32.2" cy="11.2" r="2.4" fill="#f0f9ff" />
      </g>

      {/* Wordmark */}
      <text
        x="46"
        y="29"
        fill="#f0f9ff"
        fontFamily="'Inter', 'Segoe UI', system-ui, sans-serif"
        fontSize="21"
        fontWeight="600"
        letterSpacing="-0.6"
        textRendering="geometricPrecision"
      >
        Strucvre
      </text>
    </svg>
  );
}