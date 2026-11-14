/* IMOV365 · plataforma do crédito imobiliário (demonstração, sem servidor) */
'use strict';

/* ---------- utilidades ---------- */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const h = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const brl = v => (Number(v) || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
const num = v => (Number(v) || 0).toLocaleString('pt-BR');
const fdata = iso => iso ? iso.slice(0, 10).split('-').reverse().join('/') : '';
const hoje = () => { const x = new Date(); return new Date(x.getTime() - x.getTimezoneOffset() * 6e4).toISOString().slice(0, 10); };
const addDias = (iso, n) => { const x = new Date(iso + 'T12:00'); x.setDate(x.getDate() + n); return x.toISOString().slice(0, 10); };
const diasEntre = (a, b) => Math.round((new Date(b + 'T12:00') - new Date(a + 'T12:00')) / 864e5);
const horaAgora = () => new Date().toTimeString().slice(0, 5);

const ICONES = {
  pin: 'M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11zM12 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5',
  bank: 'M3 10h18M5 10v8M9 10v8M15 10v8M19 10v8M3 21h18M12 3l9 5H3z',
  home: 'M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z',
  helmet: 'M4 17h16M5 17a7 7 0 0 1 14 0M10 10V6h4v4M3 20h18',
  chart: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
  kanban: 'M4 4h4v16H4zM10 4h4v10h-4zM16 4h4v13h-4z',
  users: 'M16 19v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1M9 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6M22 19v-1a4 4 0 0 0-3-3.9M16 4.1a3 3 0 0 1 0 5.8',
  chat: 'M21 12a8 8 0 0 1-11.6 7.1L4 21l1.9-5.4A8 8 0 1 1 21 12z',
  calc: 'M6 3h12v18H6zM9 7h6M9 12h1M14 12h1M9 16h1M14 16h1',
  doc: 'M14 3H6v18h12V7zM14 3v4h4M9 13h6M9 17h6',
  gear: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19 12l2-1-1-3-2 .2-1.2-1.2L17 5l-3-1-1 2h-2L10 4 7 5l.2 2L6 8.2 4 8l-1 3 2 1v0l-2 1 1 3 2-.2L7.2 17 7 19l3 1 1-2h2l1 2 3-1-.2-2 1.2-1.2 2 .2 1-3z',
  building: 'M4 21V5l8-2v18M12 8h8v13M8 8v.01M8 12v.01M8 16v.01M16 12v.01M16 16v.01M2 21h20',
  tag: 'M20 12l-8 8-9-9V3h8zM7.5 7.5h.01',
  key: 'M15 7a4 4 0 1 1-3.9 4.9L3 20v-3h3v-3h3l2.1-2.1A4 4 0 0 1 15 7z',
  logout: 'M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9',
  chev: 'M9 6l6 6-6 6',
  back: 'M15 6l-6 6 6 6',
  plus: 'M12 5v14M5 12h14',
  grid: 'M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z',
  funnel: 'M3 4h18l-7 8v6l-4 2v-8z',
  swap: 'M7 7h13l-3-3M17 17H4l3 3',
  ext: 'M14 4h6v6M20 4l-9 9M18 14v5H5V6h5',
  menu: 'M4 6h16M4 12h16M4 18h16',
  clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 7v5l3 2',
  alert: 'M12 9v4M12 17h.01M10.3 3.9L2 18a2 2 0 0 0 1.7 3h16.6a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z',
  money: 'M3 6h18v12H3zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 9v.01M18 15v.01',
  check: 'M5 12l5 5L20 7',
  send: 'M22 2L11 13M22 2l-7 20-4-9-9-4z',
  print: 'M6 9V3h12v6M6 18H4v-6h16v6h-2M8 14h8v7H8z',
  spark: 'M12 3l2 5 5 2-5 2-2 5-2-5-5-2 5-2z'
};
const ic = (n, cls = 'i') => `<svg class="${cls}" viewBox="0 0 24 24"><path d="${ICONES[n] || ''}"/></svg>`;

function logo(alt = 34, claro = false) {
  const tx = claro ? '#ffffff' : '#0f2a44', bx = claro ? 'rgba(255,255,255,.12)' : '#0f2a44';
  return `<svg viewBox="0 0 256 56" height="${alt}" role="img" aria-label="IMOV365" style="display:block">
    <rect x="2" y="4" width="48" height="48" rx="13" fill="${bx}"/>
    <path d="M12 28 L26 16 L40 28" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M15.5 34.5 a10.5 7 0 0 0 21 0" fill="none" stroke="#f07a28" stroke-width="5" stroke-linecap="round"/>
    <text x="62" y="41" font-family="Inter, Segoe UI, Arial, sans-serif" font-size="32" font-weight="800" letter-spacing="0.5" fill="${tx}">IMOV<tspan fill="#f07a28">365</tspan></text></svg>`;
}

/* ---------- base e sessão ---------- */
let DB, SESS = null;
function load() {
  try { const s = localStorage.getItem('cor365_db'); DB = s ? JSON.parse(s) : null; } catch (e) { DB = null; }
  if (!DB || DB.versao !== 1) { DB = seedDB(); save(); }
  if (DB.config && /^COR365/.test(DB.config.escritorio || '')) { DB.config.escritorio = DB.config.escritorio.replace(/^COR365/, 'IMOV365'); save(); }
  try { SESS = JSON.parse(localStorage.getItem('cor365_sessao') || 'null'); } catch (e) { SESS = null; }
}
function save() { try { localStorage.setItem('cor365_db', JSON.stringify(DB)); } catch (e) { } }
function setSess(s) { SESS = s; try { s ? localStorage.setItem('cor365_sessao', JSON.stringify(s)) : localStorage.removeItem('cor365_sessao'); } catch (e) { } }
function aplicaMarca() { document.documentElement.style.setProperty('--accent', DB.config.cor || '#f07a28'); }

/* ---------- regras ---------- */
const prazo = p => addDias(p.entrouFase, FASES[p.fase].sla);
const atrasado = p => hoje() > prazo(p);
const pendencias = p => DOCS_PADRAO.filter(d => !p.docs[d]);
const proc = id => DB.processos.find(p => p.id === +id);
function moverFase(p, nova, nota) {
  if (nova < 0 || nova >= FASES.length || nova === p.fase) return;
  const de = FASES[p.fase].n;
  p.fase = nova; p.entrouFase = hoje();
  p.historico.push({ data: hoje(), txt: `${nota || 'Moveu'}: ${de} → ${FASES[nova].n}`, por: SESS.nome });
  save();
}
function novoProcesso(v) {
  const id = ++DB.seq.processo; const docs = {}; DOCS_PADRAO.forEach(d => docs[d] = false);
  const p = {
    id, cliente: v.cliente, cpf: v.cpf || '', telefone: v.telefone || '', banco: v.banco || 'Caixa', modalidade: v.modalidade || 'MCMV Faixa 2',
    valorImovel: +v.valorImovel || 0, financiamento: +v.financiamento || 0, renda: +v.renda || 0, fase: 0, entrouFase: hoje(),
    responsavel: v.responsavel || RESPONSAVEIS[id % RESPONSAVEIS.length], corretor: v.corretor || '', imobiliaria: v.corretor ? 'Imobiliária Horizonte' : '',
    empreendimento: v.empreendimento || '', unidade: v.unidade || '', cidade: v.cidade || '', bairro: v.bairro || '', docs, criado: hoje(),
    historico: [{ data: hoje(), txt: v.origem || 'Processo aberto', por: SESS.nome }]
  };
  DB.processos.push(p); save(); return p;
}
const precoUnidade = (e, cod) => {
  const andar = +cod.split('-')[1].slice(0, -2) || 1;
  const camp = DB.campanhas.find(c => c.empreendimento === e.id && c.status === 'Ativa' && c.desconto > 0);
  const base = e.precoBase * (1 + 0.008 * (andar - 1));
  return { cheio: base, final: camp ? base * (1 - camp.desconto / 100) : base, camp };
};

/* ---------- perfis ---------- */
const PERFIS = {
  banco: { nome: 'Correspondente bancário', sub: 'Processos, crédito e CRM', ico: 'bank',
    menu: [['painel', 'Painel', 'chart'], ['esteira', 'Esteira de processos', 'kanban'], ['crm', 'CRM de vendas', 'funnel'], ['atendimento', 'Atendimento', 'chat'], ['renda', 'Apurador de renda', 'calc'], ['mapa', 'Mapa de oportunidades', 'pin'], ['formularios', 'Formulários dos bancos', 'doc'], ['config', 'Configurações', 'gear']] },
  imob: { nome: 'Imobiliária e corretor', sub: 'Imóveis, propostas e reservas', ico: 'home',
    menu: [['painel', 'Painel', 'chart'], ['clientes', 'Meus clientes', 'users'], ['imoveis', 'Imóveis', 'home'], ['empreendimentos', 'Empreendimentos', 'building'], ['propostas', 'Propostas', 'doc'], ['reservas', 'Reservas', 'key'], ['mapa', 'Mapa de oportunidades', 'pin']] },
  const: { nome: 'Construtora', sub: 'Empreendimentos e campanhas', ico: 'helmet',
    menu: [['painel', 'Painel', 'chart'], ['empreendimentos', 'Espelho de vendas', 'grid'], ['reservas', 'Reservas', 'key'], ['campanhas', 'Campanhas', 'tag'], ['repasse', 'Repasse', 'swap']] }
};

/* ---------- modal e aviso ---------- */
function toast(t) { const d = document.createElement('div'); d.className = 'toast'; d.textContent = t; document.body.appendChild(d); setTimeout(() => d.remove(), 2600); }
function closeModal() { $$('.modal-bg').forEach(m => m.remove()); }
function modal(titulo, corpo, botoes = [], wide = false) {
  closeModal();
  const bg = document.createElement('div'); bg.className = 'modal-bg';
  bg.innerHTML = `<div class="modal ${wide ? 'wide' : ''}"><div class="mh"><h3>${h(titulo)}</h3><button aria-label="Fechar">×</button></div><div class="mb">${corpo}</div>${botoes.length ? '<div class="mf"></div>' : ''}</div>`;
  bg.addEventListener('mousedown', e => { if (e.target === bg) closeModal(); });
  $('.mh button', bg).onclick = closeModal;
  const mf = $('.mf', bg);
  botoes.forEach(b => { const el = document.createElement('button'); el.className = 'btn ' + (b.cls || ''); el.innerHTML = b.t; el.onclick = () => b.fn(bg); mf.appendChild(el); });
  document.body.appendChild(bg);
  const f = $('input,select,textarea', bg); if (f) f.focus();
  return bg;
}
function campo(f) {
  const v = f.v ?? '';
  const req = f.req ? ' <span class="req">*</span>' : '';
  let inp;
  if (f.t === 'select') inp = `<select class="inp" name="${f.k}">${f.o.map(o => { const [val, lab] = Array.isArray(o) ? o : [o, o]; return `<option value="${h(val)}" ${String(val) === String(v) ? 'selected' : ''}>${h(lab)}</option>`; }).join('')}</select>`;
  else if (f.t === 'textarea') inp = `<textarea class="inp" name="${f.k}">${h(v)}</textarea>`;
  else inp = `<input class="inp" name="${f.k}" type="${f.t || 'text'}" value="${h(v)}" ${f.ph ? `placeholder="${h(f.ph)}"` : ''} ${f.t === 'number' ? 'step="any" min="0"' : ''}>`;
  return `<div class="field"><label>${h(f.l)}${req}</label>${inp}</div>`;
}
function formModal(titulo, campos, onSave, extra = []) {
  let html = '', buf = [];
  campos.forEach(f => { if (f.half) { buf.push(campo(f)); if (buf.length === 2) { html += `<div class="frow">${buf.join('')}</div>`; buf = []; } } else { if (buf.length) { html += `<div class="frow">${buf.join('')}</div>`; buf = []; } html += campo(f); } });
  if (buf.length) html += `<div class="frow">${buf.join('')}</div>`;
  html += '<div class="erro"></div>';
  return modal(titulo, html, [...extra, { t: 'Cancelar', cls: 'ghost', fn: closeModal }, { t: 'Salvar', fn: bg => {
    const v = {}; campos.forEach(f => { const el = $(`[name="${f.k}"]`, bg); v[f.k] = f.t === 'number' ? (el.value === '' ? '' : +el.value) : el.value.trim(); });
    const falta = campos.find(f => f.req && (v[f.k] === '' || v[f.k] == null));
    if (falta) { $('.erro', bg).textContent = 'Preencha: ' + falta.l; return; }
    if (onSave(v) !== false) closeModal();
  } }]);
}

/* ---------- roteador ---------- */
const app = document.getElementById('root');
function go(r) { location.hash = '#/' + r; }
function route() {
  closeModal();
  const p = location.hash.replace(/^#\/?/, '').split('/');
  if (p[0] === 'app') { if (!SESS || !SESS.perfil) return go(SESS ? 'hub' : ''); return telaApp(p[1] || 'painel', p[2]); }
  if (p[0] === 'hub') { if (!SESS) return go(''); if (!SESS.admin) return go('app/painel'); return telaHub(); }
  if (SESS) return go(SESS.admin ? 'hub' : 'app/painel');
  if (p[0]) return go('');
  telaEntrada();
}

/* ---------- admin do HUB (senha guardada só como hash SHA-256 de e-mail + senha) ---------- */
const ADMIN = { email: 'admin@imov365.com.br', nome: 'Administrador', hash: '95921b2e5a43f1aa03a74523b031fd397bfd1345f805413ae3183a132829669f' };
async function sha256(t) {
  const b = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(t));
  return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, '0')).join('');
}
window.addEventListener('hashchange', route);

