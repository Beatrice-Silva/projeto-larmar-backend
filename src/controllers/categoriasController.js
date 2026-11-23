// Controller de categorias (tabela de apoio): listar e cadastrar.
import { prisma } from '../lib/prisma.js';
import { ErroApi } from '../erros.js';

// GET /api/categorias
export async function listar(req, res) {
  const categorias = await prisma.categoria.findMany({ orderBy: { nome: 'asc' } });
  res.json(categorias);
}

// POST /api/categorias
export async function criar(req, res) {
  const { nome } = req.body ?? {};
  if (typeof nome !== 'string' || nome.trim() === '') {
    throw new ErroApi(400, 'Dados inválidos', ['nome é obrigatório e precisa ser um texto']);
  }
  // nome repetido: o banco recusa (@unique) e o app.js responde 409
  const nova = await prisma.categoria.create({ data: { nome: nome.trim() } });
  res.status(201).json(nova);
}