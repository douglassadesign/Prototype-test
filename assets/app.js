const app = document.getElementById('app');

const journeys = {
  agente: {
    title: 'Jornada 1 · Agente / Franqueado',
    subtitle: 'Cenário 1: convite autorizado do gestor para conexão CoEx.'
  },
  gestor: {
    title: 'Jornada 2 · Gestor de Equipe',
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
    title: 'Jornada 3 · Matriz / Brand Owner',
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
    title: 'Jornada 4 · Comercial Blip',
    subtitle: 'Product-Led Sales com sinais de adoção orgânica.',
    screens: [
      {
        title: '1) Painel de Inteligência B2B',
        body: `
          <section class="panel card">
            <h3>Penetração por marca</h3>
            <div class="kpi-grid" style="margin-top:10px;">
              <div class="kpi"><span class="small">Lojas Marca X</span><strong>3.000</strong></div>
              <div class="kpi"><span class="small">Franqueados conectados</span><strong>450</strong></div>
              <div class="kpi"><span class="small">Penetração orgânica</span><strong>15%</strong></div>
            </div>
          </section>
        `
      }
    ]
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
          <h2>Landing Page · 4 Portais de Jornada</h2>
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

          ${['gestor', 'matriz', 'comercial']
            .map(
              (id) => `
              <article class="portal card" data-journey="${id}">
                <h3>${journeys[id].title}</h3>
                <p>${journeys[id].subtitle}</p>
                <p class="small" style="margin-top:10px;">Jornada em preview resumido</p>
              </article>
            `
            )
            .join('')}
        </section>
      </main>
    </div>
  `;

  document.querySelectorAll('[data-journey]').forEach((el) => {
    el.addEventListener('click', () => {
      state.view = 'journey';
      state.journey = el.dataset.journey;
      state.screen = 0;
      render();
    });
  });
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
