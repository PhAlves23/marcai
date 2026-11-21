// Antes da suíte: aplica as migrations no banco de teste (cria o banco se ainda não existir).
// Não apaga nada: cada teste limpa as próprias tabelas com TRUNCATE (veja test/helpers.ts).
const { execFileSync } = require('node:child_process');

module.exports = async () => {
  require('./env.js');
  execFileSync(process.execPath, [require.resolve('prisma/build/index.js'), 'migrate', 'deploy'], {
    env: process.env,
    stdio: 'inherit',
  });
};
