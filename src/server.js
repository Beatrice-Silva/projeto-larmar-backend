// server.js: liga a API na porta do .env (ou 3333).
import app from './app.js';

const PORT = process.env.PORT || 3333;

app.listen(PORT, () => {
  console.log(`API rodando em http://localhost:${PORT}`);
});
