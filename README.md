# Blip CoEx — Central de Comando (Protótipo Navegável)

Protótipo front-end em **HTML + CSS + JavaScript puro** para apresentar a proposta de valor do **Blip CoEx** com foco em:
- Governança de conversas (Shadow WhatsApp)
- Eficiência operacional com IA
- Estratégia PLG (bottom-up + expansão enterprise)

## Escopo coberto

Landing page interativa com 4 portais de jornada:
1. **Agente / Franqueado** (onboarding QR, sidekick kanban, upsell PLG)
2. **Gestor de Equipe** (convite em lote, dashboard baseline vs atual, checkout self-service)
3. **Matriz / Brand Owner** (descoberta shadow WhatsApp, central de vínculo, QA/compliance)
4. **Comercial Blip** (inteligência B2B, radar de oportunidades, gerador de pitch ROI)

## Requisitos funcionais representados

- **RF01** Coexistência transparente (não substitui WhatsApp no celular)
- **RF02** Triagem híbrida IA + humano (determinístico + probabilístico)
- **RF03** Retroatividade explícita (Meta API: últimos 6 meses)
- **RF04** Hierarquia de permissões (Matriz com visibilidade/veto sobre Franquia)

## Estrutura

```txt
/
  index.html
  /assets
    styles.css
    app.js
  /screens
    email.html
```

## Como executar localmente

```bash
python3 -m http.server 5500
```

Acesse:
- `http://localhost:5500/`

## Observações

- É um protótipo visual de demonstração.
- Não há backend nem integração real com APIs externas.
