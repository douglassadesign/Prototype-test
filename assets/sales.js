const salesApp = document.getElementById('sales-app');

const steps = ['overview', 'accounts', 'opportunities', 'pitch'];
const labels = {
  overview: 'Visão Geral',
  accounts: 'Empresas',
  opportunities: 'Oportunidades',
  pitch: 'Gerador de Pitch'
};

function getStep() {
  const step = new URLSearchParams(window.location.search).get('step') || 'overview';
  return steps.includes(step) ? step : 'overview';
}

function goToStep(step) {
  const target = steps.includes(step) ? step : 'overview';
  window.history.replaceState({}, '', `sales.html?step=${target}`);
  render();
}

function sidebarLink(step, text) {
  const activeClass = getStep() === step ? 'active' : '';
  return `<button class="sales-menu ${activeClass}" data-step="${step}">${text}</button>`;
}

function overviewContent() {
  return `
    <section class="card panel sales-panel">
      <div class="section-header">
        <div>
          <h2>Adoção orgânica detectada</h2>
          <p class="small">Dados de adoção identificados via CoEx.</p>
        </div>
      </div>
      <div class="note">Oportunidades identificadas a partir de adoção orgânica (PLG).</div>
      <div class="sales-kpis">
        <article class="kpi"><span class="small">Empresas monitoradas</span><strong>86</strong></article>
        <article class="kpi"><span class="small">Empresas com números conectados</span><strong>41</strong></article>
        <article class="kpi"><span class="small">Total números conectados</span><strong>1.284</strong></article>
        <article class="kpi"><span class="small">Total conversas mensais</span><strong>92.000</strong></article>
      </div>
      <div class="sales-grid">
        <article class="card panel">
          <h3>Crescimento de conexões</h3>
          <p class="small">Dados coletados via CoEx.</p>
          <div class="chart-bars" aria-label="Crescimento de conexões mensal">
            <div><span style="height:35%"></span><label>Jan</label></div>
            <div><span style="height:43%"></span><label>Fev</label></div>
            <div><span style="height:52%"></span><label>Mar</label></div>
            <div><span style="height:66%"></span><label>Abr</label></div>
            <div><span style="height:81%"></span><label>Mai</label></div>
            <div><span style="height:95%"></span><label>Jun</label></div>
          </div>
        </article>
        <article class="card panel opportunity-highlight">
          <h3>Maior oportunidade detectada</h3>
          <p><strong>Marca XPTO</strong></p>
          <p class="small">Penetração: 15%</p>
          <button class="primary-btn" data-step="accounts">Ver detalhes</button>
        </article>
      </div>
    </section>
  `;
}

function accountsContent() {
  return `
    <section class="card panel sales-panel">
      <h2>Empresas monitoradas</h2>
      <p class="small" style="margin-top:8px;">Penetração = números conectados / lojas estimadas</p>
      <div class="table-wrap">
        <table class="table sales-table">
          <thead>
            <tr>
              <th>Empresa</th>
              <th>Lojas estimadas</th>
              <th>Números conectados</th>
              <th>Penetração</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr data-step="opportunities">
              <td>Marca XPTO</td><td>3000</td><td>450</td><td>15%</td><td><span class="badge warning">Alta oportunidade</span></td>
            </tr>
            <tr data-step="opportunities">
              <td>Rede FarmaSul</td><td>800</td><td>120</td><td>15%</td><td><span class="badge warning">Alta oportunidade</span></td>
            </tr>
            <tr data-step="opportunities">
              <td>SuperCasa</td><td>1500</td><td>60</td><td>4%</td><td><span class="badge info">Emergente</span></td>
            </tr>
            <tr data-step="opportunities">
              <td>ModaMax</td><td>600</td><td>18</td><td>3%</td><td><span class="badge success">Inicial</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  `;
}

function opportunitiesContent() {
  return `
    <section class="card panel sales-panel">
      <h2>Radar de oportunidades</h2>
      <p class="small" style="margin-top:6px;">Marca XPTO</p>
      <div class="sales-kpis">
        <article class="kpi"><span class="small">Lojas estimadas</span><strong>3000</strong></article>
        <article class="kpi"><span class="small">Números conectados</span><strong>450</strong></article>
        <article class="kpi"><span class="small">Números governados</span><strong>120</strong></article>
        <article class="kpi"><span class="small">Penetração</span><strong>15%</strong></article>
      </div>
      <div class="sales-grid">
        <article class="card panel">
          <h3>Alertas de oportunidade</h3>
          <div class="alert-card">
            Empresa ultrapassou 100 números conectados.<br /><span class="small">Prioridade: Alta</span>
          </div>
          <div class="alert-card">
            Crescimento de 40% em 3 meses.<br /><span class="small">Prioridade: Alta</span>
          </div>
          <div class="alert-card" style="border-color:#fde68a;background:#fffbeb;color:#854d0e;">
            Mais de 60% dos números não possuem governança.<br /><span class="small" style="color:#a16207;">Prioridade: Média</span>
          </div>
        </article>
        <article class="card panel">
          <h3>Penetração atual</h3>
          <p class="small">Total lojas: 3000</p>
          <div class="progress-track">
            <div class="progress-connected" style="width:15%;"></div>
          </div>
          <div class="metric-line"><span>Connected</span><strong>450</strong></div>
          <div class="metric-line"><span>Remaining potential</span><strong>2550</strong></div>
          <p class="small" style="margin-top:12px;">Adoção orgânica indica alto potencial Enterprise.</p>
          <p class="small" style="margin-top:8px;">Clientes Enterprise possuem governança completa.</p>
          <button class="primary-btn" style="margin-top:14px;" data-step="pitch">Gerar pitch automático</button>
        </article>
      </div>
    </section>
  `;
}

