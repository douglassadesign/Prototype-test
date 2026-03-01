const app = document.getElementById('agentApp');

const storage = {
  passwordCreated: 'blip_passwordCreated',
  whatsappConnected: 'blip_whatsappConnected',
  onboardingCompleted: 'blip_onboardingCompleted',
  inviteContext: 'blip_inviteContext',
  selectedConversation: 'blip_selected_conversation',
  conversations: 'blip_agent_conversations'
};

const inviteContext = {
  company: 'Empresa XPTO',
  managerName: 'Juliana Mendes',
  managerEmail: 'juliana@empresaXPTO.com',
  agentName: 'Carlos Silva',
  agentEmail: 'carlos@empresaXPTO.com',
  agentPhone: '+55 31 99999-8888'
};

const baseConversations = [
  {
    id: 'c1',
    name: 'Nicolas Torres',
    phone: '+55 31 98888-1001',
    status: 'Novos',
    tag: 'Lead quente',
    time: '10:41',
    score: 85,
    snippet: 'Estou aguardando o retorno sobre a proposta.',
    messages: [
      { dir: 'in', text: 'Estou aguardando o retorno sobre a proposta.', time: '10:41' },
      { dir: 'out', text: 'Claro! Vou verificar isso para você.', time: '10:46' }
    ]
  },
  {
    id: 'c2',
    name: 'Gustavo Silva',
    phone: '+55 31 98888-1002',
    status: 'Em atendimento',
    tag: 'Pendência',
    time: '11:20',
    score: 71,
    snippet: 'Consegue me enviar o contrato por e-mail?',
    messages: [{ dir: 'in', text: 'Consegue me enviar o contrato por e-mail?', time: '11:20' }]
  },
  {
    id: 'c3',
    name: 'Priscila Figueredo',
    phone: '+55 31 98888-1003',
    status: 'Follow-up',
    tag: 'IA sugere contato 2h',
    time: '09:49',
    score: 78,
    snippet: 'Obrigada pelo atendimento!',
    messages: [{ dir: 'in', text: 'Obrigada pelo atendimento!', time: '09:49' }]
  },
  {
    id: 'c4',
    name: 'Fernanda Ramos',
    phone: '+55 31 98888-1004',
    status: 'Fechado',
    tag: 'Fechado',
    time: '08:33',
    score: 92,
    snippet: 'Fechamos, pode seguir com o pedido.',
    messages: [{ dir: 'in', text: 'Fechamos, pode seguir com o pedido.', time: '08:33' }]
  }
];

function getParamStep() {
  const url = new URL(window.location.href);
  return url.searchParams.get('step');
}

function navigateStep(step) {
  const url = new URL(window.location.href);
  url.searchParams.set('step', step);
  window.history.pushState({}, '', url);
  render();
}

function initStorage() {
  if (!localStorage.getItem(storage.inviteContext)) {
    localStorage.setItem(storage.inviteContext, JSON.stringify(inviteContext));
  }

  if (!localStorage.getItem(storage.conversations)) {
    localStorage.setItem(storage.conversations, JSON.stringify(baseConversations));
  }

  if (!localStorage.getItem(storage.selectedConversation)) {
    localStorage.setItem(storage.selectedConversation, 'c1');
  }
}

function getConversations() {
  return JSON.parse(localStorage.getItem(storage.conversations)) || [];
}

function saveConversations(data) {
  localStorage.setItem(storage.conversations, JSON.stringify(data));
}

function isTrue(key) {
  return localStorage.getItem(key) === 'true';
}

function guardStep(step) {
  if (step === 'qr' && !isTrue(storage.passwordCreated)) return 'password';
  if (step === 'welcome' && !isTrue(storage.whatsappConnected)) return 'qr';
  if (step === 'desk') {
    if (!isTrue(storage.passwordCreated)) return 'password';
    if (!isTrue(storage.whatsappConnected)) return 'qr';
  }
  return step;
}

