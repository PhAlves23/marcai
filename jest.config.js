// Testes unitários (*.spec.ts, em src) e de integração (*.e2e-spec.ts, em test) rodam juntos.
module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.(spec|e2e-spec)\\.ts$',
  transform: { '^.+\\.ts$': 'ts-jest' },
  testEnvironment: 'node',
  setupFiles: ['<rootDir>/test/env.js'],
  globalSetup: '<rootDir>/test/global-setup.js',
  maxWorkers: 1,
};
