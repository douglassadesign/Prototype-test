# Blip Go Personal — Protótipo Navegável (Mock-only)

Este repositório contém um protótipo front-end completo da experiência de onboarding do **Blip Go Personal**.
Todo o fluxo é simulado com **HTML + CSS + JavaScript puro**, sem backend e sem build step, pronto para publicação em **GitHub Pages**.

## O que está incluído

- Simulação de e-mail de convite em `/screens/email.html`
- Fluxo com rotas hash em `/index.html`:
  - `#/invite`
  - `#/create-password`
  - `#/qr-connect`
  - `#/connecting`
  - `#/connected`
  - `#/app/atendimento`
  - `#/app/relatorios`
- Área de Atendimento com dois modos:
  - **Desk** (lista de contatos + conversa)
  - **CRM** (kanban + drawer lateral)
- Área de Relatórios com KPIs, gráfico em barras (HTML/CSS) e tabela por colaborador
- Persistência via `localStorage` para:
  - senha criada
  - estado de conexão WhatsApp
  - usuário logado
  - mensagens enviadas
  - mudanças de status no CRM

## Estrutura

```txt
/
  index.html
  /assets
    styles.css
    app.js
  /mocks
    users.json
    contacts.json
    conversations.json
    reports.json
  /screens
    email.html
```

## Como rodar localmente

> Opcional: em geral o GitHub Pages já servirá corretamente.

Você pode abrir o `index.html` direto no navegador, mas para garantir leitura de JSON via `fetch`, prefira um servidor estático simples:

### Opção com Python

```bash
python3 -m http.server 5500
```

Depois acesse:
- `http://localhost:5500/screens/email.html`
- `http://localhost:5500/index.html#/invite?token=INVITE_TOKEN_123`

## Deploy no GitHub Pages (somente hosting estático)

1. Faça push deste conteúdo para o branch `main` do seu repositório.
2. No GitHub, abra **Settings**.
3. Vá em **Pages**.
4. Em **Build and deployment**, selecione:
   - **Source**: `Deploy from a branch`
   - **Branch**: `main`
   - **Folder**: `/ (root)`
5. Salve e aguarde o GitHub publicar a URL.

## URLs importantes

- Simulação de e-mail:
  - `/screens/email.html`
- Início do onboarding com token:
  - `/index.html#/invite?token=INVITE_TOKEN_123`

## Observações de protótipo

- Os dados são 100% mockados em `mocks/*.json`.
- Não há integração real com WhatsApp.
- O QR Code e a etapa de conexão são simulados visualmente.
