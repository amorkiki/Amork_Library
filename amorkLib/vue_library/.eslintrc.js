module.exports = {
  root: true,
  env: {
    node: true
  },
<<<<<<< HEAD
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
=======
  extends: ['plugin:vue/essential', '@vue/standard'],
>>>>>>> user
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
<<<<<<< HEAD
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
=======
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-multi-spaces': 'off',
    'no-trailing-spaces': 'off',
    'eol-last': 'off',
    'space-before-function-paren': 0
>>>>>>> user
  }
}
