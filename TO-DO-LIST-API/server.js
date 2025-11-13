require('dotenv').config();
const express = require('express');
const { testConnection } = require('./src/config/database');
const Tarefa = require('./src/models/tarefa');

// Importar rotas
const tarefasRoutes = require('./src/routes/tarefasRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

// Rota principal
app.get('/', (req, res) => {
  res.json({ 
    mensagem: 'API To-Do List funcionando!',
    endpoints: {
      'POST /tarefas': 'Criar nova tarefa',
      'GET /tarefas': 'Listar todas as tarefas',
      'GET /tarefas/:id': 'Buscar tarefa por ID',
      'PUT /tarefas/:id': 'Atualizar tarefa completamente',
      'PATCH /tarefas/:id/status': 'Atualizar apenas o status',
      'DELETE /tarefas/:id': 'Deletar tarefa'
    }
  });
});

// Usar rotas das tarefas
app.use('/tarefas', tarefasRoutes);


app.use((req, res) => {
  res.status(404).json({ erro: 'Endpoint não encontrado!' });
});

// Inicializar servidor
async function iniciarServidor() {
  try {

    await testConnection();

    await Tarefa.sync();
    console.log('Tabelas sincronizadas!');

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
      console.log(`Acesse: http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

iniciarServidor();