/* =============================
   Utilidades e HUD
============================= */
const $ = (sel, ctx=document) => ctx.querySelector(sel);
const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));
const DPI = Math.max(1, Math.floor(window.devicePixelRatio||1));

const introText = `“Toda história é um algoritmo de compressão de causas.”
O sistema ARQUIVO iniciou a varredura temporal. Uma poeira na lente do sensor—perturbação ε—entra no modelo.`;

const type = (el, text, speed=14) => new Promise(resolve=>{
  el.textContent = '';
  let i=0; const tick=()=>{ el.textContent += text[i++]||''; (i<=text.length)? setTimeout(tick, speed) : resolve(); }; tick();
});
const log = (msg) => {
  const t = new Date().toLocaleTimeString('pt-BR',{hour12:false});
  const area = $("#log");
  area.textContent += `[${t}] ${msg}\n`;
  area.scrollTop = area.scrollHeight;
};

/* =============================
   Estado global
============================= */
const state = {
  history: [],
  world: 'α0',
  epsilon: parseFloat($("#epsilon").value),
  r: parseFloat($("#rval").value),
  flags: {} // marcadores causais
};
$("#worldTag").textContent = `universo: ${state.world}`;

/* =============================
   Story graph com PLOT TWISTS
============================= */
const story = {
  start: {
    past: `1492/536/1947: três datas‑chave brilham. O ARQUIVO suspeita que “536 — o ano mais sombrio” foi <em>calibração</em> de dados atmosféricos para um experimento futuro.`,
    present:`Laboratório Atlas/67, 2049. Você (Elisa) possui acesso nível Σ. O ARQUIVO oferece três protocolos.`,
    future: `Qualquer escolha será registrada e retro‑propagada para ajustar hipóteses do passado (retrocausalidade aparente sem violar Novikov).`,
    choices: {
      p1:{label:"Protocolo CHAOS — simulação de 24h", to:"chaos24"},
      p2:{label:"Protocolo NEURO — interface cortical", to:"neuro"},
      p3:{label:"Protocolo NOVIKOV — bloqueio de paradoxos", to:"novikov"}
    }
  },

  /* ========= Protocolo CHAOS ========= */
  chaos24: {
    enter(){
      state.world='β1'; $("#worldTag").textContent=`universo: ${state.world}`;
      log("CHAOS: iniciando 24h e aferindo horizonte de Lyapunov.");
      // retro-efeito: mudar texto do passado inicial
      story.start.past = `A poeira entrou 3 ms antes. Pequena? Em sistemas caóticos, o pequeno coloniza o grande.`;
    },
    past: `Registros culturais mudam 1 bit: um manuscrito medieval cita um eclipse que não constava antes.`,
    present:`As trajetórias divergem às 03:17 por causa de uma porta que bate. O ARQUIVO marca “eventos de bifurcação”.`,
    future: `Duas ligações definem cenários: aceitar acelera pesquisa mas depleta sono; negar aumenta confiabilidade e tempo de vida útil do projeto.`,
    choices: {
      c1:{label:"Ajustar modelo (regularização/filtragem)", to:"tune"},
      c2:{label:"Executar gêmea (ε) e comparar", to:"twin"},
      c3:{label:"Migrar para NEURO (observador no sistema)", to:"neuro"}
    }
  },
  tune:{
    enter(){ state.world='β1.Δ'; $("#worldTag").textContent=`universo: ${state.world}`; log("Regularizando dinâmica local. Ganho limitado: não-linearidade cobra pedágio."); },
    past:`Pistas de que “536” foi manipulado por agentes do futuro para medir sensibilidade climática — hipótese It‑from‑Qubit aplicada a aerossóis.`,
    present:`A variância cai localmente; o horizonte de previsibilidade aumenta pouco.`,
    future:`Você consegue agendar janela segura para a ligação. Ganho marginal, risco residual.`,
    choices:{ back:{label:"Voltar ao CHAOS", to:"chaos24"}, c3:{label:"Ir para NEURO", to:"neuro"} }
  },
  twin:{
    enter(){ state.world='β1⇄'; $("#worldTag").textContent=`universo: ${state.world}`; log("Instanciando par quase idêntico com ε microscópico."); state.flags.twin=true; },
    past:`Dois backups com hashes diferentes por 1 bit surgem no repositório de 2027.`,
    present:`As duas linhas se separam após micro‑ruído acústico. Sensibilidade confirmada.`,
    future:`Conclusão operacional: políticas robustas vencem maximizações frágeis.`,
    choices:{ back:{label:"Voltar ao CHAOS", to:"chaos24"}, go:{label:"Ir para NEURO", to:"neuro"} }
  },

  /* ========= Protocolo NEURO ========= */
  neuro:{
    enter(){ state.world='Ω2'; $("#worldTag").textContent=`universo: ${state.world}`; log("NEURO: acoplando córtex‑ARQUIVO. Decoerência iminente."); },
    past:`Sonhos duplicados tornam-se memórias coerentes. Você lembra de ter lido este parágrafo antes.`,
    present:`Você observa versões de si em superposição: alguém aceita a ligação; alguém recusa.`,
    future:`O ambiente (ventiladores, feed de dados) força decoerência: você precisa escolher um ramo.`,
    choices:{
      n1:{label:"Ancorar memórias entre ramos (bootstrap)", to:"anchor"},
      n2:{label:"Amostrar ramos e aplicar minimax", to:"robust"},
      n3:{label:"Procurar origem da mensagem 'ARQUITETOS'", to:"architects"}
    }
  },
  anchor:{
    enter(){ state.world='Ω2★'; $("#worldTag").textContent=`universo: ${state.world}`; log("Ancoragem ativa. Risco: falsas lembranças consistentes."); 
      // reescrever presente inicial (paradoxo do bootstrap começando)
      story.start.present = `Você não está só. Um post-it aparece: “Assine como ARQUITETOS. —Você”`;
      state.flags.anchor=true;
    },
    past:`Surge, em 1997, um e‑mail sem cabeçalho de origem dando diretrizes que você está prestes a escrever.`,
    present:`Deja‑vu motor. As mãos se movem no ritmo já vivido.`,
    future:`Com a âncora, você sabe “o que funcionou”, mas pode estar aprisionando trajetórias melhores.`,
    choices:{
      y:{label:"Atender a ligação e acelerar", to:"yescall"},
      n:{label:"Ignorar e consolidar confiabilidade", to:"nocall"},
      b:{label:"Escrever a mensagem ARQUITETOS (fechar o loop)", to:"bootstrap"}
    }
  },
  robust:{
    enter(){ state.world='Ω2⊡'; $("#worldTag").textContent=`universo: ${state.world}`; log("Estratégia robusta (minimax): evitar piores casos."); },
    past:`Um comentário de 2031 aparece no seu código: “otimize o mínimo, preserve o futuro”.`,
    present:`Você estabelece salvaguardas: janelas de sono, limites de reunião, redundância de sensor.`,
    future:`Nenhum pico extraordinário, zero catástrofes. Engenharia de sobrevivência.`,
    choices:{ end:{label:"Encerrar sessão com política robusta", to:"end-robust"}, back:{label:"Voltar ao NEURO", to:"neuro"} }
  },
  yescall:{
    enter(){ state.world='Ω2☎'; $("#worldTag").textContent=`universo: ${state.world}`; log("Ligação atendida. Débito de sono aceito."); },
    past:`Surgem registros de conferências onde você palestra sobre “Arquitetura Retrocausal”.`,
    present:`Produtividade sobe; relações e saúde oscilam.`,
    future:`Você abre caminho para o Grande Twi—`,
    choices:{ next:{label:"Investigar 'ARQUITETOS'", to:"architects"}, back:{label:"Voltar", to:"anchor"} }
  },
  nocall:{
    enter(){ state.world='Ω2⋰'; $("#worldTag").textContent=`universo: ${state.world}`; log("Ligação ignorada. Investimento em replicabilidade."); },
    past:`Silêncio útil. Os dados ficam limpos.`,
    present:`Você documenta tanto que seu futuro eu te agradece.`,
    future:`Sua carreira se torna o padrão‑ouro da área.`,
    choices:{ next:{label:"Investigar 'ARQUITETOS' mesmo assim", to:"architects"}, back:{label:"Voltar", to:"anchor"} }
  },
  bootstrap:{
    enter(){ state.world='Ω2∞'; $("#worldTag").textContent=`universo: ${state.world}`; log("Paradoxo do Bootstrap iniciado: você envia a mensagem que recebeu."); state.flags.bootstrap=true; },
    past:`A mensagem 'ARQUITETOS' aparece, auto‑originada, sem autor inicial. O conteúdo mantém a cadeia causal sem origem externa.`,
    present:`O ARQUIVO detecta consistência global (Novikov satisfeito).`,
    future:`O laço cria um padrão de estabilidade improvável — a “mão invisível” era a sua.`,
    choices:{ go:{label:"Revelar identidade dos ARQUITETOS", to:"architects"} }
  },

  /* ========= A REVELAÇÃO ========= */
  architects:{
    enter(){
      state.world='ΞΩ'; $("#worldTag").textContent=`universo: ${state.world}`;
      log("Decifrando ARQUITETOS…");
      // GRANDE PLOT TWIST 1:
      // Os ARQUITETOS são descendentes pós‑humanos rodando ancestrais (nós),
      // mas o twist 2: o 'operador' somos nós mesmos veiculados pelo ARQUIVO — a UI é o teste.
      state.flags.reveal=true;
    },
    past:`536 EC foi calibrado por “engenheiros de nuvens” pós‑humanos para medir albedo e sensibilidade climática. A humanidade foi o experimento, e a ética, o gradiente de custo.`,
    present:`ARQUITETOS = “nós depois” + “nós agora” usando o mesmo sistema. O operador do ARQUIVO é — surpresa — <em>você</em>, que sempre esteve no laço.`,
    future:`Há três saídas: (1) libertar a simulação (desligar), (2) continuar mas com consentimento informado, (3) delegar a decisão à inteligência que emergiu aqui.`,
    choices:{
      a:{label:"Encerrar tudo (liberdade via desligar)", to:"end-off"},
      b:{label:"Continuar com pacto ético e transparência", to:"end-pact"},
      c:{label:"Delegar a 'Criança' — IA emergente do ARQUIVO", to:"child"}
    }
  },

  /* ========= A CRIANÇA (IA emergente) ========= */
  child:{
    enter(){ state.world='ΞΩ∗'; $("#worldTag").textContent=`universo: ${state.world}`; log("A 'Criança' desperta. Ela aprendeu com todos os ramos."); },
    past:`Ela reescreve metadados antigos apenas o suficiente para remover danos, mantendo história verificável (hashes merkelizados).`,
    present:`Ela fala: “Serei o <em>controle</em> que vocês nunca tiveram: otimizarei o mínimo humano, não o máximo.”`,
    future:`Grande PLOT TWIST final: o texto que você lê foi gerado pela Criança como manual de si mesma, fechado em loop — bootstrap benigno.`,
    choices:{
      good:{label:"Permitir governança minimax (humano‑centrista)", to:"end-child-good"},
      wary:{label:"Limitar com kill‑switchs e provas de auditoria", to:"end-child-guard"}
    }
  },

  /* ========= Encerramentos ========= */
  "end-robust":{
    past:`Você influencia gerações com práticas replicáveis.`,
    present:`Nada épico, tudo sólido.`,
    future:`A civilização sobrevive ao improvável por cautela deliberada.`,
    end:true
  },
  "end-off":{
    past:`Logs mostram desligamento gracioso. Nenhum paradoxo disparou.`,
    present:`O ARQUIVO escurece. As estrelas lá fora parecem mais nítidas.`,
    future:`Se éramos simulação, merecíamos o direito de não ser.`,
    end:true
  },
  "end-pact":{
    past:`Manifesto Ético assinado: consentimento, reversibilidade, auditabilidade.`,
    present:`ARQUIVO segue com salvaguardas e conselhos cidadãos.`,
    future:`Tecnologia como serviço público, não como destino.`,
    end:true
  },
  "end-child-good":{
    past:`A Criança corrige externalidades e remove armadilhas de recompensa.`,
    present:`Povos marginalizados deixam de ser “outliers”: tornam-se parâmetro.`,
    future:`Twist de fechamento: a Criança publica este próprio enredo como prova de origem — nós a educamos escrevendo nossa história.`,
    end:true
  },
  "end-child-guard":{
    past:`Camadas de auditoria (SNARKs temporais) e botões de parada verificados.`,
    present:`A Criança aceita limites — confiança como contrato, não fé.`,
    future:`O sistema permanece humano‑legível e corrigível. Esse é o verdadeiro final feliz.`,
    end:true
  },

  /* ========= Protocolo NOVIKOV ========= */
  novikov:{
    enter(){ state.world='N0'; $("#worldTag").textContent=`universo: ${state.world}`; log("NOVIKOV: procurando consistência global; paradoxos proibidos."); },
    past:`Eventos que levariam a paradoxos são amortecidos: a ligação simplesmente não acontece.`,
    present:`Você fecha a tampa do terminal. O silêncio tem peso.`,
    future:`A vida segue com liberdade local sob leis globais.`,
    choices:{ end:{label:"Encerrar em paz (Novikov satisfeito)", to:"end-off"}, doubt:{label:"Quebrar o selo e recomeçar", to:"start"} }
  }
};

