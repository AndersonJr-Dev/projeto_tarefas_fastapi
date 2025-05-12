# Projeto de Gerenciamento de Tarefas

Este é um projeto simples de gerenciamento de tarefas desenvolvido com **FastAPI** no backend e uma interface web no frontend.

## Funcionalidades

- **Criar Tarefa**: Adicione novas tarefas com título e descrição.
- **Listar Tarefas**: Visualize todas as tarefas cadastradas.
- **Editar Tarefa**: Atualize o título, descrição ou status de uma tarefa.
- **Deletar Tarefa**: Remova tarefas indesejadas.

## Tecnologias Utilizadas

### Backend
- **FastAPI**: Framework para construção de APIs rápidas e eficientes.
- **Pydantic**: Validação e modelagem de dados.
- **UUID**: Identificação única para cada tarefa.

### Frontend
- **HTML/CSS/JavaScript**: Interface simples e responsiva.

## Como Executar o Projeto

### Pré-requisitos
- Python 3.10 ou superior
- Node.js (opcional, para desenvolvimento avançado no frontend)

### Passos para o Backend
1. Clone o repositório:
   ```bash
   git clone https://github.com/AndersonJr-Dev/projeto_tarefas_fastapi.git
   cd projeto_tarefas_fastapi/backend
   ```
2. Instale as dependências:
   ```bash
   pip install fastapi uvicorn
   ```
3. Inicie o servidor:
   ```bash
   uvicorn main:app --reload
   ```
4. Acesse a documentação interativa da API em: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### Passos para o Frontend
1. Navegue até a pasta do frontend:
   ```bash
   cd ../frontend
   ```
2. Abra o arquivo `index.html` no navegador.

## Estrutura do Projeto
```
projeto_tarefas_fastapi/
├── backend/
│   ├── main.py
├── frontend/
│   ├── index.html
│   ├── style.css
│   ├── script.js
```

## Contribuição
Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.

## Licença
Este projeto está licenciado sob a [MIT License](LICENSE).
