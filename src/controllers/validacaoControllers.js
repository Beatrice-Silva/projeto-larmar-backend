// Controller de servicos: agora com validação, erros padronizados e a categoria junto.
import { prisma } from '../lib/prisma.js';
import { ErroApi } from '../erros.js';
import { validarServico, lerId } from '../validacao/servicoValidacao.js';

// traz os dados da categoria junto com cada item
const incluir = { categoria: true };

async function buscarOuFalhar(id) {
  const servico = await prisma.servico.findUnique({ where: { id }, include: incluir });
  if (!servico) {
    throw new ErroApi(404, 'Serviço não encontrado');
  }
  return servico;
}

async function conferirCategoria(categoriaId) {
  if (categoriaId === undefined) return;
  const categoria = await prisma.categoria.findUnique({ where: { id: categoriaId } });
  if (!categoria) {
    throw new ErroApi(400, 'Dados inválidos', ['categoriaId não existe']);
  }
}

// GET /api/servicos
export async function listar(req, res) {
  const servicos = await prisma.servico.findMany({ include: incluir, orderBy: { id: 'asc' } });
  res.json(servicos);
}

// GET /api/servicos/:id
export async function buscarPorId(req, res) {
  const servico = await buscarOuFalhar(lerId(req.params.id));
  res.json(servico);
}

// POST /api/servicos
export async function criar(req, res) {
  const dados = req.body ?? {};
  validarServico(dados);
  await conferirCategoria(dados.categoriaId);
  const novo = await prisma.servico.create({
    data: {
      nome: dados.nome,
      duracaoMin: dados.duracaoMin,
      preco: dados.preco,
      status: dados.status,
      categoriaId: dados.categoriaId,
    },
    include: incluir,
  });
  res.status(201).json(novo);
}

// PUT /api/servicos/:id
export async function atualizar(req, res) {
  const id = lerId(req.params.id);
  await buscarOuFalhar(id);
  const dados = req.body ?? {};
  validarServico(dados, true);
  await conferirCategoria(dados.categoriaId);
  const atualizado = await prisma.servico.update({
    where: { id },
    data: {
      nome: dados.nome,
      duracaoMin: dados.duracaoMin,
      preco: dados.preco,
      status: dados.status,
      categoriaId: dados.categoriaId,
    },
    include: incluir,
  });
  res.json(atualizado);
}

// DELETE /api/servicos/:id
export async function excluir(req, res) {
  const id = lerId(req.params.id);
  await buscarOuFalhar(id);
  await prisma.servico.delete({ where: { id } });
  res.status(204).send();
}

// Extensão opcional · PATCH /api/servicos/:id/status
const STATUS_VALIDOS = ['ativo', 'inativo'];

export async function alterarStatus(req, res) {
  const id = lerId(req.params.id);
  await buscarOuFalhar(id);
  const { status } = req.body ?? {};
  if (!STATUS_VALIDOS.includes(status)) {
    throw new ErroApi(400, 'Dados inválidos', [`status precisa ser: ${STATUS_VALIDOS.join(', ')}`]);
  }
  const atualizado = await prisma.servico.update({ where: { id }, data: { status }, include: incluir });
  res.json(atualizado);
}