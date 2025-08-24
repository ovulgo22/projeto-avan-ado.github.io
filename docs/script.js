/* script.js
  - Salve como script.js
  - O jogo possui:
    * salvamento automático em localStorage
    * variáveis ocultas: coragem, medo, sabedoria
    * múltiplos finais + finais secretos (baseados nas stats)
    * mapa simples de decisões (lista)
    * explicações infantis para cada escolha (ligadas a teorias)
*/

/* ---------- Helper Utilities ---------- */
const $ = id => document.getElementById(id);
const LS_KEY = 'theo_labirinto_save_v1';

function saveToStorage(state){
  localStorage.setItem(LS_KEY, JSON.stringify(state));
}
function loadFromStorage(){
  try { return JSON.parse(localStorage.getItem(LS_KEY)); }
  catch(e){ return null; }
}

/* ---------- Game Data: cenas, escolhas e finais ---------- */
/* Cada nó tem:
   id: {
     title, text, explain, choices: [{ text, next, effect:{coragem,medo,sabedoria}, tags:[], hiddenCondition?: fn }]
   }
*/
const scenes = {
  start: {
    title: 'A manhã do menino Theo',
    text: `Theo acorda com três objetos na mesa: um espelho quebrado, um disco de metal e uma fita com o símbolo de uma borboleta.`,
    explain: 'Pequenas coisas no começo podem mudar tudo (Teoria do Caos).',
    choices: [
      { text: 'Pegar o espelho', next: 'mirrorPath', effect:{coragem:0, medo:0, sabedoria:0}, tags:['Simulação','Autorreferência'] },
      { text: 'Pegar o disco', next: 'discPath', effect:{coragem:0, medo:0, sabedoria:0}, tags:['Computação','Muitos-Mundos'] },
      { text: 'Pegar a fita da borboleta', next: 'butterflyPath', effect:{coragem:0, medo:0, sabedoria:0}, tags:['Teoria do Caos','Fractais'] }
    ]
  },

  mirrorPath: {
    title: 'O Espelho que Sussurra',
    text: `Ao olhar, Theo vê outra versão dele que parece saber das escolhas futuras.`,
    explain: 'Perguntas sobre quem controla as escolhas (Teoria da Simulação & Livre-arbítrio).',
    choices: [
      { text: 'Perguntar \"Quem me fez?\"', next: 'whoMade', effect:{coragem:0, medo:0, sabedoria:1}, tags:['Simulação'], twist:true },
      { text: 'Sair pro jardim', next: 'garden', effect:{coragem:1, medo:0, sabedoria:0}, tags:['Teoria do Caos'] }
    ]
  },

  discPath: {
    title: 'O Disco e os Códigos',
    text: `O disco toca canções diferentes, cada uma mudando detalhes do ambiente.`,
    explain: 'Como variar parâmetros cria realidades alternativas (Muitos-Mundos).',
    choices: [
      { text: 'Tocar canção alegre', next: 'happySong', effect:{coragem:1, medo:0, sabedoria:0}, tags:['Teoria do Caos'] },
      { text: 'Tocar canção triste', next: 'sadSong', effect:{coragem:0, medo:1, sabedoria:0}, tags:['Muitos-Mundos'] }
    ]
  },

  butterflyPath: {
    title: 'A Fita da Borboleta',
    text: `A fita mostra uma borboleta. Um pequeno bater de asas faz chover num lugar distante.`,
    explain: 'Efeito Borboleta: pequenos atos criam grandes mudanças.',
    choices: [
      { text: 'Guardar e estudar', next: 'study', effect:{sabedoria:1}, tags:['Fractais','Teoria do Caos'] },
      { text: 'Queimar a fita', next: 'burn', effect:{medo:1}, tags:['Catástrofe'] }
    ]
  },

  /* -- caminhos intermediários -- */
  whoMade: {
    title: 'A Sala dos Observadores',
    text: `O espelho abre e revela telas com registros das escolhas de Theo.`,
    explain: 'Provas de um observador externo -> meta-reflexão.',
    choices: [
      { text: 'Ler registros', next: 'readDoc', effect:{sabedoria:1}, tags:['Autorreferência','Simulação'] },
      { text: 'Quebrar o espelho', next: 'breakMirror', effect:{coragem:1, medo:0}, tags:['Catástrofe'] }
    ]
  },

  garden: {
    title: 'Jardim das Ramificações',
    text: `Cada flor representa um caminho. Theo sente que lembrar de algo pequeno pode mudar sua vida.`,
    explain: 'Memória como condição inicial que muda trajetórias (Caos).',
    choices: [
      { text: 'Seguir a lembrança', next: 'memoryPath', effect:{sabedoria:1}, tags:['Teoria do Caos'] },
      { text: 'Seguir o vento', next: 'windPath', effect:{coragem:0, medo:0}, tags:['Sistemas Dinâmicos'] }
    ]
  },

  happySong: {
    title: 'Cidade Cor de Sol',
    text: `A cidade se ilumina: um inventor começa a construir uma máquina que "lembra o futuro".`,
    explain: 'Tentativas de prever resultam em debates éticos e erros (Retrocausalidade leve).',
    choices: [
      { text: 'Ajudar o inventor', next: 'calibrate', effect:{sabedoria:1, coragem:1}, tags:['Computação','Ética'], twist:true },
      { text: 'Ignorar e seguir', next: 'normalLife', effect:{coragem:0, sabedoria:0}, tags:['Complexidade'] }
    ]
  },

  sadSong: {
    title: 'Noite de Ecos',
    text: `Theo vê múltiplos 'e se...' que tiram o sono dele.`,
    explain: 'Cada alternativa é uma ramificação possível (Muitos-Mundos).',
    choices: [
      { text: 'Aceitar e aprender', next: 'learn', effect:{sabedoria:2}, tags:['Muitos-Mundos'] },
      { text: 'Esconder o disco', next: 'hideDisc', effect:{medo:1}, tags:['Catástrofe'] }
    ]
  },

  study: {
    title: 'Caderno dos Fractais',
    text: `Theo desenha padrões e vê o todo em cada pedacinho.`,
    explain: 'Fractais mostram como padrões simples criam complexidade.',
    choices: [
      { text: 'Desenhar mais', next: 'drawMore', effect:{sabedoria:1}, tags:['Fractais'] },
      { text: 'Compartilhar com amigos', next: 'share', effect:{sabedoria:0, coragem:1}, tags:['Teoria da Informação'] }
    ]
  },

  burn: {
    title: 'Cinzas e Rumores',
    text: `Queimar a fita espalha um rumor que cresce por si só.`,
    explain: 'Apagar informação às vezes cria efeitos inesperados (Catástrofe social).',
    choices: [
      { text: 'Investigar rumores', next: 'rumors', effect:{sabedoria:1}, tags:['Teoria do Caos'] },
      { text: 'Negar e esconder', next: 'deny', effect:{medo:1}, tags:['Psicologia'] }
    ]
  },

  /* -- finais e nós importantes -- */
  readDoc: {
    title: 'Documento do Observador',
    text: `O documento menciona um "JOGADOR". A última linha diz: "Se você leu, você também escolheu".`,
    explain: 'Autorreferência e quebra da 4ª parede (Gödel/Hofstadter em narrativa).',
    choices: [
      { text: 'Aceitar que há um jogador', next: 'metaAccept', effect:{sabedoria:1}, tags:['Autorreferência','Livre-Arbítrio'], twist:true },
      { text: 'Destruir o documento', next: 'destroyDoc', effect:{coragem:1}, tags:['Catástrofe'] }
    ]
  },

  calibrate: {
    title: 'A Máquina do Inventor',
    text: `Calibrar a máquina revela previsões falhas quando aparecem escolhas que não estavam no modelo.`,
    explain: 'Modelos têm limites; catástrofes aparecem quando parâmetros mudam bruscamente.',
    choices: [
      { text: 'Publicar resultados', next: 'endingReveal', effect:{sabedoria:1}, tags:['Ética'] },
      { text: 'Destruir a máquina', next: 'destroyMachine', effect:{coragem:1}, tags:['Caos'] }
    ]
  },

  memoryPath: {
    title: 'A Lembrança que Vale Ouro',
    text: `Uma lembrança leva Theo até um arquivo que prova alguém espionava sua casa.`,
    explain: 'Provas mudam narrativas — encadeamento de causas e efeitos.',
    choices: [
      { text: 'Ler o arquivo', next: 'readSpy', effect:{sabedoria:1}, tags:['Simulação','Determinismo'] }
    ]
  },

  windPath: {
    title: 'O Vento e os Mundos',
    text: `O vento traz palavras sobre "mundos que nascem de escolhas".`,
    explain: 'Muitos-mundos: cada escolha abre outro caminho real.',
    choices: [
      { text: 'Seguir a voz', next: 'followStranger', effect:{coragem:1}, tags:['Muitos-Mundos'] }
    ]
  },

  /* endings (visíveis) */
  normalLife: { title: 'Final A — Vida Simples', text: 'Theo vive com curiosidade tranquila. Nem todo final precisa ser espetacular.', explain:'Complexidade cotidiana', choices:[] },
  learn: { title: 'Final B — O Aprendiz', text: 'Theo aprende a organizar possibilidades e se torna guardião de memórias.', explain:'Teoria da Informação', choices:[] },
  share: { title: 'Final C — Sementes Compartilhadas', text: 'Os desenhos de Theo inspiram outras crianças e surgem novas ideias.', explain:'Complexidade e redes', choices:[] },
  endingReveal: { title: 'Final D — A Revelação', text: 'A verdade sobre previsões provoca mudanças sociais.', explain:'Ética em ciência', choices:[] },
  destroyMachine: { title: 'Final E — Abraçar o Caos', text: 'Sem máquina, a comunidade aprende a viver com incerteza e criatividade.', explain:'Teoria do Caos', choices:[] },
  metaAccept: { title: 'Final F — O Jogo que Olha', text: 'Theo e o jogador percebem que a escolha é também uma relação entre eles.', explain:'Autorreferência e livre-arbítrio', choices:[] },
  readSpy: { title: 'Final G — O Observador', text: 'As evidências mudam tudo: Theo decide agir ou proteger o mundo.', explain:'Simulação / determinismo', choices:[] },
  destroyDoc: { title: 'Final H — Dúvida Persistente', text: 'Sem provas, a dúvida fica — um motor para a ciência.', explain:'Filosofia da ciência', choices:[] },
  rumors: { title: 'Final I — Arquivista', text: 'Theo documenta rumores e transforma boatos em ciência da informação.', explain:'Teoria da Informação', choices:[] },
  deny: { title: 'Final J — Rede de Apoio', text: 'Theo pede ajuda e constrói uma comunidade mais forte.', explain:'Psicologia social', choices:[] },

  /* hidden/secret ending (condições baseadas em stats) handled in code */
};

