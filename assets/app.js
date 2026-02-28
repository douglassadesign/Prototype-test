const app = document.getElementById('app');

const journeys = {
  agente: {
    title: 'Jornada 1 · Agente / Franqueado',
    subtitle: 'Produtividade com fricção zero e expansão PLG.',
    screens: [
      {
        title: '1) Onboarding (Fricção Zero)',
        body: `
          <div class="layout two-col">
            <section class="panel card">
              <h3>Conectar WhatsApp Business via QR</h3>
              <p class="small">Coexistência transparente: o agente mantém o WhatsApp nativo no celular e a Blip espelha no backend (RF01).</p>
              <div class="qr"></div>
              <div class="inline-badges">
                <span class="badge success">Conexão em ~30s</span>
                <span class="badge info">Sincronização Meta API: últimos 6 meses</span>
              </div>
              <button class="primary-btn" style="margin-top:12px;">Já escaneei</button>
            </section>
            <aside class="panel card phone-preview">
              <h4>Celular do agente (permanece igual)</h4>
              <p class="small">Nenhuma troca de app. Apenas ganhos de organização e IA no desktop.</p>
              <div class="chat-bubble in">Cliente: "Qual prazo de entrega?"</div>
              <div class="chat-bubble out">Agente: "Te confirmo agora 😊"</div>
            </aside>
          </div>
        `
      },
      {
        title: '2) Sidekick (Super WhatsApp)',
        body: `
          <div class="layout three-col">
            <aside class="panel card">
              <h3>Triagem Híbrida</h3>
              <p class="small">Fluxo determinístico + probabilístico antes do humano (RF02).</p>
              <ul class="mini-list">
                <li>IA resolve dúvidas repetitivas.</li>
                <li>IA pontua probabilidade de fechamento.</li>
                <li>Humano atua em negociação e exceções.</li>
              </ul>
            </aside>
            <section class="panel card">
              <h3>Kanban Comercial</h3>
              <div class="kanban" style="margin-top:12px;">
                <div class="column"><h4>Triagem IA</h4><div class="lead-card"><strong>Maria · Farmácia Sol</strong><span class="small">FAQ prazo entregue automaticamente</span></div></div>
                <div class="column"><h4>Lead Quente</h4><div class="lead-card"><strong>João · Clínica Viva</strong><span class="small">Score de fechamento: 85%</span></div></div>
                <div class="column"><h4>Follow-up</h4><div class="lead-card"><strong>Ana · Loja Centro</strong><span class="small">Preferência: contato à tarde</span></div></div>
                <div class="column"><h4>Fechado</h4><div class="lead-card"><strong>Grupo Lima</strong><span class="small">Ticket R$ 12.000</span></div></div>
              </div>
            </section>
            <aside class="panel card">
              <h3>IA Insights</h3>
              <p class="small">• Próxima melhor ação: oferecer combo premium.</p>
              <p class="small">• Objeção dominante: preço.</p>
              <p class="small">• Horário ideal: 16h–18h.</p>
              <div class="metric-line"><span>Priorização de leads</span><strong>+33%</strong></div>
            </aside>
          </div>
        `
      },
      {
        title: '3) Gatilho de Upsell (PLG)',
        body: `
          <section class="panel card">
            <h3>Momento de expansão para Blip Desk</h3>
            <p class="small">Upsell não intrusivo no fluxo do agente, orientado por valor real já percebido.</p>
            <div class="banner-upsell">
              <strong>Automatize respostas repetitivas com o Blip Desk.</strong>
              <p class="small" style="margin-top:6px;">Ganhos previstos: -28% no TMA e +11% de conversão em 30 dias.</p>
              <button class="ghost-btn" style="margin-top:8px;">Solicitar upgrade ao Gestor</button>
            </div>
          </section>
        `
      }
    ]
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
      },
      {
        title: '2) Dashboard da Célula',
        body: `
          <div class="layout two-col">
            <div class="panel card">
              <h3>Tabela de agentes</h3>
              <table class="table" style="margin-top:10px;">
                <tr><th>Agente</th><th>Status</th><th>Mensagens</th><th>TMA</th></tr>
                <tr><td>Patrícia</td><td><span class="badge success">Online</span></td><td>72</td><td>02:10</td></tr>
                <tr><td>Rafael</td><td><span class="badge warning">Atenção</span></td><td>59</td><td>02:48</td></tr>
                <tr><td>Bianca</td><td><span class="badge success">Online</span></td><td>65</td><td>01:57</td></tr>
              </table>
            </div>
            <div class="panel card">
              <h3>Eficiência operacional</h3>
              <p class="small">Comparativo explícito: Sincronização Meta API (últimos 6 meses) vs desempenho atual (RF03).</p>
              <div class="kpi-grid" style="margin-top:10px;">
                <div class="kpi"><span class="small">TMA baseline</span><strong>04:20</strong></div>
                <div class="kpi"><span class="small">TMA atual</span><strong>02:11</strong></div>
                <div class="kpi"><span class="small">Conversão</span><strong>+18%</strong></div>
              </div>
              <h4 style="margin-top:12px;">Nuvem de tópicos (IA)</h4>
              <div class="topic-cloud" style="margin-top:8px;"><span class="topic">Preço</span><span class="topic">Prazo de entrega</span><span class="topic">Troca</span><span class="topic">Garantia</span></div>
            </div>
          </div>
        `
      },
      {
        title: '3) Checkout Self-Service',
        body: `
          <section class="panel card">
            <h3>Contratação local (PLG expand)</h3>
            <p class="small">O gestor da célula pode contratar a versão completa para o time sem ciclo enterprise inicial.</p>
            <div class="pricing">
              <div><strong>Desk PRO</strong><p class="small">10 números conectados</p></div>
              <div><strong>R$ 899/mês</strong><p class="small">cartão de crédito</p></div>
              <button class="primary-btn">Contratar agora</button>
            </div>
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
      },
      {
        title: '2) Central de Vínculo',
        body: `
          <div class="layout two-col">
            <section class="panel card">
              <h3>Números detectados</h3>
              <table class="table" style="margin-top:10px;">
                <tr><th>Número</th><th>Loja</th><th>Status</th><th>Ações</th></tr>
                <tr><td>+55 11 95555-1001</td><td>Franquia Sul</td><td><span class="badge warning">Não verificado</span></td><td><button class="ghost-btn">Reconhecer vínculo</button></td></tr>
                <tr><td>+55 11 95555-1002</td><td>Unidade Centro</td><td><span class="badge danger">Risco</span></td><td><button class="primary-btn">Denunciar/Desconectar</button></td></tr>
              </table>
            </section>
            <aside class="panel card">
              <h3>Hierarquia de permissões (RF04)</h3>
              <div class="matrix-grid">
                <div><strong>Matriz</strong><p class="small">Visibilidade total + veto</p></div>
                <div><strong>Franquia</strong><p class="small">Autonomia operacional local</p></div>
              </div>
            </aside>
          </div>
        `
      },
      {
        title: '3) Auditoria de Qualidade (QA IA)',
        body: `
          <section class="panel card">
            <h3>Desvios de branding detectados</h3>
            <article class="alert-card">
              <strong>Red Flag · Franquia Sul</strong>
              <p class="small">Uso de política de descontos não autorizada em 37 conversas.</p>
            </article>
            <div class="inline-badges"><span class="badge danger">Risco de compliance</span><span class="badge warning">Revisão jurídica recomendada</span></div>
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
      },
      {
        title: '2) Radar de Oportunidades',
        body: `
          <section class="panel card">
            <h3>Gatilhos de venda enterprise</h3>
            <div class="timeline">
              <div class="timeline-item"><strong>Empresa Y</strong><p class="small">Atingiu 100 números conectados · abordar governança enterprise.</p></div>
              <div class="timeline-item"><strong>Rede Z</strong><p class="small">+40% crescimento em 3 semanas · janela de upsell ativa.</p></div>
            </div>
          </section>
        `
      },
      {
        title: '3) Gerador de Pitch',
        body: `
          <section class="panel card">
            <h3>Prévia de relatório ROI para C-Level</h3>
            <p class="small">Documento com baseline 6 meses, ganhos de TMA e conversão, risco de shadow e proposta de centralização.</p>
            <button class="primary-btn" style="margin-top:10px;">Gerar PDF de ROI</button>
            <div class="note">Adoção orgânica comprovada: TMA -41% e conversão +18% após CoEx + IA.</div>
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
          ${Object.entries(journeys).map(([id, item]) => `
            <article class="portal card" data-journey="${id}">
              <h3>${item.title}</h3>
              <p>${item.subtitle}</p>
              <p class="small" style="margin-top:10px;">${item.screens.length} telas de demonstração</p>
            </article>
          `).join('')}
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

function renderJourney() {
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
          <div style="display:flex;gap:8px;">
            <button class="ghost-btn" id="backLanding">Voltar aos portais</button>
            <button class="ghost-btn" id="prevScreen" ${state.screen === 0 ? 'disabled' : ''}>Anterior</button>
            <button class="primary-btn" id="nextScreen">${state.screen === current.screens.length - 1 ? 'Concluir jornada' : 'Próxima'}</button>
          </div>
        </div>
        ${screen.body}
      </main>
    </div>
  `;

  document.getElementById('backLanding').addEventListener('click', () => {
    state.view = 'landing';
    render();
  });

  document.getElementById('prevScreen').addEventListener('click', () => {
    if (state.screen > 0) state.screen -= 1;
    render();
  });

  document.getElementById('nextScreen').addEventListener('click', () => {
    if (state.screen < current.screens.length - 1) {
      state.screen += 1;
      render();
      return;
    }
    state.view = 'landing';
    render();
  });
}

function render() {
  if (state.view === 'landing') return renderLanding();
  return renderJourney();
}

render();
