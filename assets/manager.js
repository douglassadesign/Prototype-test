const managerApp = document.getElementById('managerApp');

const STORAGE_KEYS = {
  agents: 'blip_manager_agents',
  invites: 'blip_manager_invites',
  bottomup: 'blip_manager_bottomup_pending',
  selfConnectCompleted: 'blip_selfconnect_completed',
  agentPhone: 'blip_agent_phone'
};

const MANAGER_INFO = {
  company: 'Empresa XPTO',
  name: 'Juliana Mendes',
  email: 'juliana@empresaXPTO.com'
};

const STEP_LABELS = {
  import: 'Equipe',
  verify: 'Equipe',
  invites: 'Equipe',
  reports: 'Relatórios',
  upgrade: 'Planos'
};

const validSteps = ['import', 'verify', 'invites', 'reports', 'upgrade'];

function loadArray(key) {
  try {
    return JSON.parse(localStorage.getItem(key) || '[]');
  } catch {
    return [];
  }
}

function saveArray(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getStep() {
  const params = new URLSearchParams(window.location.search);
  const step = params.get('step') || 'import';
  return validSteps.includes(step) ? step : 'import';
}

function goToStep(step) {
  const next = validSteps.includes(step) ? step : 'import';
  const nextUrl = `${window.location.pathname}?step=${next}`;
  window.history.pushState({}, '', nextUrl);
  renderManager();
}

function showToast(message) {
  const holder = document.getElementById('managerToastHolder');
  if (!holder) return;
  const toast = document.createElement('div');
  toast.className = 'manager-toast';
  toast.textContent = message;
  holder.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 10);
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 2800);
}

function eligibilityFromPhone(phone) {
  const digits = String(phone || '').replace(/\D/g, '');
  const lastDigit = Number(digits.slice(-1));
  if (!digits || Number.isNaN(lastDigit)) {
    return {
      eligibility: 'not_eligible',
      reason: 'Número inválido para verificação.'
    };
  }
  if (lastDigit % 2 === 0) {
    return {
      eligibility: 'eligible',
      reason: ''
    };
  }
  return {
    eligibility: 'not_eligible',
    reason: 'Este número parece estar no WhatsApp (Consumer). Migre para WhatsApp Business para conectar.'
  };
}

function normalizeAgents(rawAgents) {
  return rawAgents
    .filter((agent) => agent.name || agent.email || agent.phone)
    .map((agent, index) => ({
      id: agent.id || `agent_${Date.now()}_${index}`,
      name: agent.name || `Agente ${index + 1}`,
      email: agent.email || `agente${index + 1}@empresa.com`,
      phone: agent.phone || '',
      eligibility: agent.eligibility || 'eligible',
      reason: agent.reason || '',
      inviteStatus: agent.inviteStatus || 'not_sent',
      connectionType: agent.connectionType || 'invited',
      connectedAt: agent.connectedAt || ''
    }));
}

function getStatusLabel(inviteStatus, eligibility, connectionType) {
  if (eligibility === 'not_eligible') return 'Não elegível';
  if (connectionType === 'self_connected' && inviteStatus === 'connected') return 'Conectado (self)';
  const map = {
    not_sent: 'Não enviado',
    sent: 'Enviado',
    opened: 'Aberto',
    connected: 'Conectado',
    failed: 'Falhou'
  };
  return map[inviteStatus] || 'Não enviado';
}

function seedBottomUpIfNeeded() {
  const completed = localStorage.getItem(STORAGE_KEYS.selfConnectCompleted) === 'true';
  const phone = localStorage.getItem(STORAGE_KEYS.agentPhone);
  if (!completed || !phone) return;

  const pending = loadArray(STORAGE_KEYS.bottomup);
  const alreadyExists = pending.some((item) => item.phone === phone);
  if (!alreadyExists) {
    pending.push({
      id: `bottomup_${Date.now()}`,
      name: 'Carlos Silva',
      phone,
      source: 'self_connected',
      status: 'pending'
    });
    saveArray(STORAGE_KEYS.bottomup, pending);
  }
}

