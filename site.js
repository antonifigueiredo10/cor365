/* IMOV365 · site de apresentação, entrada por perfil, pedido de cadastro e aprovação pelo admin */
'use strict';

const SITE_PERFIS = {
  banco: {
    nome: 'Correspondente bancário', curto: 'Correspondente', ico: 'bank',
    chamada: 'Toda a esteira de crédito, do primeiro contato à assinatura.',
    itens: ['Esteira com 9 fases e prazo de cada etapa', 'Apurador de renda que lê o extrato', 'CRM de vendas e atendimento pelo WhatsApp', 'Formulários dos bancos prontos para imprimir', 'Mapa de oportunidades com os clientes da carteira'],
    empresa: 'Empresa (correspondente)', doc: 'CNPJ'
  },
  imob: {
    nome: 'Corretor e imobiliária', curto: 'Corretor', ico: 'home',
    chamada: 'Mais cliente com crédito aprovado chegando até você.',
    itens: ['Mapa de clientes com crédito perto dos seus imóveis', 'Ofereça o seu imóvel e receba o contato liberado', 'Carteira de imóveis, propostas e reservas', 'Acompanhe o andamento de cada cliente em tempo real', 'Envie o cliente ao correspondente em um clique'],
    empresa: 'Imobiliária (se tiver)', doc: 'CRECI'
  },
  const: {
    nome: 'Construtora', curto: 'Construtora', ico: 'helmet',
    chamada: 'Espelho de vendas vivo e repasse sem surpresa.',
    itens: ['Espelho de vendas por empreendimento', 'Reservas com prazo e controle de unidade', 'Campanhas com desconto aplicado no preço', 'Acompanhamento do repasse junto ao banco', 'Corretores e correspondentes no mesmo fluxo'],
    empresa: 'Construtora', doc: 'CNPJ'
  }
};

const SITE_RECURSOS = [
  ['kanban', 'Esteira de processos', 'Cada cliente numa fase, com responsável, prazo e alerta do que está parado.'],
  ['calc', 'Apurador de renda', 'Lança o extrato, separa os créditos válidos e calcula a renda e o financiamento possível.'],
  ['pin', 'Mapa de oportunidades', 'Clientes no mapa pelo bairro desejado e valor do imóvel, sem expor nome nem contato.'],
  ['funnel', 'CRM de vendas', 'Leads organizados por etapa, do primeiro contato até virar processo.'],
  ['chat', 'Atendimento', 'Conversas do WhatsApp com respostas prontas para simulação e documentos.'],
  ['doc', 'Formulários dos bancos', 'Caixa, Itaú, Bradesco, Santander, BB e Inter preenchidos com os dados do processo.'],
  ['grid', 'Espelho de vendas', 'Unidades disponíveis, reservadas e vendidas de cada empreendimento.'],
  ['money', 'Campanhas', 'Condições especiais aplicadas no preço e vistas por toda a rede de vendas.']
];

const SITE_FAQ = [
  ['Quem pode usar o IMOV365?', 'Correspondentes bancários, corretores, imobiliárias e construtoras que trabalham com crédito imobiliário. Cada um entra no seu próprio painel.'],
  ['Como faço para ter acesso?', 'Clique em Cadastre-se, escolha o seu perfil e preencha o pedido. A equipe do IMOV365 confere os dados e envia o seu acesso.'],
  ['O corretor vê os dados dos clientes de outros?', 'Não. O corretor vê só a região, o valor e a situação do crédito. Nome e contato só aparecem depois que o cliente é liberado para ele.'],
  ['Funciona no celular?', 'Sim. O IMOV365 funciona no navegador do computador, do tablet e do celular, sem instalar nada.'],
  ['Meus dados ficam guardados onde?', 'Num banco de dados na nuvem, com acesso por usuário e senha e regras que limitam o que cada perfil pode ver.']
];

function siteNav() {
  return `<header class="s-top" id="stop"><div class="s-wrap s-top-in">
    <a href="#/" class="s-logo" aria-label="IMOV365">${logo(34)}</a>
    <nav class="s-nav" id="snav">
      <button data-ir="s-perfis">Para quem é</button><button data-ir="s-como">Como funciona</button><button data-ir="s-recursos">Recursos</button><button data-ir="s-seg">Segurança</button><button data-ir="s-faq">Dúvidas</button>
      <span class="s-nav-cta"><a class="s-btn s-btn-ghost" href="#/entrar">Entrar</a><button class="s-btn s-btn-cor" data-ir="s-cad">Cadastre-se</button></span>
    </nav>
    <button class="s-burger" id="sbur" aria-label="Abrir menu">${ic('menu')}</button>
  </div></header>`;
}

