// ============================================================
//  🔀 CLOUDFLARE WORKER — ROTEAMENTO
//  ============================================================
//  Este Worker faz o domínio único (tamacavi.com.br) apontar
//  para vários sistemas hospedados em plataformas diferentes
//  (Render, Railway, Fly.io, etc.), SEM o usuário ver o endereço
//  real. Exemplo:
//
//      tamacavi.com.br/vendas   →  https://vendas.up.railway.app
//      tamacavi.com.br/estoque  →  https://estoque.onrender.com
//
//  ➜ Edite apenas a lista de ROTAS abaixo.
//  ============================================================

// ── ROTAS (edite aqui) ─────────────────────────────────────
// formato:  "/caminho" : "https://endereco-real-do-sistema"
const ROTAS = {
  // "/vendas":  "https://vendas.up.railway.app",
  // "/estoque": "https://estoque.onrender.com",
  // "/fiscal":  "https://fiscal.fly.dev",
};

const HUB_URL = "https://tamacavi.com.br"; // landing page principal

// ── Lógica (não precisa editar abaixo) ─────────────────────
export default {
  async fetch(request) {
    const url = new URL(request.url);
    const caminho = url.pathname;

    // Remove a barra final e normaliza
    const chave = caminho.length > 1 ? caminho.replace(/\/$/, "") : caminho;

    if (ROTAS[chave]) {
      // Redireciona para o sistema correspondente
      return Response.redirect(ROTAS[chave], 302);
    }

    if (caminho === "/" || caminho === "") {
      // Raiz → landing page (Cloudflare Pages)
      return fetch(HUB_URL);
    }

    // Caminho desconhecido → 404
    return new Response("Página não encontrada", { status: 404 });
  },
};
