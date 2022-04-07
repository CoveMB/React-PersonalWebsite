module.exports = {
  parserOptions: {
    ecmaVersion: 10,
    parser: "babel-eslint",
  },
  extends: ["airbnb", "airbnb/hooks"],
  plugins: ["eslint-plugin", "react"],
  settings: {
    "import/extensions": [".jsx", ".js"],
    "import/resolver": {
      node: {
        extensions: [".js", ".jsx"],
        moduleDirectory: ["node_modules", "./src"],
      },
    },
  },
  rules: {
    "react/prop-types": "off",
    "no-extraneous-dependencies": "off",
    "max-len": [
      "warn",
      {
        code: 100,
        ignoreStrings: true,
        ignoreUrls: true,
        ignoreComments: true,
        ignoreTemplateLiterals: true,
      },
    ],

    // "import/no-unresolved": "off",
    "import/prefer-default-export": "off",
    "no-console": "off",
    quotes: ["warn", "double"],

    // Spacing
    "react/jsx-max-props-per-line": 1,
    "react/jsx-closing-bracket-location": [1, "tag-aligned"],
    "space-in-parens": "warn",
    "keyword-spacing": "warn",
    "no-trailing-spaces": "warn",
    "space-before-blocks": "warn",
    "key-spacing": [
      "warn",
      {
        align: {},
        multiLine: {},
      },
    ],
    "no-multi-spaces": [
      "warn",
      {
        exceptions: {
          VariableDeclarator: true,
        },
        ignoreEOLComments: true,
      },
    ],

    // Padding
    "lines-around-comment": [
      "warn",
      {
        beforeBlockComment: true,
        beforeLineComment: true,
      },
    ],
    "eol-last": "warn",
    "no-empty": "warn",
    "no-multiple-empty-lines": "warn",
    "newline-per-chained-call": [
      "warn",
      {
        ignoreChainWithDepth: 2,
      },
    ],
    "padded-blocks": ["off", "always"],
    "padding-line-between-statements": [
      "warn",
      {
        blankLine: "always",
        prev: "*",
        next: ["cjs-export", "return", "if"],
      },
      {
        blankLine: "always",
        prev: ["const", "let", "var", "import"],
        next: "*",
      },
      {
        blankLine: "any",
        prev: ["const", "let", "var", "import"],
        next: ["const", "let", "var", "import"],
      },
    ],

    // Semi and coma rules
    "comma-dangle": "off",
    "no-extra-semi": "warn",
    "semi-style": ["error", "last"],
    semi: [
      "warn",
      "always",
      {
        omitLastInOneLineBlock: false,
      },
    ],
    indent: ["warn", 2, { SwitchCase: 1 }],
    "comma-spacing": [
      "warn",
      {
        before: false,
        after: true,
      },
    ],

    // Object rules
    "object-curly-spacing": ["warn", "always"],
    "object-curly-newline": [
      "off",
      {
        ObjectPattern: {
          multiline: true,
          minProperties: 4,
          consistent: true,
        },
        ObjectExpression: {
          multiline: true,
          minProperties: 2,
          consistent: true,
        },
        ImportDeclaration: "never",
        ExportDeclaration: "never",
      },
    ],
    "operator-linebreak": "off",

    // Array rules
    "array-bracket-spacing": ["warn", "always"],
    "array-bracket-newline": [
      "warn",
      {
        multiline: true,
        minItems: 3,
      },
    ],
    "array-element-newline": [
      "warn",
      {
        multiline: true,
        minItems: 3,
      },
    ],
    "jsx-a11y/label-has-associated-control": "off",
    "react/jsx-one-expression-per-line": "off",
  },
  env: {
    node: true,
    browser: true,
  },
};
