import js from '@eslint/js';
import prettierConfig from 'eslint-config-prettier';
import prettier from 'eslint-plugin-prettier';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      'dist',
      'node_modules',
      'public',
      '**/*.config.js',
      '**/*.config.mjs',
      '**/*.config.cjs',
    ],
  },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended, prettierConfig],
    // 적용 파일 패턴
    files: ['**/*.js'], // JavaScript 파일만 대상으로 설정
  },

  {
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
    },
    plugins: {
      prettier: prettier,
    },

    rules: {
      'no-console': 'warn',
      'no-undef': 'off',
      eqeqeq: 'warn',
      'no-invalid-this': 'error',
      'no-return-assign': 'error',
      'no-useless-return': 'error',
      'no-unused-vars': ['warn', { argsIgnorePattern: 'req|res|next' }],
      'no-var': 'error',
      'prefer-const': 'error',
      'prefer-template': 'warn',
      'prettier/prettier': 'error',
      'import/order': [
        'off',
        {
          'newlines-between': 'always', // import 사이에 한 줄 띄우기
          alphabetize: { order: 'asc', caseInsensitive: true },
          groups: ['builtin', 'external', 'internal', ['parent', 'sibling'], 'object', 'type'],
          pathGroups: [
            {
              pattern: 'express',
              group: 'external',
              position: 'before',
            },
            {
              pattern: '@/**',
              group: 'internal',
              position: 'after',
            },
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
        },
      ],
    },
  }
);
