// app.js: monta a aplicação Express (middlewares e rotas).
import express from 'express';
//import usuariosRoutes from './routes/usuariosRoutes.js';
import categoriasRoutes from './routes/categoriasRoutes.js';
import servicosRoutes from './routes/servicosRoutes.js';
import { ErroApi } from './erros.js';

const app = express();

// Permite receber JSON no corpo das requisições (req.body)
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok', horario: new Date().toISOString() });
});

app.get('/', (req, res) => {
  res.json({
    nome: 'API Agendamento de Serviços',
    versao: '0.3.0',
    rotas: [
      'GET /api/servicos',
      'GET /api/servicos/:id',
      'POST /api/servicos',
      'PUT /api/servicos/:id',
      'DELETE /api/servicos/:id',
    ],
  });
});

// Todas as rotas de serviços começam com /api/servicos
app.use('/api/servicos', servicosRoutes);

// Qualquer rota que não existe: 404 em JSON
app.use((req, res) => {
  res.status(404).json({ erro: `Rota ${req.method} ${req.path} não existe` });
});

// Tratamento de erros: sempre o último app.use. Todo erro sai no mesmo formato.
app.use((erro, req, res, next) => {
  // erros que nós mesmos lançamos com throw new ErroApi(...)
  if (erro instanceof ErroApi) {
    return res.status(erro.status).json({ erro: erro.message, detalhes: erro.detalhes });
  }
  // JSON mal escrito no corpo da requisição
  if (erro.type === 'entity.parse.failed') {
    return res.status(400).json({ erro: 'JSON inválido no corpo da requisição' });
  }
  // Prisma: valor repetido num campo único (@unique)
  if (erro.code === 'P2002') {
    return res.status(409).json({ erro: 'Já existe um registro com esse valor' });
  }
  console.error(erro);
  res.status(500).json({ erro: 'Erro interno no servidor' });
});
export default app;
