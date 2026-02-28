const appRoot = document.getElementById('app');

const storageKeys = {
  user: 'blip_mock_user',
  hasPassword: 'blip_has_password',
  connected: 'blip_connected',
  conversations: 'blip_conversations_override',
  contacts: 'blip_contacts_override'
};

const state = {
  usersByToken: {},
  contacts: [],
  conversations: {},
  reports: null,
  selectedContactId: null,
  atendimentoMode: 'desk',
  crmDrawerContactId: null,
  sidebarOpen: false,
  connectingTimer: null
};

async function loadMocks() {
  const [users, contacts, conversations, reports] = await Promise.all([
    fetch('mocks/users.json').then((res) => res.json()),
    fetch('mocks/contacts.json').then((res) => res.json()),
    fetch('mocks/conversations.json').then((res) => res.json()),
    fetch('mocks/reports.json').then((res) => res.json())
  ]);

  state.usersByToken = users;
  state.contacts = getStoredContacts() || contacts;
  state.conversations = getStoredConversations() || conversations;
  state.reports = reports;

  if (!state.selectedContactId && state.contacts[0]) {
    state.selectedContactId = state.contacts[0].id;
  }
}

function parseHash() {
  const fullHash = window.location.hash || '#/invite';
  const cleanHash = fullHash.replace(/^#/, '');
  const [pathPart, queryPart] = cleanHash.split('?');
  return {
    path: pathPart || '/invite',
    query: new URLSearchParams(queryPart || '')
  };
}

function navigate(path) {
  window.location.hash = path;
}

function getStoredUser() {
  const raw = localStorage.getItem(storageKeys.user);
  return raw ? JSON.parse(raw) : null;
}

function setStoredUser(user) {
  localStorage.setItem(storageKeys.user, JSON.stringify(user));
}

function hasPassword() {
  return localStorage.getItem(storageKeys.hasPassword) === 'true';
}

function isConnected() {
  return localStorage.getItem(storageKeys.connected) === 'true';
}

function getStoredConversations() {
  const raw = localStorage.getItem(storageKeys.conversations);
  return raw ? JSON.parse(raw) : null;
}

function getStoredContacts() {
  const raw = localStorage.getItem(storageKeys.contacts);
  return raw ? JSON.parse(raw) : null;
}

function saveConversations() {
  localStorage.setItem(storageKeys.conversations, JSON.stringify(state.conversations));
}

function saveContacts() {
  localStorage.setItem(storageKeys.contacts, JSON.stringify(state.contacts));
}

function routeGuard(path) {
  if (path.startsWith('/app')) {
    if (!hasPassword()) {
      navigate('/invite');
      return false;
    }
    if (!isConnected()) {
      navigate('/qr-connect');
      return false;
    }
  }
  return true;
}

function render() {
  const { path, query } = parseHash();

  if (!routeGuard(path)) return;

  clearTimeout(state.connectingTimer);

  if (path === '/invite') return renderInvite(query);
  if (path === '/create-password') return renderCreatePassword();
  if (path === '/qr-connect') return renderQrConnect();
  if (path === '/connecting') return renderConnecting();
  if (path === '/connected') return renderConnected();
  if (path === '/app/atendimento') return renderAtendimento();
  if (path === '/app/relatorios') return renderRelatorios();

  navigate('/invite');
}

function getCurrentInvitedUser() {
  const token = parseHash().query.get('token');
  if (token && state.usersByToken[token]) return state.usersByToken[token];
  return getStoredUser() || state.usersByToken.INVITE_TOKEN_123;
}

function renderInvite(query) {
  const token = query.get('token') || 'INVITE_TOKEN_123';
  const user = state.usersByToken[token];

  appRoot.innerHTML = `
    <div class="centered-screen">
      <div class="card auth-card">
        <div class="logo-placeholder">Blip</div>
        <h1>Blip Go Personal</h1>
        ${
          user
            ? `<p class="lead">Olá, <strong>${user.name}</strong>! Você foi convidado para conectar seu WhatsApp.</p>
               <div class="readonly-data">
                 <p><span>E-mail</span>${user.email}</p>
                 <p><span>Telefone</span>${user.phone}</p>
               </div>
               <button class="primary-btn" id="continueInvite">Continuar</button>`
            : `<p class="error-text">Token de convite inválido. Use um link válido para continuar.</p>`
        }
      </div>
    </div>
  `;

  if (user) {
    document.getElementById('continueInvite').addEventListener('click', () => {
      setStoredUser(user);
      navigate('/create-password');
    });
  }
}

function renderCreatePassword() {
  const user = getCurrentInvitedUser();

  if (!user) {
    navigate('/invite');
    return;
  }

  appRoot.innerHTML = `
    <div class="centered-screen">
      <form class="card auth-card" id="passwordForm">
        <h2>Crie sua senha</h2>
        <div class="readonly-data">
          <p><span>Nome</span>${user.name}</p>
          <p><span>E-mail</span>${user.email}</p>
          <p><span>Telefone</span>${user.phone}</p>
        </div>

        <label>Senha
          <input type="password" id="password" required placeholder="Mínimo 8 caracteres" />
        </label>

        <label>Confirmar senha
          <input type="password" id="confirmPassword" required placeholder="Digite novamente" />
        </label>

        <p class="error-text" id="passwordError"></p>
        <button class="primary-btn" type="submit">Salvar e continuar</button>
      </form>
    </div>
  `;

  document.getElementById('passwordForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const password = document.getElementById('password').value.trim();
    const confirmPassword = document.getElementById('confirmPassword').value.trim();
    const errorEl = document.getElementById('passwordError');

    if (password.length < 8) {
      errorEl.textContent = 'A senha deve ter no mínimo 8 caracteres.';
      return;
    }

    if (password !== confirmPassword) {
      errorEl.textContent = 'As senhas não coincidem.';
      return;
    }

    setStoredUser(user);
    localStorage.setItem(storageKeys.hasPassword, 'true');
    navigate('/qr-connect');
  });
}

