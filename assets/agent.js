const app = document.getElementById('agentApp');

const storage = {
  passwordCreated: 'blip_passwordCreated',
  whatsappConnected: 'blip_whatsappConnected',
  onboardingCompleted: 'blip_onboardingCompleted',
  inviteContext: 'blip_inviteContext',
  selectedTicket: 'blip_selected_ticket',
  deskMode: 'blip_desk_mode',
  ticketFilter: 'blip_ticket_filter',
  tickets: 'blip_agent_tickets',
  connectPromptDismissed: 'blip_connect_prompt_dismissed',
  selfconnectFirstTryDone: 'blip_selfconnect_first_try_done',
  selfconnectCompleted: 'blip_selfconnect_completed',
  agentPhone: 'blip_agent_phone',
  channelFilter: 'blip_channel_filter'
};

const fallbackAgentPhone = '+55 31 99449-9944';
const televendasChannel = '0800 466-466';
let deskModal = null;
let connectTimer = null;

const inviteContext = {
  company: 'Empresa XPTO',
  managerName: 'Juliana Mendes',
  managerEmail: 'juliana@empresaXPTO.com',
  agentName: 'Carlos Silva',
  agentEmail: 'carlos@empresaXPTO.com',
  agentPhone: '+55 31 99999-8888'
};

const queues = [
  { name: 'Qualificação', icon: '🔵', avg: '2h 15min' },
  { name: 'Apresentação da Solução', icon: '🟣', avg: '4h 30min' },
  { name: 'Quebra de Objeções', icon: '🟠', avg: '1h 45min' },
  { name: 'Aprovação de Crédito', icon: '🟡', avg: '6h 20min' },
  { name: 'Assinatura de Contrato', icon: '🟢', avg: '3h 10min' },
  { name: 'Ganho', icon: '✅', avg: '0h 40min' },
  { name: 'Perdido', icon: '❌', avg: '0h 30min' }
];