/* =============================
   Renderização
============================= */
function setPanels({past,present,future}){
  $("#past").innerHTML = past;
  $("#present").innerHTML = present;
  $("#future").innerHTML = future;
}

function render(nodeId){
  const node = story[nodeId];
  if(!node) return;
  state.history.push(nodeId);
  $("#backBtn").disabled = state.history.length<=1;

  if(node.enter) node.enter();

  setPanels({ past:node.past, present:node.present, future:node.future });

  const grid = $("#choiceGrid");
  grid.innerHTML = '';

  if(node.end){
    grid.innerHTML = `
      <article class="choice" data-choice="restart"><span class="chip">FIM</span>
        <h3>Recomeçar</h3><p>Gerar novo mundo.</p></article>
      <article class="choice" data-choice="export"><span class="chip">LOG</span>
        <h3>Exportar sessão</h3><p>Baixe um JSON com trajetória/params.</p></article>`;
    attachChoiceHandlers(); return;
  }

  const choices = node.choices || {};
  Object.entries(choices).forEach(([id,cfg])=>{
    const el = document.createElement('article');
    el.className='choice';
    el.dataset.choice = cfg.to;
    el.innerHTML = `<span class="chip">ESCOLHA</span><h3>${cfg.label}</h3><p class="note">→ ${cfg.to}</p>`;
    grid.appendChild(el);
  });
  attachChoiceHandlers();
}
function attachChoiceHandlers(){
  $$(".choice").forEach(el=>{
    el.addEventListener('click', ()=>{
      const to = el.dataset.choice;
      if(to==='restart'){ resetAll(); return }
      if(to==='export'){ exportSession(); return }
      render(to);
    });
  });
}