function renderQrConnect() {
  appRoot.innerHTML = `
    <div class="centered-screen">
      <div class="card auth-card">
        <h2>Conectar WhatsApp por QR Code</h2>
        <div class="qr-box" aria-label="QR Code simulado"></div>
        <p class="lead">
          Abra o WhatsApp no seu celular &gt; Aparelhos conectados &gt; Conectar aparelho e escaneie o QR Code.
        </p>
        <button class="primary-btn" id="scannedBtn">Já escaneei</button>
      </div>
    </div>
  `;

  document.getElementById('scannedBtn').addEventListener('click', () => navigate('/connecting'));
}

function renderConnecting() {
  appRoot.innerHTML = `
    <div class="centered-screen">
      <div class="card auth-card text-center">
        <div class="spinner"></div>
        <h2>Conectando seu WhatsApp…</h2>
        <p>Aguarde alguns instantes.</p>
      </div>
    </div>
  `;

  state.connectingTimer = setTimeout(() => navigate('/connected'), 2000);
}

function renderConnected() {
  appRoot.innerHTML = `
    <div class="centered-screen">
      <div class="card auth-card text-center">
        <h2>Conexão concluída!</h2>
        <p class="lead">A partir de agora, seu WhatsApp está conectado à plataforma Blip.</p>
        <button class="primary-btn" id="goSystemBtn">Ir para o sistema</button>
      </div>
    </div>
  `;

  document.getElementById('goSystemBtn').addEventListener('click', () => {
    localStorage.setItem(storageKeys.connected, 'true');
    navigate('/app/atendimento');
  });
}