function renderEmail() {
  const c = inviteContext;

  app.innerHTML = `
    <div class="agent-fullscreen gmail-shell">
      <header class="gmail-topbar">
        <div class="gmail-logo">Gmail</div>
        <input class="gmail-search" placeholder="Pesquisar e-mails" />
      </header>
      <div class="gmail-layout">
        <aside class="gmail-left">
          <button class="gmail-nav active">Caixa de entrada</button>
          <button class="gmail-nav">Com estrela</button>
          <button class="gmail-nav">Enviados</button>
          <button class="gmail-nav">Rascunhos</button>
        </aside>
        <main class="gmail-mail-view">
          <h2>Convite para conectar seu WhatsApp profissional</h2>
          <p class="small"><strong>De:</strong> ${c.managerName} &lt;${c.managerEmail}&gt;</p>
          <p class="small"><strong>Para:</strong> ${c.agentName} &lt;${c.agentEmail}&gt;</p>
          <div class="mail-copy">
            <p>Olá, ${c.agentName}.</p>
            <p>A ${c.company} está te enviando um convite autorizado para conectar seu número profissional <strong>${c.agentPhone}</strong> ao Blip.</p>
            <p>Com isso, você terá uma camada extra para:</p>
            <ul>
              <li>organizar sua carteira de clientes;</li>
              <li>identificar pendências rapidamente;</li>
              <li>priorizar leads com mais chance de fechamento;</li>
              <li>não perder conversas importantes.</li>
            </ul>
            <p>Seu WhatsApp continua funcionando normalmente no celular (coexistência).</p>
            <p>Você ganha produtividade sem precisar trocar seu jeito de trabalhar.</p>
          </div>
          <button class="primary-btn" id="connectFromEmail">Conectar meu número</button>
        </main>
      </div>
    </div>
  `;

  document.getElementById('connectFromEmail').addEventListener('click', () => navigateStep('password'));
}

function renderPassword() {
  const c = inviteContext;
  const alreadyCreated = isTrue(storage.passwordCreated);

  app.innerHTML = `
    <div class="agent-fullscreen centered-step">
      <section class="card panel auth-card">
        <h2>Criar acesso ao Blip Desk</h2>
        <p class="small">Convite autorizado para conexão CoEx.</p>

        <div class="info-grid">
          <p><span>Empresa</span><strong>${c.company}</strong></p>
          <p><span>Gestora</span><strong>${c.managerName} (${c.managerEmail})</strong></p>
          <p><span>Agente</span><strong>${c.agentName}</strong></p>
          <p><span>E-mail</span><strong>${c.agentEmail}</strong></p>
          <p><span>Telefone</span><strong>${c.agentPhone}</strong></p>
        </div>

        ${
          alreadyCreated
            ? `<div class="subtle-note">Senha já criada neste navegador.</div>
               <button class="primary-btn" id="skipPassword">Continuar</button>`
            : `<label>Senha
                <input type="password" id="password" placeholder="Mínimo 8 caracteres" />
               </label>
               <label>Confirmar senha
                <input type="password" id="confirmPassword" placeholder="Digite novamente" />
               </label>
               <p class="error-text" id="passwordError"></p>
               <button class="primary-btn" id="createPassword">Criar senha e continuar</button>`
        }
      </section>
    </div>
  `;

  const skip = document.getElementById('skipPassword');
  if (skip) {
    skip.addEventListener('click', () => navigateStep('qr'));
    return;
  }

  document.getElementById('createPassword').addEventListener('click', () => {
    const password = document.getElementById('password').value.trim();
    const confirm = document.getElementById('confirmPassword').value.trim();
    const errorEl = document.getElementById('passwordError');

    if (password.length < 8) {
      errorEl.textContent = 'A senha deve ter no mínimo 8 caracteres.';
      return;
    }

    if (password !== confirm) {
      errorEl.textContent = 'As senhas não coincidem.';
      return;
    }

    localStorage.setItem(storage.passwordCreated, 'true');
    if (!localStorage.getItem(storage.inviteContext)) {
      localStorage.setItem(storage.inviteContext, JSON.stringify(inviteContext));
    }
    navigateStep('qr');
  });
}

