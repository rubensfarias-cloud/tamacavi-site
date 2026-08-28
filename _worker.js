// ============================================================
//  🎭 CLOUDFLARE WORKER — ROTEAMENTO MASCARADO (PROXY)
//  ============================================================
//  Faz o domínio único (tamacavi.com.br) "mascarar" sistemas
//  hospedados em plataformas externas (Render, Railway, etc.).
//
//  O usuário acessa:
//      tamacavi.com.br/financeiro
//  e o Worker busca o conteúdo (HTML E assets) no endereço real,
//  mas o usuário continua vendo "tamacavi.com.br/financeiro"
//  na barra — nunca o endereço real.
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
    const caminho = url.pathname;

    // Se pedir a raiz, deixa o site hub responder
    if (caminho === "/" || caminho === "") {
      return env.ASSETS.fetch(request);
    }

    // Normaliza o caminho (remove barra final) para rotas de "página"
    const chave = caminho.length > 1 ? caminho.replace(/\/$/, "") : caminho;

    // (1) Rota direta de uma página mapeada (ex: /financeiro)
    if (ROTAS[chave]) {
      return await proxy(ROTAS[chave], url, request, chave);
    }

    // (2) Asset/arquivo estático pertencente a um sistema roteado.
    //     Detecta o slug da rota no início do caminho, ex: /financeiro/assets/x
    const slug = "/" + caminho.split("/")[1];
    if (ROTAS[slug]) {
      // Remove o slug do início: /financeiro/assets/x -> /assets/x
      const caminhoReal = caminho.replace(new RegExp("^" + slug), "") || "/";
      const destino = new URL(ROTAS[slug]);
      const urlCompleta = new URL(caminhoReal + url.search, destino.origin);
      return await fetchDestino(urlCompleta.toString(), request);
    }

    // (3) Queda: deixa o site estático responder (index.html p/ SPA hub)
    return env.ASSETS.fetch(request);
  },
}

// Proxy de uma página de sistema (reescreve HTML para mascarar)
async function proxy(destinoBase, urlOriginal, request, slug) {
  const destino = new URL(destinoBase);
  const caminhoNoDestino = destino.pathname || "/";
  const urlCompleta = new URL(caminhoNoDestino + urlOriginal.search, destino.origin);

  const resp = await fetch(urlCompleta.toString(), {
    method: request.method,
    headers: request.headers,
    redirect: "manual",
  });

  // Se for redirecionamento do sistema real, reescreve a localização
  if (resp.status >= 300 && resp.status < 400) {
    const location = resp.headers.get("location");
    if (location) {
      const nova = new URL(location, destino.origin);
      return new Response(null, {
        status: 302,
        headers: { Location: mascararURL(nova.toString(), urlOriginal.origin, slug) },
      });
    }
  }

  const contentType = resp.headers.get("content-type") || "text/plain";
  const body = await resp.text();

  // Se for HTML, reescreve os links para manter o mascaramento
  if (contentType.includes("text/html")) {
    return new Response(reescreverHTML(body, destino.origin, urlOriginal.origin, slug), {
      status: resp.status,
      headers: {
        "content-type": contentType,
        "cache-control": "no-cache",
      },
    });
  }

  // Outros tipos: repassa o corpo como está
  return new Response(body, {
    status: resp.status,
    headers: {
      "content-type": contentType,
      "cache-control": "no-cache",
    },
  });
}

// Busca direta de um asset/arquivo no destino real (sem reescrita de HTML)
async function fetchDestino(urlString, request) {
  const resp = await fetch(urlString, {
    method: request.method,
    headers: request.headers,
    redirect: "follow",
  });
  const contentType = resp.headers.get("content-type") || "application/octet-stream";
  const body = await resp.arrayBuffer();
  return new Response(body, {
    status: resp.status,
    headers: {
      "content-type": contentType,
      "cache-control": "public, max-age=604800",
    },
  });
}

// Converte uma URL do destino real para o domínio mascarado com o slug
function mascararURL(urlString, novoOrigem, slug) {
  try {
    const u = new URL(urlString);
    // Caminho relativo -> prefixa com o slug
    const caminho = u.pathname;
    return novoOrigem + slug + caminho;
  } catch (e) {
    return urlString;
  }
}

// Reescreve URLs dentro do HTML para manter o mascaramento
function reescreverHTML(html, origemReal, novoOrigem, slug) {
  let resultado = html;
  // Substitui o endereço real completo pelo nosso domínio (mantendo o caminho + slug)
  resultado = resultado.split(origemReal).join(novoOrigem + slug);
  // Também trata a menção sem protocolo
  const realSemProto = origemReal.replace(/^https?:\/\//, "");
  const novoSemProto = novoOrigem.replace(/^https?:\/\//, "");
  resultado = resultado.split(realSemProto).join(novoSemProto + slug);
  return resultado;
}