function renderAppShell(content, activeItem) {
  const user = getStoredUser();
  const menuItems = [
    { label: 'Atendimento', icon: '💬', route: '/app/atendimento', active: activeItem === 'atendimento' },
    { label: 'Relatórios', icon: '📊', route: '/app/relatorios', active: activeItem === 'relatorios' },
    { label: 'Contatos', icon: '👥' },
    { label: 'Campanhas', icon: '📣' },
    { label: 'Bots', icon: '🤖' },
    { label: 'Analytics', icon: '📈' },
    { label: 'Configurações', icon: '⚙️' }
  ];

  appRoot.innerHTML = `
    <div class="app-shell ${state.sidebarOpen ? 'sidebar-open' : ''}">
      <aside class="sidebar">
        <div class="logo-placeholder">Blip</div>
        <button class="menu-toggle" title="Exibir menu" aria-label="Exibir menu">☰</button>
        <nav class="primary-nav">
          ${menuItems
            .map(
              (item) => `
            <button
              class="nav-item ${item.active ? 'active' : ''} ${item.route ? '' : 'muted'}"
              type="button"
              ${item.route ? `data-route="${item.route}"` : ''}
              title="${item.label}"
              aria-label="${item.label}"
            >
              <span class="nav-icon">${item.icon}</span>
              <span class="nav-tooltip">${item.label}</span>
            </button>
          `
            )
            .join('')}
        </nav>
        <div class="sidebar-footer">AD</div>
      </aside>

      <div class="main-panel">
        <header class="topbar">
          <button class="menu-btn" id="menuBtn">☰</button>
          <h1 class="topbar-title">Atendimento</h1>
          <div class="user-box">
            <span>Colaborador:</span>
            <strong>${user ? user.name : 'Usuário'}</strong>
          </div>
        </header>
        <main class="content-area">${content}</main>
      </div>
    </div>
  `;

  document.querySelectorAll('.nav-item').forEach((btn) => {
    btn.addEventListener('click', () => {
      state.sidebarOpen = false;
      if (btn.dataset.route) navigate(btn.dataset.route);
    });
  });

  document.getElementById('menuBtn').addEventListener('click', () => {
    state.sidebarOpen = !state.sidebarOpen;
    render();
  });
}

function getMessagesFor(contactId) {
  return state.conversations[contactId] || [];
}

function appendMessage(contactId, text) {
  const list = getMessagesFor(contactId);
  const newMessage = {
    id: `m_${Date.now()}`,
    direction: 'out',
    text,
    time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  };
  state.conversations[contactId] = [...list, newMessage];
  saveConversations();
}

function renderAtendimento() {
  const selectedContact = state.contacts.find((contact) => contact.id === state.selectedContactId) || state.contacts[0];
  state.selectedContactId = selectedContact ? selectedContact.id : null;

  const modeToggle = `
    <div class="mode-toggle">
      <span>Desk</span>
      <label class="switch">
        <input id="modeSwitch" type="checkbox" ${state.atendimentoMode === 'crm' ? 'checked' : ''} />
        <span class="slider"></span>
      </label>
      <span>CRM</span>
    </div>
  `;

  const content = `
    <section class="atendimento-screen">
      <div class="toolbar">${modeToggle}</div>
      ${state.atendimentoMode === 'desk' ? renderDeskMode(selectedContact) : renderCrmMode()}
    </section>
  `;

  renderAppShell(content, 'atendimento');

  const switchInput = document.getElementById('modeSwitch');
  if (switchInput) {
    switchInput.addEventListener('change', (event) => {
      state.atendimentoMode = event.target.checked ? 'crm' : 'desk';
      render();
    });
  }

  attachAtendimentoHandlers();
}

