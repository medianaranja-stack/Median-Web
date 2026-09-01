// Configuracion minima con un objetivo concreto: `no-undef`.
//
// Dos veces se rompio el sitio en produccion por un identificador usado sin
// importar (ProductCard con urlServida, banners.js con isSupabaseEnabled).
// Vite no lo detecta: no resuelve identificadores libres al compilar, asi que
// el build pasa y explota recien en el navegador. Esto lo atrapa antes.
import js from '@eslint/js'
import globals from 'globals'

export default [
  { ignores: ['dist/**', 'node_modules/**'] },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.es2021 },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    rules: {
      // Lo que importa: usar algo que no existe.
      'no-undef': 'error',
      // Solo aviso: un import sin usar no rompe nada en produccion.
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-empty': ['error', { allowEmptyCatch: true }],
    },
  },
]