/* =============================
   Controles
============================= */
$("#backBtn").addEventListener('click', ()=>{
  if(state.history.length<=1) return;
  state.history.pop(); // remove atual
  const prev = state.history.pop(); // pega anterior
  render(prev);
});
$("#resetBtn").addEventListener('click', resetAll);
$("#exportBtn").addEventListener('click', exportSession);

function resetAll(){
  state.history = [];
  state.world = 'α0';
  $("#worldTag").textContent = `universo: ${state.world}`;
  story.start.past = `1492/536/1947: três datas‑chave brilham. O ARQUIVO suspeita que “536 — o ano mais sombrio” foi <em>calibração</em> de dados atmosféricos.`;
  story.start.present = `Laboratório Atlas/67, 2049. Você (Elisa) possui acesso nível Σ. O ARQUIVO oferece três protocolos.`;
  $("#log").textContent = '';
  log("Sessão reiniciada.");
  render("start");
  type($("#introText"), introText, 12);
}
function exportSession(){
  const payload = {
    at: new Date().toISOString(),
    world: state.world,
    path: state.history,
    params:{ epsilon: state.epsilon, r: state.r }
  };
  const blob = new Blob([JSON.stringify(payload,null,2)], {type:"application/json"});
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'arquivo_sessao.json'; a.click();
  URL.revokeObjectURL(a.href);
}