function renderDeskMode(selectedContact) {
  const list = getMessagesFor(selectedContact?.id);
  const previewMessage = list[0]?.text || 'Sem mensagens';
  const lastMessage = list[list.length - 1];

  return `
    <div class="desk-wrap">
      <div class="panel contact-list-panel">
        <div class="list-header">
          <h3>Atendimentos</h3>
          <button class="primary-btn">Atender</button>
        </div>
        <div class="list-tabs">
          <span class="chip active">Todos (${state.contacts.length})</span>
          <span class="chip">Não lidos (2)</span>
        </div>
        <div class="contact-list">
        ${state.contacts
          .map(
            (contact, index) => `
          <button class="contact-item ${selectedContact && selectedContact.id === contact.id ? 'active' : ''}" data-contact-id="${contact.id}">
            <div class="contact-main-row">
              <strong>${contact.name}</strong>
              <small>${String(8 + (index % 10)).padStart(2, '0')}:${String(12 + (index % 40)).padStart(2, '0')}</small>
            </div>
            <p>${(getMessagesFor(contact.id)[0]?.text || 'Sem histórico').slice(0, 42)}...</p>
            <div class="contact-meta-row">
              <small>#${20 + index} Fila: Default</small>
              <span class="status-badge">${contact.status.replace('_', ' ')}</span>
            </div>
          </button>
        `
          )
          .join('')}
        </div>
      </div>

      <div class="panel conversation-panel">
        ${
          selectedContact
            ? `
          <div class="conversation-header">
            <div>
              <h3>${selectedContact.name}</h3>
              <small>Ticket #${20 + state.contacts.findIndex((item) => item.id === selectedContact.id)}</small>
            </div>
            <div class="conversation-actions">
              <button>Transferir</button>
              <button class="primary-btn">Finalizar</button>
            </div>
          </div>
          <div class="messages" id="deskMessages">
            ${renderMessages(list)}
          </div>
          <form class="message-form" id="deskForm">
            <input id="deskInput" type="text" placeholder="Escreva uma mensagem" required />
            <button class="primary-btn" type="submit">Enviar</button>
          </form>
        `
            : '<p>Selecione um contato.</p>'
        }
      </div>

      <aside class="panel contact-info-panel">
        ${
          selectedContact
            ? `
          <h3>Dados do Contato</h3>
          <div class="contact-data-group">
            <h4>Informações</h4>
            <p><span>Nome</span>${selectedContact.name}</p>
            <p><span>Telefone</span>${selectedContact.phone}</p>
            <p><span>E-mail</span>${selectedContact.email || selectedContact.name.toLowerCase().replace(' ', '.')}@exemplo.com.br</p>
            <p><span>Tags</span>${selectedContact.tags.join(', ')}</p>
          </div>
          <div class="contact-data-group">
            <h4>Resumo recente</h4>
            <p><span>Última mensagem</span>${lastMessage?.text || previewMessage}</p>
            <p><span>Último horário</span>${lastMessage?.time || '--:--'}</p>
          </div>
          <div class="contact-data-group">
            <h4>Comentários</h4>
            <p class="muted-text">Não há comentários sobre este usuário.</p>
          </div>
        `
            : '<p>Selecione um contato para ver os detalhes.</p>'
        }
      </aside>
    </div>
  `;
}

function renderCrmMode() {
  const columns = [
    { key: 'entrada', label: 'Entrada' },
    { key: 'em_atendimento', label: 'Em atendimento' },
    { key: 'concluido', label: 'Concluído' },
    { key: 'cancelado', label: 'Cancelado' }
  ];

  const drawerContact = state.contacts.find((contact) => contact.id === state.crmDrawerContactId);

  return `
    <div class="crm-layout">
      <div class="kanban">
        ${columns
          .map((column) => {
            const cards = state.contacts.filter((contact) => contact.status === column.key);
            return `
              <section class="kanban-column">
                <h4>${column.label} <span>${cards.length}</span></h4>
                <div class="kanban-cards">
                  ${cards
                    .map(
                      (contact) => `
                    <button class="kanban-card" data-drawer-contact="${contact.id}">
                      <strong>${contact.name}</strong>
                      <small>${contact.phone}</small>
                      <p>${contact.tags.join(' • ')}</p>
                    </button>
                  `
                    )
                    .join('')}
                </div>
              </section>
            `;
          })
          .join('')}
      </div>

      ${drawerContact ? renderCrmDrawer(drawerContact) : ''}
    </div>
  `;
}

function renderCrmDrawer(contact) {
  const messages = getMessagesFor(contact.id);
  const lastMessages = messages.slice(-3);

  return `
    <aside class="crm-drawer">
      <button class="close-drawer" id="closeDrawer">×</button>
      <h3>${contact.name}</h3>
      <p>${contact.phone}</p>
      <p class="tags">${contact.tags.map((tag) => `<span>${tag}</span>`).join('')}</p>

      <label>Status do atendimento
        <select id="statusSelect" data-contact-id="${contact.id}">
          <option value="entrada" ${contact.status === 'entrada' ? 'selected' : ''}>Entrada</option>
          <option value="em_atendimento" ${contact.status === 'em_atendimento' ? 'selected' : ''}>Em atendimento</option>
          <option value="concluido" ${contact.status === 'concluido' ? 'selected' : ''}>Concluído</option>
          <option value="cancelado" ${contact.status === 'cancelado' ? 'selected' : ''}>Cancelado</option>
        </select>
      </label>

      <div class="drawer-section">
        <h4>Últimas mensagens</h4>
        ${lastMessages.map((msg) => `<p>• ${msg.text}</p>`).join('')}
      </div>

      <div class="drawer-section messages compact-messages">${renderMessages(messages)}</div>

      <form id="drawerForm" class="message-form">
        <input id="drawerInput" type="text" placeholder="Enviar mensagem..." required />
        <button class="primary-btn" type="submit">Enviar</button>
      </form>
    </aside>
  `;
}

