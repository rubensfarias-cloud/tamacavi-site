// ============================================================
//  ⚙️ CONFIGURAÇÃO DOS SISTEMAS
//  ============================================================
//  ➜ Este é o arquivo que VOCÊ edita para adicionar sistemas.
//
//  COMO ADICIONAR UM NOVO SISTEMA:
//  1. Copie um bloco entre "{" e "}," (incluindo as 2 vírgulas do final)
//  2. Cole logo abaixo, na posição desejada
//  3. Altere os valores:
//        nome          → Nome do sistema (aparece no card)
//        descricao     → Pequena descrição
//        url           → Endereço real onde o sistema roda
//        icone         → Emoji de ícone (opcional)
//        categoria     → Categoria: "internos" | "clientes" | "landing"
//        destaque      → true para destacar em azul (só 1-2 por vez)
//  4. Salve o arquivo. O site atualiza automaticamente.
//
//  Para REMOVER: apague o bloco inteiro do sistema.
//  ============================================================

const SISTEMAS = {
  // ── Sistemas internos (seus) ──────────────────────────────
  internos: [
    {
      nome: "Controle Financeiro",
      descricao: "Gestão de planejamento e controle financeiro.",
      url: "https://planejamento-financeiro-q4lc.onrender.com/",
      icone: "💰",
      destaque: true
    },
    // {
    //   nome: "Nome do Sistema",
    //   descricao: "Descrição breve do que o sistema faz.",
    //   url: "https://endereco-do-sistema.com",
    //   icone: "📊",
    //   destaque: true
    // },
  ],

  // ── Sistemas para clientes ────────────────────────────────
  clientes: [
    // {
    //   nome: "Sistema do Cliente",
    //   descricao: "Descrição do sistema.",
    //   url: "https://endereco-do-sistema.com",
    //   icone: "💼",
    //   destaque: false
    // },
  ],

  // ── Links para landing pages / sites ──────────────────────
  landing: [
    // {
    //   nome: "Site Institucional",
    //   descricao: "Nosso site principal.",
    //   url: "https://meu-site.com",
    //   icone: "🌐",
    //   destaque: false
    // },
  ]
};
