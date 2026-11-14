/* IMOV365 · base de demonstração (fica só no navegador, chave cor365_db) */
const FASES = [
  { k: 'cadastro',     n: 'Cadastro',               sla: 2 },
  { k: 'operacional',  n: 'Análise operacional',    sla: 2 },
  { k: 'credito',      n: 'Análise de crédito',     sla: 5 },
  { k: 'engenharia',   n: 'Engenharia',             sla: 7 },
  { k: 'montagem',     n: 'Montagem',               sla: 3 },
  { k: 'conformidade', n: 'Conformidade',           sla: 3 },
  { k: 'agencia',      n: 'Agência',                sla: 5 },
  { k: 'cartorio',     n: 'Cartório',               sla: 15 },
  { k: 'obra',         n: 'Acompanhamento de obra', sla: 90 }
];
const ETAPAS_CRM = ['Novo lead', 'Primeiro contato', 'Simulação', 'Documentação', 'Convertido', 'Perdido'];
const BANCOS = ['Caixa', 'Itaú', 'Bradesco', 'Santander', 'Banco do Brasil', 'Inter'];
const DOCS_PADRAO = ['RG e CPF', 'Comprovante de estado civil', 'Comprovante de residência', 'Comprovante de renda (3 últimos)', 'Extrato do FGTS', 'Declaração de IR', 'Carteira de trabalho', 'Matrícula do imóvel'];
const RESPONSAVEIS = ['Ana Ribeiro', 'Bruno Matos', 'Carla Nunes', 'Diego Prado'];

