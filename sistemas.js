// ============================================================
//  ⚙️ CONFIGURAÇÃO DOS SISTEMAS
//  ============================================================
//  ➜ Este é o arquivo que VOCÊ edita para adicionar sistemas.
//
//  O site é dividido em COLUNAS, cada uma com um DROPDOWN
//  (menu suspenso) que lista os sistemas daquela categoria.
//
//  COMO ADICIONAR UM NOVO SISTEMA:
//  1. Abra a coluna/categoria desejada (financeira, agropecuaria, futura)
//  2. Copie um bloco entre "{" e "}," e cole dentro do array
//  3. Altere os valores:
//        nome      → Nome do sistema (aparece no dropdown)
//        url       → Endereço real onde o sistema roda
//  4. Salve o arquivo. O site atualiza automaticamente.
//
//  Para REMOVER: apague o bloco inteiro do sistema.
//  ============================================================

const SISTEMAS = {
  // ── Coluna 1: Gestão Financeira ───────────────────────────
  financeira: {
    titulo: "Gestão Financeira",
    sistemas: [
      {
        nome: "Controle Financeiro",
        url: "https://planejamento-financeiro-q4lc.onrender.com/",
      },
      // {
      //   nome: "Outro Sistema Financeiro",
      //   url: "https://endereco-do-sistema.com",
      // },
    ],
  },

  // ── Coluna 2: Sistema de Gestão Agropecuária ─────────────
  agropecuaria: {
    titulo: "Sistema de Gestão Agropecuária",
    sistemas: [
      // {
      //   nome: "Nome do Sistema Agro",
      //   url: "https://endereco-do-sistema.com",
      // },
    ],
  },

  // ── Coluna 3: (futura categoria) ─────────────────────────
  futura: {
    titulo: "Próxima Categoria",
    sistemas: [
      // {
      //   nome: "Nome do Sistema",
      //   url: "https://endereco-do-sistema.com",
      // },
    ],
  },
};
