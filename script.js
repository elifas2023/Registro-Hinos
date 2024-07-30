document.addEventListener('DOMContentLoaded', async () => {
    showSection('home');
    await listarHinos();
    await listarLixeira();
});

function showSection(sectionId) {
    const sections = document.querySelectorAll('main > section');
    sections.forEach(section => {
        section.style.display = section.id === sectionId ? 'block' : 'none';
    });
}

async function registrarHino() {
    const nome = document.getElementById('nome').value;
    const data = document.getElementById('data').value;
    const notas = document.getElementById('notas').value.split(',');

    try {
        const response = await fetch('/registrar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nome, data, notas }),
        });

        if (response.ok) {
            alert('Hino registrado com sucesso!');
            await listarHinos();  // Atualizar a lista de hinos
            await listarLixeira(); // Atualizar a lista de lixeira

            // Resetar o formulário
            document.getElementById('registroHinos').reset();
        } else {
            alert('Erro ao registrar o hino.');
        }
    } catch (err) {
        console.error('Erro ao registrar o hino:', err);
    }
}

async function listarHinos() {
    try {
        const response = await fetch('/hinos');
        const hinos = await response.json();
        const lista = document.getElementById('lista-hinos');
        lista.innerHTML = '';  // Limpar a lista antes de atualizar
        hinos.forEach(hino => {
            const item = document.createElement('li');
            item.textContent = `${hino.nome} - ${new Date(hino.data).toLocaleDateString()} - ${hino.notas.join(', ')}`;
            item.innerHTML += ` <button onclick="moverParaLixeira('${hino._id}')">Mover para Lixeira</button>`;
            lista.appendChild(item);
        });
    } catch (err) {
        console.error('Erro ao listar hinos:', err);
    }
}

async function listarLixeira() {
    try {
        const response = await fetch('/hinos/lixeira');
        const hinos = await response.json();
        const lista = document.getElementById('lista-lixeira');
        lista.innerHTML = '';  // Limpar a lista antes de atualizar
        hinos.forEach(hino => {
            const item = document.createElement('li');
            item.textContent = `${hino.nome} - ${new Date(hino.data).toLocaleDateString()} - ${hino.notas.join(', ')}`;
            item.innerHTML += ` <button onclick="restaurarHino('${hino._id}')">Restaurar</button>`;
            item.innerHTML += ` <button onclick="excluirHino('${hino._id}')">Excluir Permanentemente</button>`;
            lista.appendChild(item);
        });
    } catch (err) {
        console.error('Erro ao listar lixeira:', err);
    }
}

async function buscarHinos() {
    const nome = document.getElementById('busca').value;
    try {
        const response = await fetch(`/hinos?nome=${nome}`);
        const hinos = await response.json();
        const lista = document.getElementById('lista-hinos');
        lista.innerHTML = '';  // Limpar a lista antes de atualizar
        hinos.forEach(hino => {
            const item = document.createElement('li');
            item.textContent = `${hino.nome} - ${new Date(hino.data).toLocaleDateString()} - ${hino.notas.join(', ')}`;
            item.innerHTML += ` <button onclick="moverParaLixeira('${hino._id}')">Mover para Lixeira</button>`;
            lista.appendChild(item);
        });
    } catch (err) {
        console.error('Erro ao buscar hinos:', err);
    }
}

async function moverParaLixeira(id) {
    try {
        await fetch(`/hinos/${id}/lixeira`, { method: 'PUT' });
        await listarHinos();  // Atualizar a lista de hinos
        await listarLixeira(); // Atualizar a lista de lixeira
    } catch (err) {
        console.error('Erro ao mover para lixeira:', err);
    }
}

async function restaurarHino(id) {
    try {
        await fetch(`/hinos/${id}/restaurar`, { method: 'PUT' });
        await listarHinos();  // Atualizar a lista de hinos
        await listarLixeira(); // Atualizar a lista de lixeira
    } catch (err) {
        console.error('Erro ao restaurar hino:', err);
    }
}

async function excluirHino(id) {
    try {
        await fetch(`/hinos/${id}`, { method: 'DELETE' });
        await listarHinos();  // Atualizar a lista de hinos
        await listarLixeira(); // Atualizar a lista de lixeira
    } catch (err) {
        console.error('Erro ao excluir hino:', err);
    }
}

