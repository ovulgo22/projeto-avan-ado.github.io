document.getElementById('myButton').addEventListener('click', function() {
    const message = document.getElementById('message');
    message.textContent = 'Você clicou no botão! Aqui estão algumas sugestões para você melhorar suas habilidades!';
    message.classList.remove('hidden');
    message.classList.add('show');
});