const baseTickets = [
  {
    id: '200',
    contactName: 'Nicolas Torres',
    queue: 'Qualificação',
    bot: 'Bot Vendas',
    area: 'Vendas',
    time: '10:41',
    unread: true,
    statusBadge: 'Novo',
    iaSignal: 'Lead quente',
    score: 85,
    snippet: 'Estou aguardando o retorno sobre a proposta.',
    contact: {
      phone: '+55 31 98888-1001',
      email: 'nicolas.torres@email.com',
      city: 'Belo Horizonte',
      plan: 'Enterprise',
      gender: 'Masculino'
    },
    source: 'televendas',
    channelNumber: televendasChannel,
    messages: [
      { dir: 'in', text: 'Estou aguardando o retorno sobre a proposta.', time: '10:41' },
      { dir: 'out', text: 'Claro! Vou verificar isso para você.', time: '10:46' }
    ]
  },
  {
    id: '201',
    contactName: 'Gustavo Silva',
    queue: 'Qualificação',
    bot: 'Bot Suporte',
    area: 'Suporte',
    time: '17:54',
    unread: false,
    statusBadge: '',
    iaSignal: 'Pendência',
    score: 71,
    snippet: 'Quando posso agendar a reunião?',
    contact: {
      phone: '+55 31 98888-1002',
      email: 'gustavo.silva@email.com',
      city: 'Contagem',
      plan: 'Pro',
      gender: 'Masculino'
    },
    source: 'televendas',
    channelNumber: televendasChannel,
    messages: [{ dir: 'in', text: 'Quando posso agendar a reunião?', time: '17:54' }]
  },
  {
    id: '208',
    contactName: 'Oscar Evangelista',
    queue: 'Apresentação da Solução',
    bot: 'Bot Geral',
    area: 'Financeiro',
    time: '19:17',
    unread: true,
    statusBadge: 'Novo',
    iaSignal: 'IA sugere contato 2h',
    score: 64,
    snippet: 'Preciso de ajuda com meu cadastro',
    contact: {
      phone: '+55 31 98888-1208',
      email: 'oscar.evangelista@email.com',
      city: 'Betim',
      plan: 'Pro',
      gender: 'Masculino'
    },
    source: 'televendas',
    channelNumber: televendasChannel,
    messages: [{ dir: 'in', text: 'Preciso de ajuda com meu cadastro', time: '19:17' }]
  },
  {
    id: '214',
    contactName: 'Eduardo Queiroz',
    queue: 'Quebra de Objeções',
    bot: 'Bot Geral',
    area: 'Pós-venda',
    time: '08:52',
    unread: false,
    statusBadge: '',
    iaSignal: 'Lead quente',
    score: 77,
    snippet: 'Ainda tenho dúvidas sobre o valor.',
    contact: {
      phone: '+55 31 98888-1214',
      email: 'eduardo.queiroz@email.com',
      city: 'Nova Lima',
      plan: 'Enterprise',
      gender: 'Masculino'
    },
    source: 'televendas',
    channelNumber: televendasChannel,
    messages: [{ dir: 'in', text: 'Ainda tenho dúvidas sobre o valor.', time: '08:52' }]
  },
  {
    id: '220',
    contactName: 'Larissa Braga',
    queue: 'Aprovação de Crédito',
    bot: 'Bot Geral',
    area: 'Suporte',
    time: '12:55',
    unread: false,
    statusBadge: '',
    iaSignal: 'Pendência',
    score: 68,
    snippet: 'Vocês têm desconto para pagamento à vista?',
    contact: {
      phone: '+55 31 98888-1220',
      email: 'larissa.braga@email.com',
      city: 'Belo Horizonte',
      plan: 'Standard',
      gender: 'Feminino'
    },
    source: 'televendas',
    channelNumber: televendasChannel,
    messages: [{ dir: 'in', text: 'Vocês têm desconto para pagamento à vista?', time: '12:55' }]
  },
  {
    id: '226',
    contactName: 'Fernanda Ramos',
    queue: 'Assinatura de Contrato',
    bot: 'Bot Geral',
    area: 'Pós-venda',
    time: '16:55',
    unread: false,
    statusBadge: '',
    iaSignal: 'Lead quente',
    score: 92,
    snippet: 'Quando posso agendar a reunião?',
    contact: {
      phone: '+55 31 98888-1226',
      email: 'fernanda.ramos@email.com',
      city: 'Lagoa Santa',
      plan: 'Enterprise',
      gender: 'Feminino'
    },
    source: 'televendas',
    channelNumber: televendasChannel,
    messages: [{ dir: 'in', text: 'Quando posso agendar a reunião?', time: '16:55' }]
  },
  {
    id: '231',
    contactName: 'Gustavo Mello',
    queue: 'Ganho',
    bot: 'Bot Vendas',
    area: 'Vendas',
    time: '09:31',
    unread: false,
    statusBadge: '',
    iaSignal: 'Ganho',
    score: 95,
    snippet: 'Fechamos, pode seguir com o pedido.',
    contact: {
      phone: '+55 31 98888-1231',
      email: 'gustavo.mello@email.com',
      city: 'Sete Lagoas',
      plan: 'Enterprise',
      gender: 'Masculino'
    },
    source: 'televendas',
    channelNumber: televendasChannel,
    messages: [{ dir: 'in', text: 'Fechamos, pode seguir com o pedido.', time: '09:31' }]
  },
  {
    id: '234',
    contactName: 'André Costa',
    queue: 'Perdido',
    bot: 'Bot Geral',
    area: 'Suporte',
    time: '15:07',
    unread: false,
    statusBadge: '',
    iaSignal: 'Perdido',
    score: 23,
    snippet: 'Vou adiar essa decisão por enquanto.',
    contact: {
      phone: '+55 31 98888-1234',
      email: 'andre.costa@email.com',
      city: 'Ribeirão das Neves',
      plan: 'Basic',
      gender: 'Masculino'
    },
    source: 'televendas',
    channelNumber: televendasChannel,
    messages: [{ dir: 'in', text: 'Vou adiar essa decisão por enquanto.', time: '15:07' }]
  }
];

const personalTicketsSeed = [
  ['300', 'Patrícia Lima', 'Qualificação', 'Quero simular uma proposta para minha equipe.', '11:08'],
  ['301', 'Rodrigo Nunes', 'Apresentação da Solução', 'Consegue me mostrar o plano Enterprise?', '11:45'],
  ['302', 'Vanessa Rocha', 'Quebra de Objeções', 'Ainda estou comparando com outro fornecedor.', '12:06'],
  ['303', 'Bruno Tavares', 'Aprovação de Crédito', 'Meu financeiro pediu mais detalhes da cobrança.', '12:28'],
  ['304', 'Camila Faria', 'Assinatura de Contrato', 'Pode reenviar o contrato com assinatura digital?', '13:14'],
  ['305', 'Leandro Souza', 'Qualificação', 'Vocês atendem empresas com mais de 100 usuários?', '14:03'],
  ['306', 'Taís Almeida', 'Apresentação da Solução', 'Tem como fazer uma demo ainda hoje?', '14:37'],
  ['307', 'Rafael Neves', 'Quebra de Objeções', 'Preciso validar internamente antes de fechar.', '15:05'],
  ['308', 'Mirela Duarte', 'Aprovação de Crédito', 'Conseguimos parcelamento em 12x?', '15:44'],
  ['309', 'João Pedro Barros', 'Assinatura de Contrato', 'Aprovado! Qual próximo passo?', '16:12']
];

