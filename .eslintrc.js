module.exports = {
  env: {
    node: true,
    es2021: true,
    jest: true,
  },
  extends: ['eslint:recommended', 'plugin:node/recommended', 'plugin:jest/recommended', 'prettier'],
  plugins: ['node', 'jest', 'prettier'],
  rules: {
    'prettier/prettier': 'error',
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'no-console': 'off',
    'node/no-unpublished-require': [
      'error',
      {
        allowModules: ['supertest'],
      },
    ],
  },
};