/* ---------- escolha de perfil e login ---------- */
function linksRodape() {
  return `<div class="gate-links"><a href="#" data-wa="comercial">Falar com o comercial ${ic('ext')}</a><a href="#" data-wa="suporte">Suporte no WhatsApp ${ic('ext')}</a></div>`;
}
function ligaWhats(el) {
  $$('[data-wa]', el).forEach(a => a.onclick = e => {
    e.preventDefault();
    const n = (DB.config.whatsapp || '').replace(/\D/g, '');
    if (!n) return toast('Cadastre o número do WhatsApp em Configurações');
    window.open('https://wa.me/' + n + '?text=' + encodeURIComponent(a.dataset.wa === 'comercial' ? 'Olá! Quero conhecer o IMOV365.' : 'Olá! Preciso de suporte no IMOV365.'), '_blank', 'noopener');
  });
}
function telaEntrada() {
  document.title = 'Entrar | IMOV365';
  app.innerHTML = `<div class="gate dots"><div class="gate-box entrada">
    <div class="logo-grande">${logo(84)}</div>
    <div class="kicker" style="text-align:center">Plataforma do crédito imobiliário</div>
    <form id="fl" autocomplete="on">
      <div class="field"><label>E-mail <span class="req">*</span></label><input class="inp" name="email" type="email" autocomplete="username" required></div>
      <div class="field"><label>Senha <span class="req">*</span></label><input class="inp" name="senha" type="password" autocomplete="current-password" required></div>
      <div class="erro" id="err"></div>
      <a href="#" id="esq" style="font-size:13px">Esqueci minha senha</a>
      <button class="btn full" style="margin-top:16px">Entrar</button>
    </form>${linksRodape()}</div></div>`;
  $('#esq').onclick = e => { e.preventDefault(); toast('Fale com o administrador para trocar a senha'); };
  $('[name=email]').focus();
  ligaWhats(app);
  $('#fl').onsubmit = async e => {
    e.preventDefault();
    const f = new FormData(e.target), em = String(f.get('email')).trim().toLowerCase(), se = String(f.get('senha'));
    if (em === ADMIN.email) {
      let ok = false;
      try { ok = (await sha256(em + '|' + se)) === ADMIN.hash; } catch (x) { }
      if (!ok) { $('#err').textContent = 'E-mail ou senha inválidos.'; return; }
      setSess({ email: ADMIN.email, nome: ADMIN.nome, admin: true, perfil: null });
      return go('hub');
    }
    const u = DB.usuarios.find(x => x.email === em && x.senha === se);
    if (!u) { $('#err').textContent = 'E-mail ou senha inválidos.'; return; }
    setSess({ email: u.email, nome: u.nome, perfil: u.perfil });
    go('app/painel');
  };
}
function telaHub() {
  document.title = 'HUB | IMOV365';
  app.innerHTML = `<div class="gate dots"><div class="gate-box">
    ${logo(46)}<div class="kicker">HUB · escolha o sistema</div><h1>Olá, ${h(SESS.nome.split(' ')[0])}</h1>
    ${Object.entries(PERFIS).map(([k, p]) => `<button class="perfil" data-p="${k}"><span class="ico">${ic(p.ico)}</span><span><b>${p.nome}</b><small>${p.sub}</small></span><span class="chev">${ic('chev')}</span></button>`).join('')}
    <div class="gate-links"><span class="muted" style="font-size:13px">${h(SESS.email)}</span><a href="#" id="sair">${ic('logout')} Sair</a></div></div></div>`;
  $$('.perfil', app).forEach(b => b.onclick = () => { setSess({ ...SESS, perfil: b.dataset.p }); go('app/painel'); });
  $('#sair').onclick = e => { e.preventDefault(); setSess(null); go(''); };
}

/* ---------- casca do app ---------- */
function telaApp(view, arg) {
  const pf = PERFIS[SESS.perfil];
  const fn = (VIEWS[SESS.perfil] || {})[view] || VIEWS.comum[view];
  if (!fn) return go('app/painel');
  const r = fn(arg) || {};
  document.title = (r.t || pf.nome) + ' | IMOV365';
  const badge = k => {
    if (SESS.perfil !== 'banco') return 0;
    if (k === 'esteira') return DB.processos.filter(atrasado).length;
    if (k === 'atendimento') return DB.conversas.reduce((s, c) => s + c.naoLidas, 0);
    return 0;
  };
  const ativo = { processo: SESS.perfil === 'banco' ? 'esteira' : SESS.perfil === 'imob' ? 'clientes' : 'repasse', espelho: 'empreendimentos', oferta: 'mapa' }[view] || view;
  app.innerHTML = `<div class="app">
    <aside class="side" id="side"><div class="brand">${logo(30, true)}<div class="who">${pf.nome}</div></div>
      <nav>${pf.menu.map(([k, n, i]) => { const b = badge(k); return `<a href="#/app/${k}" class="${k === ativo ? 'on' : ''}">${ic(i)}${n}${b ? `<span class="badge">${b}</span>` : ''}</a>`; }).join('')}</nav>
      <div class="foot"><b>${h(SESS.nome)}</b><span class="muted" style="color:#8fa5bb">${h(SESS.email)}</span><br>${SESS.admin ? `<button id="hub">${ic('back')} Voltar ao HUB</button><br>` : ''}<button id="sair">${ic('logout')} Sair</button></div></aside>
    <div class="main"><header class="top"><button class="menu-btn" id="mb" aria-label="Menu">${ic('menu')}</button>
      <div><h1>${h(r.t || '')}</h1>${r.s ? `<div class="sub">${r.s}</div>` : ''}</div><div class="actions" id="acts">${r.a || ''}</div></header>
      <section class="view" id="view">${r.html || ''}</section></div></div>`;
  $('#sair').onclick = () => { setSess(null); go(''); };
  if ($('#hub')) $('#hub').onclick = () => { setSess({ ...SESS, perfil: null }); go('hub'); };
  $('#mb').onclick = () => $('#side').classList.toggle('open');
  $$('#side nav a').forEach(a => a.addEventListener('click', () => $('#side').classList.remove('open')));
  if (r.after) r.after($('#view'));
  window.scrollTo(0, 0);
}
const rerender = () => route();

/* ---------- pedaços reaproveitados ---------- */
const kpi = (lab, val, foot, icn, alerta) => `<div class="card kpi ${alerta ? 'alert' : ''}"><div class="lab">${ic(icn)}${lab}</div><div class="val">${val}</div>${foot ? `<div class="foot">${foot}</div>` : ''}</div>`;
const tagFase = p => `<span class="tag ${p.fase >= 6 ? 'ok' : p.fase >= 3 ? 'info' : ''}">${FASES[p.fase].n}</span>`;
const barra = (pct, cor) => `<div class="track" style="height:8px;background:#eef1f5;border-radius:99px;overflow:hidden;min-width:90px"><div style="height:100%;width:${Math.max(0, Math.min(100, pct))}%;background:${cor || 'var(--navy2)'};border-radius:99px"></div></div>`;
const progresso = p => Math.round((p.fase + 1) / FASES.length * 100);
function steps(p) {
  return `<div class="steps">${FASES.map((f, i) => `<div class="step ${i < p.fase ? 'done' : i === p.fase ? 'now' : ''}"><div class="bar"></div>${f.n}</div>`).join('')}</div>`;
}
function kanbanDnD(root, onDrop) {
  $$('.kc', root).forEach(c => {
    c.draggable = true;
    c.addEventListener('dragstart', e => { e.dataTransfer.setData('text/plain', c.dataset.id); c.classList.add('dragging'); });
    c.addEventListener('dragend', () => c.classList.remove('dragging'));
  });
  $$('.col', root).forEach(col => {
    col.addEventListener('dragover', e => { e.preventDefault(); col.classList.add('over'); });
    col.addEventListener('dragleave', () => col.classList.remove('over'));
    col.addEventListener('drop', e => { e.preventDefault(); col.classList.remove('over'); const id = +e.dataTransfer.getData('text/plain'); if (id) onDrop(id, +col.dataset.col); });
  });
}
/* ---------- mapa de oportunidades ---------- */
const CIDADES_MS = { 'Campo Grande': [-20.4697, -54.6201], 'Dourados': [-22.2211, -54.8056], 'Três Lagoas': [-20.7849, -51.7007], 'Corumbá': [-19.0078, -57.6547], 'Ponta Porã': [-22.5361, -55.7256] };
/* coordenadas aproximadas do bairro (o pino marca a região desejada, nunca o endereço do cliente) */
const BAIRROS_MS = [
  ['Campo Grande', 'Centro', -20.4628, -54.6156], ['Campo Grande', 'Jardim dos Estados', -20.4590, -54.6010], ['Campo Grande', 'Tiradentes', -20.4750, -54.5660],
  ['Dourados', 'Centro', -22.2230, -54.8060], ['Campo Grande', 'Carandá', -20.4370, -54.5880], ['Três Lagoas', 'Centro', -20.7880, -51.7030],
  ['Campo Grande', 'Nova Lima', -20.3960, -54.6020], ['Corumbá', 'Centro', -19.0090, -57.6520], ['Campo Grande', 'Aero Rancho', -20.5180, -54.6570],
  ['Ponta Porã', 'Centro', -22.5360, -55.7250], ['Campo Grande', 'Coronel Antonino', -20.4240, -54.6200], ['Dourados', 'Jardim Água Boa', -22.2440, -54.8280],
  ['Três Lagoas', 'Vila Nova', -20.7700, -51.6900]
];
function localDe(p) {
  const j = n => (((p.id * n) % 9) - 4) * 0.0018;
  if (p.cidade && CIDADES_MS[p.cidade]) {
    const b = BAIRROS_MS.find(x => x[0] === p.cidade && x[1].toLowerCase() === String(p.bairro || '').trim().toLowerCase());
    const c = b ? [b[2], b[3]] : CIDADES_MS[p.cidade];
    return { cidade: p.cidade, bairro: (p.bairro || '').trim() || 'Bairro não informado', lat: c[0] + j(7), lng: c[1] + j(13) };
  }
  const b = BAIRROS_MS[p.id % BAIRROS_MS.length];
  return { cidade: b[0], bairro: b[1], lat: b[2] + j(7), lng: b[3] + j(13) };
}
const statusOp = p => p.fase >= 7 ? 'Contratado' : p.fase >= 3 ? 'Aprovado' : 'Em análise';
const milhar = v => v >= 1e6 ? 'R$ ' + (v / 1e6).toFixed(1).replace('.', ',') + ' mi' : 'R$ ' + Math.round(v / 1000) + ' mil';
let _leaflet;
function carregaLeaflet() {
  if (window.L) return Promise.resolve();
  return _leaflet || (_leaflet = new Promise((ok, ko) => {
    let n = 0; const um = () => { if (++n === 2) ok(); }, erro = () => { _leaflet = null; ko(); };
    const c = document.createElement('link'); c.rel = 'stylesheet'; c.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'; c.onload = um; c.onerror = erro; document.head.appendChild(c);
    const s = document.createElement('script'); s.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'; s.onload = um; s.onerror = erro; document.head.appendChild(s);
  }));
}
function camposProcesso(v = {}) {
  return [
    { k: 'cliente', l: 'Cliente', req: true, v: v.cliente },
    { k: 'cpf', l: 'CPF', v: v.cpf, half: true, ph: '000.000.000-00' }, { k: 'telefone', l: 'Telefone', v: v.telefone, half: true, ph: '(67) 90000-0000' },
    { k: 'banco', l: 'Banco', t: 'select', o: BANCOS, v: v.banco, half: true }, { k: 'modalidade', l: 'Modalidade', t: 'select', o: ['MCMV Faixa 1', 'MCMV Faixa 2', 'MCMV Faixa 3', 'Pró-Cotista', 'SBPE'], v: v.modalidade, half: true },
    { k: 'valorImovel', l: 'Valor do imóvel (R$)', t: 'number', v: v.valorImovel, half: true }, { k: 'financiamento', l: 'Valor financiado (R$)', t: 'number', v: v.financiamento, half: true },
    { k: 'renda', l: 'Renda familiar (R$)', t: 'number', v: v.renda, half: true }, { k: 'responsavel', l: 'Responsável', t: 'select', o: RESPONSAVEIS, v: v.responsavel, half: true },
    { k: 'corretor', l: 'Corretor', v: v.corretor, half: true }, { k: 'empreendimento', l: 'Empreendimento', t: 'select', o: ['', ...DB.empreendimentos.map(e => e.nome)], v: v.empreendimento, half: true },
    { k: 'unidade', l: 'Unidade', v: v.unidade, half: true, ph: 'A-302' },
    { k: 'cidade', l: 'Cidade onde quer comprar', t: 'select', o: ['', ...Object.keys(CIDADES_MS)], v: v.cidade || (v.id ? localDe(v).cidade : ''), half: true }, { k: 'bairro', l: 'Bairro desejado', v: v.bairro || (v.id ? localDe(v).bairro : ''), half: true, ph: 'Centro' }
  ];
}
function listaReservas(todas) {
  const rows = [];
  DB.empreendimentos.forEach(e => Object.entries(e.unidades).forEach(([cod, u]) => {
    if (u.status === 'reservado' && (todas || u.corretor === SESS.nome)) rows.push({ e, cod, u });
  }));
  rows.sort((a, b) => (a.u.ate || '').localeCompare(b.u.ate || ''));
  return rows;
}

