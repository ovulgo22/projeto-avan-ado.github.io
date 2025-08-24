const startBtn = document.getElementById('startBtn');
const puzzleSection = document.getElementById('puzzleSection');
const homeSection = document.getElementById('homeSection');
const logsSection = document.getElementById('logsSection');
const cluesList = document.getElementById('cluesList');
const logsList = document.getElementById('logsList');
const puzzleText = document.getElementById('puzzleText');
const choicesContainer = document.getElementById('choicesContainer');

const homeLink = document.getElementById('homeLink');
const puzzleLink = document.getElementById('puzzleLink');
const logsLink = document.getElementById('logsLink');

let chaosLevel = 0; // aumenta imprevisibilidade

// Navegação
homeLink.addEventListener('click',()=>showSection('home'));
puzzleLink.addEventListener('click',()=>showSection('puzzle'));
logsLink.addEventListener('click',()=>showSection('logs'));

function showSection(section){
    homeSection.classList.add('hidden');
    puzzleSection.classList.add('hidden');
    logsSection.classList.add('hidden');
    if(section==='home') homeSection.classList.remove('hidden');
    if(section==='puzzle') puzzleSection.classList.remove('hidden');
    if(section==='logs') logsSection.classList.remove('hidden');
}

// Iniciar investigação
startBtn.addEventListener('click',()=>{
    homeSection.classList.add('hidden');
    puzzleSection.classList.remove('hidden');
    addLog('Investigação iniciada.');
});

// Escolhas aleatórias
choicesContainer.addEventListener('click', e=>{
    if(e.target.classList.contains('choice')){
        let path = e.target.dataset.path;
        chaosLevel += Math.random(); // cada escolha aumenta o caos
        let outcome = getRandomOutcome(path);
        addClue(outcome.clue);
        addLog(`Escolha: ${path} | Resultado: ${outcome.clue}`);
        puzzleText.textContent = outcome.nextText;
        if(outcome.hiddenChoice) revealHiddenChoice();
    }
});

function getRandomOutcome(path){
    const outcomes = {
        A:[
            {clue:"Diagramas caóticos surgem diante de você.", nextText:"O laboratório revela conexões imprevisíveis."},
            {clue:"Um diário antigo mostra anotações enigmáticas.", nextText:"Você sente padrões surgindo."}
        ],
        B:[
            {clue:"A sombra se move de maneira estranha.", nextText:"Seguindo a sombra, padrões mudam a cada passo."},
            {clue:"Você encontra símbolos em paredes escondidas.", nextText:"O caminho se torna mais imprevisível."}
        ]
    };
    let arr = outcomes[path];
    return arr[Math.floor(Math.random()*arr.length)];
}

function revealHiddenChoice(){
    let btn = document.createElement('button');
    btn.textContent = "Escolher caminho oculto";
    btn.classList.add('choice','clues-glitch');
    btn.dataset.path = 'C';
    choicesContainer.appendChild(btn);
}

// Funções auxiliares
function addClue(text){
    if(cluesList.children[0].textContent==="Nenhuma pista ativa") cluesList.innerHTML="";
    const li = document.createElement('li');
    li.textContent = text;
    li.classList.add('clues-glitch');
    cluesList.appendChild(li);
}

function addLog(text){
    if(logsList.children[0].textContent==="Sem registros ainda.") logsList.innerHTML="";
    const li = document.createElement('li');
    li.textContent = `[${new Date().toLocaleTimeString()}] ${text}`;
    logsList.appendChild(li);
}
