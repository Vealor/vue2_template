module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    'plugin:vue/essential',
    '@vue/airbnb',
    '@vue/typescript/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'import/no-unresolved': 'off',
    'linebreak-style': 0,
    'max-len': ['error', { code: 300 }],
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'prefer-destructuring': 'off',
    semi: ['error', 'never'],
    'template-curly-spacing': ['off'],
    indent: ['error', 2, { ignoredNodes: ['TemplateLiteral'] }],
  },
}