/* ---------- Game State ---------- */
let state = {
  current: 'start',
  history: [], // {from, choiceText, to}
  stats: { coragem:0, medo:0, sabedoria:0 },
  createdAt: Date.now()
};

/* ---------- DOM references ---------- */
const sceneTitleEl = $('sceneTitle');
const sceneTextEl = $('sceneText');
const choicesEl = $('choices');
const explainBodyEl = $('explainBody');
const statsEl = $('stats');
const progressEl = $('progress');
const mapEl = $('map');
const backBtn = $('backBtn');
const restartBtn = $('restartBtn');
const saveBtn = $('saveBtn');
const loadBtn = $('loadBtn');
const exportBtn = $('exportBtn');
const importBtn = $('importBtn');
const importFile = $('importFile');

/* ---------- Save / Load / Export / Import ---------- */
function autosave(){ saveToStorage(state); /* dica: salva sempre para persistência */ }
function manualSave(){ saveToStorage(state); alert('Progresso salvo localmente.'); }
function manualLoad(){ const s = loadFromStorage(); if(s){ state = s; render(); alert('Progresso carregado.'); } else alert('Nenhum salvamento encontrado.'); }
function exportSave(){ const blob = new Blob([JSON.stringify(state, null, 2)], {type:'application/json'}); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = 'theo_save.json'; a.click(); URL.revokeObjectURL(url); }
function importSaveFile(file){ const reader = new FileReader(); reader.onload = e => { try{ const imported = JSON.parse(e.target.result); state = imported; render(); alert('Importado com sucesso.'); }catch(err){ alert('Arquivo inválido.'); }}; reader.readAsText(file); }