function managerShell(content, step) {
  const activeSection = STEP_LABELS[step] || 'Equipe';
  return `
    <div class="manager-shell">
      <aside class="manager-sidebar">
        <div>
          <h2>Blip Desk</h2>
          <p>Módulo Gestor</p>
        </div>
        <button class="manager-nav ${activeSection === 'Equipe' ? 'active' : ''}" data-step="import">Equipe</button>
        <button class="manager-nav ${activeSection === 'Relatórios' ? 'active' : ''}" data-step="reports">Relatórios</button>
        <button class="manager-nav ${activeSection === 'Planos' ? 'active' : ''}" data-step="upgrade">Planos</button>
      </aside>
      <section class="manager-main">
        <header class="manager-topbar">
          <div>
            <strong>${MANAGER_INFO.company}</strong>
            <span>• ${MANAGER_INFO.name}</span>
          </div>
          <small>${MANAGER_INFO.email}</small>
        </header>
        <main class="manager-content">${content}</main>
      </section>
      <div class="manager-toast-holder" id="managerToastHolder"></div>
    </div>
  `;
}

function renderImportStep() {
  const agents = loadArray(STORAGE_KEYS.agents);
  const rows = agents.length > 0 ? normalizeAgents(agents) : new Array(5).fill(null).map((_, i) => ({ id: `new_${i}`, name: '', email: '', phone: '' }));

  return `
    <div class="manager-section-header">
      <div>
        <h1>Cadastrar equipe</h1>
        <p>Adicione os dados do seu time para enviar convites de conexão do WhatsApp via CoEx.</p>
      </div>
      <div class="manager-subtabs">
        <button class="active">Cadastro</button>
        <button data-step="invites">Convites</button>
      </div>
    </div>

    <article class="card panel">
      <h3>Cadastro manual</h3>
      <p class="small">Preencha nome, telefone e e-mail dos agentes.</p>
      <div class="manager-table-wrap">
        <table class="table manager-edit-table">
          <thead>
            <tr><th>Nome</th><th>Telefone</th><th>E-mail</th><th></th></tr>
          </thead>
          <tbody id="importRows">
            ${rows
              .map(
                (row) => `
                <tr>
                  <td><input class="manager-input" data-field="name" value="${row.name || ''}" placeholder="Ex: Ana Souza" /></td>
                  <td><input class="manager-input" data-field="phone" value="${row.phone || ''}" placeholder="Ex: +55 11 98888-1234" /></td>
                  <td><input class="manager-input" data-field="email" value="${row.email || ''}" placeholder="Ex: ana@empresa.com" /></td>
                  <td><button class="icon-btn" data-action="remove-row">🗑</button></td>
                </tr>`
              )
              .join('')}
          </tbody>
        </table>
      </div>
      <div class="manager-actions-row">
        <button class="ghost-btn" id="addRow">+ Adicionar linha</button>
        <button class="ghost-btn" id="uploadCsv">Upload CSV</button>
      </div>
      <div class="manager-actions-row" style="justify-content:flex-end; margin-top:16px;">
        <button class="primary-btn" id="verifyEligibility">Verificar elegibilidade</button>
      </div>
    </article>
  `;
}

function renderVerifyStep() {
  const agents = normalizeAgents(loadArray(STORAGE_KEYS.agents));
  const eligible = agents.filter((a) => a.eligibility === 'eligible').length;
  const notEligible = agents.length - eligible;

  return `
    <section class="manager-section-header">
      <div>
        <h1>Verificação de elegibilidade</h1>
        <p class="small" id="verifyLoading">Verificando números…</p>
      </div>
    </section>

    <article class="card panel">
      <div class="kpi-grid manager-kpi-grid">
        <div class="kpi"><span class="small">Elegíveis para conexão</span><strong>${eligible}</strong></div>
        <div class="kpi"><span class="small">Não elegíveis</span><strong>${notEligible}</strong></div>
      </div>

      <table class="table" style="margin-top:12px;">
        <thead>
          <tr><th>Nome</th><th>Telefone</th><th>E-mail</th><th>Status</th></tr>
        </thead>
        <tbody>
          ${agents
            .map(
              (agent) => `
                <tr>
                  <td>${agent.name}</td>
                  <td>${agent.phone}</td>
                  <td>${agent.email}</td>
                  <td>
                    <span class="badge ${agent.eligibility === 'eligible' ? 'success' : 'danger'}">${agent.eligibility === 'eligible' ? 'Elegível' : 'Não elegível'}</span>
                    ${agent.eligibility === 'not_eligible' ? `<p class="small" style="margin-top:6px;">${agent.reason}</p>` : ''}
                  </td>
                </tr>
              `
            )
            .join('')}
        </tbody>
      </table>

      <div class="manager-actions-row" style="justify-content:space-between; margin-top:14px;">
        <button class="ghost-btn" data-step="import">Voltar e editar</button>
        <button class="primary-btn" data-step="invites">Ir para convites</button>
      </div>
    </article>
  `;
}

