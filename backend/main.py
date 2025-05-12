from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Literal
import uuid

# Modelos Pydantic para validação e estruturação dos dados
class TarefaBase(BaseModel):
    titulo: str = Field(..., min_length=1, example="Comprar leite")  # Validação de título obrigatório e exemplo
    descricao: Optional[str] = Field(None, example="Desnatado, na padaria da esquina")  # Descrição opcional com exemplo

class TarefaCriar(TarefaBase):
    pass  # Modelo para criação de tarefas, herda de TarefaBase

class TarefaAtualizar(BaseModel):
    titulo: Optional[str] = Field(None, min_length=1, example="Comprar pão integral")  # Título opcional para atualização
    descricao: Optional[str] = Field(None, example="Na padaria nova")  # Descrição opcional para atualização
    status: Optional[Literal["pendente", "em andamento", "concluída"]] = Field(None, example="em andamento")  # Status opcional

class Tarefa(TarefaBase):
    id: uuid.UUID  # Identificador único da tarefa
    status: Literal["pendente", "em andamento", "concluída"] = "pendente"  # Status padrão como pendente

    class Config:
        from_attributes = True  # Configuração para permitir conversão de atributos

# Instância do aplicativo FastAPI com metadados
app = FastAPI(
    title="API de Gerenciamento de Tarefas",
    description="Uma API simples para criar, listar, atualizar e deletar tarefas.",
    version="0.1.0",
)

# Configuração de CORS para permitir requisições de origens específicas
origins = [
    "http://localhost",
    "http://127.0.0.1",
    "null",
    "http://127.0.0.1:5500",  # Live Server
    "http://localhost:5500"  # Live Server
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Base de dados em memória para armazenar tarefas temporariamente
db_tarefas: List[Tarefa] = []

# Endpoint para criar uma nova tarefa
@app.post("/tarefas/", response_model=Tarefa, status_code=status.HTTP_201_CREATED)
async def criar_tarefa(tarefa_data: TarefaCriar):
    nova_tarefa = Tarefa(
        id=uuid.uuid4(),
        titulo=tarefa_data.titulo,
        descricao=tarefa_data.descricao,
        status="pendente"
    )
    db_tarefas.append(nova_tarefa)
    return nova_tarefa

# Endpoint para listar todas as tarefas
@app.get("/tarefas/", response_model=List[Tarefa])
async def listar_tarefas():
    return db_tarefas

# Endpoint para obter uma tarefa específica pelo ID
@app.get("/tarefas/{tarefa_id}", response_model=Tarefa)
async def obter_tarefa(tarefa_id: uuid.UUID):
    for tarefa in db_tarefas:
        if tarefa.id == tarefa_id:
            return tarefa
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tarefa não encontrada")

# Endpoint para atualizar uma tarefa existente
@app.put("/tarefas/{tarefa_id}", response_model=Tarefa)
async def atualizar_tarefa_endpoint(tarefa_id: uuid.UUID, tarefa_data: TarefaAtualizar):
    for index, tarefa_existente in enumerate(db_tarefas):
        if tarefa_existente.id == tarefa_id:
            update_data_dict = tarefa_existente.model_dump()  # Converte a tarefa existente para dicionário
            novos_dados = tarefa_data.model_dump(exclude_unset=True)  # Exclui campos não definidos
            update_data_dict.update(novos_dados)  # Atualiza os dados existentes com os novos
            tarefa_atualizada = Tarefa(**update_data_dict)  # Recria o objeto Tarefa atualizado
            db_tarefas[index] = tarefa_atualizada
            return tarefa_atualizada
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tarefa não encontrada")

# Endpoint para deletar uma tarefa pelo ID
@app.delete("/tarefas/{tarefa_id}", status_code=status.HTTP_204_NO_CONTENT)
async def deletar_tarefa(tarefa_id: uuid.UUID):
    for index, tarefa in enumerate(db_tarefas):
        if tarefa.id == tarefa_id:
            db_tarefas.pop(index)
            return
    raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tarefa não encontrada")

# Endpoint raiz para verificar o funcionamento da API
@app.get("/")
async def ler_raiz():
    return {"mensagem": "Bem-vindo à API de Tarefas!"}