/* ---------- Game Logic ---------- */
function applyEffect(effect){
  if(!effect) return;
  for(const k of Object.keys(state.stats)){
    if(typeof effect[k] === 'number') state.stats[k] += effect[k];
    if(state.stats[k] < 0) state.stats[k] = 0;
  }
}

function pushHistory(from, choiceText, to){
  state.history.push({from, choiceText, to});
  // limitar histórico para evitar memória infinita (opcional)
  if(state.history.length > 200) state.history.shift();
}

function goto(sceneId, fromChoiceText){
  // check scene exists
  if(!scenes[sceneId]) {
    console.warn('Cena inexistente:', sceneId);
    return;
  }
  pushHistory(state.current, fromChoiceText || null, sceneId);
  state.current = sceneId;
  autosave();
  render();
}

/* hidden endings logic: se certas stats >= limiar, forçar final secreto */
function checkHiddenEndings(){
  // exemplo de final secreto: "O Caminhante dos Mundos"
  const s = state.stats;
  // Se coragem >=3 e sabedoria >=4 -> final secreto ManyWorldsUnlocked
  if(s.coragem >= 3 && s.sabedoria >= 4 && !state.history.some(h=>h.to === 'secretManyWorlds')){
    // criar cena final secreto dinamicamente
    scenes.secretManyWorlds = {
      title: 'Final Secreto — Caminhante dos Mundos',
      text: `Theo desbloqueou a compreensão profunda: atravessa mundos e entende que cada escolha é um universo. Esse final aparece porque suas escolhas mostraram coragem e sabedoria altas.`,
      explain: 'Muitos Mundos: cada escolha existe em outro universo. Você desbloqueou o final secreto!',
      choices: []
    };
    goto('secretManyWorlds', 'desbloqueio secreto');
    return true;
  }

  // outro final secreto: "Guardião do Caos" — se medo = 0 e sabedoria >=5
  if(s.medo === 0 && s.sabedoria >= 5 && !state.history.some(h=>h.to === 'secretGuardian')){
    scenes.secretGuardian = {
      title: 'Final Secreto — Guardião do Caos',
      text: `Theo aprendeu a conviver com a incerteza sem medo. Ele ajuda outros a navegar escolhas difíceis.`,
      explain: 'Guardião do Caos: compreender o caos sem medo permite ação responsável.',
      choices: []
    };
    goto('secretGuardian', 'desbloqueio secreto');
    return true;
  }

  return false;
}

