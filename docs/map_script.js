/* map_script.js atualizado: tooltips, destaque nó atual e responsividade dinâmica */
const svg = document.getElementById('decisionMap');

function updateMap(){
  const width = svg.clientWidth;
  const height = svg.clientHeight;
  svg.innerHTML = '';

  const nodes = [];
  const links = [];

  let baseX = 50;
  let baseY = 100;
  const xSpacing = Math.max(150, width / (state.history.length+1));
  const ySpacing = 150;

  state.history.forEach((h, idx) => {
    const isSecret = h.to.startsWith('secret');
    const isChaos = h.tags && h.tags.includes('Teoria do Caos');
    nodes.push({id:h.to, label:h.to, x:baseX + idx*xSpacing, y:baseY + (idx%2===0?0:ySpacing), secret:isSecret, chaos:isChaos, effect:h.effect || {}, explain:h.explain || '', isCurrent: idx === state.history.length -1});
    if(idx>0){
      links.push({source:state.history[idx-1].to, target:h.to, chaos:isChaos});
    }
  });

  links.forEach((l, idx) => {
    const s = nodes.find(n=>n.id===l.source);
    const t = nodes.find(n=>n.id===l.target);
    const line = document.createElementNS('http://www.w3.org/2000/svg','line');
    line.setAttribute('x1', s.x);
    line.setAttribute('y1', s.y);
    line.setAttribute('x2', s.x);
    line.setAttribute('y2', s.y);
    line.setAttribute('class','link');
    if(l.chaos) line.setAttribute('stroke','#f87171');
    svg.appendChild(line);

    const animationDuration = 600;
    setTimeout(()=>{
      line.setAttribute('x2', t.x);
      line.setAttribute('y2', t.y);
    }, idx * animationDuration / 2);
  });

  nodes.forEach(n => {
    const circle = document.createElementNS('http://www.w3.org/2000/svg','circle');
    circle.setAttribute('cx', n.x);
    circle.setAttribute('cy', n.y);
    circle.setAttribute('r', n.isCurrent ? (n.secret ? 30 : 25) : (n.secret ? 25 : 20));
    let className = n.secret ? 'node node-secret' : 'node';
    if(n.chaos) className += ' node-chaos';
    if(n.isCurrent) className += ' node-current';
    circle.setAttribute('class', className);
    svg.appendChild(circle);

    const text = document.createElementNS('http://www.w3.org/2000/svg','text');
    text.setAttribute('x', n.x);
    text.setAttribute('y', n.y+5);
    text.setAttribute('class','node-text');
    text.textContent = n.label;
    svg.appendChild(text);

    const tooltip = document.createElementNS('http://www.w3.org/2000/svg','title');
    tooltip.textContent = `Efeito: ${JSON.stringify(n.effect)}\nExplicação: ${n.explain}`;
    circle.appendChild(tooltip);
  });
}

window.addEventListener('resize', updateMap);