function renderInvitesStep() {
  const agents = normalizeAgents(loadArray(STORAGE_KEYS.agents));
  const pendingBottomup = loadArray(STORAGE_KEYS.bottomup).filter((item) => item.status === 'pending');

  return `
    <div class="manager-section-header">
      <div>
        <h1>Convites e conexões</h1>
        <p class="small">CoEx: o agente continua usando o WhatsApp no celular; o Desk espelha as conversas.</p>
      </div>
      <div class="manager-subtabs">
        <button data-step="import">Cadastro</button>
        <button class="active">Convites</button>
      </div>
    </div>

    <article class="card panel">
      <h3>Equipe</h3>
      <table class="table" style="margin-top:10px;">
        <thead>
          <tr><th>Nome</th><th>Telefone</th><th>E-mail</th><th>Elegibilidade</th><th>Status</th><th>Ação</th></tr>
        </thead>
        <tbody>
          ${agents
            .map((agent) => {
              const statusText = getStatusLabel(agent.inviteStatus, agent.eligibility, agent.connectionType);
              const action =
                agent.eligibility === 'not_eligible'
                  ? '<button class="ghost-btn" disabled>Não elegível</button>'
                  : agent.inviteStatus === 'connected'
                    ? '<button class="ghost-btn" disabled>Conectado ✓</button>'
                    : `<button class="primary-btn" data-action="send-invite" data-id="${agent.id}">${agent.inviteStatus === 'not_sent' ? 'Enviar convite' : 'Reenviar'}</button>`;

              return `
                <tr>
                  <td>${agent.name}</td>
                  <td>${agent.phone}</td>
                  <td>${agent.email}</td>
                  <td><span class="badge ${agent.eligibility === 'eligible' ? 'success' : 'danger'}">${agent.eligibility === 'eligible' ? 'Elegível' : 'Não elegível'}</span></td>
                  <td>${statusText}</td>
                  <td>${action}</td>
                </tr>
              `;
            })
            .join('')}
        </tbody>
      </table>

      <div class="banner-upsell" style="margin-top:14px;">
        <strong>Convites simulam um link de conexão via QR Code.</strong>
      </div>
    </article>

    <article class="card panel" style="margin-top:14px;">
      <h3>Conexões feitas pelo agente (bottom-up)</h3>
      <p class="small" style="margin-top:6px;">Conexões self-connect aparecem aqui para validação do gestor.</p>
      ${
        pendingBottomup.length === 0
          ? '<p class="small" style="margin-top:8px;">Sem conexões pendentes de reconhecimento.</p>'
          : `<table class="table" style="margin-top:10px;">
              <thead><tr><th>Agente</th><th>Número</th><th>Origem</th><th>Status</th><th>Ação</th></tr></thead>
              <tbody>
                ${pendingBottomup
                  .map(
                    (item) => `
                      <tr>
                        <td>${item.name}</td>
                        <td>${item.phone}</td>
                        <td><span class="badge info">Self-connected</span></td>
                        <td>Aguardando reconhecimento do gestor</td>
                        <td>
                          <button class="primary-btn" data-action="recognize" data-id="${item.id}">Reconhecer vínculo</button>
                          <button class="ghost-btn" data-action="reject" data-id="${item.id}">Rejeitar</button>
                        </td>
                      </tr>
                    `
                  )
                  .join('')}
              </tbody>
            </table>`
      }
    </article>
  `;
}