/* =================================================================
   TELAS
   ================================================================= */
const FILT = { banco: '', resp: '', q: '' };
let CONV_SEL = null;

/* ---------- tela do mapa: completa (correspondente) ou anônima (corretor) ----------
   No modo corretor nunca vão para o HTML: nome, CPF, telefone, banco nem o link do processo,
   a não ser que o administrador tenha liberado o cliente para aquele corretor (ou que o cliente já seja dele). */
/* carteira do corretor: imóveis dele + os da imobiliária sem dono; vendido não entra */
const normTxt = t => String(t || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase();
/* imóveis do corretor que ele pode oferecer a um cliente: disponíveis e no MESMO bairro e cidade que o cliente procura */
const imoveisNoBairro = (nome, cidade, bairro) => carteiraDe(nome).filter(m => m.status === 'Disponível' && normTxt(m.cidade) === normTxt(cidade) && normTxt(m.bairro) === normTxt(bairro));
let preImovel = null; /* bairro e cidade para abrir o cadastro de imóvel já preenchido, vindo do mapa */
const carteiraDe = nome => DB.imoveis.filter(m => m.status !== 'Vendido' && (!m.corretor || m.corretor === nome));
const linkOferta = (p, i) => '#/app/oferta/' + p.id + '.' + i;
const resumoImovel = m => `${h(m.titulo)} · ${h(m.bairro || '')}${m.cidade ? ', ' + h(m.cidade) : ''} · ${brl(m.valor)}`;
const liberadoPara = (p, nome) => !!nome && (p.liberadoPara === nome || p.corretor === nome);
function corretoresConhecidos() {
  const n = new Set();
  DB.usuarios.filter(u => u.perfil === 'imob').forEach(u => n.add(u.nome));
  DB.processos.forEach(p => { if (p.corretor) n.add(p.corretor); (p.interesses || []).forEach(i => n.add(i.corretor)); });
  return [...n].sort();
}
function telaMapa(anonimo) {
  const eu = SESS.nome;
  const ps = DB.processos.map(p => ({ p, ...localDe(p), st: statusOp(p) }));
  const cidades = [...new Set(ps.map(x => x.cidade))].sort();
  const sts = ['Em análise', 'Aprovado', 'Contratado'];
  const cls = st => st === 'Em análise' ? 'an' : st === 'Aprovado' ? 'ap' : 'ct';
  return {
    t: 'Mapa de oportunidades',
    s: anonimo ? 'Clientes com crédito em andamento perto de você. Nome e contato só aparecem depois que o administrador libera o cliente para você.'
      : 'Clientes no mapa com o valor do imóvel que podem comprar. O pino marca o bairro desejado, não o endereço.',
    html: `<div class="mapa-wrap"><div class="mapa-lado">
      <div class="mapa-filtros">
        <div class="field"><label>Cidade</label><select class="inp" id="fc"><option value="">Todas as cidades</option>${cidades.map(c => `<option>${h(c)}</option>`).join('')}</select></div>
        <div class="field"><label>Bairro</label><select class="inp" id="fb"></select></div>
        <div class="mchips" id="fs"><button class="mchip on" data-st="">Todos</button>${sts.map(x => `<button class="mchip" data-st="${x}">${x}</button>`).join('')}${anonimo ? '<button class="mchip" data-st="lib">Liberados para mim</button>' : ''}</div>
      </div>
      <div class="mapa-cont"><span>${anonimo ? 'Oportunidades anônimas' : 'Oportunidades'}</span><b id="fq">00</b></div>
      <div class="mapa-lista" id="fl2"></div></div>
      <div class="mapa-map"><div id="mapa"></div><div class="mapa-aviso" id="mav">Carregando o mapa…</div>
        <div class="mapa-leg">${sts.map(x => `<span><i class="st-${cls(x)}"></i>${x}</span>`).join('')}</div></div></div>`,
    after(v) {
      let map = null, camada = null, mks = {}, atual = [];
      const tg = st => `<span class="tag ${st === 'Aprovado' ? 'ok' : st === 'Contratado' ? 'info' : 'warn'}">${st}</span>`;
      const pino = x => `<div class="mpin st-${cls(x.st)}${anonimo && liberadoPara(x.p, eu) ? ' lib' : ''}"><b>${milhar(x.p.valorImovel)}</b><small>${x.st}</small></div>`;
      const pediu = p => (p.interesses || []).some(i => i.corretor === eu);
      /* bloco de ação/identificação de cada cliente, igual na lista e no balão do mapa */
      const quem = x => {
        const p = x.p;
        if (!anonimo) {
          const ofs = p.interesses || [];
          return `<div class="mquem"><b>${h(p.cliente)}</b> · ${h(p.telefone || 'sem telefone')} · ${h(p.banco)}</div>
            ${ofs.map((o, i) => `<div class="mint">${ic('home')}<span><b>${h(o.corretor)}</b> ${o.imovel ? `ofereceu <a href="${linkOferta(p, i)}">${resumoImovel(o.imovel)}</a>` : 'pediu este cliente'}</span></div>`).join('')}
            ${p.liberadoPara ? `<div class="mlib">Liberado para <b>${h(p.liberadoPara)}</b>${SESS.admin ? ` <a href="#" data-lib="${p.id}">trocar</a> · <a href="#" data-tirar="${p.id}">tirar</a>` : ''}</div>`
              : SESS.admin ? `<button class="btn sm" data-lib="${p.id}">${ic('key')} Liberar para corretor</button>` : ''}`;
        }
        if (liberadoPara(p, eu)) {
          const tel = (p.telefone || '').replace(/\D/g, '');
          return `<div class="mlib">${p.corretor === eu ? 'Seu cliente' : 'Liberado para você'}</div>
            <div class="mquem"><b>${h(p.cliente)}</b> · ${h(p.telefone || 'sem telefone')}</div>
            ${tel ? `<a class="btn ghost sm" target="_blank" rel="noopener" href="https://wa.me/55${tel}">${ic('chat')} WhatsApp</a>` : ''}`;
        }
        const minha = (p.interesses || []).find(i => i.corretor === eu);
        return minha ? `<div class="mint"><span>${minha.imovel ? `Você ofereceu <b>${resumoImovel(minha.imovel)}</b>. ` : ''}Aguardando o administrador liberar.</span></div>`
          : `<button class="btn ghost sm" data-int="${p.id}">${ic('home')} Tenho imóvel para este cliente</button>`;
      };
      const pop = x => `<div class="mpop">${anonimo ? `<b>${h(x.bairro)} · ${h(x.cidade)}</b>` : `<b>${h(x.p.cliente)}</b><div>${h(x.bairro)} · ${h(x.cidade)}</div>`}
        <div>Imóvel até <b>${brl(x.p.valorImovel)}</b></div><div>Crédito ${brl(x.p.financiamento)}${anonimo ? '' : ' · ' + h(x.p.banco)}</div><div>Situação: ${x.st}</div>
        <div class="mpop-a">${quem(x)}</div>${anonimo ? '' : `<a href="#/app/processo/${x.p.id}">Abrir processo →</a>`}</div>`;
      const filtra = () => {
        const c = $('#fc', v).value, b = $('#fb', v).value, st = $('#fs .on', v).dataset.st;
        return ps.filter(x => (!c || x.cidade === c) && (!b || x.bairro === b) && (!st || (st === 'lib' ? liberadoPara(x.p, eu) : x.st === st)));
      };
      const bairros = () => {
        const c = $('#fc', v).value;
        $('#fb', v).innerHTML = '<option value="">' + (c ? 'Todos os bairros' : 'Selecione uma cidade') + '</option>' + (c ? [...new Set(ps.filter(x => x.cidade === c).map(x => x.bairro))].sort().map(b => `<option>${h(b)}</option>`).join('') : '');
        $('#fb', v).disabled = !c;
      };
      const desenha = (manter) => {
        const l = filtra(); $('#fq', v).textContent = String(l.length).padStart(2, '0');
        $('#fl2', v).innerHTML = l.length ? l.map(x => `<div class="mitem" data-id="${x.p.id}"><div class="mtop"><b>${h(x.bairro)} · ${h(x.cidade)}</b>${tg(x.st)}</div>
          ${anonimo ? `<div class="muted">${h(x.p.modalidade)}</div>` : ''}
          <div class="mval">${milhar(x.p.valorImovel)} <small>imóvel · crédito ${brl(x.p.financiamento)}</small></div>
          <div class="mquem-w">${quem(x)}</div>
          <div class="macts"><button class="btn ghost sm" data-ver="${x.p.id}">${ic('pin')} Ver no mapa</button>${anonimo ? '' : `<a class="btn ghost sm" href="#/app/processo/${x.p.id}">Abrir processo</a>`}</div></div>`).join('')
          : `<div class="empty">${$('#fs .on', v).dataset.st === 'lib' ? 'Nenhum cliente liberado para você ainda.' : 'Nenhum cliente com esse filtro.'}</div>`;
        atual = l;
        if (!map) return;
        if (!manter && l.length) map.fitBounds(L.latLngBounds(l.map(x => [x.lat, x.lng])).pad(.08), { maxZoom: 13, animate: false, padding: innerWidth < 821 ? [24, 24] : [36, 36] });
        pinta();
      };
      /* pinos que se encostariam na tela viram um pino de grupo (quantidade e total); clicar aproxima */
      const pinta = () => {
        camada.clearLayers(); mks = {};
        const gs = [];
        atual.forEach(x => {
          const pt = map.latLngToLayerPoint([x.lat, x.lng]);
          const g = gs.find(g => Math.abs(g.pt.x - pt.x) < 180 && Math.abs(g.pt.y - pt.y) < 60);
          if (g) g.xs.push(x); else gs.push({ pt, xs: [x] });
        });
        gs.forEach(({ xs }) => {
          if (xs.length === 1) { const x = xs[0]; mks[x.p.id] = L.marker([x.lat, x.lng], { icon: L.divIcon({ className: 'mpin-w', html: pino(x), iconSize: [112, 48], iconAnchor: [56, 56] }) }).bindPopup(() => pop(x), { offset: [0, -50], minWidth: 220 }).addTo(camada); return; }
          const lat = xs.reduce((a, x) => a + x.lat, 0) / xs.length, lng = xs.reduce((a, x) => a + x.lng, 0) / xs.length;
          const tot = xs.reduce((a, x) => a + x.p.valorImovel, 0), cids = [...new Set(xs.map(x => x.cidade))];
          const onde = cids.length === 1 ? cids[0] : cids.length === 2 ? cids.join(' e ') : cids.length + ' cidades';
          L.marker([lat, lng], { icon: L.divIcon({ className: 'mpin-w', html: `<div class="mpin st-grp"><b>${xs.length} clientes · ${milhar(tot)}</b><small>${h(onde)}</small></div>`, iconSize: [176, 48], iconAnchor: [88, 56] }) })
            .on('click', () => map.fitBounds(L.latLngBounds(xs.map(x => [x.lat, x.lng])), { maxZoom: 16, padding: [90, 90] })).addTo(camada);
          xs.forEach(x => mks[x.p.id] = { getLatLng: () => L.latLng(x.lat, x.lng) });
        });
      };
      const depois = (msg) => { save(); if (map) map.closePopup(); desenha(true); toast(msg); };
      v.addEventListener('click', e => {
        const t = e.target.closest('[data-ver],[data-int],[data-lib],[data-tirar]'); if (!t) return;
        e.preventDefault();
        if (t.dataset.ver) {
          const id = t.dataset.ver, m = mks[id]; if (!m || !map) return;
          if (innerWidth < 821) $('#mapa', v).scrollIntoView({ behavior: 'smooth', block: 'center' });
          map.once('moveend', () => { const k = mks[id]; if (k && k.openPopup) k.openPopup(); });
          map.flyTo(m.getLatLng(), 16, { duration: .6 });
        } else if (t.dataset.int) {
          const p = proc(+t.dataset.int); if (!p || pediu(p)) return;
          if (map) map.closePopup();
          const x = ps.find(y => y.p.id === p.id), base = imoveisNoBairro(eu, x.cidade, x.bairro);
          if (!base.length) return modal('Nenhum imóvel seu neste bairro', `<p>Você não tem imóvel <b>disponível</b> em <b>${h(x.bairro)}, ${h(x.cidade)}</b>, que é onde este cliente procura.</p><p class="muted">Cadastre o imóvel desse bairro na sua carteira e depois volte ao mapa para oferecer.</p>`,
            [{ t: 'Cancelar', cls: 'ghost', fn: closeModal }, { t: 'Cadastrar imóvel em ' + x.bairro, fn: () => { closeModal(); preImovel = { bairro: x.bairro, cidade: x.cidade, status: 'Disponível', volta: true }; go('app/imoveis'); } }]);
          const ord = base.slice().sort((a, b) => (a.valor > p.valorImovel) - (b.valor > p.valorImovel) || Math.abs(a.valor - p.valorImovel) - Math.abs(b.valor - p.valorImovel));
          const lab = m => `${m.titulo} · ${brl(m.valor)}${m.valor > p.valorImovel ? ' (acima do valor do cliente)' : ''}`;
          formModal(`Qual imóvel você tem? Cliente de até ${brl(p.valorImovel)} em ${x.bairro}, ${x.cidade}`, [
            { k: 'imovel', l: 'Seus imóveis disponíveis em ' + x.bairro, t: 'select', o: ord.map(m => [m.id, lab(m)]), v: ord[0].id, req: true },
            { k: 'obs', l: 'Recado para o administrador (opcional)', t: 'textarea' }
          ], vals => {
            const m = DB.imoveis.find(i => i.id === +vals.imovel); if (!m) return false;
            (p.interesses = p.interesses || []).push({ corretor: eu, data: hoje(), imovelId: m.id, obs: vals.obs || '',
              imovel: { titulo: m.titulo, bairro: m.bairro || '', cidade: m.cidade || '', valor: +m.valor || 0, quartos: m.quartos || '', area: m.area || '', status: m.status || '' } });
            p.historico.push({ data: hoje(), txt: 'Corretor ' + eu + ' ofereceu o imóvel ' + m.titulo + ' (' + brl(m.valor) + ') pelo mapa', por: eu });
            depois('Imóvel enviado ao administrador');
          });
        } else if (t.dataset.tirar && SESS.admin) {
          const p = proc(+t.dataset.tirar); p.historico.push({ data: hoje(), txt: 'Liberação retirada de ' + p.liberadoPara, por: eu }); p.liberadoPara = '';
          depois('Liberação retirada');
        } else if (t.dataset.lib && SESS.admin) {
          if (map) map.closePopup();
          const p = proc(+t.dataset.lib), ints = (p.interesses || []).map(i => i.corretor);
          const ops = [...new Set([...ints, ...corretoresConhecidos()])];
          formModal('Liberar ' + p.cliente + ' para corretor', [{ k: 'corretor', l: 'Corretor', t: 'select', o: ops, v: p.liberadoPara || ints[0] || ops[0], req: true }], vals => {
            p.liberadoPara = vals.corretor; p.historico.push({ data: hoje(), txt: 'Cliente liberado no mapa para o corretor ' + vals.corretor, por: eu });
            depois('Cliente liberado para ' + vals.corretor);
          });
        }
      });
      $('#fc', v).onchange = () => { bairros(); desenha(); };
      $('#fb', v).onchange = () => desenha();
      $$('#fs .mchip', v).forEach(b => b.onclick = () => { $$('#fs .mchip', v).forEach(x => x.classList.toggle('on', x === b)); desenha(); });
      bairros(); desenha();
      carregaLeaflet().then(() => {
        if (!document.body.contains(v) || !$('#mapa', v)) return;
        $('#mav', v).remove();
        map = L.map($('#mapa', v), { scrollWheelZoom: true }).setView([-20.8, -54.6], 6);
        L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap contributors · tiles by OpenStreetMap France', subdomains: 'abc', maxZoom: 18 }).addTo(map);
        camada = L.layerGroup().addTo(map); map.invalidateSize(); map.on('zoomend', pinta); desenha();
      }).catch(() => { const a = $('#mav', v); if (a) a.textContent = 'Não foi possível carregar o mapa. Confira a internet e abra a tela de novo.'; });
    }
  };
}

const VIEWS = {
  /* ---------- telas comuns aos perfis ---------- */
  comum: {
    oferta(arg) {
      const [pid, n] = String(arg || '').split('.'), p = proc(+pid), o = p && (p.interesses || [])[+n];
      if (!o) return { t: 'Oferta não encontrada', html: `<div class="card"><div class="empty">Essa oferta não existe mais. <a href="#/app/mapa">Voltar ao mapa</a></div></div>` };
      const m = DB.imoveis.find(i => i.id === o.imovelId) || o.imovel || {}, loc = localDe(p), cabe = (+m.valor || 0) <= p.valorImovel;
      const verCliente = SESS.perfil !== 'imob' || liberadoPara(p, SESS.nome);
      const lib = p.liberadoPara === o.corretor;
      return {
        t: 'Imóvel oferecido por ' + o.corretor, s: 'Oferta feita pelo Mapa de oportunidades em ' + fdata(o.data),
        a: `<a class="btn ghost" href="#/app/mapa">${ic('back')} Voltar ao mapa</a>${SESS.admin && !lib ? ` <button class="btn accent" id="libo">${ic('key')} Liberar cliente para ${h(o.corretor)}</button>` : ''}`,
        html: `<div class="grid g2">
          <div class="card"><div class="head"><h3>${ic('home')} Imóvel</h3>${m.status ? `<span class="tag ${m.status === 'Disponível' ? 'ok' : m.status === 'Vendido' ? 'bad' : 'warn'} r">${h(m.status)}</span>` : ''}</div>
            <div class="ofa-tit">${h(m.titulo || 'Imóvel removido da carteira')}</div>
            <div class="ofa-val">${brl(+m.valor || 0)}</div>
            <dl class="ofa-dl"><dt>Local</dt><dd>${h(m.bairro || '-')}, ${h(m.cidade || '-')}</dd><dt>Quartos</dt><dd>${h(String(m.quartos || '-'))}</dd><dt>Área</dt><dd>${m.area ? h(String(m.area)) + ' m²' : '-'}</dd><dt>Corretor</dt><dd>${h(o.corretor)}</dd></dl>
            ${o.obs ? `<div class="ofa-obs"><b>Recado do corretor</b><br>${h(o.obs)}</div>` : ''}</div>
          <div class="card"><div class="head"><h3>${ic('users')} Cliente</h3>${tagFase(p)}</div>
            ${verCliente ? `<div class="ofa-tit">${h(p.cliente)}</div>` : '<div class="muted">Cliente anônimo</div>'}
            <dl class="ofa-dl"><dt>Procura em</dt><dd>${h(loc.bairro)}, ${h(loc.cidade)}</dd><dt>Imóvel até</dt><dd>${brl(p.valorImovel)}</dd><dt>Crédito</dt><dd>${brl(p.financiamento)}</dd><dt>Situação</dt><dd>${statusOp(p)}</dd></dl>
            <div class="ofa-fit ${cabe ? 'ok' : 'bad'}">${cabe ? 'O imóvel cabe no valor do cliente' : 'O imóvel está ' + brl((+m.valor || 0) - p.valorImovel) + ' acima do valor do cliente'}</div>
            ${lib ? `<div class="mlib" style="margin-top:10px">Cliente já liberado para ${h(o.corretor)}</div>` : ''}
            ${SESS.perfil !== 'imob' ? `<a href="#/app/processo/${p.id}" style="display:inline-block;margin-top:10px">Abrir processo →</a>` : ''}</div></div>`,
        after() {
          const b = $('#libo'); if (!b) return;
          b.onclick = () => { p.liberadoPara = o.corretor; p.historico.push({ data: hoje(), txt: 'Cliente liberado para o corretor ' + o.corretor + ' pela oferta do imóvel ' + (m.titulo || ''), por: SESS.nome }); save(); toast('Cliente liberado para ' + o.corretor); rerender(); };
        }
      };
    },
    processo(id) {
      const p = proc(id); if (!p) return { t: 'Processo não encontrado', html: '<div class="empty">Processo não encontrado.</div>' };
      const pode = SESS.perfil === 'banco';
      const pend = pendencias(p), late = atrasado(p);
      const voltar = SESS.perfil === 'banco' ? 'esteira' : SESS.perfil === 'imob' ? 'clientes' : 'repasse';
      return {
        t: p.cliente, s: `Processo #${p.id} · ${h(p.banco)} · ${h(p.modalidade)}`,
        a: `<a class="btn ghost" href="#/app/${voltar}">${ic('back')} Voltar</a>` + (pode ? `<button class="btn ghost" id="ed">Editar</button><button class="btn ghost" id="vt" ${p.fase === 0 ? 'disabled' : ''}>Voltar fase</button><button class="btn accent" id="av" ${p.fase === FASES.length - 1 ? 'disabled' : ''}>Avançar fase ${ic('chev')}</button>` : ''),
        html: `<div class="card">${steps(p)}<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px">${tagFase(p)}
            <span class="tag ${late ? 'bad' : 'ok'}">${ic('clock')} Prazo ${fdata(prazo(p))}${late ? ' · atrasado' : ''}</span>
            <span class="tag">Responsável: ${h(p.responsavel)}</span>${pend.length ? `<span class="tag warn">${pend.length} pendência(s)</span>` : '<span class="tag ok">Documentação completa</span>'}</div></div>
          <div class="grid g2 mt">
            <div class="card"><h3>Dados do processo</h3><dl class="dl">
              <dt>Cliente</dt><dd>${h(p.cliente)}</dd><dt>CPF</dt><dd>${h(p.cpf) || '—'}</dd><dt>Telefone</dt><dd>${h(p.telefone) || '—'}</dd>
              <dt>Banco</dt><dd>${h(p.banco)}</dd><dt>Modalidade</dt><dd>${h(p.modalidade)}</dd>
              <dt>Valor do imóvel</dt><dd>${brl(p.valorImovel)}</dd><dt>Financiamento</dt><dd>${brl(p.financiamento)}</dd>
              <dt>Entrada</dt><dd>${brl(p.valorImovel - p.financiamento)}</dd><dt>Renda familiar</dt><dd>${brl(p.renda)}</dd>
              <dt>Comprometimento</dt><dd>${p.renda ? Math.round(parcelaEstimada(p.financiamento) / p.renda * 100) + '% da renda' : '—'}</dd>
              <dt>Corretor</dt><dd>${h(p.corretor) || '—'} ${p.imobiliaria ? '<span class="muted">· ' + h(p.imobiliaria) + '</span>' : ''}</dd>
              <dt>Empreendimento</dt><dd>${h(p.empreendimento) || '—'} ${p.unidade ? '· ' + h(p.unidade) : ''}</dd>
            </dl></div>
            <div class="card"><div class="head"><h3>Documentos</h3><span class="r muted">${DOCS_PADRAO.length - pend.length}/${DOCS_PADRAO.length}</span></div>
              <div class="checklist">${DOCS_PADRAO.map(d => `<label><input type="checkbox" data-doc="${h(d)}" ${p.docs[d] ? 'checked' : ''} ${pode ? '' : 'disabled'}> ${h(d)}</label>`).join('')}</div></div>
          </div>
          <div class="card mt"><div class="head"><h3>Histórico</h3>${pode || SESS.perfil === 'imob' ? '<button class="btn ghost sm r" id="nota">' + ic('plus') + ' Observação</button>' : ''}</div>
            <ul class="hist">${p.historico.slice().reverse().map(x => `<li>${h(x.txt)}<small>${fdata(x.data)} · ${h(x.por)}</small></li>`).join('')}</ul></div>`,
        after(v) {
          $$('[data-doc]', v).forEach(c => c.onchange = () => { p.docs[c.dataset.doc] = c.checked; p.historico.push({ data: hoje(), txt: (c.checked ? 'Documento recebido: ' : 'Documento desmarcado: ') + c.dataset.doc, por: SESS.nome }); save(); rerender(); });
          const av = $('#av'), vt = $('#vt'), ed = $('#ed'), nt = $('#nota');
          if (av) av.onclick = () => { moverFase(p, p.fase + 1, 'Avançou'); toast('Processo foi para ' + FASES[p.fase].n); rerender(); };
          if (vt) vt.onclick = () => { moverFase(p, p.fase - 1, 'Voltou'); rerender(); };
          if (ed) ed.onclick = () => formModal('Editar processo', camposProcesso(p), vals => { Object.assign(p, vals); p.historico.push({ data: hoje(), txt: 'Dados do processo editados', por: SESS.nome }); save(); rerender(); });
          if (nt) nt.onclick = () => formModal('Nova observação', [{ k: 'txt', l: 'Observação', t: 'textarea', req: true }], vals => { p.historico.push({ data: hoje(), txt: vals.txt, por: SESS.nome }); save(); rerender(); });
        }
      };
    },
    espelho(id) {
      const e = DB.empreendimentos.find(x => x.id === +id); if (!e) return go('app/empreendimentos');
      const cont = { disponivel: 0, reservado: 0, vendido: 0, bloqueado: 0 };
      Object.values(e.unidades).forEach(u => cont[u.status]++);
      const camp = DB.campanhas.find(c => c.empreendimento === e.id && c.status === 'Ativa');
      const leg = [['disponivel', 'Disponível', 'var(--ok-soft)'], ['reservado', 'Reservado', 'var(--warn-soft)'], ['vendido', 'Vendido', '#e3e8ee'], ['bloqueado', 'Bloqueado', 'var(--bad-soft)']];
      return {
        t: e.nome, s: `${h(e.cidade)} · entrega ${h(e.entrega)} · ${Object.keys(e.unidades).length} unidades`,
        a: `<a class="btn ghost" href="#/app/empreendimentos">${ic('back')} Voltar</a>`,
        html: `${camp ? `<div class="card" style="border-color:var(--accent);background:var(--accent-soft);margin-bottom:16px;padding:12px 16px">${ic('tag')} <b>Campanha ativa:</b> ${h(camp.nome)}${camp.desconto ? ` · ${camp.desconto}% de desconto já aplicado nos preços` : ''} · até ${fdata(camp.fim)}</div>` : ''}
          <div class="legend">${leg.map(([k, n, c]) => `<span><i style="background:${c}"></i>${n} <b>${cont[k]}</b></span>`).join('')}</div>
          ${e.torres.map(t => `<div class="card tower"><h4>Torre ${h(t)}</h4><div class="floors" style="overflow-x:auto">${Array.from({ length: e.andares }, (_, i) => e.andares - i).map(a =>
            `<div class="floor"><span class="fl">${a}º andar</span>${Array.from({ length: e.porAndar }, (_, j) => { const cod = `${t}-${a}0${j + 1}`, u = e.unidades[cod]; return `<button class="un s-${u.status}" data-u="${cod}">${a}0${j + 1}<small>${u.status === 'disponivel' ? brl(precoUnidade(e, cod).final).replace('R$', '').trim() : u.status}</small></button>`; }).join('')}</div>`).join('')}</div></div>`).join('')}`,
        after(v) { $$('[data-u]', v).forEach(b => b.onclick = () => abrirUnidade(e, b.dataset.u)); }
      };
    }
  },

  /* ---------- CORRESPONDENTE BANCÁRIO ---------- */
  banco: {
    painel() {
      const ps = DB.processos, late = ps.filter(atrasado);
      const aprov = ps.filter(p => p.fase >= 3).length, vol = ps.reduce((s, p) => s + p.financiamento, 0);
      const max = Math.max(1, ...FASES.map((_, i) => ps.filter(p => p.fase === i).length));
      const prox = ps.slice().sort((a, b) => prazo(a).localeCompare(prazo(b))).slice(0, 7);
      return {
        t: 'Painel', s: `${h(DB.config.escritorio)} · visão geral da operação`,
        a: `<button class="btn accent" id="np">${ic('plus')} Novo processo</button>`,
        html: `<div class="grid g4">${kpi('Processos ativos', ps.length, `${DB.leads.filter(l => l.etapa < 4).length} leads no funil`, 'kanban')}
            ${kpi('Fora do prazo', late.length, 'passaram do SLA da fase', 'alert', late.length > 0)}
            ${kpi('Crédito aprovado', aprov, 'da engenharia em diante', 'check')}
            ${kpi('Volume em financiamento', brl(vol), 'soma dos processos', 'money')}</div>
          <div class="grid g2 mt">
            <div class="card"><h3>Processos por fase</h3><div class="bars">${FASES.map((f, i) => { const n = ps.filter(p => p.fase === i).length; return `<div class="row"><span>${f.n}</span><div class="track"><div class="fill" style="width:${n / max * 100}%"></div></div><span class="n">${n}</span></div>`; }).join('')}</div></div>
            <div class="card"><div class="head"><h3>Prazos mais próximos</h3><a class="r" href="#/app/esteira" style="font-size:13px">Ver esteira</a></div>
              <div class="tbl-wrap" style="border:0"><table><tbody>${prox.map(p => `<tr class="click" data-p="${p.id}"><td><b>${h(p.cliente)}</b><br><span class="muted" style="font-size:12px">${FASES[p.fase].n} · ${h(p.responsavel)}</span></td><td class="num"><span class="tag ${atrasado(p) ? 'bad' : diasEntre(hoje(), prazo(p)) <= 1 ? 'warn' : 'ok'}">${fdata(prazo(p))}</span></td></tr>`).join('')}</tbody></table></div></div>
          </div>
          <div class="grid g3 mt">${BANCOS.slice(0, 3).map(b => { const pb = ps.filter(p => p.banco === b); return `<div class="card kpi"><div class="lab">${ic('bank')}${b}</div><div class="val">${pb.length}</div><div class="foot">${brl(pb.reduce((s, p) => s + p.financiamento, 0))} em financiamento</div></div>`; }).join('')}</div>`,
        after(v) { $$('[data-p]', v).forEach(r => r.onclick = () => go('app/processo/' + r.dataset.p)); $('#np').onclick = () => formModal('Novo processo', camposProcesso(), vals => { const p = novoProcesso(vals); go('app/processo/' + p.id); }); }
      };
    },
    esteira() {
      const lista = DB.processos.filter(p => (!FILT.banco || p.banco === FILT.banco) && (!FILT.resp || p.responsavel === FILT.resp) && (!FILT.q || (p.cliente + p.cpf + p.id).toLowerCase().includes(FILT.q.toLowerCase())));
      return {
        t: 'Esteira de processos', s: 'Cada processo tem uma fase, um responsável e um prazo. Arraste o cartão para mudar de fase.',
        a: `<button class="btn accent" id="np">${ic('plus')} Novo processo</button>`,
        html: `<div class="toolbar"><input class="inp grow" id="fq" placeholder="Buscar cliente, CPF ou número" value="${h(FILT.q)}">
            <select class="inp" id="fb"><option value="">Todos os bancos</option>${BANCOS.map(b => `<option ${b === FILT.banco ? 'selected' : ''}>${b}</option>`).join('')}</select>
            <select class="inp" id="fr"><option value="">Todos os responsáveis</option>${RESPONSAVEIS.map(b => `<option ${b === FILT.resp ? 'selected' : ''}>${b}</option>`).join('')}</select></div>
          <div class="kanban">${FASES.map((f, i) => { const cs = lista.filter(p => p.fase === i); return `<div class="col" data-col="${i}"><div class="col-h">${f.n}<span class="cnt">${cs.length}</span><span class="sla">SLA ${f.sla}d</span></div>
            ${cs.map(p => { const pend = pendencias(p).length, late = atrasado(p); return `<div class="kc ${late ? 'late' : ''}" data-id="${p.id}"><b>${h(p.cliente)}</b>
              <div class="line"><span>#${p.id} · ${h(p.banco)}</span><span>${brl(p.financiamento)}</span></div>
              <div class="meta"><span class="tag ${late ? 'bad' : 'ok'}">${ic('clock')} ${fdata(prazo(p)).slice(0, 5)}</span>${pend ? `<span class="tag warn">${pend} pend.</span>` : ''}<span class="tag">${h(p.responsavel.split(' ')[0])}</span></div></div>`; }).join('')}</div>`; }).join('')}</div>`,
        after(v) {
          $('#fq').oninput = e => { FILT.q = e.target.value; clearTimeout(window._fq); window._fq = setTimeout(() => { rerender(); const i = $('#fq'); i.focus(); i.setSelectionRange(i.value.length, i.value.length); }, 250); };
          $('#fb').onchange = e => { FILT.banco = e.target.value; rerender(); };
          $('#fr').onchange = e => { FILT.resp = e.target.value; rerender(); };
          $$('.kc', v).forEach(c => c.onclick = () => go('app/processo/' + c.dataset.id));
          kanbanDnD(v, (id, col) => { const p = proc(id); if (p && p.fase !== col) { moverFase(p, col); toast(`${p.cliente} → ${FASES[col].n}`); rerender(); } });
          $('#np').onclick = () => formModal('Novo processo', camposProcesso(), vals => { novoProcesso(vals); toast('Processo criado em Cadastro'); rerender(); });
        }
      };
    },
    crm() {
      return {
        t: 'CRM de vendas', s: 'Funil de leads ligado ao processo de crédito. Arraste para mudar de etapa.',
        a: `<button class="btn accent" id="nl">${ic('plus')} Novo lead</button>`,
        html: `<div class="grid g4" style="margin-bottom:16px">${kpi('Leads no funil', DB.leads.filter(l => l.etapa < 4).length, '', 'funnel')}${kpi('Convertidos', DB.leads.filter(l => l.etapa === 4).length, 'viraram processo', 'check')}${kpi('Taxa de conversão', Math.round(DB.leads.filter(l => l.etapa === 4).length / Math.max(1, DB.leads.filter(l => l.etapa >= 4).length) * 100) + '%', 'convertidos ÷ encerrados', 'chart')}${kpi('Potencial no funil', brl(DB.leads.filter(l => l.etapa < 4).reduce((s, l) => s + (+l.valor || 0), 0)), 'valor dos imóveis', 'money')}</div>
          <div class="kanban">${ETAPAS_CRM.map((et, i) => { const ls = DB.leads.filter(l => l.etapa === i); return `<div class="col" data-col="${i}"><div class="col-h">${et}<span class="cnt">${ls.length}</span></div>
            ${ls.map(l => `<div class="kc" data-id="${l.id}"><b>${h(l.nome)}</b><div class="line"><span>${h(l.telefone)}</span></div><div class="meta"><span class="tag info">${h(l.origem)}</span><span class="tag">${brl(l.valor)}</span></div></div>`).join('')}</div>`; }).join('')}</div>`,
        after(v) {
          const campos = (l = {}) => [{ k: 'nome', l: 'Nome', req: true, v: l.nome }, { k: 'telefone', l: 'Telefone', v: l.telefone, half: true }, { k: 'origem', l: 'Origem', t: 'select', o: ['Site', 'Instagram', 'WhatsApp', 'Indicação de corretor', 'Feirão', 'Outro'], v: l.origem, half: true }, { k: 'valor', l: 'Valor do imóvel desejado (R$)', t: 'number', v: l.valor, half: true }, { k: 'etapa', l: 'Etapa', t: 'select', o: ETAPAS_CRM.map((e, i) => [i, e]), v: l.etapa ?? 0, half: true }];
          $('#nl').onclick = () => formModal('Novo lead', campos(), vals => { DB.leads.push({ id: ++DB.seq.lead, ...vals, etapa: +vals.etapa, criado: hoje() }); save(); rerender(); });
          $$('.kc', v).forEach(c => c.onclick = () => {
            const l = DB.leads.find(x => x.id === +c.dataset.id);
            formModal('Lead · ' + l.nome, campos(l), vals => { Object.assign(l, vals, { etapa: +vals.etapa }); save(); rerender(); }, [
              { t: ic('swap') + ' Converter em processo', cls: 'accent', fn: () => { const p = novoProcesso({ cliente: l.nome, telefone: l.telefone, valorImovel: l.valor, financiamento: Math.round((+l.valor || 0) * .8), origem: 'Convertido do CRM (lead ' + l.origem + ')' }); l.etapa = 4; save(); toast('Processo #' + p.id + ' aberto'); go('app/processo/' + p.id); } },
              { t: 'Excluir', cls: 'danger', fn: () => { if (confirm('Excluir este lead?')) { DB.leads = DB.leads.filter(x => x !== l); save(); closeModal(); rerender(); } } }
            ]);
          });
          kanbanDnD(v, (id, col) => { const l = DB.leads.find(x => x.id === id); if (l) { l.etapa = col; save(); rerender(); } });
        }
      };
    },
    atendimento() {
      if (!CONV_SEL || !DB.conversas.find(c => c.id === CONV_SEL)) CONV_SEL = DB.conversas[0]?.id;
      const c = DB.conversas.find(x => x.id === CONV_SEL);
      if (c) c.naoLidas = 0; save();
      const p = c && c.processo ? proc(c.processo) : null;
      const respostas = {
        'Documentos': 'Para começar precisamos de: ' + DOCS_PADRAO.slice(0, 6).join(', ') + '.',
        'Prazo da análise': 'A análise de crédito leva em média 5 dias úteis depois da documentação completa.',
        'Status do processo': p ? `Seu processo está na fase ${FASES[p.fase].n}. Previsão desta etapa: ${fdata(prazo(p))}.` : 'Ainda não encontrei um processo no seu nome. Vou abrir um para você.',
        'Simulação': 'Me passa sua renda familiar e o valor do imóvel que eu faço a simulação na hora.'
      };
      return {
        t: 'Atendimento', s: 'Conversas do WhatsApp compartilhadas pelo time, com histórico ligado ao cliente e ao processo.',
        a: `<button class="btn ghost" id="nc">${ic('plus')} Nova conversa</button>`,
        html: `<div class="chat"><div class="list">${DB.conversas.map(x => `<div class="conv ${x.id === CONV_SEL ? 'on' : ''}" data-c="${x.id}"><b>${h(x.cliente)}${x.naoLidas ? `<span class="tag acc">${x.naoLidas}</span>` : `<span class="muted" style="font-weight:400;font-size:12px">${h(x.msgs.at(-1)?.hora || '')}</span>`}</b><small>${h(x.msgs.at(-1)?.txt || '')}</small></div>`).join('')}</div>
          ${c ? `<div class="pane"><div class="ph"><div><b>${h(c.cliente)}</b><div class="muted" style="font-size:12px">${h(c.telefone)}</div></div><span style="margin-left:auto"></span>
            ${p ? `<a class="btn ghost sm" href="#/app/processo/${p.id}">Processo #${p.id} · ${FASES[p.fase].n}</a>` : `<button class="btn ghost sm" id="vl">Criar lead</button>`}</div>
            <div class="msgs" id="msgs">${c.msgs.map(m => `<div class="msg ${m.de}">${m.de === 'bot' ? '<b style="font-size:11px;color:var(--info)">Robô</b><br>' : ''}${h(m.txt)}<small>${h(m.hora)}</small></div>`).join('')}</div>
            <div class="quick">${Object.keys(respostas).map(k => `<button data-q="${h(k)}">${ic('spark')} ${h(k)}</button>`).join('')}</div>
            <form class="comp" id="fm"><input class="inp" id="tx" placeholder="Escreva uma mensagem" autocomplete="off"><button class="btn">${ic('send')}</button></form></div>` : '<div class="empty">Nenhuma conversa.</div>'}</div>`,
        after(v) {
          $$('[data-c]', v).forEach(el => el.onclick = () => { CONV_SEL = +el.dataset.c; rerender(); });
          const m = $('#msgs'); if (m) m.scrollTop = m.scrollHeight;
          const fm = $('#fm');
          if (fm) fm.onsubmit = e => { e.preventDefault(); const t = $('#tx').value.trim(); if (!t) return; c.msgs.push({ de: 'eu', txt: t, hora: horaAgora() }); save(); rerender(); $('#tx').focus(); };
          $$('[data-q]', v).forEach(b => b.onclick = () => { c.msgs.push({ de: 'bot', txt: respostas[b.dataset.q], hora: horaAgora() }); save(); rerender(); });
          const vl = $('#vl'); if (vl) vl.onclick = () => { DB.leads.push({ id: ++DB.seq.lead, nome: c.cliente, telefone: c.telefone, origem: 'WhatsApp', etapa: 0, valor: 0, criado: hoje() }); save(); toast('Lead criado no CRM'); };
          $('#nc').onclick = () => formModal('Nova conversa', [{ k: 'cliente', l: 'Nome do cliente', req: true }, { k: 'telefone', l: 'WhatsApp', ph: '(67) 90000-0000' }, { k: 'processo', l: 'Vincular ao processo', t: 'select', o: [['', 'Nenhum'], ...DB.processos.map(p => [p.id, '#' + p.id + ' · ' + p.cliente])] }], vals => {
            const id = ++DB.seq.conversa; DB.conversas.unshift({ id, cliente: vals.cliente, telefone: vals.telefone, processo: vals.processo ? +vals.processo : null, naoLidas: 0, msgs: [] }); CONV_SEL = id; save(); rerender();
          });
        }
      };
    },
    mapa: () => telaMapa(false),
    renda() {
      const exemplo = ['05/08 PIX RECEBIDO EMPRESA ALFA LTDA 2.350,00', '10/08 SALARIO 3.100,00', '12/08 PAGAMENTO BOLETO -450,00', '20/08 PIX RECEBIDO CLIENTE 380,00', '05/09 PIX RECEBIDO EMPRESA ALFA LTDA 2.350,00', '10/09 SALARIO 3.100,00', '18/09 TRANSF MESMA TITULARIDADE 1.000,00', '25/09 COMPRA CARTAO -210,90', '05/10 PIX RECEBIDO EMPRESA ALFA LTDA 2.410,00', '10/10 SALARIO 3.100,00', '22/10 PIX RECEBIDO CLIENTE 520,00'].join('\n');
      return {
        t: 'Apurador de renda', s: 'Cole o extrato bancário e a leitura automática separa os créditos válidos, calcula a renda média e a capacidade de financiamento.',
        html: `<div class="grid g2"><div class="card"><h3>Extrato</h3>
            <div class="field"><label>Lançamentos (data, descrição e valor por linha)</label><textarea class="inp" id="ex" style="min-height:260px;font-family:Consolas,monospace;font-size:12.5px">${h(exemplo)}</textarea></div>
            <div class="frow"><div class="field"><label>Taxa de juros (% ao ano)</label><input class="inp" id="tj" type="number" step="0.1" value="9.5"></div><div class="field"><label>Prazo (meses)</label><input class="inp" id="pz" type="number" value="360"></div></div>
            <button class="btn accent full" id="ap">${ic('spark')} Apurar renda</button></div>
          <div class="card" id="res"><h3>Resultado</h3><div class="empty">Cole o extrato e clique em Apurar renda.</div></div></div>`,
        after() {
          $('#ap').onclick = () => {
            const meses = {}, ignorados = [];
            $('#ex').value.split('\n').forEach(l => {
              const m = l.trim().match(/^(\d{2})\/(\d{2})(?:\/\d{2,4})?\s+(.+?)\s+(-?[\d.]+,\d{2})$/); if (!m) return;
              const val = +m[4].replace(/\./g, '').replace(',', '.');
              if (val <= 0) return;
              if (/mesma titularidade|estorno|resgate|aplica|empr[eé]stimo/i.test(m[3])) { ignorados.push(m[3] + ' · ' + brl(val)); return; }
              meses[m[2]] = (meses[m[2]] || 0) + val;
            });
            const ks = Object.keys(meses).sort(); if (!ks.length) { $('#res').innerHTML = '<h3>Resultado</h3><div class="empty">Não encontrei lançamentos. Use o formato: 05/08 DESCRIÇÃO 1.234,56</div>'; return; }
            const media = ks.reduce((s, k) => s + meses[k], 0) / ks.length;
            const parcela = media * .3, i = Math.pow(1 + (+$('#tj').value || 9.5) / 100, 1 / 12) - 1, n = +$('#pz').value || 360;
            const pv = parcela * (1 - Math.pow(1 + i, -n)) / i;
            const nm = ['', 'jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
            $('#res').innerHTML = `<h3>Resultado</h3><div class="grid g2" style="gap:12px">${kpi('Renda média apurada', brl(media), ks.length + ' meses lidos', 'money')}${kpi('Parcela máxima (30%)', brl(parcela), 'regra de comprometimento', 'calc')}</div>
              <div class="card kpi mt" style="background:var(--accent-soft);border-color:var(--accent)"><div class="lab">${ic('home')}Financiamento possível</div><div class="val">${brl(pv)}</div><div class="foot">${n} meses a ${$('#tj').value}% ao ano, tabela Price</div></div>
              <div class="tbl-wrap mt"><table><thead><tr><th>Mês</th><th class="num">Créditos válidos</th></tr></thead><tbody>${ks.map(k => `<tr><td>${nm[+k]}</td><td class="num">${brl(meses[k])}</td></tr>`).join('')}</tbody></table></div>
              ${ignorados.length ? `<p class="muted" style="font-size:12.5px">Desconsiderados: ${ignorados.map(h).join('; ')}</p>` : ''}
              <div class="frow mt" style="align-items:end"><div class="field" style="margin:0"><label>Aplicar ao processo</label><select class="inp" id="pr">${DB.processos.map(p => `<option value="${p.id}">#${p.id} · ${h(p.cliente)}</option>`).join('')}</select></div><button class="btn" id="apl">Gravar renda</button></div>`;
            $('#apl').onclick = () => { const p = proc($('#pr').value); p.renda = Math.round(media); p.historico.push({ data: hoje(), txt: 'Renda apurada pelo extrato: ' + brl(media), por: SESS.nome }); save(); toast('Renda gravada no processo #' + p.id); };
          };
        }
      };
    },
    formularios() {
      const FORMS = [['Caixa', 'Ficha cadastro pessoa física'], ['Caixa', 'Declaração de propósito MCMV'], ['Caixa', 'Autorização de consulta ao FGTS'], ['Caixa', 'Declaração de renda informal'], ['Itaú', 'Proposta de financiamento imobiliário'], ['Bradesco', 'Ficha cadastral do proponente'], ['Santander', 'Proposta de crédito imobiliário'], ['Banco do Brasil', 'Ficha cadastral PF'], ['Inter', 'Proposta de financiamento']];
      return {
        t: 'Formulários dos bancos', s: 'Escolha o processo e o formulário sai preenchido, pronto para imprimir ou salvar em PDF.',
        html: `<div class="toolbar"><label class="muted">Processo</label><select class="inp grow" id="pr">${DB.processos.map(p => `<option value="${p.id}">#${p.id} · ${h(p.cliente)} · ${h(p.banco)}</option>`).join('')}</select></div>
          <div class="tbl-wrap"><table><thead><tr><th>Banco</th><th>Formulário</th><th></th></tr></thead><tbody>${FORMS.map((f, i) => `<tr><td><span class="tag info">${f[0]}</span></td><td>${f[1]}</td><td class="num"><button class="btn ghost sm" data-f="${i}">${ic('doc')} Gerar</button></td></tr>`).join('')}</tbody></table></div>`,
        after(v) {
          $$('[data-f]', v).forEach(b => b.onclick = () => {
            const [banco, nome] = FORMS[+b.dataset.f], p = proc($('#pr').value);
            const linhas = [['Proponente', p.cliente], ['CPF', p.cpf], ['Telefone', p.telefone], ['Modalidade', p.modalidade], ['Valor de compra e venda', brl(p.valorImovel)], ['Valor do financiamento', brl(p.financiamento)], ['Recursos próprios', brl(p.valorImovel - p.financiamento)], ['Renda familiar bruta', brl(p.renda)], ['Empreendimento e unidade', (p.empreendimento || '—') + (p.unidade ? ' · ' + p.unidade : '')], ['Correspondente', DB.config.escritorio], ['Data', fdata(hoje())]];
            modal(nome, `<div class="doc"><div class="dh"><div><b style="font-size:16px">${h(banco)}</b><div class="muted">${h(nome)}</div></div>${logo(26)}</div>
              <table>${linhas.map(([a, b2]) => `<tr><td>${h(a)}</td><td><b>${h(b2) || '—'}</b></td></tr>`).join('')}</table>
              <p style="font-size:12px;color:var(--muted);margin-top:14px">Declaro que as informações acima são verdadeiras e autorizo a consulta aos órgãos de proteção ao crédito.</p>
              <div class="sig"><div>${h(p.cliente)}</div><div>${h(DB.config.escritorio)}</div></div></div>`, [{ t: 'Fechar', cls: 'ghost', fn: closeModal }, { t: ic('print') + ' Imprimir', fn: () => window.print() }], true);
            p.historico.push({ data: hoje(), txt: 'Formulário gerado: ' + banco + ' · ' + nome, por: SESS.nome }); save();
          });
        }
      };
    },
    config() {
      return {
        t: 'Configurações', s: 'Marca própria (white label), equipe e dados da demonstração.',
        html: `<div class="grid g2"><div class="card"><h3>Marca do escritório</h3>
            <div class="field"><label>Nome do escritório</label><input class="inp" id="ce" value="${h(DB.config.escritorio)}"></div>
            <div class="field"><label>WhatsApp do comercial e suporte</label><input class="inp" id="cw" value="${h(DB.config.whatsapp || '')}" placeholder="5567999999999"></div>
            <div class="field"><label>Cor de destaque</label><input class="inp" id="cc" type="color" value="${h(DB.config.cor)}" style="height:44px;padding:4px"></div>
            <button class="btn" id="sv">Salvar</button></div>
          <div class="card"><h3>Equipe</h3><div class="tbl-wrap" style="border:0"><table><tbody>${RESPONSAVEIS.map(r => { const n = DB.processos.filter(p => p.responsavel === r); return `<tr><td><b>${r}</b><br><span class="muted" style="font-size:12px">Analista de crédito</span></td><td class="num">${n.length} processos<br><span class="${n.filter(atrasado).length ? 'tag bad' : 'tag ok'}">${n.filter(atrasado).length} atrasado(s)</span></td></tr>`; }).join('')}</tbody></table></div></div></div>
          <div class="card mt"><h3>Acessos da demonstração</h3><div class="tbl-wrap" style="border:0"><table><thead><tr><th>Perfil</th><th>Nome</th><th>E-mail</th><th>Senha</th></tr></thead><tbody>${DB.usuarios.map(u => `<tr><td>${PERFIS[u.perfil].nome}</td><td>${h(u.nome)}</td><td>${h(u.email)}</td><td>${h(u.senha)}</td></tr>`).join('')}</tbody></table></div>
            <p class="muted" style="font-size:13px">Tudo fica gravado só neste navegador. Para começar de novo:</p><button class="btn danger" id="rs">Restaurar dados de demonstração</button></div>`,
        after() {
          $('#cc').oninput = e => document.documentElement.style.setProperty('--accent', e.target.value);
          $('#sv').onclick = () => { DB.config.escritorio = $('#ce').value.trim() || 'IMOV365'; DB.config.whatsapp = $('#cw').value.trim(); DB.config.cor = $('#cc').value; save(); aplicaMarca(); toast('Configurações salvas'); };
          $('#rs').onclick = () => { if (confirm('Apagar tudo e voltar aos dados de demonstração?')) { DB = seedDB(); save(); aplicaMarca(); toast('Dados restaurados'); rerender(); } };
        }
      };
    }
  },

  /* ---------- IMOBILIÁRIA E CORRETOR ---------- */
  imob: {
    mapa: () => telaMapa(true),
    painel() {
      const meus = DB.processos.filter(p => p.corretor === SESS.nome), res = listaReservas(false);
      return {
        t: 'Painel', s: `Olá, ${h(SESS.nome.split(' ')[0])}. Acompanhe o crédito dos seus clientes em tempo real.`,
        a: `<button class="btn accent" id="ec">${ic('plus')} Enviar cliente ao correspondente</button>`,
        html: `<div class="grid g4">${kpi('Clientes em crédito', meus.length, 'processos com você', 'users')}${kpi('Crédito aprovado', meus.filter(p => p.fase >= 3).length, 'já passaram da análise', 'check')}${kpi('Propostas abertas', DB.propostas.filter(p => p.status === 'Enviada').length, '', 'doc')}${kpi('Reservas ativas', res.length, 'unidades segurando', 'key')}</div>
          <div class="card mt"><div class="head"><h3>Andamento dos meus clientes</h3><a class="r" href="#/app/clientes" style="font-size:13px">Ver todos</a></div>
            <div class="tbl-wrap" style="border:0"><table><tbody>${meus.map(p => `<tr class="click" data-p="${p.id}"><td><b>${h(p.cliente)}</b><br><span class="muted" style="font-size:12px">${h(p.banco)} · ${brl(p.financiamento)}</span></td><td>${tagFase(p)}</td><td style="width:30%">${barra(progresso(p), p.fase >= 6 ? 'var(--ok)' : 'var(--navy2)')}</td><td class="num muted">${progresso(p)}%</td></tr>`).join('') || '<tr><td class="empty">Nenhum cliente ainda.</td></tr>'}</tbody></table></div></div>`,
        after(v) { $$('[data-p]', v).forEach(r => r.onclick = () => go('app/processo/' + r.dataset.p)); $('#ec').onclick = enviarCliente; }
      };
    },
    clientes() {
      const lista = DB.processos.filter(p => p.imobiliaria);
      return {
        t: 'Meus clientes', s: 'Fase do crédito de cada cliente da imobiliária, sem precisar ligar para o correspondente.',
        a: `<button class="btn accent" id="ec">${ic('plus')} Enviar cliente</button>`,
        html: `<div class="tbl-wrap"><table><thead><tr><th>Cliente</th><th>Corretor</th><th>Banco</th><th>Fase</th><th>Andamento</th><th class="num">Pendências</th></tr></thead><tbody>
          ${lista.map(p => `<tr class="click" data-p="${p.id}"><td><b>${h(p.cliente)}</b><br><span class="muted" style="font-size:12px">#${p.id} · ${brl(p.financiamento)}</span></td><td>${h(p.corretor)}</td><td>${h(p.banco)}</td><td>${tagFase(p)}</td><td>${barra(progresso(p), p.fase >= 6 ? 'var(--ok)' : 'var(--navy2)')}</td><td class="num">${pendencias(p).length ? `<span class="tag warn">${pendencias(p).length}</span>` : '<span class="tag ok">ok</span>'}</td></tr>`).join('')}</tbody></table></div>`,
        after(v) { $$('[data-p]', v).forEach(r => r.onclick = () => go('app/processo/' + r.dataset.p)); $('#ec').onclick = enviarCliente; }
      };
    },
    imoveis() {
      const campos = (m = {}) => [{ k: 'titulo', l: 'Título', req: true, v: m.titulo }, { k: 'bairro', l: 'Bairro', v: m.bairro, half: true }, { k: 'cidade', l: 'Cidade', v: m.cidade || 'Campo Grande', half: true }, { k: 'valor', l: 'Valor (R$)', t: 'number', req: true, v: m.valor, half: true }, { k: 'status', l: 'Situação', t: 'select', o: ['Disponível', 'Em proposta', 'Vendido'], v: m.status, half: true }, { k: 'quartos', l: 'Quartos', t: 'number', v: m.quartos, half: true }, { k: 'area', l: 'Área (m²)', t: 'number', v: m.area, half: true }];
      return {
        t: 'Imóveis', s: `${DB.imoveis.length} imóveis na carteira`,
        a: `<button class="btn accent" id="ni">${ic('plus')} Novo imóvel</button>`,
        html: `<div class="grid g3">${DB.imoveis.map(m => `<div class="card imv click" data-i="${m.id}" style="cursor:pointer"><div class="ph"><span class="tag ${m.status === 'Disponível' ? 'ok' : m.status === 'Vendido' ? '' : 'warn'}">${h(m.status)}</span></div>
          <div class="bd"><b>${h(m.titulo)}</b><div class="pr">${brl(m.valor)}</div><div class="muted" style="font-size:13px">${h(m.bairro)}, ${h(m.cidade)} · ${num(m.quartos)} quartos · ${num(m.area)} m²</div></div></div>`).join('')}</div>`,
        after(v) {
          const novo = (pre = {}) => formModal(pre.bairro ? 'Novo imóvel em ' + pre.bairro : 'Novo imóvel', campos(pre), vals => {
            DB.imoveis.push({ id: ++DB.seq.imovel, ...vals, corretor: SESS.perfil === 'imob' ? SESS.nome : '' }); save();
            if (pre.volta) { toast('Imóvel cadastrado. Agora ofereça o cliente no mapa.'); go('app/mapa'); } else rerender();
          });
          $('#ni').onclick = () => novo();
          if (preImovel) { const pre = preImovel; preImovel = null; novo(pre); }
          $$('[data-i]', v).forEach(c => c.onclick = () => { const m = DB.imoveis.find(x => x.id === +c.dataset.i); formModal('Editar imóvel', campos(m), vals => { Object.assign(m, vals); save(); rerender(); }, [{ t: 'Excluir', cls: 'danger', fn: () => { if (confirm('Excluir este imóvel?')) { DB.imoveis = DB.imoveis.filter(x => x !== m); save(); closeModal(); rerender(); } } }]); });
        }
      };
    },
    empreendimentos: () => listaEmpreendimentos(false),
    propostas() {
      const cor = { Enviada: 'warn', Aceita: 'ok', Recusada: 'bad', 'No correspondente': 'info' };
      return {
        t: 'Propostas', s: 'Proposta aceita vai direto para o correspondente abrir o processo de crédito.',
        a: `<button class="btn accent" id="np">${ic('plus')} Nova proposta</button>`,
        html: `<div class="tbl-wrap"><table><thead><tr><th>Cliente</th><th>Imóvel</th><th class="num">Valor</th><th>Pagamento</th><th>Data</th><th>Situação</th><th></th></tr></thead><tbody>
          ${DB.propostas.slice().reverse().map(p => `<tr><td><b>${h(p.cliente)}</b><br><span class="muted" style="font-size:12px">${h(p.corretor)}</span></td><td>${h(p.imovel)}</td><td class="num">${brl(p.valor)}</td><td>${h(p.pagamento)}</td><td>${fdata(p.data)}</td><td><span class="tag ${cor[p.status] || ''}">${h(p.status)}</span></td>
            <td class="num" style="white-space:nowrap">${p.status === 'Enviada' ? `<button class="btn ghost sm" data-ac="${p.id}">Aceita</button> <button class="btn ghost sm" data-rc="${p.id}">Recusada</button>` : p.status === 'Aceita' && /Financ/.test(p.pagamento) ? `<button class="btn sm" data-en="${p.id}">Enviar ao correspondente</button>` : ''}</td></tr>`).join('')}</tbody></table></div>`,
        after(v) {
          const opImv = [...DB.imoveis.filter(m => m.status !== 'Vendido').map(m => m.titulo), ...listaReservas(false).map(r => r.e.nome + ' · ' + r.cod)];
          $('#np').onclick = () => formModal('Nova proposta', [{ k: 'cliente', l: 'Cliente', req: true }, { k: 'imovel', l: 'Imóvel', t: 'select', o: opImv }, { k: 'valor', l: 'Valor proposto (R$)', t: 'number', req: true, half: true }, { k: 'pagamento', l: 'Forma de pagamento', t: 'select', o: ['Financiamento MCMV', 'Financiamento SBPE', 'À vista', 'Consórcio'], half: true }], vals => { DB.propostas.push({ id: ++DB.seq.proposta, ...vals, status: 'Enviada', data: hoje(), corretor: SESS.nome }); save(); rerender(); });
          const get = id => DB.propostas.find(x => x.id === +id);
          $$('[data-ac]', v).forEach(b => b.onclick = () => { get(b.dataset.ac).status = 'Aceita'; save(); rerender(); });
          $$('[data-rc]', v).forEach(b => b.onclick = () => { get(b.dataset.rc).status = 'Recusada'; save(); rerender(); });
          $$('[data-en]', v).forEach(b => b.onclick = () => {
            const pr = get(b.dataset.en); const [emp, uni] = pr.imovel.split(' · ');
            const p = novoProcesso({ cliente: pr.cliente, valorImovel: pr.valor, financiamento: Math.round(pr.valor * .8), modalidade: /MCMV/.test(pr.pagamento) ? 'MCMV Faixa 2' : 'SBPE', corretor: pr.corretor, empreendimento: uni ? emp : '', unidade: uni || '', origem: 'Enviado pela imobiliária (proposta aceita)' });
            pr.status = 'No correspondente'; save(); toast('Processo #' + p.id + ' aberto no correspondente'); rerender();
          });
        }
      };
    },
    reservas: () => telaReservas(false)
  },

  /* ---------- CONSTRUTORA ---------- */
  const: {
    painel() {
      let tot = 0, vend = 0, res = 0, vgv = 0;
      DB.empreendimentos.forEach(e => Object.entries(e.unidades).forEach(([c, u]) => { tot++; if (u.status === 'vendido') { vend++; vgv += precoUnidade(e, c).cheio; } if (u.status === 'reservado') res++; }));
      const rep = DB.processos.filter(p => p.empreendimento);
      return {
        t: 'Painel', s: 'Vendas, reservas e repasse dos empreendimentos.',
        html: `<div class="grid g4">${kpi('Unidades vendidas', `${vend}<span class="muted" style="font-size:15px"> / ${tot}</span>`, Math.round(vend / tot * 100) + '% vendido', 'check')}${kpi('Reservas ativas', res, 'aguardando assinatura', 'key')}${kpi('VGV vendido', brl(vgv), 'valor geral de vendas', 'money')}${kpi('Repasse em andamento', rep.length, 'clientes no banco', 'swap')}</div>
          <div class="grid g2 mt">${DB.empreendimentos.map(e => { const us = Object.values(e.unidades), v = us.filter(u => u.status === 'vendido').length, r = us.filter(u => u.status === 'reservado').length; return `<a class="card" href="#/app/espelho/${e.id}" style="text-decoration:none;color:inherit"><div class="head"><h3>${h(e.nome)}</h3><span class="r tag">${h(e.entrega)}</span></div>
            <div style="display:flex;height:12px;border-radius:99px;overflow:hidden;background:var(--ok-soft)"><div style="width:${v / us.length * 100}%;background:#9aa9b9"></div><div style="width:${r / us.length * 100}%;background:#e9b44c"></div></div>
            <div class="muted" style="font-size:13px;margin-top:8px">${v} vendidas · ${r} reservadas · ${us.length - v - r} livres ou bloqueadas</div></a>`; }).join('')}</div>
          <div class="card mt"><h3>Campanhas ativas</h3>${DB.campanhas.filter(c => c.status === 'Ativa').map(c => `<div style="display:flex;gap:10px;align-items:center;padding:8px 0;border-bottom:1px solid #edf0f4"><span class="tag acc">${ic('tag')}</span><b>${h(c.nome)}</b><span class="muted">${h(DB.empreendimentos.find(e => e.id === c.empreendimento)?.nome || '')}</span><span style="margin-left:auto" class="muted">até ${fdata(c.fim)}</span></div>`).join('') || '<div class="empty">Nenhuma campanha ativa.</div>'}</div>`
      };
    },
    empreendimentos: () => listaEmpreendimentos(true),
    reservas: () => telaReservas(true),
    campanhas() {
      const opE = DB.empreendimentos.map(e => [e.id, e.nome]);
      const campos = (c = {}) => [{ k: 'nome', l: 'Nome da campanha', req: true, v: c.nome }, { k: 'empreendimento', l: 'Empreendimento', t: 'select', o: opE, v: c.empreendimento }, { k: 'desconto', l: 'Desconto (%)', t: 'number', v: c.desconto ?? 0, half: true }, { k: 'status', l: 'Situação', t: 'select', o: ['Ativa', 'Pausada', 'Encerrada'], v: c.status, half: true }, { k: 'inicio', l: 'Início', t: 'date', v: c.inicio || hoje(), half: true }, { k: 'fim', l: 'Fim', t: 'date', v: c.fim || addDias(hoje(), 30), half: true }];
      return {
        t: 'Campanhas', s: 'O desconto da campanha ativa já entra no preço do espelho de vendas.',
        a: `<button class="btn accent" id="nc">${ic('plus')} Nova campanha</button>`,
        html: `<div class="tbl-wrap"><table><thead><tr><th>Campanha</th><th>Empreendimento</th><th class="num">Desconto</th><th>Período</th><th>Situação</th></tr></thead><tbody>
          ${DB.campanhas.slice().reverse().map(c => `<tr class="click" data-c="${c.id}"><td><b>${h(c.nome)}</b></td><td>${h(DB.empreendimentos.find(e => e.id === +c.empreendimento)?.nome || '')}</td><td class="num">${c.desconto ? c.desconto + '%' : '—'}</td><td>${fdata(c.inicio)} a ${fdata(c.fim)}</td><td><span class="tag ${c.status === 'Ativa' ? 'ok' : c.status === 'Pausada' ? 'warn' : ''}">${h(c.status)}</span></td></tr>`).join('')}</tbody></table></div>`,
        after(v) {
          const fix = vals => ({ ...vals, empreendimento: +vals.empreendimento, desconto: +vals.desconto || 0 });
          $('#nc').onclick = () => formModal('Nova campanha', campos(), vals => { DB.campanhas.push({ id: ++DB.seq.campanha, ...fix(vals) }); save(); rerender(); });
          $$('[data-c]', v).forEach(r => r.onclick = () => { const c = DB.campanhas.find(x => x.id === +r.dataset.c); formModal('Editar campanha', campos(c), vals => { Object.assign(c, fix(vals)); save(); rerender(); }, [{ t: 'Excluir', cls: 'danger', fn: () => { if (confirm('Excluir campanha?')) { DB.campanhas = DB.campanhas.filter(x => x !== c); save(); closeModal(); rerender(); } } }]); });
        }
      };
    },
    repasse() {
      const lista = DB.processos.filter(p => p.empreendimento);
      return {
        t: 'Repasse', s: 'Clientes das unidades vendidas no processo de crédito do banco.',
        html: `<div class="tbl-wrap"><table><thead><tr><th>Cliente</th><th>Empreendimento</th><th>Unidade</th><th>Banco</th><th>Fase</th><th>Andamento</th><th class="num">Financiamento</th></tr></thead><tbody>
          ${lista.map(p => `<tr class="click" data-p="${p.id}"><td><b>${h(p.cliente)}</b></td><td>${h(p.empreendimento)}</td><td>${h(p.unidade)}</td><td>${h(p.banco)}</td><td>${tagFase(p)}</td><td>${barra(progresso(p), p.fase >= 6 ? 'var(--ok)' : 'var(--navy2)')}</td><td class="num">${brl(p.financiamento)}</td></tr>`).join('') || '<tr><td colspan="7" class="empty">Nenhum cliente em repasse.</td></tr>'}</tbody></table></div>`,
        after(v) { $$('[data-p]', v).forEach(r => r.onclick = () => go('app/processo/' + r.dataset.p)); }
      };
    }
  }
};

/* ---------- telas compartilhadas por imobiliária e construtora ---------- */
function listaEmpreendimentos(ehConstrutora) {
  return {
    t: ehConstrutora ? 'Espelho de vendas' : 'Empreendimentos', s: ehConstrutora ? 'Escolha o empreendimento para ver o espelho em tempo real.' : 'Reserve unidades direto no espelho da construtora.',
    a: ehConstrutora ? `<button class="btn accent" id="ne">${ic('plus')} Novo empreendimento</button>` : '',
    html: `<div class="grid g2">${DB.empreendimentos.map(e => { const us = Object.values(e.unidades), d = us.filter(u => u.status === 'disponivel').length, v = us.filter(u => u.status === 'vendido').length; return `<a class="card imv" href="#/app/espelho/${e.id}" style="text-decoration:none;color:inherit"><div class="ph"><span class="tag ok">${d} disponíveis</span></div>
      <div class="bd"><b style="font-size:16px">${h(e.nome)}</b><div class="muted" style="font-size:13px;margin:4px 0 10px">${h(e.cidade)} · ${e.torres.length} torre(s) · ${us.length} unidades · entrega ${h(e.entrega)}</div>
      ${barra(v / us.length * 100, 'var(--accent)')}<div class="muted" style="font-size:12px;margin-top:6px">${Math.round(v / us.length * 100)}% vendido · a partir de ${brl(precoUnidade(e, e.torres[0] + '-101').final)}</div></div></a>`; }).join('')}</div>`,
    after() {
      const ne = $('#ne'); if (!ne) return;
      ne.onclick = () => formModal('Novo empreendimento', [{ k: 'nome', l: 'Nome', req: true }, { k: 'cidade', l: 'Cidade', v: 'Campo Grande', half: true }, { k: 'entrega', l: 'Entrega', ph: 'Dez/2028', half: true }, { k: 'torres', l: 'Torres (separadas por vírgula)', v: 'A, B' }, { k: 'andares', l: 'Andares', t: 'number', v: 5, half: true }, { k: 'porAndar', l: 'Unidades por andar', t: 'number', v: 4, half: true }, { k: 'precoBase', l: 'Preço base (R$)', t: 'number', v: 250000, req: true }], vals => {
        const torres = vals.torres.split(',').map(s => s.trim().toUpperCase()).filter(Boolean); const an = Math.min(30, Math.max(1, +vals.andares || 1)), pa = Math.min(9, Math.max(1, +vals.porAndar || 1));
        if (!torres.length) return false;
        const unidades = {}; torres.forEach(t => { for (let a = 1; a <= an; a++) for (let u = 1; u <= pa; u++) unidades[`${t}-${a}0${u}`] = { status: 'disponivel', cliente: '', corretor: '' }; });
        const id = Math.max(0, ...DB.empreendimentos.map(e => e.id)) + 1;
        DB.empreendimentos.push({ id, nome: vals.nome, cidade: vals.cidade, entrega: vals.entrega || '—', torres, andares: an, porAndar: pa, precoBase: +vals.precoBase, unidades }); save(); go('app/espelho/' + id);
      });
    }
  };
}
function abrirUnidade(e, cod) {
  const u = e.unidades[cod], pr = precoUnidade(e, cod), cons = SESS.perfil === 'const';
  const nomes = { disponivel: 'Disponível', reservado: 'Reservado', vendido: 'Vendido', bloqueado: 'Bloqueado' };
  const corpo = `<dl class="dl"><dt>Empreendimento</dt><dd>${h(e.nome)}</dd><dt>Unidade</dt><dd>${h(cod)}</dd><dt>Situação</dt><dd><span class="un s-${u.status}" style="display:inline-flex;width:auto;height:auto;padding:2px 10px">${nomes[u.status]}</span></dd>
    <dt>Preço</dt><dd>${pr.camp && pr.camp.desconto ? `<s class="muted">${brl(pr.cheio)}</s> ` : ''}<b>${brl(pr.final)}</b>${pr.camp && pr.camp.desconto ? ` <span class="tag acc">${pr.camp.desconto}% ${h(pr.camp.nome)}</span>` : ''}</dd>
    ${u.cliente ? `<dt>Cliente</dt><dd>${h(u.cliente)}</dd>` : ''}${u.corretor ? `<dt>Corretor</dt><dd>${h(u.corretor)}</dd>` : ''}${u.ate ? `<dt>Reserva até</dt><dd>${fdata(u.ate)}</dd>` : ''}</dl>`;
  const set = (st, extra = {}) => { e.unidades[cod] = { status: st, cliente: '', corretor: '', ate: '', ...extra }; save(); closeModal(); rerender(); };
  const reservar = () => formModal('Reservar ' + cod, [{ k: 'cliente', l: 'Cliente', req: true }, { k: 'corretor', l: 'Corretor', v: SESS.perfil === 'imob' ? SESS.nome : '' }, { k: 'dias', l: 'Prazo da reserva (dias)', t: 'number', v: 2 }], vals => { set('reservado', { cliente: vals.cliente, corretor: vals.corretor, ate: addDias(hoje(), +vals.dias || 2) }); toast('Unidade ' + cod + ' reservada'); });
  const bts = [];
  if (u.status === 'disponivel') bts.push({ t: ic('key') + ' Reservar', cls: 'accent', fn: reservar });
  if (cons) {
    if (u.status === 'reservado') bts.push({ t: 'Confirmar venda', fn: () => set('vendido', { cliente: u.cliente, corretor: u.corretor }) });
    if (u.status === 'disponivel') bts.push({ t: 'Bloquear', cls: 'ghost', fn: () => set('bloqueado') });
    if (u.status !== 'disponivel') bts.push({ t: 'Liberar', cls: 'danger', fn: () => { if (confirm('Liberar a unidade ' + cod + '?')) set('disponivel'); } });
  } else if (u.status === 'reservado' && u.corretor === SESS.nome) bts.push({ t: 'Cancelar reserva', cls: 'danger', fn: () => set('disponivel') });
  bts.push({ t: 'Fechar', cls: 'ghost', fn: closeModal });
  modal('Unidade ' + cod, corpo, bts);
}
function telaReservas(todas) {
  const rows = listaReservas(todas);
  return {
    t: 'Reservas', s: todas ? 'Todas as reservas em aberto nos empreendimentos.' : 'Suas reservas. Elas vencem no prazo e a unidade volta para a venda.',
    html: `<div class="tbl-wrap"><table><thead><tr><th>Empreendimento</th><th>Unidade</th><th>Cliente</th><th>Corretor</th><th>Vence</th><th></th></tr></thead><tbody>
      ${rows.map(({ e, cod, u }) => { const d = u.ate ? diasEntre(hoje(), u.ate) : 0; return `<tr><td>${h(e.nome)}</td><td><b>${h(cod)}</b></td><td>${h(u.cliente)}</td><td>${h(u.corretor)}</td><td><span class="tag ${d < 0 ? 'bad' : d <= 1 ? 'warn' : 'ok'}">${fdata(u.ate)}${d < 0 ? ' · vencida' : ''}</span></td><td class="num"><button class="btn ghost sm" data-e="${e.id}" data-u="${h(cod)}">Abrir</button></td></tr>`; }).join('') || '<tr><td colspan="6" class="empty">Nenhuma reserva em aberto.</td></tr>'}</tbody></table></div>`,
    after(v) { $$('[data-u]', v).forEach(b => b.onclick = () => abrirUnidade(DB.empreendimentos.find(x => x.id === +b.dataset.e), b.dataset.u)); }
  };
}
function enviarCliente() {
  formModal('Enviar cliente ao correspondente', [{ k: 'cliente', l: 'Cliente', req: true }, { k: 'cpf', l: 'CPF', half: true }, { k: 'telefone', l: 'Telefone', half: true }, { k: 'valorImovel', l: 'Valor do imóvel (R$)', t: 'number', half: true }, { k: 'renda', l: 'Renda familiar (R$)', t: 'number', half: true }, { k: 'modalidade', l: 'Modalidade', t: 'select', o: ['MCMV Faixa 1', 'MCMV Faixa 2', 'MCMV Faixa 3', 'Pró-Cotista', 'SBPE'] }], vals => {
    const p = novoProcesso({ ...vals, financiamento: Math.round((+vals.valorImovel || 0) * .8), corretor: SESS.nome, origem: 'Enviado pelo corretor ' + SESS.nome });
    toast('Cliente enviado. Processo #' + p.id); go('app/processo/' + p.id);
  });
}
function parcelaEstimada(pv, taxa = 9.5, n = 360) { const i = Math.pow(1 + taxa / 100, 1 / 12) - 1; return pv * i / (1 - Math.pow(1 + i, -n)); }

/* ---------- início ---------- */
load(); aplicaMarca(); route();
