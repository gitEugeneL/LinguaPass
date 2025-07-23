import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';

export default tseslint.config(
  { ignores: ['dist'] },
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
      import: importPlugin
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/no-explicit-any': 'off',
      semi: ['error', 'always'],
      'comma-dangle': ['error', 'never'],
      quotes: ['error', 'single'],
      'jsx-quotes': ['error', 'prefer-single'],
      'no-unused-vars': [
        'warn',
        {
          vars: 'all',
          args: 'after-used',
          ignoreRestSiblings: true
        }
      ],

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
              message: "'Only import through index.ts from global src folders"
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
