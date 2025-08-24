// Scroll suave ao clicar nos links da sidebar
document.querySelectorAll('.sidebar a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const targetId = link.getAttribute('href').substring(1);
    document.getElementById(targetId).scrollIntoView({ behavior: 'smooth' });
  });
});

// Filtro por categoria
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
const searchInput = document.getElementById('search');
searchInput.addEventListener('input', () => {
  const query = searchInput.value.toLowerCase();
  topics.forEach(topic => {
    const title = topic.querySelector('h2').innerText.toLowerCase();
    topic.style.display = title.includes(query) ? 'block' : 'none';
  });
});

// Acordeão animado
document.querySelectorAll('.topic h2').forEach(title => {
  title.addEventListener('click', () => {
    title.parentElement.classList.toggle('active');
  });
});

// Fade-in ao rolar a página
function handleScrollAnimation() {
  topics.forEach(topic => {
    const top = topic.getBoundingClientRect().top;
    if(top < window.innerHeight - 100){
      topic.classList.add('visible');
    }
  });
}

window.addEventListener('scroll', handleScrollAnimation);
window.addEventListener('load', handleScrollAnimation);