function seedDB() {
  const d = (n) => { const x = new Date(); x.setDate(x.getDate() + n); return x.toISOString().slice(0, 10); };
  const P = (id, cliente, cpf, tel, banco, mod, valor, fin, renda, fase, diasNaFase, resp, corretor, emp, unidade, docsOk) => {
    const docs = {}; DOCS_PADRAO.forEach((x, i) => docs[x] = i < docsOk);
    return {
      id, cliente, cpf, telefone: tel, banco, modalidade: mod, valorImovel: valor, financiamento: fin, renda,
      fase, entrouFase: d(-diasNaFase), responsavel: resp, corretor, imobiliaria: corretor ? 'Imobiliária Horizonte' : '',
      empreendimento: emp, unidade, docs, criado: d(-diasNaFase - fase * 4 - 2),
      historico: [{ data: d(-diasNaFase - fase * 4 - 2), txt: 'Processo aberto', por: resp }, { data: d(-diasNaFase), txt: 'Entrou na fase ' + FASES[fase].n, por: resp }]
    };
  };
  return {
    versao: 1,
    config: { escritorio: 'IMOV365 Correspondente', cor: '#f07a28' },
    usuarios: [
      { email: 'banco@cor365.com.br', senha: '123456', nome: 'Ana Ribeiro', perfil: 'banco' },
      { email: 'corretor@cor365.com.br', senha: '123456', nome: 'Marcos Lima', perfil: 'imob' },
      { email: 'construtora@cor365.com.br', senha: '123456', nome: 'Paula Torres', perfil: 'const' }
    ],
    processos: [
      P(1001, 'Juliana Costa',     '123.456.789-01', '(67) 99811-2030', 'Caixa',     'MCMV Faixa 2', 240000, 192000, 4800, 0, 1, 'Ana Ribeiro', 'Marcos Lima', 'Residencial Jardim das Águas', 'A-302', 3),
      P(1002, 'Rafael Souza',      '234.567.890-12', '(67) 99702-1144', 'Caixa',     'MCMV Faixa 3', 310000, 248000, 7200, 1, 3, 'Bruno Matos', 'Marcos Lima', 'Residencial Jardim das Águas', 'B-501', 4),
      P(1003, 'Fernanda Alves',    '345.678.901-23', '(67) 99654-7788', 'Itaú',      'SBPE',         520000, 390000, 15000, 2, 2, 'Carla Nunes', '', '', '', 6),
      P(1004, 'Thiago Martins',    '456.789.012-34', '(67) 99133-5522', 'Caixa',     'MCMV Faixa 2', 225000, 180000, 4100, 2, 7, 'Ana Ribeiro', 'Lívia Rocha', 'Residencial Jardim das Águas', 'A-104', 5),
      P(1005, 'Patrícia Mendes',   '567.890.123-45', '(67) 99288-9090', 'Bradesco',  'SBPE',         680000, 476000, 21000, 3, 4, 'Diego Prado', 'Lívia Rocha', '', '', 7),
      P(1006, 'Lucas Ferreira',    '678.901.234-56', '(67) 99341-6677', 'Caixa',     'MCMV Faixa 3', 295000, 236000, 6900, 3, 9, 'Bruno Matos', 'Marcos Lima', 'Vista Parque Residence', 'T1-702', 6),
      P(1007, 'Camila Rodrigues',  '789.012.345-67', '(67) 99477-1212', 'Santander', 'SBPE',         450000, 337500, 13500, 4, 1, 'Carla Nunes', '', '', '', 8),
      P(1008, 'Gabriel Oliveira',  '890.123.456-78', '(67) 99561-3434', 'Caixa',     'MCMV Faixa 2', 232000, 185600, 4500, 5, 2, 'Ana Ribeiro', 'Marcos Lima', 'Residencial Jardim das Águas', 'B-203', 8),
      P(1009, 'Mariana Pereira',   '901.234.567-89', '(67) 99619-4545', 'Caixa',     'Pró-Cotista',  380000, 304000, 9800, 6, 6, 'Diego Prado', 'Lívia Rocha', 'Vista Parque Residence', 'T2-401', 8),
      P(1010, 'Eduardo Lima',      '012.345.678-90', '(67) 99702-5656', 'Inter',     'SBPE',         590000, 413000, 18500, 7, 10, 'Bruno Matos', '', '', '', 8),
      P(1011, 'Aline Barbosa',     '111.222.333-44', '(67) 99833-6767', 'Caixa',     'MCMV Faixa 2', 228000, 182400, 4300, 8, 20, 'Ana Ribeiro', 'Marcos Lima', 'Residencial Jardim das Águas', 'A-201', 8),
      P(1012, 'Rodrigo Cardoso',   '222.333.444-55', '(67) 99944-7878', 'Banco do Brasil', 'SBPE',   410000, 307500, 12100, 1, 1, 'Carla Nunes', 'Lívia Rocha', '', '', 2),
      P(1013, 'Beatriz Nogueira',  '333.444.555-66', '(67) 99155-8989', 'Caixa',     'MCMV Faixa 3', 318000, 254400, 7600, 0, 3, 'Diego Prado', '', 'Vista Parque Residence', 'T1-303', 1)
    ],
    leads: [
      { id: 1, nome: 'Henrique Batista', telefone: '(67) 99210-1010', origem: 'Site', etapa: 0, valor: 260000, criado: d(-1) },
      { id: 2, nome: 'Sabrina Lopes', telefone: '(67) 99320-2020', origem: 'Instagram', etapa: 0, valor: 300000, criado: d(-2) },
      { id: 3, nome: 'Otávio Freitas', telefone: '(67) 99430-3030', origem: 'Indicação de corretor', etapa: 1, valor: 450000, criado: d(-4) },
      { id: 4, nome: 'Renata Castro', telefone: '(67) 99540-4040', origem: 'WhatsApp', etapa: 2, valor: 235000, criado: d(-6) },
      { id: 5, nome: 'Vinícius Pires', telefone: '(67) 99650-5050', origem: 'Site', etapa: 2, valor: 520000, criado: d(-7) },
      { id: 6, nome: 'Larissa Teixeira', telefone: '(67) 99760-6060', origem: 'Feirão', etapa: 3, valor: 280000, criado: d(-9) },
      { id: 7, nome: 'Fábio Moura', telefone: '(67) 99870-7070', origem: 'Indicação de corretor', etapa: 4, valor: 330000, criado: d(-15) },
      { id: 8, nome: 'Daniela Reis', telefone: '(67) 99980-8080', origem: 'Instagram', etapa: 5, valor: 210000, criado: d(-20) }
    ],
    conversas: [
      { id: 1, cliente: 'Juliana Costa', telefone: '(67) 99811-2030', processo: 1001, naoLidas: 2, msgs: [
        { de: 'cli', txt: 'Oi, boa tarde! Mandei os documentos ontem, chegaram?', hora: '14:02' },
        { de: 'eu', txt: 'Boa tarde, Juliana! Chegaram sim, falta só o comprovante de residência.', hora: '14:05' },
        { de: 'cli', txt: 'Vou mandar agora. Pode ser conta de luz?', hora: '14:07' },
        { de: 'cli', txt: 'Está no nome do meu marido.', hora: '14:07' } ] },
      { id: 2, cliente: 'Rafael Souza', telefone: '(67) 99702-1144', processo: 1002, naoLidas: 0, msgs: [
        { de: 'cli', txt: 'Qual o prazo da análise?', hora: '10:15' },
        { de: 'bot', txt: 'A análise de crédito leva em média 5 dias úteis depois da documentação completa.', hora: '10:15' } ] },
      { id: 3, cliente: 'Renata Castro', telefone: '(67) 99540-4040', processo: null, naoLidas: 1, msgs: [
        { de: 'cli', txt: 'Quero simular um financiamento de 235 mil, ganho 5 mil por mês.', hora: '09:40' } ] }
    ],
    imoveis: [
      { id: 1, titulo: 'Casa 3 quartos com suíte', bairro: 'Tiradentes', cidade: 'Campo Grande', valor: 420000, quartos: 3, area: 140, status: 'Disponível' },
      { id: 2, titulo: 'Apartamento 2 quartos', bairro: 'Centro', cidade: 'Campo Grande', valor: 285000, quartos: 2, area: 62, status: 'Disponível' },
      { id: 3, titulo: 'Sobrado em condomínio', bairro: 'Carandá Bosque', cidade: 'Campo Grande', valor: 780000, quartos: 4, area: 210, status: 'Em proposta' },
      { id: 4, titulo: 'Casa térrea MCMV', bairro: 'Nova Lima', cidade: 'Campo Grande', valor: 215000, quartos: 2, area: 52, status: 'Disponível' },
      { id: 5, titulo: 'Apartamento 3 quartos', bairro: 'Jardim dos Estados', cidade: 'Campo Grande', valor: 560000, quartos: 3, area: 96, status: 'Vendido' }
    ],
    propostas: [
      { id: 1, cliente: 'Otávio Freitas', imovel: 'Sobrado em condomínio', valor: 760000, pagamento: 'Financiamento SBPE', status: 'Enviada', data: d(-3), corretor: 'Marcos Lima' },
      { id: 2, cliente: 'Fábio Moura', imovel: 'Vista Parque Residence · T1-505', valor: 328000, pagamento: 'Financiamento MCMV', status: 'Aceita', data: d(-10), corretor: 'Marcos Lima' },
      { id: 3, cliente: 'Daniela Reis', imovel: 'Casa térrea MCMV', valor: 200000, pagamento: 'À vista', status: 'Recusada', data: d(-18), corretor: 'Lívia Rocha' }
    ],
    empreendimentos: [
      mkEmp(1, 'Residencial Jardim das Águas', 'Campo Grande', ['A', 'B'], 6, 4, 210000, d),
      mkEmp(2, 'Vista Parque Residence', 'Campo Grande', ['T1', 'T2'], 8, 4, 290000, d)
    ],
    campanhas: [
      { id: 1, nome: 'Black Friday da casa própria', empreendimento: 1, desconto: 5, inicio: d(-5), fim: d(16), status: 'Ativa' },
      { id: 2, nome: 'Entrada facilitada em 60x', empreendimento: 2, desconto: 0, inicio: d(-30), fim: d(30), status: 'Ativa' },
      { id: 3, nome: 'Feirão de outubro', empreendimento: 1, desconto: 3, inicio: d(-45), fim: d(-14), status: 'Encerrada' }
    ],
    seq: { processo: 1013, lead: 8, conversa: 3, imovel: 5, proposta: 3, campanha: 3 }
  };
}

