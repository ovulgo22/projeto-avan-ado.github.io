// Representação de qubits como vetores complexos [α, β] -> α|0> + β|1>
let qubits = [
    [1, 0], // Qubit 0 inicia em |0>
    [1, 0]  // Qubit 1 inicia em |0>
];

// Função para aplicar Hadamard
function applyHadamard(index) {
    let [a, b] = qubits[index];
    let newA = (a + b) / Math.sqrt(2);
    let newB = (a - b) / Math.sqrt(2);
    qubits[index] = [newA, newB];
    updateQubitDisplay(index);
}

// Função para aplicar Pauli-X (NOT quântico)
function applyPauliX(index) {
    let [a, b] = qubits[index];
    qubits[index] = [b, a];
    updateQubitDisplay(index);
}

// Função para aplicar CNOT (controle Q0, alvo Q1)
function applyCNOT(control, target) {
    let [cA, cB] = qubits[control];
    let [tA, tB] = qubits[target];

    // Simulação simples: troca apenas amplitudes de base
    if (Math.random() < Math.pow(Math.abs(cB), 2)) {
        qubits[target] = [tB, tA];
    }
    updateQubitDisplay(target);
}

// Função para medir todos os qubits
function measureAll() {
    let results = [];
    qubits.forEach(([a, b], i) => {
        let prob0 = Math.pow(Math.abs(a), 2);
        let measured = Math.random() < prob0 ? 0 : 1;
        results.push(`Qubit ${i}: ${measured}`);
        // Após medição, qubit colapsa
        qubits[i] = measured === 0 ? [1, 0] : [0, 1];
        updateQubitDisplay(i);
    });
    document.getElementById('resultsOutput').innerText = results.join('\n');
}

// Atualiza visual do qubit na tela
function updateQubitDisplay(index) {
    const [a, b] = qubits[index];
    const el = document.getElementById(`qubit${index}`);
    el.innerText = `Qubit ${index}: α=${a.toFixed(2)}, β=${b.toFixed(2)}`;
}