function renderQr() {
  app.innerHTML = `
    <div class="agent-fullscreen centered-step">
      <section class="card panel qr-step">
        <h2>Conectar WhatsApp Business</h2>
        <div class="qr big"></div>
        <p>Abra o WhatsApp Business &gt; Aparelhos conectados &gt; Conectar aparelho e escaneie o QR Code.</p>
        <p class="small">Você continuará usando o WhatsApp normalmente no celular.</p>
        <p class="small">Suas conversas serão espelhadas no Blip Desk.</p>
        <button class="primary-btn" id="scanned">Já escaneei</button>
      </section>
    </div>
  `;

  document.getElementById('scanned').addEventListener('click', () => navigateStep('connecting'));
}

function renderConnecting() {
  app.innerHTML = `
    <div class="agent-fullscreen centered-step">
      <section class="card panel connect-loading text-center">
        <div class="spinner"></div>
        <h2>Conectando seu WhatsApp…</h2>
        <p class="small">Sincronizando histórico (últimos 6 meses) via Meta API…</p>
      </section>
    </div>
  `;

  setTimeout(() => {
    localStorage.setItem(storage.whatsappConnected, 'true');
    navigateStep('welcome');
  }, 2000);
}

function renderWelcome() {
  app.innerHTML = `
    <div class="agent-fullscreen centered-step">
      <section class="card panel auth-card text-center">
        <h2>Bem-vindo ao Blip Desk</h2>
        <p>Seu WhatsApp foi conectado com sucesso.</p>
        <p class="small">Todas as conversas do WhatsApp são espelhadas aqui.</p>
        <p class="small">Você pode continuar usando o WhatsApp no celular ou atender diretamente pelo Desk.</p>
        <button class="primary-btn" id="startDesk">OK, vou começar</button>
      </section>
    </div>
  `;

  document.getElementById('startDesk').addEventListener('click', () => {
    localStorage.setItem(storage.onboardingCompleted, 'true');
    navigateStep('desk');
  });
}

