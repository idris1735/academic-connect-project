module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:@next/next/recommended',
    'standard',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react', '@next/next', 'jsx-a11y'],
  settings: {
    react: {
      version: '18.2',
    },
    'import/resolver': {
      node: {
        paths: ['src'],
      },
    },
  },
  rules: {
    // React rules
    'react/prop-types': 'error',
    'react/no-unknown-property': 'error',
    'react/react-in-jsx-scope': 'off',
    'react/self-closing-comp': 'error',
    'react/jsx-no-duplicate-props': 'error',
    'react/jsx-key': 'error',
    'react/no-unescaped-entities': 'error',

    // Next.js rules
    '@next/next/no-img-element': 'error',
    '@next/next/no-html-link-for-pages': 'error',

    // Accessibility rules
    'jsx-a11y/alt-text': 'error',
    'jsx-a11y/aria-props': 'error',
    'jsx-a11y/aria-role': 'error',

    // General rules
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-unused-vars': 'error',
    'comma-dangle': ['error', 'always-multiline'],
    semi: ['error', 'never'],
    quotes: ['error', 'single'],
    'space-before-function-paren': [
      'error',
      {
        anonymous: 'always',
        named: 'never',
        asyncArrow: 'always',
      },
    ],
    'object-curly-spacing': ['error', 'always'],
    'array-bracket-spacing': ['error', 'never'],
    'computed-property-spacing': ['error', 'never'],
  },
}