function siteMock() {
  const col = (t, cards) => `<div class="mk-col"><div class="mk-col-t">${t}</div>${cards.map(c => `<div class="mk-card"><b>${c[0]}</b><small>${c[1]}</small><i style="width:${c[2]}%"></i></div>`).join('')}</div>`;
  return `<div class="mk" aria-hidden="true">
    <div class="mk-win"><div class="mk-bar"><span></span><span></span><span></span><em>imov365.com.br</em></div>
      <div class="mk-body"><div class="mk-side"><div class="mk-side-logo"></div>${'<div class="mk-side-it"></div>'.repeat(6)}</div>
        <div class="mk-main"><div class="mk-h">Esteira de processos</div>
          <div class="mk-cols">${col('Cadastro', [['Juliana C.', 'MCMV · Caixa', 18], ['Pedro A.', 'SBPE · Itaú', 10]])}${col('Análise', [['Rafael S.', 'Pró-Cotista', 44], ['Ana M.', 'MCMV · Caixa', 52]])}${col('Aprovado', [['Lucas F.', 'SBPE · Santander', 76]])}${col('Contrato', [['Aline B.', 'MCMV · Caixa', 96]])}</div>
        </div></div></div>
    <div class="mk-float mk-f1"><div class="mk-f-lab">${ic('home')} Financiamento possível</div><div class="mk-f-val">R$ 322.692</div><div class="mk-f-sub">360 meses · tabela Price</div></div>
    <div class="mk-float mk-f2"><span class="mk-dot"></span><div><b>Cliente liberado</b><small>Centro · Campo Grande · R$ 240 mil</small></div></div>
  </div>`;
}

