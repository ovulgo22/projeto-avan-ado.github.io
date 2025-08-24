// Scroll suave
document.querySelectorAll('.sidebar a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.getElementById(link.getAttribute('href').substring(1));
    target.scrollIntoView({ behavior: 'smooth' });
  });
});

// Filtros por categoria
const buttons = document.querySelectorAll('.filters button');
const topics = document.querySelectorAll('.topic');
buttons.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;
    topics.forEach(topic => {
      topic.style.display = (filter === 'all' || topic.dataset.category === filter) ? 'block' : 'none';
    });
  });
});

// Busca dinâmica
document.getElementById('search').addEventListener('input', e => {
  const query = e.target.value.toLowerCase();
  topics.forEach(t => {
    t.style.display = t.querySelector('h2').innerText.toLowerCase().includes(query) ? 'block' : 'none';
  });
});

// Acordeão animado
document.querySelectorAll('.topic h2').forEach(h => {
  h.addEventListener('click', () => {
    h.parentElement.classList.toggle('active');
  });
});

// Fade-in ao rolar
function handleScroll() {
  topics.forEach(t => {
    if (t.getBoundingClientRect().top < window.innerHeight - 100) t.classList.add('visible');
  });
}
window.addEventListener('scroll', handleScroll);
window.addEventListener('load', handleScroll);

// Dark mode toggle
const body = document.body;
document.getElementById('dark-mode-toggle').addEventListener('click', () => {
  body.classList.toggle('dark-mode');
});

// Explorar aleatório
document.getElementById('random-topic').addEventListener('click', () => {
  const visibleTopics = [...topics].filter(t => t.style.display !== 'none');
  if (visibleTopics.length === 0) return;
  const random = visibleTopics[Math.floor(Math.random() * visibleTopics.length)];
  random.scrollIntoView({ behavior: 'smooth' });
});

// Canvas de partículas para Mecânica Quântica
function quantumAnimation() {
  const canvas = document.querySelector('.quantum-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const particles = [];
  for (let i = 0; i < 50; i++) {
    particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, dx: (Math.random() - 0.5) * 1.5, dy: (Math.random() - 0.5) * 1.5 });
  }
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = 'blue';
      ctx.fill();
      p.x += p.dx; p.y += p.dy;
      if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    });
    requestAnimationFrame(animate);
  }
  animate();
}
quantumAnimation();

// Canvas de expansão do universo para Big Bang
function universeAnimation() {
  const canvas = document.querySelector('.universe-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const stars = [];
  for (let i = 0; i < 100; i++) {
    stars.push({ x: canvas.width / 2, y: canvas.height / 2, angle: Math.random() * Math.PI * 2, dist: Math.random() * canvas.width / 2, speed: 0.01 + Math.random() * 0.02 });
  }
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach(s => {
      s.dist += s.speed;
      const x = canvas.width / 2 + Math.cos(s.angle) * s.dist;
      const y = canvas.height / 2 + Math.sin(s.angle) * s.dist;
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fillStyle = 'yellow';
      ctx.fill();
    });
    requestAnimationFrame(animate);
  }
  animate();
}
universeAnimation();
