import type { Product } from "@prisma/client";

/**
 * Construção de links de afiliado em runtime.
 *
 * O banco guarda só a URL "crua" do produto (marketplaceUrl, opcional) e o
 * programa (marketplace). O link final é montado aqui, lendo os IDs do .env.
 *
 * Estratégia híbrida (por produto):
 *   1. affiliateUrl manual válido      → respeita (override)
 *   2. marketplaceUrl real preenchida   → monta link exato com a tag
 *   3. só marketplace + nome do produto → monta link de BUSCA com a tag
 *      (cookie de afiliado setado no pouso; converte menos, mas nunca quebra
 *       e não exige curadoria de URL por produto)
 *   4. nada                            → "#"
 *
 * Programas: amazon | shopee | mercadolivre | aliexpress
 *
 * IMPORTANTE: os formatos abaixo são os atalhos manuais de cada programa.
 * Valide o esquema de tracking no seu painel antes de publicar — alguns
 * programas mudam o formato. Sem ID configurado no env, devolve a URL crua.
 */

export type Marketplace = "amazon" | "shopee" | "mercadolivre" | "aliexpress";

type AffiliateInput = Pick<Product, "name" | "marketplace" | "marketplaceUrl" | "affiliateUrl">;

function env(key: string): string | undefined {
  if (typeof process === "undefined") return undefined;
  return process.env[key]?.trim() || undefined;
}

function isPlaceholder(url: string | null | undefined): boolean {
  if (!url) return true;
  const v = url.trim();
  return v === "" || v === "#";
}

function withAmazonTag(url: string, tag: string): string {
  try {
    const u = new URL(url);
    u.searchParams.set("tag", tag);
    return u.toString();
  } catch {
    return url;
  }
}

function withShopeeUniversal(url: string, affiliateId: string): string {
  const redir = encodeURIComponent(url);
  return `https://shopee.com.br/universal-link?affiliate_id=${encodeURIComponent(
    affiliateId,
  )}&redirection_url=${redir}`;
}

function withMercadoLivreAwin(url: string, affId: string): string {
  const redirect = encodeURIComponent(url);
  return `https://tracking.mercadolivre.com.br/affiliate?origin=ml&redirect=${redirect}&aff=${encodeURIComponent(
    affId,
  )}`;
}

function withAliExpress(url: string, affId: string): string {
  try {
    const u = new URL(url);
    u.searchParams.set("aff_fcid", affId);
    return u.toString();
  } catch {
    return url;
  }
}

function slugify(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** URL de busca (sem tag) no marketplace, pelo termo informado. */
export function buildSearchUrl(marketplace: Marketplace, query: string): string {
  const q = query.trim();
  switch (marketplace) {
    case "amazon":
      return `https://www.amazon.com.br/s?k=${encodeURIComponent(q)}`;
    case "shopee":
      return `https://shopee.com.br/search?keyword=${encodeURIComponent(q)}`;
    case "mercadolivre":
      // ML aceita o termo direto no path: lista.mercadolivre.com.br/<slug>
      return `https://lista.mercadolivre.com.br/${encodeURIComponent(slugify(q))}`;
    case "aliexpress":
      return `https://www.aliexpress.com/wholesale?SearchText=${encodeURIComponent(q)}`;
  }
}

/** Aplica a tag/ID de afiliado a qualquer URL (exata ou de busca). */
export function tagUrl(marketplace: Marketplace, url: string): string {
  switch (marketplace) {
    case "amazon": {
      const tag = env("AFFILIATE_AMAZON_TAG");
      return tag ? withAmazonTag(url, tag) : url;
    }
    case "shopee": {
      const id = env("AFFILIATE_SHOPEE_ID");
      return id ? withShopeeUniversal(url, id) : url;
    }
    case "mercadolivre": {
      const id = env("AFFILIATE_ML_AWIN_ID");
      return id ? withMercadoLivreAwin(url, id) : url;
    }
    case "aliexpress": {
      const id = env("AFFILIATE_ALIEXPRESS_ID");
      return id ? withAliExpress(url, id) : url;
    }
  }
}

export function buildAffiliateUrl(product: AffiliateInput): string {
  // 1. override manual
  const manual = product.affiliateUrl?.trim();
  if (manual && manual !== "#") return manual;

  const marketplace = (product.marketplace as Marketplace | null) ?? null;
  if (!marketplace) return "#";

  // 2. URL exata do produto
  const raw = product.marketplaceUrl?.trim();
  if (!isPlaceholder(raw)) return tagUrl(marketplace, raw!);

  // 3. fallback: busca por nome com a tag
  const query = product.name?.trim();
  if (query) return tagUrl(marketplace, buildSearchUrl(marketplace, query));

  return "#";
}