function renderMessages(messages) {
  return messages
    .map(
      (msg) => `
      <div class="message ${msg.direction === 'out' ? 'outbound' : 'inbound'}">
        <p>${msg.text}</p>
        <small>${msg.time}</small>
      </div>
    `
    )
    .join('');
}

function attachAtendimentoHandlers() {
  document.querySelectorAll('.contact-item').forEach((item) => {
    item.addEventListener('click', () => {
      state.selectedContactId = item.dataset.contactId;
      render();
    });
  });

  const deskForm = document.getElementById('deskForm');
  if (deskForm) {
    deskForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const input = document.getElementById('deskInput');
      appendMessage(state.selectedContactId, input.value.trim());
      input.value = '';
      render();
    });
  }

  document.querySelectorAll('[data-drawer-contact]').forEach((card) => {
    card.addEventListener('click', () => {
      state.crmDrawerContactId = card.dataset.drawerContact;
      render();
    });
  });

  const closeDrawer = document.getElementById('closeDrawer');
  if (closeDrawer) {
    closeDrawer.addEventListener('click', () => {
      state.crmDrawerContactId = null;
      render();
    });
  }

  const statusSelect = document.getElementById('statusSelect');
  if (statusSelect) {
    statusSelect.addEventListener('change', () => {
      const contact = state.contacts.find((item) => item.id === statusSelect.dataset.contactId);
      if (contact) {
        contact.status = statusSelect.value;
        saveContacts();
        render();
      }
    });
  }

  const drawerForm = document.getElementById('drawerForm');
  if (drawerForm) {
    drawerForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const input = document.getElementById('drawerInput');
      appendMessage(state.crmDrawerContactId, input.value.trim());
      input.value = '';
      render();
    });
  }
}

function renderRelatorios() {
  const { kpis, atendimentosPorHora, colaboradores } = state.reports;
  const maxValue = Math.max(...atendimentosPorHora.map((item) => item.value), 1);

  const content = `
    <section class="reports-screen">
      <h2>Relatórios</h2>
      <div class="kpi-grid">
        <article class="kpi-card"><h3>Total atendimentos hoje</h3><strong>${kpis.totalAtendimentosHoje}</strong></article>
        <article class="kpi-card"><h3>Tempo médio de resposta</h3><strong>${kpis.tempoMedioResposta}</strong></article>
        <article class="kpi-card"><h3>Conversas em aberto</h3><strong>${kpis.conversasEmAberto}</strong></article>
        <article class="kpi-card"><h3>CSAT</h3><strong>${kpis.csat}</strong></article>
      </div>

      <div class="panel chart-panel">
        <h3>Atendimentos por hora</h3>
        <div class="bars">
          ${atendimentosPorHora
            .map(
              (item) => `
            <div class="bar-row">
              <span>${item.label}</span>
              <div class="bar-track"><div class="bar-fill" style="width:${(item.value / maxValue) * 100}%"></div></div>
              <strong>${item.value}</strong>
            </div>
          `
            )
            .join('')}
        </div>
      </div>

      <div class="panel">
        <h3>Atendimentos por colaborador</h3>
        <table>
          <thead>
            <tr><th>Colaborador</th><th>Atendimentos</th><th>Tempo médio</th><th>CSAT</th></tr>
          </thead>
          <tbody>
            ${colaboradores
              .map(
                (person) => `
              <tr>
                <td>${person.nome}</td>
                <td>${person.atendimentos}</td>
                <td>${person.tempoMedio}</td>
                <td>${person.csat}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      </div>
    </section>
  `;

  renderAppShell(content, 'relatorios');
}

window.addEventListener('hashchange', render);

loadMocks()
  .then(() => {
    if (!window.location.hash) navigate('/invite');
    render();
  })
  .catch(() => {
    appRoot.innerHTML = '<div class="centered-screen"><p>Erro ao carregar os mocks.</p></div>';
  });
