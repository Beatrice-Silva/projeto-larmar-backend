# API · Agendamento de Serviços

API REST de um sistema de agendamento de serviços (salão, barbearia, estética): cadastro de serviços organizados por categoria.
Projeto do Curso Técnico em Desenvolvimento de Sistemas · SENAI · versão do encontro 4 (CRUD gravando no banco).

## Tecnologias

- Node.js 24 + Express 5
- PostgreSQL no Neon
- Prisma 7

## Como rodar

```bash
npm install
cp .env.example .env
```

No `.env`, troque o `DATABASE_URL` pelo endereço do seu banco no Neon (botão **Connect**, com **Connection pooling** desligado). Depois:

```bash
npx prisma generate
npx prisma migrate dev --name criar-tabelas
npm run seed
npm run dev
```

A API responde em `http://localhost:3333`. No codespace, use o endereço da porta 3333 (aba PORTS, visibilidade Public).

## Banco de dados

| Tabela | Campos |
|---|---|
| usuarios | id, nome, email (único), senhaHash, criadoEm (usada no login, encontro 6) |
| categorias | id, nome (único). Ex.: Cabelo, Barba, Estética |
| servicos | id, nome, duracaoMin (padrão 30), preco (padrão 0), status (padrão ativo), categoriaId, criadoEm |

Relacionamento 1:N: cada categoria tem vários serviços (`servicos.categoriaId` aponta para `categorias.id`).

## Rotas

| Método | Rota | Descrição | Status |
|---|---|---|---|
| GET | /health | status da API | 200 |
| GET | /api/servicos | lista os serviços | 200 |
| GET | /api/servicos/:id | detalhe de um serviço | 200, 400, 404 |
| POST | /api/servicos | cadastra um serviço | 201, 400 |
| PUT | /api/servicos/:id | altera um serviço | 200, 400, 404 |
| DELETE | /api/servicos/:id | exclui um serviço | 204, 400, 404 |

Exemplo de cadastro:

```json
{
  "nome": "Sobrancelha",
  "duracaoMin": 15,
  "preco": 20.0,
  "categoriaId": 1
}
```

`nome` e `categoriaId` são obrigatórios; `categoriaId` precisa existir em `categorias`.
O preço volta no JSON como texto (ex.: `"20"`), que é como o Prisma envia o tipo Decimal.

## Testes

Coleção do Postman em `postman/`: importe, ajuste a variável `baseUrl` e rode com **Run** (9 requisições; pode rodar várias vezes seguidas).

## Estrutura

```
prisma/
  schema.prisma       tabelas
  seed.js             categorias de exemplo (npm run seed)
prisma.config.ts      onde estão o schema e a conexão
src/
  lib/prisma.js       conexão com o banco
  controllers/        regras de cada rota
  routes/             endereços e métodos
  app.js, server.js
postman/              coleção de testes
```

O arquivo `.env` (com a senha do banco) não vai para o GitHub.
