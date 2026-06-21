# FinanceFlow - Sistema de Controle Financeiro Familiar

Uma aplicação SaaS moderna e elegante de controle financeiro familiar, construída com Next.js 15, React 19, TypeScript, Tailwind CSS e Supabase.

## 🚀 Stack Tecnológica

### Frontend
- **Next.js 15** - Framework React com App Router
- **React 19** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização utility-first
- **Shadcn/UI** - Componentes UI reutilizáveis
- **Framer Motion** - Animações suaves
- **Recharts** - Gráficos e visualizações
- **Lucide Icons** - Ícones modernos
- **next-themes** - Gerenciamento de temas (Dark/Light mode)

### Backend
- **Supabase** - Backend as a Service
  - PostgreSQL - Banco de dados relacional
  - Auth - Autenticação de usuários
  - Storage - Armazenamento de arquivos
  - Realtime - Sincronização em tempo real
  - Row Level Security (RLS) - Segurança a nível de linha

### Deploy
- **Cloudflare Pages** - Hospedagem do frontend
- **Cloudflare Workers** - Serverless functions
- **Cloudflare R2** - Armazenamento de anexos e comprovantes

## ✨ Funcionalidades

### Dashboard
- Saldo consolidado em tempo real
- Patrimônio líquido
- Receitas e despesas do mês
- Economia e fluxo de caixa
- Gráficos de evolução financeira
- Transações recentes
- Progresso das metas financeiras
- Status dos cartões de crédito

### Contas
- Conta Corrente
- Poupança
- Dinheiro
- Carteira
- Conta Digital
- Visualização de saldo por conta
- Transferências entre contas

### Transações
- Registro de receitas e despesas
- Categorização automática
- Filtros por tipo, categoria e período
- Busca avançada
- Anexo de comprovantes
- Transações recorrentes
- Notas e observações

### Cartões de Crédito
- Múltiplos cartões
- Controle de fatura atual
- Melhor dia de compra
- Dia de vencimento
- Limite disponível
- Histórico de transações
- Parcelamento

### Orçamento
- Definição de orçamento mensal por categoria
- Acompanhamento de gastos
- Alertas de excesso
- Visualização de progresso
- Comparativo mensal

### Metas Financeiras
- Criação de metas personalizadas
- Acompanhamento de progresso
- Data alvo
- Contribuições regulares
- Histórico de depósitos

### Investimentos
- Tesouro Direto
- CDB
- Ações
- Fundos Imobiliários
- Criptomoedas
- Acompanhamento de rentabilidade
- Diversificação de carteira

### Relatórios
- Relatórios mensais, trimestrais e anuais
- Análise por categoria
- Evolução patrimonial
- Exportação em PDF
- Exportação em Excel
- Insights inteligentes

### Funcionalidades Familiares
- Múltiplos membros por família
- Papéis: Administrador, Cônjuge, Filho, Convidado
- Permissões granulares
- Controle de acesso
- Atividade compartilhada

### Recursos Premium
- Insights inteligentes com IA
- Calendário financeiro
- Transações recorrentes automáticas
- Central de notificações
- Alertas de contas a vencer
- Alertas de metas atingidas
- Alertas de orçamento excedido

## 🎨 Design System

### Temas
- Dark Mode
- Light Mode
- Sistema automático baseado no sistema operacional

### UX/UI
- Design responsivo (Mobile First)
- Interface minimalista
- Micro animações suaves
- Skeleton loading
- Empty states ilustrados
- Dashboard altamente visual
- Experiência premium

### Inspiração Visual
Baseado nas melhores fintechs modernas:
- Nubank
- C6 Bank
- Inter
- Monarch Money
- Rocket Money

## 📁 Estrutura do Projeto