function pitchContent() {
  return `
    <section class="card panel sales-panel">
      <h2>Gerador de Pitch Enterprise</h2>
      <p class="small" style="margin-top:6px;">Marca XPTO</p>
      <div class="pdf-preview card">
        <h3>Resumo Executivo</h3>
        <p>A Marca XPTO possui 450 números WhatsApp conectados organicamente ao Blip.</p>
        <p>Isso representa aproximadamente 15% da rede.</p>
        <p>A adoção orgânica demonstra demanda real pela solução.</p>

        <h3>Riscos atuais</h3>
        <ul>
          <li>Falta de governança</li>
          <li>Falta de auditoria</li>
          <li>Dados descentralizados</li>
        </ul>

        <h3>Oportunidade</h3>
        <ul>
          <li>Centralizar governança</li>
          <li>Padronizar atendimento</li>
          <li>Gerar inteligência de dados</li>
        </ul>

        <h3>ROI estimado</h3>
        <div class="inline-badges">
          <span class="badge info">Redução TMR: -28%</span>
          <span class="badge success">Aumento conversão: +17%</span>
          <span class="badge warning">Redução risco: -65%</span>
        </div>
      </div>
      <div class="inline-badges">
        <button class="primary-btn" id="exportPdf">Exportar PDF</button>
        <button class="ghost-btn" id="openContact">Enviar para cliente</button>
      </div>
    </section>

    <div class="sales-toast" id="salesToast">PDF gerado (simulação)</div>

    <div class="modal-backdrop" id="contactModal" aria-hidden="true">
      <div class="modal card panel">
        <h3>Enviar para cliente</h3>
        <div class="modal-form">
          <label>Nome do contato <input type="text" placeholder="Ex.: Ana Souza" /></label>
          <label>Empresa <input type="text" value="Marca XPTO" /></label>
          <label>Email <input type="email" placeholder="contato@empresa.com" /></label>
          <label>Mensagem <textarea rows="4">Olá! Segue proposta de governança Enterprise baseada na adoção orgânica detectada.</textarea></label>
        </div>
        <div class="section-header" style="margin-top:12px; margin-bottom:0;">
          <button class="ghost-btn" id="closeModal">Cancelar</button>
          <button class="primary-btn" id="sendPitch">Enviar</button>
        </div>
        <p class="small" id="sendSuccess" style="display:none;margin-top:10px;color:#047857;">Pitch enviado com sucesso (simulação).</p>
      </div>
    </div>
  `;
}

function screenContent(step) {
  if (step === 'accounts') return accountsContent();
  if (step === 'opportunities') return opportunitiesContent();
  if (step === 'pitch') return pitchContent();
  return overviewContent();
}

function bindEvents() {
  document.querySelectorAll('[data-step]').forEach((element) => {
    element.addEventListener('click', () => goToStep(element.dataset.step));
  });

  const exportPdf = document.getElementById('exportPdf');
  if (exportPdf) {
    exportPdf.addEventListener('click', () => {
      const toast = document.getElementById('salesToast');
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 2200);
    });
  }

  const openContact = document.getElementById('openContact');
  const modal = document.getElementById('contactModal');
  if (openContact && modal) {
    openContact.addEventListener('click', () => {
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
    });
  }

  const closeModal = document.getElementById('closeModal');
  if (closeModal && modal) {
    closeModal.addEventListener('click', () => {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
    });
  }

  const sendPitch = document.getElementById('sendPitch');
  if (sendPitch && modal) {
    sendPitch.addEventListener('click', () => {
      document.getElementById('sendSuccess').style.display = 'block';
      setTimeout(() => {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
      }, 1200);
    });
  }
}

function render() {
  const step = getStep();
  salesApp.innerHTML = `
    <div class="sales-shell">
      <aside class="sales-sidebar">
        <h2>Comercial Blip</h2>
        ${sidebarLink('overview', labels.overview)}
        ${sidebarLink('accounts', labels.accounts)}
        ${sidebarLink('opportunities', labels.opportunities)}
        ${sidebarLink('pitch', labels.pitch)}
      </aside>
      <div class="sales-main">
        <header class="topbar sales-topbar">
          <h1>Blip Sales Intelligence • Executivo Comercial</h1>
          <span class="meta">Executivo Blip</span>
        </header>
        <main class="container sales-container">${screenContent(step)}</main>
      </div>
    </div>
  `;

  bindEvents();
}

render();