function mkEmp(id, nome, cidade, torres, andares, porAndar, precoBase, d) {
  const unidades = {};
  let seed = id * 97;
  const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
  torres.forEach(t => {
    for (let a = 1; a <= andares; a++) for (let u = 1; u <= porAndar; u++) {
      const cod = t + '-' + a + '0' + u;
      const r = rnd();
      let st = r < .38 ? 'vendido' : r < .5 ? 'reservado' : r < .54 ? 'bloqueado' : 'disponivel';
      unidades[cod] = { status: st, cliente: st === 'vendido' || st === 'reservado' ? 'Cliente ' + cod : '', corretor: st === 'reservado' ? 'Marcos Lima' : '', ate: st === 'reservado' ? d(2) : '' };
    }
  });
  // amarra as unidades que já têm processo
  ['A-302', 'B-501', 'A-104', 'B-203', 'A-201'].forEach(c => { if (unidades[c] && id === 1) unidades[c] = { status: 'vendido', cliente: '', corretor: '' }; });
  ['T1-702', 'T2-401', 'T1-303', 'T1-505'].forEach(c => { if (unidades[c] && id === 2) unidades[c] = { status: 'vendido', cliente: '', corretor: '' }; });
  return { id, nome, cidade, torres, andares, porAndar, precoBase, entrega: id === 1 ? 'Dez/2027' : 'Jun/2028', unidades };
}