function renderReportsStep() {
  return `
    <section class="manager-section-header">
      <div>
        <h1>Dashboard da equipe</h1>
        <p class="small baseline">Baseline: comparação com histórico sincronizado dos últimos 6 meses (Meta API)</p>
      </div>
    </section>

    <article class="manager-metrics-grid">
      <div class="card panel"><span class="small">Conversas em aberto</span><h3>84</h3></div>
      <div class="card panel"><span class="small">Tempo médio de resposta (TMR)</span><h3>12m</h3></div>
      <div class="card panel"><span class="small">Taxa de follow-up em 24h</span><h3>71%</h3></div>
      <div class="card panel"><span class="small">Leads quentes (IA)</span><h3>19</h3></div>
      <div class="card panel"><span class="small">CSAT (mock)</span><h3>4.4/5</h3></div>
    </article>

    <article class="card panel" style="margin-top:14px;">
      <h3>Agentes que precisam de atenção</h3>
      <table class="table" style="margin-top:10px;">
        <thead><tr><th>Agente</th><th>TMR</th><th>Conversas em aberto</th><th>Alertas IA</th></tr></thead>
        <tbody>
          <tr><td>Ana Souza</td><td>18m</td><td>14</td><td>Possível perda de lead quente</td></tr>
          <tr><td>Bruno Lima</td><td>23m</td><td>11</td><td>Fila sem follow-up em 24h</td></tr>
          <tr><td>Camila Rocha</td><td>15m</td><td>9</td><td>Risco de atraso em orçamento</td></tr>
        </tbody>
      </table>
    </article>

    <article class="card panel" style="margin-top:14px;">
      <h3>Eficiência: antes vs depois</h3>
      <div class="manager-chart">
        <div>
          <p class="small">Antes (baseline 6 meses)</p>
          <div class="bar before" style="width:52%;"></div>
          <strong>52%</strong>
        </div>
        <div>
          <p class="small">Depois (últimos 7 dias)</p>
          <div class="bar after" style="width:78%;"></div>
          <strong>78% <span class="improvement">+26 pp</span></strong>
        </div>
      </div>
    </article>

    <article class="card panel" style="margin-top:14px;">
      <h3>Nuvem de tópicos (IA)</h3>
      <div class="topic-cloud" style="margin-top:10px;">
        <span class="topic">Preço</span>
        <span class="topic">Prazo de entrega</span>
        <span class="topic">Formas de pagamento</span>
        <span class="topic">Garantia</span>
        <span class="topic">Desconto</span>
      </div>
    </article>

    <article class="card panel" style="margin-top:14px;">
      <p class="small">IA prioriza e sinaliza leads antes do humano (triagem + score).</p>
      <p class="small" style="margin-top:4px;">Sincronização Meta API: últimos 6 meses.</p>
      <div class="banner-upsell" style="margin-top:10px;">
        <strong>Ative QA e automações completas para melhorar conversão.</strong>
        <button class="primary-btn" data-step="upgrade" style="margin-left:10px;">Ver planos</button>
      </div>
    </article>
  `;
}