```
finance/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx         # Layout principal
│   │   ├── page.tsx           # Página inicial
│   │   └── globals.css        # Estilos globais
│   ├── components/            # Componentes React
│   │   ├── ui/               # Componentes UI base (Shadcn)
│   │   ├── dashboard/        # Dashboard
│   │   ├── transactions/     # Transações
│   │   ├── accounts/         # Contas
│   │   ├── credit-cards/     # Cartões de crédito
│   │   ├── goals/            # Metas
│   │   ├── budget/           # Orçamento
│   │   ├── investments/      # Investimentos
│   │   ├── reports/          # Relatórios
│   │   └── settings/         # Configurações
│   └── lib/                  # Utilitários
│       ├── utils.ts          # Funções helper
│       └── supabase.ts       # Cliente Supabase
├── database/                 # Scripts SQL
│   └── schema.sql           # Schema do banco de dados
├── public/                  # Arquivos estáticos
├── package.json            # Dependências
├── tsconfig.json           # Configuração TypeScript
├── tailwind.config.ts      # Configuração Tailwind
├── next.config.js          # Configuração Next.js
└── README.md               # Este arquivo
```

## 🗄️ Banco de Dados

### Tabelas Principais
- `users` - Usuários do sistema
- `families` - Famílias
- `family_members` - Membros da família
- `accounts` - Contas bancárias
- `transactions` - Transações financeiras
- `categories` - Categorias de transações
- `credit_cards` - Cartões de crédito
- `credit_card_transactions` - Transações de cartão
- `budgets` - Orçamentos por categoria
- `goals` - Metas financeiras
- `investments` - Investimentos
- `notifications` - Notificações

### Segurança
- Row Level Security (RLS) habilitado
- Políticas de acesso granulares
- Criptografia de dados sensíveis
- Autenticação via Supabase Auth

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Conta no Supabase

### Instalação

1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/finance-flow.git
cd finance-flow
```

2. Instale as dependências
```bash
npm install
```

3. Configure as variáveis de ambiente
```bash
cp .env.local.example .env.local
```

Edite o arquivo `.env.local` com suas credenciais do Supabase:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

4. Execute o schema do banco de dados
- Acesse o painel do Supabase (https://supabase.com/dashboard)
- Selecione seu projeto
- Vá para **SQL Editor** no menu lateral
- Clique em **New Query**
- Copie e cole todo o conteúdo do arquivo `database/schema.sql`
- Clique em **Run** para executar o script
- Verifique se todas as tabelas foram criadas com sucesso

O schema cria:
- Tabelas: families, family_members, accounts, transactions, credit_cards, credit_card_invoices, budgets, budget_categories, financial_goals, investments, notifications, subscriptions
- Índices para performance
- Triggers para timestamps automáticos
- Row Level Security (RLS) policies

5. Inicie o servidor de desenvolvimento
```bash
npm run dev
```

6. Acesse a aplicação
```
http://localhost:3000
```

## 📦 Deploy

### Opção 1: Cloudflare Pages via GitHub (Recomendado)

Para deploy automático via GitHub, siga o guia completo em [DEPLOYMENT.md](./DEPLOYMENT.md).

**Resumo rápido:**
1. Conecte seu repositório GitHub ao Cloudflare Pages
2. Configure as variáveis de ambiente no painel do Cloudflare
3. Configure o build command: `npm run pages:build`
4. Configure o build output directory: `.vercel/output/static`
5. Deploy automático em cada push

### Opção 2: Cloudflare Pages com Wrangler CLI

O projeto usa o `@cloudflare/next-on-pages` para adaptar o Next.js para Cloudflare Pages.

#### Pré-requisitos
- Instale o Wrangler CLI:
```bash
npm install -g wrangler
```

- Faça login no Cloudflare:
```bash
wrangler login
```

#### Deploy Manual

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente no arquivo `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

3. Build para Cloudflare Pages:
```bash
npm run pages:build
```

4. Deploy:
```bash
npm run pages:deploy
```

### Variáveis de Ambiente Necessárias
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Configure estas variáveis no painel do Cloudflare Pages em Settings > Environment Variables.

## 🧪 Testes

```bash
npm run test
```

## 📝 Licença

Este projeto está sob a licença MIT.

## 👥 Contribuindo

Contribuições são bem-vindas! Por favor, abra uma issue ou pull request.

## 📞 Suporte

Para suporte, abra uma issue no repositório ou entre em contato pelo email.

---

Desenvolvido com ❤️ usando Next.js, TypeScript e Supabase
