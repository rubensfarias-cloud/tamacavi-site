// ============================================================
//  🎭 CLOUDFLARE WORKER — ROTEAMENTO MASCARADO (PROXY)
//  ============================================================
//  Faz o domínio único (tamacavi.com.br) "mascarar" sistemas
//  hospedados em plataformas externas (Render, Railway, etc.).
//
//  O usuário acessa:
//      tamacavi.com.br/financeiro
//  e o Worker busca o conteúdo no endereço real, mas o usuário
//  continua vendo "tamacavi.com.br/financeiro" na barra — nunca
//  o endereço real.
//
//  ➜ Edite apenas a lista de ROTAS abaixo.
//  ============================================================

// ── ROTAS (edite aqui) ─────────────────────────────────────
// formato:  "/caminho" : "https://endereco-real-do-sistema"
const ROTAS = {
  "/financeiro": "https://planejamento-financeiro-q4lc.onrender.com/",
  // "/vendas":   "https://vendas.up.railway.app",
  // "/estoque":  "https://estoque.onrender.com",
};

// ── Lógica do proxy (não precisa editar abaixo) ────────────
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // Se pedir um caminho raiz ou comum, deixa o site hub responder
    // (a Cloudflare serve o index.html estático para caminhos não roteados).
    if (url.pathname === "/" || url.pathname === "") {
      return env.ASSETS.fetch(request);
    }

    // Normaliza o caminho (remove barra final)
    const chave = url.pathname.length > 1
      ? url.pathname.replace(/\/$/, "")
      : url.pathname;

    // Se o caminho está nas rotas → faz o proxy mascarado
    if (ROTAS[chave]) {
      return await proxy(ROTAS[chave], url, request);
    }

    // Queda para o site estático (deixa a Cloudflare servir index)
    return env.ASSETS.fetch(request);
  },
}

// Função que busca o sistema real e reescreve os links para mascarar
async function proxy(destinoBase, urlOriginal, request) {
  const destino = new URL(destinoBase);

  // Constrói a URL completa no destino (preserva query string)
  const caminhoNoDestino = urlOriginal.pathname === "/financeiro"
    ? destino.pathname || "/"
    : urlOriginal.pathname;
  const urlCompleta = new URL(caminhoNoDestino + urlOriginal.search, destino.origin);

  // Faz a requisição real ao sistema
  const resp = await fetch(urlCompleta.toString(), {
    method: request.method,
    headers: request.headers,
    redirect: "manual",
  });

  // Se for redirecionamento do sistema real, encaminha
  if (resp.status >= 300 && resp.status < 400) {
    const location = resp.headers.get("location");
    if (location) {
      // Reescreve para manter no nosso domínio
      const nova = new URL(location, destino.origin);
      return new Response(null, {
        status: 302,
        headers: { Location: trocarDominio(nova.toString(), urlOriginal.origin) },
      });
    }
  }

  // Copia o corpo e o content-type
  const contentType = resp.headers.get("content-type") || "text/plain";
  let body = await resp.text();

  // Se for HTML, reescreve os links para o endereço real ficar escondido
  if (contentType.includes("text/html")) {
    body = reescreverHTML(body, destino.origin, urlOriginal.origin);
  }

  return new Response(body, {
    status: resp.status,
    headers: {
      "content-type": contentType,
      "cache-control": "no-cache",
    },
  });
}

// Troca o domínio real pelo nosso domínio mascarado numa URL
function trocarDominio(urlString, novoOrigem) {
  try {
    const u = new URL(urlString);
    const caminho = u.pathname;
    return novoOrigem + caminho + (u.pathname.startsWith("/financeiro") ? "" : "");
  } catch (e) {
    return urlString;
  }
}

// Reescreve URLs dentro do HTML para manter o mascaramento
function reescreverHTML(html, origemReal, novoOrigem) {
  // Substitui referências ao domínio real pelo nosso
  return html
    .split(origemReal).join(novoOrigem)
    // também tenta sem protocolo
    .split(origemReal.replace(/^https?:\/\//, "")).join(novoOrigem.replace(/^https?:\/\//, ""));
}
