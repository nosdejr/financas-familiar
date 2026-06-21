# Deploy no Cloudflare Pages via GitHub

Este guia explica como configurar o deploy automático do projeto no Cloudflare Pages usando integração com GitHub.

## Pré-requisitos

- Conta no Cloudflare
- Conta no GitHub com o repositório do projeto
- Projeto configurado com as dependências e scripts do Cloudflare

## Passo 1: Preparar o Repositório GitHub

1. **Faça commit de todas as alterações:**
```bash
git add .
git commit -m "Configuração para deploy no Cloudflare Pages"
git push origin main
```

2. **Certifique-se de que o arquivo `.gitignore` está configurado corretamente:**
   - `.env.local` não deve ser commitado
   - `node_modules` não deve ser commitado
   - `.next` não deve ser commitado

## Passo 2: Configurar Variáveis de Ambiente no Cloudflare

1. Acesse o painel do Cloudflare: https://dash.cloudflare.com
2. Vá para **Pages**
3. Clique em **Create a project**
4. Selecione **Connect to Git**
5. Escolha o repositório GitHub do projeto

6. **Configure as variáveis de ambiente:**
   - Na seção **Environment variables**, adicione:
     - `NEXT_PUBLIC_SUPABASE_URL`: sua URL do Supabase
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: sua chave anônima do Supabase

7. **Configure as variáveis de ambiente para produção:**
   - Marque as variáveis como **Production** e **Preview**

## Passo 3: Configurar Build Settings

No painel do Cloudflare Pages, configure:

**Build settings:**
- **Framework preset**: Next.js
- **Build command**: `npm run pages:build`
- **Build output directory**: `.vercel/output/static`

**Environment variables:**
```
NODE_VERSION=18
```

## Passo 4: Deploy Automático

Após a configuração inicial:

1. **Deploy inicial:** O Cloudflare fará o primeiro deploy automaticamente após conectar o repositório

2. **Deploy automático:** Cada novo push no branch `main` (ou branch configurado) acionará um novo deploy

3. **Preview deployments:** Pull requests gerarão previews automáticos para teste

## Passo 5: Monitorar o Deploy

1. Acompanhe o build no painel do Cloudflare Pages
2. Verifique os logs em caso de erro
3. Teste a aplicação na URL fornecida pelo Cloudflare

## Deploy Manual via Wrangler (Alternativa)

Se precisar fazer deploy manual via CLI:

```bash
# Instale o Wrangler
npm install -g wrangler

# Faça login
wrangler login

# Build do projeto
npm install
npm run pages:build

# Deploy
wrangler pages deploy .vercel/output/static --project-name=finance-flow
```

## Troubleshooting

### Erro: Build falha
- Verifique se todas as dependências estão no package.json
- Verifique se as variáveis de ambiente estão configuradas corretamente
- Verifique os logs de build no painel do Cloudflare

### Erro: Supabase connection
- Certifique-se de que as variáveis de ambiente estão configuradas
- Verifique se as credenciais do Supabase estão corretas
- Verifique se o RLS (Row Level Security) está configurado corretamente

### Erro: Static assets não carregam
- Verifique se o build output directory está correto
- Verifique se o comando de build está correto

## URLs Úteis

- Documentação Cloudflare Pages: https://developers.cloudflare.com/pages/
- Documentação @cloudflare/next-on-pages: https://github.com/cloudflare/next-on-pages
- Documentação Wrangler: https://developers.cloudflare.com/workers/wrangler/
