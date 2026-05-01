import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

export default tseslint.config(
  { ignores: ['dist/**', 'dev-dist/**', '**/*.js', '**/*.d.ts', '**/workbox-*.js'] },

  ...tseslint.configs.recommended,

  prettierConfig,

  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parser: tseslint.parser
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      import: importPlugin,
      prettier: prettierPlugin
    },
    rules: {
      ...reactHooks.configs.recommended.rules,

      'react-hooks/exhaustive-deps': 'off',

      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      '@typescript-eslint/no-explicit-any': 'off',

      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          ignoreRestSiblings: true
        }
      ],

      'prettier/prettier': 'error',

      'import/no-restricted-paths': [
        'error',
        {
          zones: [
            {
              target: './src/**/*',
              from: './src/*/**/*',
              except: ['./*/index.ts', './*'],
              message: 'Only import through index.ts from global src folders'
            }
          ]
        }
      ],

      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: [
                '../**/*.module.{css,pcss,scss,sass}',
                '../**/*.props.ts',
                '../**/*.types.ts',
                '../**/*.impl.tsx',
                '../**/*.tsx',
                '../**/*.store.ts'
              ],
              message: 'Only import through index.ts from global src folders'
            }
          ]
        }
      ],

      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true }
        }
      ]
    }
  }
);