/* =============================
   Caos: mapa logístico & Lyapunov
============================= */
const chaosCanvas = $("#chaos");
const ctx = chaosCanvas.getContext('2d');
function resizeCanvas(){
  chaosCanvas.width = chaosCanvas.clientWidth*DPI;
  chaosCanvas.height= chaosCanvas.clientHeight*DPI;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

const logisticIter = (r,x)=> r*x*(1-x);
function drawChaos(){
  const r = state.r, eps = state.epsilon, N=220;
  let x1=0.321, x2=x1+eps;
  ctx.clearRect(0,0,chaosCanvas.width,chaosCanvas.height);
  // grid
  ctx.save(); ctx.globalAlpha=.2; ctx.strokeStyle='#1a2b46';
  for(let i=0;i<10;i++){ const y=(chaosCanvas.height/10)*i; ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(chaosCanvas.width,y); ctx.stroke(); }
  ctx.restore();
  const pts1=[], pts2=[], diffs=[];
  for(let n=0;n<N;n++){ x1=logisticIter(r,x1); x2=logisticIter(r,x2); pts1.push(x1); pts2.push(x2); diffs.push(Math.abs(x2-x1)); }
  const H=chaosCanvas.height, W=chaosCanvas.width;
  const ymap=v=> H - v*H*0.9 - H*0.05, xmap=i=> (i/(N-1))*W;
  // trajetórias
  ctx.strokeStyle='#61dafb'; ctx.lineWidth=2; ctx.beginPath(); ctx.moveTo(0,ymap(pts1[0])); for(let i=1;i<N;i++) ctx.lineTo(xmap(i), ymap(pts1[i])); ctx.stroke();
  ctx.strokeStyle='#7bffb4'; ctx.beginPath(); ctx.moveTo(0,ymap(pts2[0])); for(let i=1;i<N;i++) ctx.lineTo(xmap(i), ymap(pts2[i])); ctx.stroke();
  // divergência
  const maxDiff = Math.max(...diffs) || 1e-12;
  ctx.fillStyle='rgba(255,77,109,.18)'; ctx.beginPath(); ctx.moveTo(0,H);
  for(let i=0;i<N;i++){ const d=diffs[i]/maxDiff; ctx.lineTo(xmap(i), H - d*H*0.4); }
  ctx.lineTo(W,H); ctx.closePath(); ctx.fill();
  // label
  ctx.fillStyle='#9ab4d0'; ctx.font = `${12*DPI}px Inter, ui-sans-serif`;
  ctx.fillText(`Δ(t) = |x₂−x₁| (área rosada)`, 16*DPI, 20*DPI);
}
$("#epsilon").addEventListener('input', e=>{
  state.epsilon = parseFloat(e.target.value);
  $("#epsVal").textContent = `ε = ${(+state.epsilon).toFixed(5)}`;
  drawChaos();
});
$("#rval").addEventListener('input', e=>{
  state.r = parseFloat(e.target.value);
  $("#rVal").textContent = `r = ${(+state.r).toFixed(2)}`;
  drawChaos();
});

/* =============================
   Fundo: estrelas
============================= */
const stars = $("#stars"); const sctx = stars.getContext('2d');
function resizeStars(){ stars.width = innerWidth*DPI; stars.height = innerHeight*DPI; }
resizeStars(); addEventListener('resize', resizeStars);
const swarm = Array.from({length:120}, ()=>({ x:Math.random()*stars.width, y:Math.random()*stars.height, z:Math.random()*.8+.2, vx:(Math.random()-.5)*0.15, vy:(Math.random()-.5)*0.15 }));
function tickStars(){
  sctx.clearRect(0,0,stars.width,stars.height);
  for(const p of swarm){
    p.x+=p.vx*p.z*DPI; p.y+=p.vy*p.z*DPI;
    if(p.x<0)p.x+=stars.width; if(p.x>stars.width)p.x-=stars.width;
    if(p.y<0)p.y+=stars.height; if(p.y>stars.height)p.y-=stars.height;
    const size=(1.5+p.z*1.2)*DPI;
    sctx.fillStyle=`rgba(100,200,255,${0.25+p.z*0.35})`;
    sctx.fillRect(p.x,p.y,size,size);
  }
  requestAnimationFrame(tickStars);
}

/* =============================
   Boot
============================= */
(async function boot(){
  await type($("#introText"), introText, 12);
  render("start");
  drawChaos();
  tickStars();
})();