function telaSite() {
  document.title = 'IMOV365 | Plataforma do crédito imobiliário';
  const P = SITE_PERFIS;
  app.innerHTML = `<div class="site">${siteNav()}
  <section class="s-hero"><div class="s-wrap s-hero-in">
    <div class="s-hero-txt">
      <div class="s-eyebrow"><span></span>Plataforma do crédito imobiliário</div>
      <h1>O crédito imobiliário inteiro, <em>conectado</em> em um só lugar.</h1>
      <p class="s-lead">Correspondente bancário, corretor e construtora trabalhando no mesmo processo. Do primeiro contato com o cliente até a assinatura do contrato, cada um vê o que precisa, na hora certa.</p>
      <div class="s-hero-cta"><button class="s-btn s-btn-cor s-btn-lg" data-ir="s-cad">Quero me cadastrar ${ic('chev')}</button><a class="s-btn s-btn-line s-btn-lg" href="#/entrar">Já tenho acesso</a></div>
      <ul class="s-hero-ok"><li>${ic('check')} Sem instalar nada</li><li>${ic('check')} Computador e celular</li><li>${ic('check')} Dados protegidos por perfil</li></ul>
    </div>
    <div class="s-hero-vis">${siteMock()}</div>
  </div></section>

  <section class="s-faixa"><div class="s-wrap s-faixa-in">
    <div><b>3</b><span>perfis no mesmo fluxo</span></div><div><b>9</b><span>fases na esteira de crédito</span></div><div><b>6</b><span>bancos com formulários prontos</span></div><div><b>24h</b><span>acesso de qualquer lugar</span></div>
  </div></section>

  <section class="s-sec" id="s-perfis"><div class="s-wrap">
    <div class="s-head"><div class="s-kick">Para quem é</div><h2>Um painel feito para cada lado do negócio</h2><p>Escolha o seu perfil para entrar ou pedir o seu acesso.</p></div>
    <div class="s-perfis">${Object.entries(P).map(([k, p], i) => `<article class="s-perfil${i === 0 ? ' destaque' : ''}">
      <div class="s-perfil-ico">${ic(p.ico)}</div><h3>${p.nome}</h3><p class="s-perfil-ch">${p.chamada}</p>
      <ul>${p.itens.map(t => `<li>${ic('check')}${t}</li>`).join('')}</ul>
      <div class="s-perfil-acts"><a class="s-btn s-btn-cor" href="#/cadastro/${k}">Cadastrar como ${p.curto.toLowerCase()}</a><a class="s-btn s-btn-ghost" href="#/entrar/${k}">Entrar</a></div>
    </article>`).join('')}</div>
  </div></section>

  <section class="s-sec s-sec-esc" id="s-como"><div class="s-wrap">
    <div class="s-head claro"><div class="s-kick">Como funciona</div><h2>Do interesse à chave na mão, sem perder o cliente no caminho</h2></div>
    <ol class="s-passos">
      <li><span>1</span><h4>O corretor encontra o cliente</h4><p>Cadastra o cliente ou oferece um imóvel para quem já tem crédito no mapa.</p></li>
      <li><span>2</span><h4>O correspondente analisa</h4><p>Apura a renda pelo extrato, simula e envia ao banco com os formulários prontos.</p></li>
      <li><span>3</span><h4>O banco aprova</h4><p>Cada fase fica registrada, com prazo e responsável, e todos acompanham o andamento.</p></li>
      <li><span>4</span><h4>A construtora faz o repasse</h4><p>Reserva da unidade, campanha aplicada e contrato assinado no mesmo processo.</p></li>
    </ol>
  </div></section>

  <section class="s-sec" id="s-recursos"><div class="s-wrap">
    <div class="s-head"><div class="s-kick">Recursos</div><h2>Tudo o que a operação de crédito precisa</h2><p>Ferramentas pensadas para o dia a dia de quem vende e financia imóvel.</p></div>
    <div class="s-recs">${SITE_RECURSOS.map(r => `<div class="s-rec"><div class="s-rec-ico">${ic(r[0])}</div><h4>${r[1]}</h4><p>${r[2]}</p></div>`).join('')}</div>
  </div></section>

  <section class="s-sec s-sec-claro" id="s-seg"><div class="s-wrap s-seg">
    <div class="s-seg-txt"><div class="s-kick">Segurança</div><h2>O cliente é seu. Os dados dele também.</h2>
      <p>Cada perfil enxerga só o que lhe cabe. O corretor vê no mapa a região, o valor e a situação do crédito, mas nome, telefone e CPF só aparecem quando o cliente é liberado para ele.</p>
      <ul class="s-lista"><li><i class="s-li-ico">${ic('key')}</i><span><b>Acesso por convite</b>Ninguém entra sem ter o cadastro aprovado.</span></li><li><i class="s-li-ico">${ic('check')}</i><span><b>Regras no servidor</b>A proteção está no banco de dados, não só na tela.</span></li><li><i class="s-li-ico">${ic('clock')}</i><span><b>Histórico de cada processo</b>Quem mudou, o que mudou e quando.</span></li></ul>
    </div>
    <div class="s-seg-vis" aria-hidden="true"><div class="s-pin"><div class="s-pin-v">R$ 240 mil</div><div class="s-pin-s">Aprovado</div></div>
      <div class="s-cad"><div class="s-cad-l"><span>Cliente</span><b class="s-blur">Juliana Costa</b></div><div class="s-cad-l"><span>Telefone</span><b class="s-blur">(67) 99811-2030</b></div><div class="s-cad-l"><span>Bairro</span><b>Centro · Campo Grande</b></div><div class="s-cad-tag">${ic('key')} Liberado só pelo correspondente</div></div></div>
  </div></section>

  <section class="s-sec" id="s-faq"><div class="s-wrap s-faq-wrap">
    <div class="s-head"><div class="s-kick">Dúvidas</div><h2>Perguntas frequentes</h2></div>
    <div class="s-faq">${SITE_FAQ.map((f, i) => `<details${i === 0 ? ' open' : ''}><summary>${f[0]}<span>${ic('plus')}</span></summary><p>${f[1]}</p></details>`).join('')}</div>
  </div></section>

  <section class="s-cta" id="s-cad"><div class="s-wrap">
    <h2>Faça parte do IMOV365</h2><p>Escolha como você trabalha e peça o seu acesso. A equipe confere os dados e envia a sua entrada.</p>
    <div class="s-cta-ops">${Object.entries(P).map(([k, p]) => `<a class="s-cta-op" href="#/cadastro/${k}"><span class="s-cta-ico">${ic(p.ico)}</span><span><b>${p.nome}</b><small>Pedir acesso</small></span>${ic('chev')}</a>`).join('')}</div>
    <p class="s-cta-ja">Já tem acesso? <a href="#/entrar">Entrar na plataforma</a></p>
  </div></section>

  <footer class="s-foot"><div class="s-wrap s-foot-in"><div>${logo(30, true)}<p>Plataforma do crédito imobiliário para correspondentes, corretores e construtoras.</p></div>
    <div class="s-foot-col"><b>Plataforma</b><a href="#/entrar">Entrar</a><a href="#/cadastro/banco">Correspondente bancário</a><a href="#/cadastro/imob">Corretor e imobiliária</a><a href="#/cadastro/const">Construtora</a></div>
    <div class="s-foot-col"><b>Saiba mais</b><button data-ir="s-como">Como funciona</button><button data-ir="s-recursos">Recursos</button><button data-ir="s-seg">Segurança</button><button data-ir="s-faq">Dúvidas</button></div>
  </div><div class="s-wrap s-foot-base">© ${new Date().getFullYear()} IMOV365. Todos os direitos reservados.</div></footer>
  </div>`;
  ligaSite();
}

