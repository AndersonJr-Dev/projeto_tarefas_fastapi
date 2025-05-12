document.addEventListener('DOMContentLoaded', () => {
    const apiUrlBase = 'http://127.0.0.1:8000/tarefas/';
    const formNovaTarefa = document.getElementById('form-nova-tarefa');
    const listaTarefasUl = document.getElementById('lista-tarefas');
    const loadingMessage = document.getElementById('loading-message');

    const modalEdicao = document.getElementById('modal-edicao');
    const closeModalButton = document.getElementById('close-modal-button');
    const formEditarTarefa = document.getElementById('form-editar-tarefa');
    const editarIdInput = document.getElementById('editar-id');
    const editarTituloInput = document.getElementById('editar-titulo');
    const editarDescricaoInput = document.getElementById('editar-descricao');
    const editarStatusSelect = document.getElementById('editar-status');

    function exibirMensagemErro(elemento, mensagem) {
        elemento.innerHTML = `<p style="color: red; text-align: center;">${mensagem}</p>`;
    }

    async function carregarTarefas() {
        try {
            loadingMessage.style.display = 'block';
            listaTarefasUl.innerHTML = '';

            const response = await fetch(apiUrlBase);
            if (!response.ok) {
                throw new Error(`Erro HTTP ao buscar tarefas: ${response.status}`);
            }
            const tarefas = await response.json();
            loadingMessage.style.display = 'none';

            if (tarefas.length === 0) {
                listaTarefasUl.innerHTML = '<p style="text-align: center;">Nenhuma tarefa cadastrada ainda.</p>';
                return;
            }

            tarefas.forEach(tarefa => {
                const li = document.createElement('li');
                li.className = `status-${tarefa.status.replace(' ', '-')}`;
                li.dataset.id = tarefa.id;

                li.innerHTML = `
                    <h3>${tarefa.titulo}</h3>
                    <p>${tarefa.descricao || 'Sem descrição'}</p>
                    <small>ID: ${tarefa.id}</small>
                    <small>Status: ${tarefa.status}</small>
                    <div class="task-actions">
                        <button class="action-button edit-btn" data-id="${tarefa.id}">Editar</button>
                        <button class="action-button delete-btn" data-id="${tarefa.id}">Deletar</button>
                    </div>
                `;
                listaTarefasUl.appendChild(li);

                li.querySelector('.edit-btn').addEventListener('click', () => abrirModalParaEdicao(tarefa));
                li.querySelector('.delete-btn').addEventListener('click', () => confirmarDelecao(tarefa.id, tarefa.titulo));
            });

        } catch (error) {
            loadingMessage.style.display = 'none';
            exibirMensagemErro(listaTarefasUl, `Erro ao carregar tarefas: ${error.message}`);
            console.error('Erro ao carregar tarefas:', error);
        }
    }

    async function adicionarNovaTarefa(event) {
        event.preventDefault();
        const tituloInput = document.getElementById('titulo-nova');
        const descricaoInput = document.getElementById('descricao-nova');

        const novaTarefa = {
            titulo: tituloInput.value,
            descricao: descricaoInput.value || null
        };

        try {
            const response = await fetch(apiUrlBase, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(novaTarefa),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.detail || `Erro HTTP ao adicionar: ${response.status}`);
            }
            formNovaTarefa.reset();
            carregarTarefas();
        } catch (error) {
            alert(`Erro ao adicionar tarefa: ${error.message}`);
            console.error('Erro ao adicionar tarefa:', error);
        }
    }

    function confirmarDelecao(tarefaId, tarefaTitulo) {
        if (confirm(`Tem certeza que deseja deletar a tarefa "${tarefaTitulo}"?`)) {
            deletarTarefa(tarefaId);
        }
    }

    async function deletarTarefa(tarefaId) {
        try {
            const response = await fetch(`${apiUrlBase}${tarefaId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.detail || `Erro HTTP ao deletar: ${response.status}`);
            }
            carregarTarefas();
        } catch (error) {
            alert(`Erro ao deletar tarefa: ${error.message}`);
            console.error('Erro ao deletar tarefa:', error);
        }
    }

    function abrirModalParaEdicao(tarefa) {
        editarIdInput.value = tarefa.id;
        editarTituloInput.value = tarefa.titulo;
        editarDescricaoInput.value = tarefa.descricao || '';
        editarStatusSelect.value = tarefa.status;
        modalEdicao.style.display = 'block';
    }

    function fecharModalEdicao() {
        modalEdicao.style.display = 'none';
        formEditarTarefa.reset();
    }

    async function salvarEdicaoTarefa(event) {
        event.preventDefault();
        const id = editarIdInput.value;
        const dadosAtualizados = {
            titulo: editarTituloInput.value,
            descricao: editarDescricaoInput.value || null,
            status: editarStatusSelect.value
        };

        try {
            const response = await fetch(`${apiUrlBase}${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dadosAtualizados),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.detail || `Erro HTTP ao atualizar: ${response.status}`);
            }
            fecharModalEdicao();
            carregarTarefas();
        } catch (error) {
            alert(`Erro ao salvar alterações: ${error.message}`);
            console.error('Erro ao salvar alterações:', error);
        }
    }

    if (formNovaTarefa) {
        formNovaTarefa.addEventListener('submit', adicionarNovaTarefa);
    }

    if (closeModalButton) {
        closeModalButton.addEventListener('click', fecharModalEdicao);
    }

    window.addEventListener('click', (event) => {
        if (event.target === modalEdicao) {
            fecharModalEdicao();
        }
    });

    if (formEditarTarefa) {
        formEditarTarefa.addEventListener('submit', salvarEdicaoTarefa);
    }

    carregarTarefas();
});