/* ---------- Renderização ---------- */
function render(){
  // checar finais secretos antes de mostrar cena comum
  if(checkHiddenEndings()) return;

  const node = scenes[state.current];
  sceneTitleEl.textContent = node.title || '';
  sceneTextEl.innerHTML = node.text.replace(/\n/g, '<br>') || '';

  // choices
  choicesEl.innerHTML = '';
  if(node.choices && node.choices.length > 0){
    node.choices.forEach((c, idx) => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.innerText = c.text;
      btn.onclick = () => {
        // aplicar efeito e ir para o próximo nó
        applyEffect(c.effect || {});
        pushHistory(state.current, c.text, c.next);
        // simular evento caótico raro: 6% chance de evento surpresa se tag Caos estiver presente
        if(c.tags && c.tags.includes('Teoria do Caos') && Math.random() < 0.06){
          // criar nó de evento caótico temporário e redirecionar para ele
          const eventId = 'chaosEvent_' + Date.now();
          scenes[eventId] = {
            title: 'Evento Caótico Inesperado',
            text: 'Uma pequena surpresa muda levemente o caminho... (efeito borboleta).',
            explain: 'Evento raro do efeito borboleta.',
            choices: [{ text: 'Seguir surpresa', next: c.next, effect: { sabedoria:0 } }]
          };
          goto(eventId, c.text + ' (evento)');
        } else {
          goto(c.next, c.text);
        }
      };
      choicesEl.appendChild(btn);
    });
  } else {
    // final — mostrar botão de recomeço e resumo
    const endNote = document.createElement('div');
    endNote.className = 'endnote';
    endNote.innerHTML = `<strong>FIM:</strong> ${node.text}<p class="muted">${node.explain || ''}</p>`;
    choicesEl.appendChild(endNote);

    // dica para o jogador: mostrar que existem finais secretos
    const secretHint = document.createElement('p');
    secretHint.className = 'muted';
    secretHint.textContent = 'Dica: há finais secretos — experimente outras combinações de escolhas e observe suas estatísticas.';
    choicesEl.appendChild(secretHint);
  }

  // explicação simples (explain + tags summary)
  explainBodyEl.innerHTML = '';
  if(node.explain) explainBodyEl.innerHTML += `<p>${node.explain}</p>`;
  if(node.choices && node.choices.length){
    const ul = document.createElement('ul');
    node.choices.forEach(c => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${c.text}</strong> — ${escapeHtml(c.next)} <div class="muted">Efeito: ${formatEffect(c.effect || {})} | Teorias: ${(c.tags||[]).join(', ')}</div>`;
      ul.appendChild(li);
    });
    explainBodyEl.appendChild(ul);
  }

  // atualizar stats e progresso
  statsEl.innerHTML = `Coragem: ${state.stats.coragem} &nbsp;|&nbsp; Medo: ${state.stats.medo} &nbsp;|&nbsp; Sabedoria: ${state.stats.sabedoria}`;
  progressEl.textContent = `Escolhas: ${state.history.length}`;

  // desenhar mapa simples de decisões (lista dos últimos nós)
  mapEl.innerHTML = renderMap();

  // autosave
  autosave();
}

/* util helpers */
function formatEffect(e){
  const parts = [];
  if(e.coragem) parts.push(`coragem ${e.coragem>0?'+':''}${e.coragem}`);
  if(e.medo) parts.push(`medo ${e.medo>0?'+':''}${e.medo}`);
  if(e.sabedoria) parts.push(`sabedoria ${e.sabedoria>0?'+':''}${e.sabedoria}`);
  return parts.join(', ') || '—';
}
function escapeHtml(s){ if(!s) return ''; return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;"}[c])); }

function renderMap(){
  if(state.history.length === 0) return 'Mapa: (ainda sem escolhas)';
  // mostrar últimos 10 passos
  const items = state.history.slice(-10).map((h, i) => {
    return `${state.history.length - (state.history.length - i)} ⇒ ${h.from} → [${h.choiceText}] → ${h.to}`;
  });
  return '<strong>Mapa (últimas escolhas):</strong><br>' + items.join('<br>');
}

/* ---------- Controls ---------- */
backBtn.onclick = () => {
  if(state.history.length === 0) return alert('Sem passos para voltar.');
  // desfazer último
  const last = state.history.pop();
  // não revertemos stats individualmente para simplificar — recarregar estudo: recomputar stats a partir do histórico
  recomputeStatsFromHistory();
  state.current = last.from || 'start';
  render();
};
restartBtn.onclick = () => {
  if(!confirm('Recomeçar perderá o progresso atual. Continuar?')) return;
  state = { current:'start', history:[], stats:{coragem:0, medo:0, sabedoria:0}, createdAt: Date.now() };
  render();
};
saveBtn.onclick = manualSave;
loadBtn.onclick = manualLoad;
exportBtn.onclick = exportSave;
importBtn.onclick = () => importFile.click();
importFile.onchange = (e) => {
  const f = e.target.files[0];
  if(f) importSaveFile(f);
  importFile.value = '';
};

/* recomputar stats com base no histórico (útil para desfazer) */
function recomputeStatsFromHistory(){
  state.stats = { coragem:0, medo:0, sabedoria:0 };
  for(const h of state.history){
    const node = scenes[h.from];
    if(!node) continue;
    // encontrar a escolha que corresponde ao texto
    const choice = (node.choices || []).find(c => c.text === h.choiceText);
    if(choice && choice.effect){
      for(const k of Object.keys(state.stats)){
        if(choice.effect[k]) state.stats[k] += choice.effect[k];
      }
    }
  }
}

/* ---------- Inicialização ---------- */
function init(){
  const saved = loadFromStorage();
  if(saved){
    // perguntar se quer continuar do save
    if(confirm('Salvamento encontrado. Deseja continuar de onde parou?')) {
      state = saved;
    } else {
      // se não, mantemos state inicial
    }
  }
  render();
}

/* iniciar jogo */
init();

/* ---------- Dicas automáticas (para você, criador) ----------
  - Para acrescentar mais profundidade: adicione checks de pré-requisito para opções
    (ex.: só aparece escolha X se coragem >= 2).
  - Para eventos raros: reduza probabilidade do evento_caos para 1% e crie várias variantes.
  - Para salvar múltiplos perfis: use chaves locais diferentes (LS_KEY + profileName).
  - Para árvore visual: gere um SVG com nodes e edges com base em state.history.
  - Para som e acessibilidade: adicione TTS (Text-to-Speech) opcional e alternativa textual grande.
  - Para mobile: verifique toques longos e feedback tátil.
------------------------------------------------------------ */