function buildPersonalTickets() {
  const channel = localStorage.getItem(storage.agentPhone) || fallbackAgentPhone;
  return personalTicketsSeed.map(([id, name, queue, snippet, time], index) => ({
    id,
    contactName: name,
    queue,
    bot: 'Atendimento humano',
    area: 'Vendas',
    time,
    unread: index % 2 === 0,
    statusBadge: index % 3 === 0 ? 'Novo' : '',
    iaSignal: index % 2 === 0 ? 'Lead quente' : 'Pendência',
    score: 65 + (index % 4) * 6,
    snippet,
    source: 'meu_whatsapp',
    channelNumber: channel,
    contact: {
      phone: `+55 31 97777-10${String(index).padStart(2, '0')}`,
      email: `${name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '.')}@email.com`,
      city: 'Belo Horizonte',
      plan: 'Pro',
      gender: index % 2 === 0 ? 'Feminino' : 'Masculino'
    },
    messages: [{ dir: 'in', text: snippet, time }]
  }));
}

function getParamStep() {
  return new URL(window.location.href).searchParams.get('step');
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
  if (!localStorage.getItem(storage.tickets)) {
    localStorage.setItem(storage.tickets, JSON.stringify(baseTickets));
  }
  if (!localStorage.getItem(storage.selectedTicket)) {
    localStorage.setItem(storage.selectedTicket, '200');
  }
  if (!localStorage.getItem(storage.deskMode)) {
    localStorage.setItem(storage.deskMode, 'lista');
  }
  if (!localStorage.getItem(storage.ticketFilter)) {
    localStorage.setItem(storage.ticketFilter, 'todos');
  }
  if (!localStorage.getItem(storage.channelFilter)) {
    localStorage.setItem(storage.channelFilter, 'todos_canais');
  }

  const currentTickets = JSON.parse(localStorage.getItem(storage.tickets)) || [];
  const migrated = currentTickets.map((ticket) => ({
    ...ticket,
    source: ticket.source || 'televendas',
    channelNumber: ticket.channelNumber || televendasChannel
  }));
  localStorage.setItem(storage.tickets, JSON.stringify(migrated));
}

function getTickets() {
  return JSON.parse(localStorage.getItem(storage.tickets)) || [];
}

