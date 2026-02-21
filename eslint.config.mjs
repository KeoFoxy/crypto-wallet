// @ts-check
import eslint from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import eslintImport from 'eslint-plugin-import'
import stylistic from '@stylistic/eslint-plugin'

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs', 'node_modules', 'test'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  // eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      '@stylistic': stylistic,
      import: eslintImport,
    },
    settings: {
      'import/resolver': {
        typescript: true,   // Для корректной работы с TypeScript
        node: true,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',

      'no-restricted-imports': [
        'error', {
          name: 'class-validator',
          importNames: ['isBoolean'],
          message: "Please import 'isBoolean' from '@/decorators/boolean.decorator.ts'",
        }
      ],

      // Style rules

      // Отступы
      '@stylistic/indent': ["error", 2],
      // Максимальная длина строки. 
      'max-len': [
        'error',
        {
          'code': 140,
          'ignorePattern': "import \\{?\\s?.*\\s?\\}? from '.*';",
          'ignoreStrings': true,
          'ignoreTemplateLiterals': true,
        },
      ],
      // Разрешенное количество пустых строк
      '@stylistic/no-multiple-empty-lines': [
        'error',
        {
          'max': 2,
          'maxBOF': 0,
          'maxEOF': 0,
        }
      ],
      // Одинарные кавычки
      '@stylistic/quotes': [
        'error',
        'single' // double если нужны двойные
      ],

      // ";" всегда
      '@stylistic/semi': [
        'error',
        'always'
      ],

      // Новая строка в конце файла
      '@stylistic/eol-last': [
        'error',
        'always'
      ],

      // Никаких пустых пробелов в конце строки
      '@stylistic/no-trailing-spaces': [
        'error'
      ],

      // Предотвращение бесполезных вычислений
      'no-constant-binary-expression': "error",

      // Порядок импортов
      'import/order': [
        'error',
        {
          groups: [
            'builtin',    // Встроенные модули (fs, path и т.д.)
            'external',   // Внешние зависимости (react, antd и т.д.)
            'internal',   // Внутренние пути (@/, src/ и т.д.)
            'parent',     // Родительские каталоги (../)
            'sibling',    // Текущий каталог (./)
            'index',      // index файлы
            'object',     // Object imports (редко используется)
            'type',       // TypeScript типы
          ],
          pathGroups: [
            {
              pattern: 'react',
              group: 'external',
              position: 'before',
            },
            {
              pattern: 'react**',
              group: 'external',
              position: 'before',
            },
            {
              pattern: 'src/**',
              group: 'internal',
            },
          ],
          pathGroupsExcludedImportTypes: ['react'],
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],

      // Висящие запятые в импортах
      '@stylistic/comma-dangle': [
        'error',
        {
          arrays: 'always-multiline',
          objects: 'always-multiline',
          imports: 'always-multiline',
          exports: 'always-multiline',
          functions: 'never',
        },
      ],

      // Yoda
      // https://eslint.org/docs/latest/rules/yoda
      'yoda': ["error", "always", { "onlyEquality": true }],
    },
  },
);