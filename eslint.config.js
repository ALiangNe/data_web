import vueParser from 'vue-eslint-parser'
import tsParser from '@typescript-eslint/parser'
import vue from 'eslint-plugin-vue'
import ts from '@typescript-eslint/eslint-plugin'

export default [
  {
    files: ['src/**/*.vue', 'src/**/*.js', 'src/**/*.ts'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 2021,
        sourceType: 'module'
      }
    },
    plugins: {
      vue,
      '@typescript-eslint': ts
    },
    rules: {
      // Vue
      'vue/multi-word-component-names': 'off',
      'vue/no-v-html': 'off',
      // TypeScript
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      // Style
      'indent': ['error', 4, { 'SwitchCase': 1 }],
      'quotes': ['error', 'single'],
      'semi': ['error', 'never'],
      'comma-dangle': ['error', 'always-multiline'],
      'key-spacing': ['error', { beforeColon: false, afterColon: true }],
      'object-curly-spacing': ['error', 'always'],
      'array-bracket-spacing': ['error', 'never'],
      'space-before-function-paren': ['error', { named: 'never', asyncArrow: 'always' }],
      'arrow-spacing': ['error', { before: true, after: true }],
      'space-infix-ops': 'error',
      'eol-last': ['error', 'always'],
      'no-trailing-spaces': 'error',
      'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1 }],
      'no-unused-vars': 'off',
      'no-mixed-spaces-and-tabs': 'error'
    }
  }
]
