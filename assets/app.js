const app = document.getElementById('app');

const journeys = {
  agente: {
    title: 'Jornada 1 · Agente / Franqueado',
    subtitle: 'Cenário 1: convite autorizado do gestor para conexão CoEx.'
  },
  gestor: {
    title: 'Jornada 3 · Gestor de Equipe',
    subtitle: 'Gestão autônoma com prova de ROI operacional.',
    screens: [
      {
        title: '1) Setup Rápido (Convite em Lote)',
        body: `
          <section class="panel card">
            <h3>Importar agentes por telefone</h3>
            <p class="small">Cole múltiplos números para envio automático de links de conexão.</p>
            <div class="input-mock">+55 11 99999-1111\n+55 11 98888-2222\n+55 21 97777-3333\n+55 31 96666-4444</div>
            <div class="inline-badges"><span class="badge info">4 convites prontos</span><span class="badge success">Sem dependência de TI</span></div>
            <button class="primary-btn" style="margin-top:10px;">Disparar convites</button>
          </section>
        `
      }
    ]
  },
  matriz: {
    title: 'Jornada 4 · Matriz / Brand Owner',
    subtitle: 'Governança central, compliance e poder de veto.',
    screens: [
      {
        title: '1) Descoberta de Shadow WhatsApp',
        body: `
          <section class="panel card">
            <h3>Alerta de exposição da marca</h3>
            <div class="funnel" style="margin-top:10px;">
              <div class="funnel-step">Total de lojas no mercado: 3.000</div>
              <div class="funnel-step">Números detectados usando a marca: 1.240</div>
              <div class="funnel-step">Números verificados na Business Manager: 390</div>
            </div>
          </section>
        `
      }
    ]
  },
  comercial: {
    title: 'Comercial Blip',
    subtitle: 'Identifique oportunidades Enterprise a partir da adoção orgânica.'
  }
};

const state = { view: 'landing', journey: null, screen: 0 };

function renderLanding() {
  app.innerHTML = `
    <div class="page">
      <header class="topbar">
        <h1>Blip CoEx: O Ecossistema de Governança e Eficiência</h1>
        <span class="meta">Central de Comando · protótipo interativo</span>
      </header>
      <main class="container">
        <div class="card panel">
          <h2>Landing Page · 5 Portais de Jornada</h2>
          <p class="small" style="margin-top:8px;">Aha Moment: conexão via QR e baseline retroativo para provar ROI em dias/semanas.</p>
          <div class="inline-badges">
            <span class="badge success">RF01 Coexistência Transparente</span>
            <span class="badge info">RF02 Triagem Híbrida Inteligente</span>
            <span class="badge warning">RF03 Retroatividade Meta API (6 meses)</span>
            <span class="badge danger">RF04 Hierarquia Matriz &gt; Franquia</span>
          </div>
        </div>

        <section class="portal-grid">
          <a class="portal card" href="agent.html?step=email" target="_blank" rel="noopener noreferrer">
            <h3>${journeys.agente.title}</h3>
            <p>${journeys.agente.subtitle}</p>
            <p class="small" style="margin-top:10px;color:#0f766e;">Exemplo do cenário 1: convite autorizado do gestor para um número pré-validado.</p>
          </a>

          <a class="portal card" href="agent.html?step=desk&scenario=selfconnect" target="_blank" rel="noopener noreferrer">
            <h3>Jornada 2 · Agente (Self-connect no Desk)</h3>
            <p>Cenário 2: agente já logado no Blip Desk conecta o próprio WhatsApp Business.</p>
            <p class="small" style="margin-top:10px;color:#0f766e;">Entrada direta em Atendimento com prompt + fluxo Saber mais + conexão CoEx pessoal.</p>
          </a>


          <a class="portal card" href="manager.html" target="_blank" rel="noopener noreferrer">
            <h3>Jornada 2 · Gestor / Equipe</h3>
            <p>Gestão de time com cadastro, convites, reconhecimento bottom-up, relatórios e upgrade.</p>
            <p class="small" style="margin-top:10px;color:#0f766e;">Acesse o módulo administrativo com sidebar, métricas e planos.</p>
          </a>

          <a class="portal card" href="matrix.html?step=discovery" target="_blank" rel="noopener noreferrer">
            <h3>Matriz / Governança</h3>
            <p>Descubra números WhatsApp usando sua marca e estabeleça governança.</p>
            <p class="small" style="margin-top:10px;color:#0f766e;">Painel corporativo com descoberta, vínculos, auditoria, governança e upgrade enterprise.</p>
          </a>

          <a class="portal card" href="sales.html?step=overview" target="_blank" rel="noopener noreferrer">
            <h3>${journeys.comercial.title}</h3>
            <p>${journeys.comercial.subtitle}</p>
            <p class="small" style="margin-top:10px;color:#0f766e;">Painel interno de Product-Led Sales Intelligence.</p>
          </a>
        </section>
      </main>
    </div>
  `;
}

function renderGenericJourney() {
  const current = journeys[state.journey];
  const screen = current.screens[state.screen];

  app.innerHTML = `
    <div class="page">
      <header class="topbar">
        <h1>${current.title}</h1>
        <span class="meta">${current.subtitle}</span>
      </header>
      <main class="container">
        <div class="section-header">
          <div>
            <p class="crumb">${screen.title}</p>
            <p class="small">Tela ${state.screen + 1} de ${current.screens.length}</p>
          </div>
          <button class="ghost-btn" id="backLanding">Voltar aos portais</button>
        </div>
        ${screen.body}
      </main>
    </div>
  `;

  document.getElementById('backLanding').addEventListener('click', () => {
    state.view = 'landing';
    render();
  });
}

function render() {
  if (state.view === 'landing') return renderLanding();
  return renderGenericJourney();
}

render();