function saveTickets(data) {
  localStorage.setItem(storage.tickets, JSON.stringify(data));
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

function queueCount(tickets, queueName) {
  return tickets.filter((t) => t.queue === queueName).length;
}

function getSourceMeta(source) {
  if (source === 'meu_whatsapp') {
    return { icon: '📱', label: 'Meu WhatsApp' };
  }
  return { icon: '🏢', label: 'Televendas' };
}

function ensureMergedTicketsIfConnected() {
  if (!isTrue(storage.selfconnectCompleted)) return;
  const data = getTickets();
  if (data.some((ticket) => ticket.source === 'meu_whatsapp')) {
    const channel = localStorage.getItem(storage.agentPhone) || fallbackAgentPhone;
    const synced = data.map((ticket) =>
      ticket.source === 'meu_whatsapp' ? { ...ticket, channelNumber: channel } : ticket
    );
    saveTickets(synced);
    return;
  }
  saveTickets([...buildPersonalTickets(), ...data]);
}

function renderDeskModal() {
  if (!deskModal) return '';

  if (deskModal.type === 'prompt') {
    return `
      <div class="modal-overlay" data-close-modal="true">
        <div class="desk-modal" role="dialog" aria-modal="true" aria-label="Conecte seu WhatsApp" onclick="event.stopPropagation()">
          <h3>Conecte seu WhatsApp</h3>
          <p>Centralize seus atendimentos e contatos no Blip Desk.</p>
          <p>Seu WhatsApp continua funcionando normalmente no celular.</p>
          <p>Ganhe organização, produtividade e Insights de IA.</p>
          <div class="modal-actions">
            <button class="ghost-btn" id="openLearnMoreFromPrompt">Saber mais</button>
            <button class="primary-btn" id="connectNowFromPrompt">Conectar agora</button>
            <button class="ghost-btn" id="dismissPrompt">Agora não</button>
          </div>
        </div>
      </div>
    `;
  }

  if (deskModal.type === 'learn') {
    const slides = [
      {
        title: 'Centralize seus atendimentos',
        bullets: [
          'Organize sua carteira de clientes',
          'Não perca mensagens importantes',
          'Identifique pendências e follow-ups',
          'Use Insights de IA',
          'Tudo no Desk sem trocar seu WhatsApp do celular'
        ]
      },
      {
        title: 'Seu WhatsApp continua funcionando',
        bullets: [
          'Seu WhatsApp continua funcionando normalmente no celular.',
          'O Blip Desk apenas espelha as conversas para organização e governança.',
          'Você pode continuar usando o WhatsApp normalmente.'
        ]
      },
      {
        title: 'WhatsApp Business necessário',
        bullets: [
          'Para conectar via CoEx, seu número precisa estar no WhatsApp Business.',
          'Se estiver no WhatsApp normal (Consumer), migre para Business e tente novamente.'
        ]
      },
      {
        title: 'Como funciona',
        bullets: [
          '1 Informar seu número',
          '2 Escanear QR Code',
          '3 Sincronizar histórico dos últimos 6 meses via Meta API',
          '4 Pronto. Conversas aparecem no Desk automaticamente'
        ]
      }
    ];
    const slide = slides[deskModal.slide] || slides[0];
    return `
      <div class="modal-overlay" data-close-modal="true">
        <div class="desk-modal" role="dialog" aria-modal="true" aria-label="Saber mais" onclick="event.stopPropagation()">
          <div class="carousel-indicator">${slides.map((_, index) => (index === deskModal.slide ? '●' : '○')).join(' ')}</div>
          <h3>${slide.title}</h3>
          <ul class="modal-list">${slide.bullets.map((item) => `<li>${item}</li>`).join('')}</ul>
          <div class="modal-nav">
            <button class="ghost-btn" id="prevSlide" ${deskModal.slide === 0 ? 'disabled' : ''}>Anterior</button>
            <span>${deskModal.slide + 1} / ${slides.length}</span>
            <button class="ghost-btn" id="nextSlide" ${deskModal.slide === slides.length - 1 ? 'disabled' : ''}>Próximo</button>
          </div>
          <div class="modal-actions">
            <button class="primary-btn" id="startConnectFlow">Conectar agora</button>
            <button class="ghost-btn" id="closeLearnMore">Agora não</button>
          </div>
        </div>
      </div>
    `;
  }

  const phoneInputValue = deskModal.input || '';
  if (deskModal.type === 'wizard' && deskModal.step === 'phone') {
    const formBlock =
      deskModal.validationState === 'error'
        ? `<div class="modal-alert error">Ops! Identificamos que este número está no WhatsApp normal (Consumer).<br><br>Para conectar via CoEx, migre seu número para WhatsApp Business e tente novamente.</div>
           <div class="modal-actions"><button class="primary-btn" id="retryPhoneValidation">Tentar novamente</button><button class="ghost-btn" id="cancelWizard">Cancelar</button></div>`
        : deskModal.validationState === 'success'
          ? `<div class="modal-alert success">Perfeito! Número apto para conexão via WhatsApp Business.</div>
             <div class="modal-actions"><button class="primary-btn" id="continueToQr">Continuar</button></div>`
          : `<label>Número do WhatsApp Business<input id="agentPhoneInput" placeholder="+55 31 99999-8888" value="${phoneInputValue}" /></label>
             <p class="small">Precisa ser WhatsApp Business.</p>
             <div class="modal-actions"><button class="primary-btn" id="validatePhone">Validar número</button><button class="ghost-btn" id="cancelWizard">Cancelar</button></div>`;

    return `
      <div class="modal-overlay" data-close-modal="true">
        <div class="desk-modal" role="dialog" aria-modal="true" aria-label="Conectar meu WhatsApp" onclick="event.stopPropagation()">
          <h3>Conectar meu WhatsApp</h3>
          <div class="info-grid compact">
            <p><span>Nome:</span><strong>Carlos Silva</strong></p>
            <p><span>Email:</span><strong>carlos@empresaXPTO.com</strong></p>
          </div>
          ${formBlock}
        </div>
      </div>
    `;
  }

  if (deskModal.type === 'wizard' && deskModal.step === 'qr') {
    return `
      <div class="modal-overlay" data-close-modal="true">
        <div class="desk-modal" role="dialog" aria-modal="true" aria-label="Escaneie o QR Code" onclick="event.stopPropagation()">
          <h3>Escaneie o QR Code</h3>
          <div class="qr"></div>
          <ul class="modal-list">
            <li>Abra o WhatsApp Business</li>
            <li>Aparelhos conectados</li>
            <li>Conectar aparelho</li>
            <li>Escaneie o QR Code</li>
          </ul>
          <p class="small">Seu WhatsApp continuará funcionando normalmente no celular.</p>
          <div class="modal-actions"><button class="primary-btn" id="confirmQr">Já escaneei</button><button class="ghost-btn" id="cancelWizard">Cancelar</button></div>
        </div>
      </div>
    `;
  }

  if (deskModal.type === 'wizard' && deskModal.step === 'connecting') {
    return `
      <div class="modal-overlay">
        <div class="desk-modal text-center" role="dialog" aria-modal="true" aria-label="Conectando" onclick="event.stopPropagation()">
          <h3>Conectando…</h3>
          <div class="spinner"></div>
          <p>Conectando seu WhatsApp…</p>
          <p class="small">Sincronizando histórico dos últimos 6 meses via Meta API…</p>
        </div>
      </div>
    `;
  }

  if (deskModal.type === 'wizard' && deskModal.step === 'summary') {
    return `
      <div class="modal-overlay" data-close-modal="true">
        <div class="desk-modal" role="dialog" aria-modal="true" aria-label="Conexão concluída" onclick="event.stopPropagation()">
          <h3>Conexão concluída!</h3>
          <p>Identificamos 128 contatos e 642 conversas dos últimos 6 meses.</p>
          <p>A partir de agora toda nova conversa no seu WhatsApp também será espelhada no Blip Desk.</p>
          <div class="modal-actions"><button class="primary-btn" id="finishSelfConnect">Ir para Atendimento</button></div>
        </div>
      </div>
    `;
  }

  return '';
}

function renderDesk() {
  ensureMergedTicketsIfConnected();
  const tickets = getTickets();
  const mode = localStorage.getItem(storage.deskMode) || 'lista';
  const filter = localStorage.getItem(storage.ticketFilter) || 'todos';
  const channelFilter = localStorage.getItem(storage.channelFilter) || 'todos_canais';

  const filteredByRead = filter === 'nao_lidos' ? tickets.filter((t) => t.unread) : tickets;
  const visibleTickets =
    channelFilter === 'televendas'
      ? filteredByRead.filter((t) => t.source === 'televendas')
      : channelFilter === 'meu_whatsapp'
        ? filteredByRead.filter((t) => t.source === 'meu_whatsapp')
        : filteredByRead;

  const selectedId = localStorage.getItem(storage.selectedTicket) || visibleTickets[0]?.id || tickets[0]?.id;
  const selected = visibleTickets.find((t) => t.id === selectedId) || visibleTickets[0] || tickets[0];

  if (!deskModal && !isTrue(storage.connectPromptDismissed) && !isTrue(storage.selfconnectCompleted)) {
    deskModal = { type: 'prompt' };
  }

  const isConnected = isTrue(storage.selfconnectCompleted);
  const connectedNumber = localStorage.getItem(storage.agentPhone) || fallbackAgentPhone;

  app.innerHTML = `
    <div class="agent-fullscreen desk-shell">
      <aside class="desk-sidebar">
        <div class="desk-brand">Blip</div>
        <button class="desk-menu active">💬 <span>Atendimento</span></button>
        <button class="desk-menu">📊 <span>Relatórios</span></button>
        <button class="desk-menu">⚙️ <span>Configurações</span></button>
      </aside>

      <div class="desk-main-wrapper">
        <header class="desk-internal-topbar">
          <h2>Atendimentos</h2>
          <div class="desk-header-actions">
            <div class="view-toggle">
              <button class="ghost-btn ${mode === 'lista' ? 'active-mode' : ''}" id="btnLista">Lista</button>
              <button class="ghost-btn ${mode === 'kanban' ? 'active-mode' : ''}" id="btnKanban">Kanban</button>
            </div>
            <button class="ghost-btn connect-cta" id="deskConnectButton" ${isConnected ? 'disabled' : ''} title="Meu WhatsApp:\n${connectedNumber}">
              ${isConnected ? 'WhatsApp conectado ✓' : 'Conectar meu WhatsApp'}
            </button>
          </div>
        </header>

        ${
          mode === 'lista'
            ? `
              <section class="desk-main list-layout">
                <aside class="desk-col col-left">
                  <input class="search" placeholder="Buscar tickets..." />

                  <div class="filter-row">
                    <button class="pill ${filter === 'todos' ? 'active' : ''}" id="filterTodos">Todos</button>
                    <button class="pill ${filter === 'nao_lidos' ? 'active' : ''}" id="filterNaoLidos">Não lidos</button>
                  </div>

                  <select class="channel-select" id="channelFilterSelect">
                    <option value="todos_canais" ${channelFilter === 'todos_canais' ? 'selected' : ''}>Todos os canais</option>
                    <option value="televendas" ${channelFilter === 'televendas' ? 'selected' : ''}>Somente Televendas</option>
                    <option value="meu_whatsapp" ${channelFilter === 'meu_whatsapp' ? 'selected' : ''}>Somente Meu WhatsApp</option>
                  </select>

                  <div class="queue-tree">
                    ${queues
                      .map((q) => {
                        const queueTickets = visibleTickets.filter((t) => t.queue === q.name);
                        const preview = queueTickets.slice(0, 3);
                        return `
                        <div class="queue-group">
                          <div class="queue-title">${q.icon} ${q.name} <span>${queueCount(visibleTickets, q.name)}</span></div>
                          ${
                            preview.length
                              ? preview
                                  .map(
                                    (t) => `
                                <button class="ticket-row ${selected?.id === t.id ? 'active' : ''}" data-ticket="${t.id}">
                                  <div>
                                    <strong>${t.contactName}</strong>
                                    <small>${t.snippet}</small>
                                    <small>${t.contact.phone}</small>
                                    <small class="channel-micro">Canal: ${t.channelNumber}</small>
                                  </div>
                                  <div class="ticket-side-meta">
                                    <small>${t.time}</small>
                                    <small class="source-chip" title="${getSourceMeta(t.source).label}">${getSourceMeta(t.source).icon}</small>
                                  </div>
                                </button>
                              `
                                  )
                                  .join('')
                              : '<p class="small queue-empty">Sem tickets neste filtro.</p>'
                          }
                        </div>
                      `;
                      })
                      .join('')}
                  </div>
                </aside>

                <main class="desk-col col-middle">
                  <div class="chat-head">
                    <strong>${selected.contactName}</strong>
                    <small>#${selected.id} · ${selected.area} · Canal: ${selected.channelNumber}</small>
                  </div>

                  <div class="chat-thread" id="chatThread">
                    ${selected.messages
                      .map(
                        (m) =>
                          `<div class="message ${m.dir === 'out' ? 'outbound' : 'inbound'}"><p>${m.text}</p><small>${m.time}</small></div>`
                      )
                      .join('')}
                  </div>

                  <form id="sendForm" class="message-form">
                    <input id="sendInput" placeholder="Escreva uma mensagem..." required />
                    <button class="primary-btn" type="submit">Enviar</button>
                  </form>
                </main>

                <aside class="desk-col col-right">
                  <div class="contact-header">
                    <div class="avatar-circle">${selected.contactName[0]}</div>
                    <div>
                      <strong>${selected.contactName}</strong>
                      <p class="small">ID: #${selected.id}</p>
                    </div>
                  </div>

                  <h4>DADOS DO CONTATO</h4>
                  <div class="data-grid small">
                    <p><span>E-mail</span><strong>${selected.contact.email}</strong></p>
                    <p><span>Telefone</span><strong>${selected.contact.phone}</strong></p>
                    <p><span>Cidade</span><strong>${selected.contact.city}</strong></p>
                    <p><span>Plano</span><strong>${selected.contact.plan}</strong></p>
                    <p><span>Gênero</span><strong>${selected.contact.gender}</strong></p>
                  </div>

                  <h4>ATENDIMENTO</h4>
                  <div class="data-grid small">
                    <p><span>Fila</span><strong>${selected.area}</strong></p>
                    <p><span>Bot</span><strong>${selected.bot}</strong></p>
                    <p><span>Status</span><strong>${selected.statusBadge || 'Em andamento'}</strong></p>
                  </div>

                  <div class="insights-box">
                    <p><strong>Insights IA</strong></p>
                    <p>Melhor horário de contato: tarde</p>
                    <p>Score de fechamento: ${selected.score}%</p>
                    <p>Sugestão: fazer follow-up em 2h</p>
                  </div>

                  <p class="small">Coexistência ativa: WhatsApp continua no celular.</p>
                  <p class="small">Sincronização: últimos 6 meses via Meta API.</p>

                  <div class="banner-upsell subtle">
                    Automatize respostas repetitivas com o Blip Desk + IA.
                    <button class="ghost-btn" style="margin-top:8px;">Solicitar upgrade ao gestor</button>
                  </div>
                </aside>
              </section>
            `
            : `
              <section class="kanban-mode-wrap">
                <div class="kanban-board desk-kanban-full">
                  ${queues
                    .map((q) => {
                      const cards = tickets.filter((t) => t.queue === q.name);
                      return `
                      <div class="kanban-col">
                        <h4>${q.icon} ${q.name} <span class="count-pill">${cards.length}</span></h4>
                        <p class="small">Tempo médio: ${q.avg}</p>
                        ${cards
                          .map(
                            (c) => `
                            <button class="kanban-desk-card" data-open-ticket="${c.id}">
                              <div class="card-top">
                                <strong>${c.contactName}</strong>
                                <small>${c.time}</small>
                              </div>
                              <p>${c.snippet}</p>
                              <small>#${c.id} · ${c.bot} · ${c.area}</small>
                              <small class="channel-micro"><span class="source-chip" title="${getSourceMeta(c.source).label}">${getSourceMeta(c.source).icon}</span> ${c.channelNumber}</small>
                              <div class="inline-badges" style="margin-top:8px;">
                                ${c.statusBadge ? `<span class="badge info">${c.statusBadge}</span>` : ''}
                                <span class="badge warning">${c.iaSignal}</span>
                              </div>
                            </button>
                          `
                          )
                          .join('')}
                      </div>
                    `;
                    })
                    .join('')}
                </div>
              </section>
            `
        }

        <div class="toast" id="deskToast" hidden></div>
      </div>
      ${renderDeskModal()}
    </div>
  `;

  document.getElementById('btnLista').addEventListener('click', () => {
    localStorage.setItem(storage.deskMode, 'lista');
    renderDesk();
  });

  document.getElementById('btnKanban').addEventListener('click', () => {
    localStorage.setItem(storage.deskMode, 'kanban');
    renderDesk();
  });

  const filterTodos = document.getElementById('filterTodos');
  if (filterTodos) {
    filterTodos.addEventListener('click', () => {
      localStorage.setItem(storage.ticketFilter, 'todos');
      renderDesk();
    });
  }

  const channelFilterSelect = document.getElementById('channelFilterSelect');
  if (channelFilterSelect) {
    channelFilterSelect.addEventListener('change', () => {
      localStorage.setItem(storage.channelFilter, channelFilterSelect.value);
      renderDesk();
    });
  }

  const connectButton = document.getElementById('deskConnectButton');
  if (connectButton && !isConnected) {
    connectButton.addEventListener('click', () => {
      deskModal = { type: 'learn', slide: 0 };
      renderDesk();
    });
  }

  const filterNaoLidos = document.getElementById('filterNaoLidos');
  if (filterNaoLidos) {
    filterNaoLidos.addEventListener('click', () => {
      localStorage.setItem(storage.ticketFilter, 'nao_lidos');
      renderDesk();
    });
  }

  document.querySelectorAll('[data-ticket]').forEach((button) => {
    button.addEventListener('click', () => {
      localStorage.setItem(storage.selectedTicket, button.dataset.ticket);
      renderDesk();
    });
  });

  document.querySelectorAll('[data-open-ticket]').forEach((card) => {
    card.addEventListener('click', () => {
      const ticketId = card.dataset.openTicket;
      localStorage.setItem(storage.selectedTicket, ticketId);
      localStorage.setItem(storage.deskMode, 'lista');
      renderDesk();
      const toast = document.getElementById('deskToast');
      if (toast) {
        toast.hidden = false;
        toast.textContent = `Abrindo ticket #${ticketId}`;
        setTimeout(() => {
          toast.hidden = true;
        }, 1600);
      }
    });
  });

  const sendForm = document.getElementById('sendForm');
  if (sendForm) {
    sendForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const input = document.getElementById('sendInput');
      const text = input.value.trim();
      if (!text) return;

      const now = new Date();
      const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      const data = getTickets();
      const ticket = data.find((t) => t.id === selected.id);

      if (ticket) {
        ticket.messages.push({ dir: 'out', text, time });
        ticket.snippet = text;
        ticket.time = time;
        saveTickets(data);
        input.value = '';
        renderDesk();
      }
    });
  }

  const closeOverlay = document.querySelector('[data-close-modal="true"]');
  if (closeOverlay) {
    closeOverlay.addEventListener('click', () => {
      if (deskModal?.type === 'prompt') {
        localStorage.setItem(storage.connectPromptDismissed, 'true');
      }
      deskModal = null;
      renderDesk();
    });
  }

  const openLearnMoreFromPrompt = document.getElementById('openLearnMoreFromPrompt');
  if (openLearnMoreFromPrompt) {
    openLearnMoreFromPrompt.addEventListener('click', () => {
      deskModal = { type: 'learn', slide: 0 };
      renderDesk();
    });
  }

  const connectNowFromPrompt = document.getElementById('connectNowFromPrompt');
  if (connectNowFromPrompt) {
    connectNowFromPrompt.addEventListener('click', () => {
      deskModal = { type: 'learn', slide: 0 };
      renderDesk();
    });
  }

  const dismissPrompt = document.getElementById('dismissPrompt');
  if (dismissPrompt) {
    dismissPrompt.addEventListener('click', () => {
      localStorage.setItem(storage.connectPromptDismissed, 'true');
      deskModal = null;
      renderDesk();
    });
  }

  const prevSlide = document.getElementById('prevSlide');
  if (prevSlide) {
    prevSlide.addEventListener('click', () => {
      deskModal = { type: 'learn', slide: Math.max(0, deskModal.slide - 1) };
      renderDesk();
    });
  }
  const nextSlide = document.getElementById('nextSlide');
  if (nextSlide) {
    nextSlide.addEventListener('click', () => {
      deskModal = { type: 'learn', slide: Math.min(3, deskModal.slide + 1) };
      renderDesk();
    });
  }
  const closeLearnMore = document.getElementById('closeLearnMore');
  if (closeLearnMore) {
    closeLearnMore.addEventListener('click', () => {
      deskModal = null;
      renderDesk();
    });
  }
  const startConnectFlow = document.getElementById('startConnectFlow');
  if (startConnectFlow) {
    startConnectFlow.addEventListener('click', () => {
      deskModal = { type: 'wizard', step: 'phone', validationState: 'form', input: localStorage.getItem(storage.agentPhone) || '' };
      renderDesk();
    });
  }

  const validatePhone = document.getElementById('validatePhone');
  if (validatePhone) {
    validatePhone.addEventListener('click', () => {
      const input = document.getElementById('agentPhoneInput');
      const phone = input?.value?.trim() || fallbackAgentPhone;
      if (!localStorage.getItem(storage.selfconnectFirstTryDone)) {
        localStorage.setItem(storage.selfconnectFirstTryDone, 'true');
        deskModal = { type: 'wizard', step: 'phone', validationState: 'error', input: phone };
      } else {
        localStorage.setItem(storage.agentPhone, phone);
        deskModal = { type: 'wizard', step: 'phone', validationState: 'success', input: phone };
      }
      renderDesk();
    });
  }

  const retryPhoneValidation = document.getElementById('retryPhoneValidation');
  if (retryPhoneValidation) {
    retryPhoneValidation.addEventListener('click', () => {
      const phone = deskModal.input || fallbackAgentPhone;
      localStorage.setItem(storage.agentPhone, phone);
      deskModal = { type: 'wizard', step: 'phone', validationState: 'success', input: phone };
      renderDesk();
    });
  }

  const continueToQr = document.getElementById('continueToQr');
  if (continueToQr) {
    continueToQr.addEventListener('click', () => {
      deskModal = { type: 'wizard', step: 'qr' };
      renderDesk();
    });
  }

  const confirmQr = document.getElementById('confirmQr');
  if (confirmQr) {
    confirmQr.addEventListener('click', () => {
      deskModal = { type: 'wizard', step: 'connecting' };
      renderDesk();
    });
  }

  const cancelWizard = document.getElementById('cancelWizard');
  if (cancelWizard) {
    cancelWizard.addEventListener('click', () => {
      deskModal = null;
      renderDesk();
    });
  }

  if (deskModal?.type === 'wizard' && deskModal.step === 'connecting') {
    if (!connectTimer) {
      connectTimer = setTimeout(() => {
        localStorage.setItem(storage.whatsappConnected, 'true');
        deskModal = { type: 'wizard', step: 'summary' };
        connectTimer = null;
        renderDesk();
      }, 2000);
    }
  } else if (connectTimer) {
    clearTimeout(connectTimer);
    connectTimer = null;
  }

  const finishSelfConnect = document.getElementById('finishSelfConnect');
  if (finishSelfConnect) {
    finishSelfConnect.addEventListener('click', () => {
      localStorage.setItem(storage.selfconnectCompleted, 'true');
      localStorage.setItem(storage.connectPromptDismissed, 'true');
      deskModal = null;
      renderDesk();
    });
  }
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
