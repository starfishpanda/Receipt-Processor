import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import prettierPlugin from 'eslint-plugin-prettier'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,js}'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.node,
    },
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      'prettier/prettier': [
        'error',
        {
          endOfLine: 'auto',
          singleQuote: true,
          semi: false,
          tabWidth: 2,
          trailingComma: 'es5',
          printWidth: 100,
        },
      ],
    },
  }
)
