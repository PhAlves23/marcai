import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  { ignores: ['dist/', 'coverage/', 'node_modules/', 'src/gen/', '**/*.js', 'eslint.config.mjs'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
);