function renderDesk() {
  const conversations = getConversations();
  const selectedId = localStorage.getItem(storage.selectedConversation) || conversations[0]?.id;
  const selected = conversations.find((c) => c.id === selectedId) || conversations[0];

  app.innerHTML = `
    <div class="agent-fullscreen desk-shell">
      <aside class="desk-sidebar">
        <div class="desk-brand">Blip</div>
        <button class="desk-menu active">💬 <span>Atendimento</span></button>
        <button class="desk-menu">📊 <span>Relatórios</span></button>
        <button class="desk-menu">⚙️ <span>Configurações</span></button>
      </aside>

      <div class="desk-main">
        <section class="desk-col col-left">
          <input class="search" placeholder="Buscar por nome ou telefone..." />
          <div class="status-row"><span>Novos</span><strong>${conversations.filter((c) => c.status === 'Novos').length}</strong></div>
          <div class="status-row"><span>Em atendimento</span><strong>${conversations.filter((c) => c.status === 'Em atendimento').length}</strong></div>
          <div class="status-row"><span>Follow-up</span><strong>${conversations.filter((c) => c.status === 'Follow-up').length}</strong></div>
          <div class="status-row"><span>Fechado</span><strong>${conversations.filter((c) => c.status === 'Fechado').length}</strong></div>
        </section>

        <section class="desk-col col-middle">
          <div class="view-toggle">
            <button class="ghost-btn active-mode" id="btnLista">Lista</button>
            <button class="ghost-btn" id="btnKanban">Kanban</button>
          </div>

          <div id="listView" class="conversation-list">
            ${conversations
              .map(
                (c) => `
                  <article class="conversation-item ${c.id === selected.id ? 'active' : ''}" data-conversation="${c.id}">
                    <div>
                      <strong>${c.name}</strong>
                      <p>${c.snippet}</p>
                    </div>
                    <div class="conv-meta">
                      <small>${c.time}</small>
                      <span class="badge info">${c.tag}</span>
                    </div>
                  </article>
                `
              )
              .join('')}
          </div>

          <div id="kanbanView" class="kanban-board" style="display:none;">
            ${['Novos', 'Em atendimento', 'Follow-up', 'Fechado']
              .map(
                (status) => `
                  <div class="kanban-col">
                    <h4>${status}</h4>
                    ${conversations
                      .filter((c) => c.status === status)
                      .map(
                        (c) => `
                          <button class="lead-card kanban-card" data-conversation="${c.id}" data-status="${status}">
                            <strong>${c.name}</strong>
                            <span class="small">${c.snippet}</span>
                          </button>
                        `
                      )
                      .join('')}
                  </div>
                `
              )
              .join('')}
          </div>
        </section>

        <section class="desk-col col-right">
          <h3>${selected.name}</h3>
          <p class="small">${selected.phone}</p>
          <div class="inline-badges">
            <span class="badge warning">Triagem IA antes do humano</span>
            <span class="badge info">Score de fechamento: ${selected.score}%</span>
          </div>

          <div class="insights-box">
            <p><strong>Insight IA:</strong> Melhor horário de contato: tarde</p>
            <p><strong>Sugestão:</strong> fazer follow-up em 2h</p>
            <p class="small">Coexistência ativa: WhatsApp continua no celular.</p>
            <p class="small">Sincronização: últimos 6 meses via Meta API.</p>
          </div>

          <div class="chat-thread" id="chatThread">
            ${selected.messages
              .map((m) => `<div class="message ${m.dir === 'out' ? 'outbound' : 'inbound'}"><p>${m.text}</p><small>${m.time}</small></div>`)
              .join('')}
          </div>

          <form id="sendForm" class="message-form">
            <input id="sendInput" placeholder="Escreva uma mensagem..." required />
            <button class="primary-btn" type="submit">Enviar</button>
          </form>

          <div class="banner-upsell subtle">
            Automatize respostas repetitivas com o Blip Desk + IA.
            <button class="ghost-btn" style="margin-top:8px;">Solicitar upgrade ao gestor</button>
          </div>
        </section>
      </div>
    </div>
  `;

  document.querySelectorAll('[data-conversation]').forEach((el) => {
    el.addEventListener('click', () => {
      localStorage.setItem(storage.selectedConversation, el.dataset.conversation);
      renderDesk();
    });
  });

  const btnLista = document.getElementById('btnLista');
  const btnKanban = document.getElementById('btnKanban');
  const listView = document.getElementById('listView');
  const kanbanView = document.getElementById('kanbanView');

  btnLista.addEventListener('click', () => {
    btnLista.classList.add('active-mode');
    btnKanban.classList.remove('active-mode');
    listView.style.display = 'grid';
    kanbanView.style.display = 'none';
  });

  btnKanban.addEventListener('click', () => {
    btnKanban.classList.add('active-mode');
    btnLista.classList.remove('active-mode');
    listView.style.display = 'none';
    kanbanView.style.display = 'grid';
  });

  document.getElementById('sendForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const input = document.getElementById('sendInput');
    const text = input.value.trim();
    if (!text) return;

    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const data = getConversations();
    const item = data.find((c) => c.id === selected.id);

    if (item) {
      item.messages.push({ dir: 'out', text, time });
      item.snippet = text;
      item.time = time;
      saveConversations(data);
      input.value = '';
      renderDesk();
    }
  });
}

function render() {
  initStorage();

  const rawStep = getParamStep();
  const requestedStep = rawStep || 'email';
  const step = guardStep(requestedStep);

  if (step !== requestedStep) {
    const url = new URL(window.location.href);
    url.searchParams.set('step', step);
    window.location.replace(url.toString());
    return;
  }

  if (!rawStep) {
    navigateStep('email');
    return;
  }

  if (step === 'email') return renderEmail();
  if (step === 'password') return renderPassword();
  if (step === 'qr') return renderQr();
  if (step === 'connecting') return renderConnecting();
  if (step === 'welcome') return renderWelcome();
  if (step === 'desk') return renderDesk();

  navigateStep('email');
}

window.addEventListener('popstate', render);
render();