function renderUpgradeStep() {
  return `
    <section class="manager-section-header">
      <div>
        <h1>Planos para sua equipe</h1>
      </div>
    </section>

    <section class="manager-pricing-grid">
      <article class="card panel">
        <h3>Free / Básico</h3>
        <ul class="mini-list">
          <li>Espelhamento + organização simples</li>
          <li>Relatórios básicos</li>
          <li>1 integração</li>
        </ul>
      </article>
      <article class="card panel">
        <h3>Pro / Desk Completo</h3>
        <ul class="mini-list">
          <li>Automação de respostas repetitivas</li>
          <li>Filas, SLAs, tags avançadas</li>
          <li>IA insights + priorização</li>
        </ul>
        <button class="primary-btn" data-action="open-specialist" style="margin-top:10px;">Fazer upgrade</button>
      </article>
      <article class="card panel">
        <h3>Enterprise / Governança Total</h3>
        <ul class="mini-list">
          <li>Compliance + auditoria QA automatizada</li>
          <li>Controles de permissão Matriz &gt; Franquia</li>
          <li>Integrações avançadas</li>
        </ul>
        <button class="ghost-btn" data-action="open-specialist" style="margin-top:10px;">Falar com comercial</button>
      </article>
    </section>

    <div id="specialistModal" class="manager-modal-overlay hidden">
      <div class="manager-modal card panel">
        <div class="manager-modal-head">
          <h3>Fale com um especialista</h3>
          <button class="icon-btn" data-action="close-modal">✕</button>
        </div>
        <form id="specialistForm" class="manager-form-grid">
          <input class="manager-input" required placeholder="Nome" />
          <input class="manager-input" required placeholder="Empresa" />
          <input class="manager-input" required type="email" placeholder="Email" />
          <select class="manager-input" required>
            <option value="">Tamanho do time</option>
            <option>1-5</option>
            <option>6-20</option>
            <option>21-50</option>
            <option>51+</option>
          </select>
          <textarea class="manager-input" placeholder="Mensagem"></textarea>
          <div style="text-align:right;">
            <button class="primary-btn" type="submit">Enviar</button>
          </div>
        </form>
      </div>
    </div>
  `;
}