function ligaSite() {
  $$('[data-ir]', app).forEach(b => b.onclick = e => {
    e.preventDefault(); const el = document.getElementById(b.dataset.ir); if (!el) return;
    $('#snav') && $('#snav').classList.remove('aberto');
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 72, behavior: 'smooth' });
  });
  const bur = $('#sbur'); if (bur) bur.onclick = () => $('#snav').classList.toggle('aberto');
  const top = $('#stop');
  const sombra = () => top && top.classList.toggle('rolou', window.scrollY > 8);
  window.removeEventListener('scroll', window.__sSombra || (() => {})); window.__sSombra = sombra;
  window.addEventListener('scroll', sombra, { passive: true }); sombra();
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) { x.target.classList.add('vis'); io.unobserve(x.target); } }), { threshold: .12 });
    $$('.s-perfil, .s-rec, .s-passos li, .s-seg-txt, .s-seg-vis, .s-head', app).forEach(el => { el.classList.add('s-anim'); io.observe(el); });
  }
  window.scrollTo(0, 0);
}

/* ---------- cadastro por perfil (vai para a tabela pedidos_cadastro, só o admin lê) ---------- */
function telaCadastro(perfil) {
  const p = SITE_PERFIS[perfil]; if (!p) return go('cadastro/imob');
  document.title = 'Cadastro ' + p.curto + ' | IMOV365';
  app.innerHTML = `<div class="site s-form-pg">${siteNav()}<div class="s-wrap s-form-grid">
    <aside class="s-form-lado"><a href="#/" class="s-voltar">${ic('back')} Voltar ao site</a>
      <div class="s-kick">Pedido de acesso</div><h1>${p.nome}</h1><p class="s-lead">${p.chamada}</p>
      <ul>${p.itens.slice(0, 4).map(t => `<li>${ic('check')}${t}</li>`).join('')}</ul>
      <div class="s-troca">Outro perfil? ${Object.entries(SITE_PERFIS).filter(([k]) => k !== perfil).map(([k, x]) => `<a href="#/cadastro/${k}">${x.curto}</a>`).join(' · ')}</div>
    </aside>
    <div class="s-form-card" id="sfc">
      <h2>Preencha os seus dados</h2><p class="muted">A equipe do IMOV365 confere o pedido e envia o seu acesso por e-mail ou WhatsApp.</p>
      <form id="fcad" novalidate>
        <div class="field"><label>Nome completo <span class="req">*</span></label><input class="inp" name="nome" autocomplete="name" maxlength="120" required></div>
        <div class="frow"><div class="field"><label>E-mail <span class="req">*</span></label><input class="inp" name="email" type="email" autocomplete="email" maxlength="160" required></div>
          <div class="field"><label>WhatsApp <span class="req">*</span></label><input class="inp" name="telefone" type="tel" autocomplete="tel" maxlength="30" placeholder="(67) 90000-0000" required></div></div>
        <div class="frow"><div class="field"><label>${p.empresa}${perfil === 'imob' ? '' : ' <span class="req">*</span>'}</label><input class="inp" name="empresa" autocomplete="organization" maxlength="160"></div>
          <div class="field"><label>${p.doc}</label><input class="inp" name="documento" maxlength="40"></div></div>
        <div class="field"><label>Cidade <span class="req">*</span></label><input class="inp" name="cidade" autocomplete="address-level2" maxlength="80" placeholder="Campo Grande, MS"></div>
        <div class="field"><label>Conte um pouco sobre você (opcional)</label><textarea class="inp" name="mensagem" maxlength="1000" rows="3"></textarea></div>
        <input class="s-hp" name="site" tabindex="-1" autocomplete="off" aria-hidden="true">
        <label class="s-ok"><input type="checkbox" name="lgpd"> Autorizo o IMOV365 a usar estes dados para analisar o meu cadastro e entrar em contato.</label>
        <div class="erro" id="cerr"></div>
        <button class="s-btn s-btn-cor s-btn-lg full" id="cbt">Enviar pedido de acesso</button>
        <p class="s-form-ja">Já tem acesso? <a href="#/entrar/${perfil}">Entrar</a></p>
      </form>
    </div></div></div>`;
  ligaSite();
  $('#fcad').onsubmit = async e => {
    e.preventDefault();
    const f = Object.fromEntries(new FormData(e.target)), err = $('#cerr'), bt = $('#cbt');
    const v = k => String(f[k] || '').trim();
    const falta = !v('nome') || v('nome').length < 3 ? 'o nome completo' : !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v('email')) ? 'um e-mail válido' : v('telefone').replace(/\D/g, '').length < 10 ? 'o WhatsApp com DDD' : (perfil !== 'imob' && !v('empresa')) ? p.empresa.toLowerCase() : !v('cidade') ? 'a cidade' : !f.lgpd ? 'a autorização de contato' : '';
    if (falta) { err.textContent = 'Preencha ' + falta + '.'; return; }
    if (v('site')) return pedidoOk(p);
    bt.disabled = true; bt.textContent = 'Enviando…'; err.textContent = '';
    const { error } = await SB.from('pedidos_cadastro').insert({ perfil, nome: v('nome'), email: v('email').toLowerCase(), telefone: v('telefone'), empresa: v('empresa'), documento: v('documento'), cidade: v('cidade'), mensagem: v('mensagem') });
    if (error) { bt.disabled = false; bt.textContent = 'Enviar pedido de acesso'; err.textContent = 'Não foi possível enviar agora. Tente de novo em instantes.'; return; }
    pedidoOk(p, v('nome'));
  };
}
function pedidoOk(p, nome = '') {
  $('#sfc').innerHTML = `<div class="s-feito"><div class="s-feito-ico">${ic('check')}</div><h2>Pedido enviado${nome ? ', ' + h(nome.split(' ')[0]) : ''}!</h2>
    <p>Recebemos o seu pedido de acesso como <b>${p.nome.toLowerCase()}</b>. Assim que for aprovado, você recebe o e-mail e a senha para entrar.</p>
    <div class="s-feito-acts"><a class="s-btn s-btn-cor" href="#/">Voltar ao site</a><a class="s-btn s-btn-ghost" href="#/entrar">Ir para a entrada</a></div></div>`;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ---------- pedidos de cadastro (só o admin, a partir do HUB) ---------- */
async function contaPedidos() {
  const { count } = await SB.from('pedidos_cadastro').select('id', { count: 'exact', head: true }).eq('status', 'novo');
  return count || 0;
}
async function telaPedidos() {
  document.title = 'Pedidos de cadastro | IMOV365';
  app.innerHTML = `<div class="gate dots" style="align-items:flex-start"><div class="gate-box ped-box">
    <a href="#/hub" class="s-voltar">${ic('back')} Voltar ao HUB</a>
    <div class="kicker">Administração</div><h1>Pedidos de cadastro</h1>
    <div class="mchips" id="pf" style="margin-bottom:14px"><button class="mchip on" data-f="novo">Novos</button><button class="mchip" data-f="aprovado">Aprovados</button><button class="mchip" data-f="recusado">Recusados</button></div>
    <div id="pl"><div class="empty">Carregando…</div></div></div></div>`;
  let filtro = 'novo', lista = [];
  const desenha = () => {
    const xs = lista.filter(x => x.status === filtro);
    $('#pl').innerHTML = xs.length ? xs.map(x => `<div class="ped">
      <div class="ped-top"><span class="ped-perfil p-${x.perfil}">${(SITE_PERFIS[x.perfil] || {}).nome || x.perfil}</span><small>${new Date(x.criado).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}</small></div>
      <b class="ped-nome">${h(x.nome)}</b>
      <div class="ped-dados">${h(x.email)} · ${h(x.telefone)}${x.cidade ? ' · ' + h(x.cidade) : ''}${x.empresa ? '<br>' + h(x.empresa) : ''}${x.documento ? ' · ' + (SITE_PERFIS[x.perfil] || {}).doc + ' ' + h(x.documento) : ''}</div>
      ${x.mensagem ? `<p class="ped-msg">${h(x.mensagem)}</p>` : ''}
      ${x.status === 'novo' ? `<div class="ped-acts"><button class="btn sm" data-ap="${x.id}">${ic('check')} Aprovar e criar acesso</button><button class="btn ghost sm" data-wa="${x.id}">WhatsApp</button><button class="btn ghost sm" data-rc="${x.id}">Recusar</button></div>` : ''}
    </div>`).join('') : `<div class="empty">Nenhum pedido ${filtro === 'novo' ? 'novo' : filtro}.</div>`;
    const acha = id => lista.find(x => String(x.id) === id);
    const zap = (x, txt) => window.open('https://wa.me/' + (x.telefone.replace(/\D/g, '').length <= 11 ? '55' : '') + x.telefone.replace(/\D/g, '') + '?text=' + encodeURIComponent(txt), '_blank', 'noopener');
    $$('[data-wa]', app).forEach(b => b.onclick = () => { const x = acha(b.dataset.wa); zap(x, 'Olá, ' + x.nome.split(' ')[0] + '! Recebemos o seu pedido de acesso ao IMOV365.'); });
    $$('[data-rc]', app).forEach(b => b.onclick = async () => {
      const x = acha(b.dataset.rc); if (!confirm('Recusar o pedido de ' + x.nome + '?')) return;
      const { error } = await SB.from('pedidos_cadastro').update({ status: 'recusado' }).eq('id', x.id);
      if (error) return toast('Não foi possível recusar: ' + error.message);
      x.status = 'recusado'; toast('Pedido recusado'); desenha();
    });
    $$('[data-ap]', app).forEach(b => b.onclick = () => {
      const x = acha(b.dataset.ap), sp = SITE_PERFIS[x.perfil];
      const senha = 'Imv-' + Math.random().toString(36).slice(2, 8) + Math.random().toString(36).slice(2, 4).toUpperCase();
      formModal('Criar acesso · ' + sp.nome, [
        { k: 'nome', l: 'Nome completo', req: true, v: x.nome }, { k: 'email', l: 'E-mail de acesso', t: 'email', req: true, v: x.email },
        { k: 'telefone', l: 'Telefone / WhatsApp', v: x.telefone, half: true }, { k: 'creci', l: sp.doc, v: x.documento, half: true },
        { k: 'imobiliaria', l: sp.empresa.replace(' (se tiver)', ''), v: x.empresa },
        { k: 'senha', l: 'Senha inicial (passe para a pessoa)', req: true, v: senha }
      ], vals => {
        (async () => {
          const { error } = await SB.functions.invoke('admin-usuarios', { body: { acao: 'criar', perfil: x.perfil, ...vals } });
          let msg = error && error.message;
          if (error && error.context && error.context.json) { try { msg = (await error.context.json()).erro || msg; } catch (z) { } }
          if (msg) return toast(msg);
          await SB.from('pedidos_cadastro').update({ status: 'aprovado' }).eq('id', x.id);
          x.status = 'aprovado'; desenha();
          try { await carrega(); } catch (z) { }
          modal('Acesso criado', `<p style="margin:0 0 8px">Acesso de <b>${h(vals.nome)}</b> criado como ${sp.nome.toLowerCase()}.</p><p class="muted" style="margin:0">E-mail: ${h(vals.email)}<br>Senha: ${h(vals.senha)}</p>`, [
            { t: 'Enviar pelo WhatsApp', fn: () => zap(x, 'Olá, ' + vals.nome.split(' ')[0] + '! Seu acesso ao IMOV365 foi aprovado.\n\nEntre em https://imov365.com.br/#/entrar\nE-mail: ' + vals.email + '\nSenha: ' + vals.senha) },
            { t: 'Fechar', cls: 'ghost', fn: closeModal }]);
        })();
      });
    });
  };
  $$('#pf .mchip', app).forEach(c => c.onclick = () => { filtro = c.dataset.f; $$('#pf .mchip', app).forEach(z => z.classList.toggle('on', z === c)); desenha(); });
  const { data, error } = await SB.from('pedidos_cadastro').select('*').order('criado', { ascending: false });
  if (error) { $('#pl').innerHTML = `<div class="empty">Não foi possível carregar: ${h(error.message)}</div>`; return; }
  lista = data || []; desenha();
}
