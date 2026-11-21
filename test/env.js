// Os testes usam um banco separado (marcai_test) no mesmo Postgres do docker compose.
process.env.PRISMA_HIDE_UPDATE_MESSAGE = '1';
const porta = process.env.DB_PORT || '5432';
process.env.DATABASE_URL =
  process.env.TEST_DATABASE_URL || `postgresql://marcai:marcai@localhost:${porta}/marcai_test`;
