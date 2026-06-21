# PROJETO: Sistema de Controle Financeiro Familiar (Cloudflare + Supabase)

Você é um Product Designer Sênior, UX/UI Designer especialista em Fintechs e um Arquiteto de Software Full Stack.

Crie uma aplicação SaaS completa de Controle Financeiro Familiar, moderna, elegante e extremamente intuitiva, com experiência semelhante aos melhores aplicativos financeiros atuais.

## Objetivo

Desenvolver uma plataforma de gestão financeira familiar que permita ao usuário controlar receitas, despesas, cartões, contas, investimentos, metas financeiras e orçamento familiar.

A aplicação será hospedada no Cloudflare e utilizará Supabase como backend e banco de dados.

---

# Stack Tecnológica

## Frontend

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Shadcn/UI
- Framer Motion
- Recharts
- Lucide Icons

## Backend

- Supabase
  - PostgreSQL
  - Auth
  - Storage
  - Realtime
  - Row Level Security

## Deploy

- Cloudflare Pages
- Cloudflare Workers
- Cloudflare R2 (para anexos e comprovantes)

---

# Design System

## Inspiração Visual

Basear-se nos seguintes estilos:

- Fintech moderna
- Nubank
- C6 Bank
- Inter
- Copilot Money
- Monarch Money
- Rocket Money

Referências:

- https://www.figma.com/pt-br/comunidade/file/1119543895995807165/preview-only-e-wallet-mobile-app-design
- https://dribbble.com/shots/24278583-Walto-Finance-Dashboard-Page
- https://dribbble.com/shots/24208290-QuikFin-Finance-Transaction-page
- https://dribbble.com/shots/27477103-AI-Powered-Personal-Finance-Dashboard-Dclan
- https://dribbble.com/shots/26837172-Fintech-Digital-banking-app
- https://dribbble.com/shots/21023422-Budget-Finance-App
- https://dribbble.com/shots/24715299-Finance-App

---

# Requisitos de UX

- Dark Mode
- Light Mode
- Design Responsivo
- Mobile First
- Micro animações suaves
- Skeleton Loading
- Empty States ilustrados
- Dashboard altamente visual
- Experiência premium
- Interface minimalista
- Navegação intuitiva

---

# EXPERIÊNCIA MOBILE

A versão mobile NÃO deve parecer um site responsivo.

Ela deve parecer um aplicativo nativo de fintech.

### Navegação

Bottom Navigation com:

- Início
- Transações
- Cartões
- Metas
- Perfil

### Dashboard Mobile

Exibir:

- Saldo Total
- Receitas do mês
- Despesas do mês
- Economia do mês
- Evolução patrimonial

### Quick Actions

- Nova Receita
- Nova Despesa
- Transferência
- Nova Meta

### Gráficos

- Gastos por categoria
- Evolução financeira
- Comparativo mensal

### Tela de Transações

- Ícone da categoria
- Descrição
- Conta
- Data
- Valor

---

# EXPERIÊNCIA DESKTOP

Inspirar-se em SaaS premium modernos.

### Sidebar

- Dashboard
- Transações
- Contas
- Cartões
- Metas
- Orçamento
- Investimentos
- Relatórios
- Configurações

### Topbar

- Pesquisa global
- Notificações
- Perfil
- Alternador Dark/Light

---

# FUNCIONALIDADES

## Dashboard

- Saldo consolidado
- Patrimônio líquido
- Receitas
- Despesas
- Economia
- Fluxo de caixa

## Contas

- Conta Corrente
- Poupança
- Dinheiro
- Carteira
- Conta Digital

## Transações

### Receitas

- Salário
- Freelance
- Investimentos
- Outros

### Despesas

- Alimentação
- Transporte
- Moradia
- Saúde
- Educação
- Lazer
- Outros

Campos:

- Valor
- Data
- Categoria
- Conta
- Descrição
- Anexo de comprovante
- Observações

## Cartões de Crédito

- Nome
- Limite
- Melhor dia de compra
- Vencimento

Controle:

- Fatura atual
- Próxima fatura
- Limite disponível

## Orçamento

Definição de orçamento mensal por categoria.

## Metas Financeiras

- Viagem
- Carro
- Casa
- Reserva de Emergência

## Investimentos

- Tesouro
- CDB
- Ações
- Fundos
- Criptomoedas

## Relatórios

- Mensal
- Trimestral
- Anual

Exportação:

- PDF
- Excel

---

# FUNCIONALIDADES FAMILIARES

Papéis:

- Administrador
- Cônjuge
- Filho
- Convidado

---

# BANCO DE DADOS

Criar schema completo contendo:

- users
- families
- family_members
- accounts
- transactions
- categories
- budgets
- goals
- credit_cards
- credit_card_transactions
- investments
- reports
- attachments
- notifications

Incluir:

- Foreign Keys
- Indexes
- Triggers
- Views
- Policies RLS

---

# DIFERENCIAIS PREMIUM

## Insights Inteligentes

Exemplos:

- Você gastou 18% mais com alimentação este mês.
- Sua economia aumentou 12%.
- Seu orçamento de lazer está próximo do limite.

## Calendário Financeiro

- Vencimentos
- Faturas
- Contas recorrentes
- Metas

## Transações Recorrentes

- Semanal
- Quinzenal
- Mensal
- Anual

## Central de Notificações

- Contas a vencer
- Faturas
- Metas atingidas
- Orçamento excedido

---

# ENTREGA ESPERADA

1. Arquitetura completa do sistema.
2. Estrutura de pastas.
3. Modelagem do banco.
4. Scripts SQL.
5. Fluxos UX/UI.
6. Wireframes.
7. Componentização React.
8. Design System.
9. Frontend completo.
10. Backend completo.
11. Responsividade Mobile e Desktop.
12. Dark Mode.
13. Dados mockados.
14. Aplicação pronta para deploy no Cloudflare.

A qualidade visual deve ser comparável a aplicativos fintech premium de 2025/2026.
