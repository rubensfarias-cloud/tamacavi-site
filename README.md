# 🌐 Landing Page Tamacavi

Central de sistemas e ferramentas — uma única página que organiza e dá acesso a todos os seus sistemas em um só domínio: **tamacavi.com.br**

---

## 📁 Estrutura do Projeto

```
Landing Page/
├── index.html     → Página principal (visual + lógica)
├── sistemas.js    → ⚙️ ARQUIVO QUE VOCÊ EDITA (lista de sistemas)
├── worker.js      → 🔀 Roteamento opcional (caminhos → sistemas externos)
└── README.md      → Este guia
```

---

## ✏️ Como Adicionar um Novo Sistema

> **Você só precisa editar o arquivo `sistemas.js`.** O site se atualiza sozinho.

### Passo a passo:

1. Abra o arquivo **`sistemas.js`** em qualquer editor de texto
2. Encontre a categoria desejada: `internos`, `clientes` ou `landing`
3. **Copie** um bloco de exemplo (entre `{` e `}`) e **cole** abaixo
4. **Preencha** os campos:

```javascript
{
  nome: "Nome do Sistema",          // ← Nome que aparece no card
  descricao: "Breve descrição",     // ← O que o sistema faz
  url: "https://endereco.com",      // ← URL real onde roda
  icone: "📊",                      // ← Emoji (opcional)
  destaque: false                   // ← true = card azul em destaque
}
```

5. **Salve** o arquivo e **publique** (time abaixo)

### Exemplo funcional:

```javascript
internos: [
  {
    nome: "Controle Financeiro",
    descricao: "Gestão de receitas e despesas da empresa.",
    url: "https://financas.tamacavi.com",
    icone: "💰",
    destaque: true
  },
  {
    nome: "Estoque",
    descricao: "Controle de inventário e produtos.",
    url: "https://estoque.tamacavi.com",
    icone: "📦",
    destaque: false
  },
]
```

### Como remover:
- Apague o bloco inteiro `{ ... }` do sistema que não quer mais.

---

## 🧩 Categorias

| Categoria | Uso |
|---|---|
| `internos` | Seus próprios sistemas (financeiro, estoque, etc.) |
| `clientes` | Sistemas que você desenvolve para clientes |
| `landing` | Sites e landing pages |

---

## 🚀 Como Publicar (Cloudflare Pages — Grátis)

O site é **estático** (só HTML+JS), então o Cloudflare Pages é perfeito — grátis e automático.

### Opção A — Pelo site (mais simples)

1. Crie uma conta em **dash.cloudflare.com**
2. Vá em **Workers & Pages** → **Create** → **Pages**
3. Conecte seu **GitHub** e escolha o repositório deste projeto
4. Build settings:
   - **Build command:** (deixe vazio)
   - **Build output directory:** `/` (ou `public`)
5. Depois vá em **Custom domains** → adicione `tamacavi.com.br`

### Opção B — Pelo terminal (wrangler)

```bash
# Apenas se quiser a CLI (não precisa para usar)
npm install -g wrangler
```

---

## 🔗 Conectando o Domínio

1. Compre/tenha o domínio **tamacavi.com.br** no Registrar.br
2. Na Cloudflare, adicione o site na **Cloudflare** → ela mostrará **2 nameservers**
3. No painel do Registrar.br, troque os nameservers do seu domínio pelos da Cloudflare
4. Aguarde a propagação (pode levar de minutos a algumas horas)
5. No Cloudflare **Pages** → **Custom domains** → adicione `tamacavi.com.br`

> Após isso, qualquer sistema novo que você adicionar em `sistemas.js` e publicar, aparecerá automaticamente em `tamacavi.com.br`.

---

## 🔀 Roteamento Avançado (opcional — worker.js)

Se quiser que o domínio `tamacavi.com.br` **traga os sistemas diretamente** (sem mostrar o endereço da plataforma), use o `worker.js`.

**Exemplo:** o usuário acessa `tamacavi.com.br/vendas` e cai direto no sistema que você hospeda no Railway — sem ele nunca ver o endereço real.

### Como configurar:

1. No Cloudflare → **Workers & Pages** → **Create** → **Worker**
2. Cole o conteúdo do `worker.js`
3. Edite a lista `ROTAS` lá dentro com seus sistemas:
   ```javascript
   const ROTAS = {
     "/vendas": "https://vendas.up.railway.app",
     "/estoque": "https://estoque.onrender.com",
   };
   ```
4. **Save and Deploy** → **Settings** → **Triggers** → **Custom Domain** → `tamacavi.com.br`

> Com o Worker ativo, o `tamacavi.com.br` inteiro passa pelo Worker (raiz → hub, caminhos → sistemas). Se preferir manter tudo apenas no Pages, basta **não** publicar o Worker.

---

## ❓ Dúvidas Frequentes

**Preciso instalar algo?** Não! O projeto é só HTML + JS, roda em qualquer hospedagem estática.

**Posso usar outro provedor (Vercel/Netlify/GitHub Pages)?** Sim! Qualquer hospedagem de site estático funciona.

**O que acontece se eu apagar tudo de `sistemas.js`?** O site mostra um aviso "Nenhum sistema cadastrado".

---

## 📝 Observações

- Ícones: use qualquer emoji (📊 💰 📦 🎯 📞 ⚙️ ...)
- O campo `destaque: true` deixa o card azul — use para 1 ou 2 sistemas principais
- A ordem dos cards segue a ordem que você coloca no `sistemas.js`