function bindImportActions() {
  const importRows = document.getElementById('importRows');
  document.getElementById('addRow')?.addEventListener('click', () => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><input class="manager-input" data-field="name" placeholder="Ex: Ana Souza" /></td>
      <td><input class="manager-input" data-field="phone" placeholder="Ex: +55 11 98888-1234" /></td>
      <td><input class="manager-input" data-field="email" placeholder="Ex: ana@empresa.com" /></td>
      <td><button class="icon-btn" data-action="remove-row">🗑</button></td>
    `;
    importRows.appendChild(row);
  });

  document.getElementById('uploadCsv')?.addEventListener('click', () => {
    showToast('Upload mockado.');
  });

  importRows?.addEventListener('click', (event) => {
    const target = event.target;
    if (target instanceof HTMLElement && target.dataset.action === 'remove-row') {
      target.closest('tr')?.remove();
    }
  });

  document.getElementById('verifyEligibility')?.addEventListener('click', () => {
    const rows = [...document.querySelectorAll('#importRows tr')];
    const parsed = rows
      .map((row, index) => {
        const name = row.querySelector('[data-field="name"]')?.value.trim() || '';
        const phone = row.querySelector('[data-field="phone"]')?.value.trim() || '';
        const email = row.querySelector('[data-field="email"]')?.value.trim() || '';
        if (!name && !phone && !email) return null;
        return {
          id: `agent_${Date.now()}_${index}`,
          name,
          phone,
          email,
          eligibility: 'eligible',
          reason: '',
          inviteStatus: 'not_sent',
          connectionType: 'invited',
          connectedAt: ''
        };
      })
      .filter(Boolean);

    saveArray(STORAGE_KEYS.agents, parsed);
    saveArray(STORAGE_KEYS.invites, parsed);

    goToStep('verify');
    setTimeout(() => {
      const saved = normalizeAgents(loadArray(STORAGE_KEYS.agents)).map((agent) => {
        const check = eligibilityFromPhone(agent.phone);
        return {
          ...agent,
          eligibility: check.eligibility,
          reason: check.reason,
          inviteStatus: check.eligibility === 'not_eligible' ? 'failed' : agent.inviteStatus
        };
      });
      saveArray(STORAGE_KEYS.agents, saved);
      saveArray(STORAGE_KEYS.invites, saved);
      renderManager();
    }, 1000);
  });
}

function bindInviteActions() {
  const agents = normalizeAgents(loadArray(STORAGE_KEYS.agents));

  document.querySelectorAll('[data-action="send-invite"]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.dataset.id;
      const updated = agents.map((agent) => (agent.id === id ? { ...agent, inviteStatus: 'sent' } : agent));
      saveArray(STORAGE_KEYS.agents, updated);
      saveArray(STORAGE_KEYS.invites, updated);

      const current = updated.find((agent) => agent.id === id);
      if (current) showToast(`Convite enviado para ${current.email}`);
      renderManager();

      setTimeout(() => {
        const refreshed = normalizeAgents(loadArray(STORAGE_KEYS.agents)).map((agent) =>
          agent.id === id && agent.inviteStatus === 'sent' ? { ...agent, inviteStatus: 'opened' } : agent
        );
        saveArray(STORAGE_KEYS.agents, refreshed);
        saveArray(STORAGE_KEYS.invites, refreshed);
        renderManager();
      }, 2000);
    });
  });

  document.querySelectorAll('[data-action="recognize"]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.dataset.id;
      const pending = loadArray(STORAGE_KEYS.bottomup);
      const selected = pending.find((item) => item.id === id);
      const updatedPending = pending.map((item) => (item.id === id ? { ...item, status: 'recognized' } : item));
      saveArray(STORAGE_KEYS.bottomup, updatedPending);

      if (selected) {
        const existing = normalizeAgents(loadArray(STORAGE_KEYS.agents));
        const alreadyByPhone = existing.find((agent) => agent.phone === selected.phone);
        let nextAgents = existing;
        if (alreadyByPhone) {
          nextAgents = existing.map((agent) =>
            agent.phone === selected.phone
              ? {
                  ...agent,
                  eligibility: 'eligible',
                  inviteStatus: 'connected',
                  connectionType: 'self_connected',
                  connectedAt: new Date().toISOString().slice(0, 10)
                }
              : agent
          );
        } else {
          nextAgents = [
            ...existing,
            {
              id: `agent_self_${Date.now()}`,
              name: selected.name,
              email: 'carlos.silva@empresa.com',
              phone: selected.phone,
              eligibility: 'eligible',
              reason: '',
              inviteStatus: 'connected',
              connectionType: 'self_connected',
              connectedAt: new Date().toISOString().slice(0, 10)
            }
          ];
        }
        saveArray(STORAGE_KEYS.agents, nextAgents);
      }

      showToast('Conexão reconhecida e vinculada à equipe.');
      renderManager();
    });
  });

  document.querySelectorAll('[data-action="reject"]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.dataset.id;
      const pending = loadArray(STORAGE_KEYS.bottomup).map((item) => (item.id === id ? { ...item, status: 'rejected' } : item));
      saveArray(STORAGE_KEYS.bottomup, pending);
      showToast('Conexão marcada como não reconhecida.');
      renderManager();
    });
  });
}

function bindUpgradeActions() {
  const modal = document.getElementById('specialistModal');

  document.querySelectorAll('[data-action="open-specialist"]').forEach((button) => {
    button.addEventListener('click', () => {
      modal?.classList.remove('hidden');
    });
  });

  document.querySelectorAll('[data-action="close-modal"]').forEach((button) => {
    button.addEventListener('click', () => {
      modal?.classList.add('hidden');
    });
  });

  modal?.addEventListener('click', (event) => {
    if (event.target === modal) modal.classList.add('hidden');
  });

  document.getElementById('specialistForm')?.addEventListener('submit', (event) => {
    event.preventDefault();
    modal?.classList.add('hidden');
    showToast('Recebemos sua solicitação. Um especialista Blip entrará em contato.');
  });
}

function bindSharedActions() {
  document.querySelectorAll('[data-step]').forEach((element) => {
    element.addEventListener('click', () => {
      goToStep(element.dataset.step);
    });
  });

  const step = getStep();
  if (step === 'import') bindImportActions();
  if (step === 'invites') bindInviteActions();
  if (step === 'upgrade') bindUpgradeActions();

  if (step === 'verify') {
    const loadingEl = document.getElementById('verifyLoading');
    if (loadingEl) {
      setTimeout(() => {
        loadingEl.textContent = 'Verificação concluída.';
      }, 1000);
    }
  }
}

function renderStep(step) {
  if (step === 'verify') return renderVerifyStep();
  if (step === 'invites') return renderInvitesStep();
  if (step === 'reports') return renderReportsStep();
  if (step === 'upgrade') return renderUpgradeStep();
  return renderImportStep();
}

function renderManager() {
  seedBottomUpIfNeeded();
  const step = getStep();
  managerApp.innerHTML = managerShell(renderStep(step), step);
  bindSharedActions();
}

window.addEventListener('popstate', renderManager);
renderManager();
