module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  // 使用 TypeScript parser，讓 ESLint 能解析 TS
  parser: "@typescript-eslint/parser",
  parserOptions: {
    // 支援 JSX 語法（React）
    ecmaFeatures: {
      jsx: true,
    },
    // 使用最新 JS 語法
    ecmaVersion: "latest",
    // 使用 ES Module
    sourceType: "module",
  },
  overrides: [
    {
      files: ["**/*.ts", "**/*.tsx"],
      parserOptions: {
        project: "./tsconfig.json",
      },
    },
    {
      files: ["src/store/hooks.ts"],
      rules: {
        "@typescript-eslint/no-restricted-imports": "off",
      },
    },
  ],
  // React 版本自動偵測（避免版本錯誤）
  settings: {
    react: {
      version: "detect",
    },
  },
  // 規則擴展（預設 rule 集）
  extends: [
    "airbnb",
    "airbnb-typescript",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended",
  ],
  // 啟用 ESLint plugins
  plugins: ["react", "react-hooks", "@typescript-eslint"],
  // 自訂規則
  rules: {
    "linebreak-style": ["error", "windows"],
    quotes: "off",
    "@typescript-eslint/quotes": ["error", "double"],
    "react/jsx-filename-extension": [
      "warn",
      { extensions: [".js", ".jsx", ".tsx"] },
    ],
    "jsx-a11y/no-static-element-interactions": "off",
    "jsx-a11y/click-events-have-key-events": "off",
    "no-param-reassign": [
      "error",
      {
        props: true,
        ignorePropertyModificationsFor: ["state"],
      },
    ],
    "react/prop-types": "off",
    // React 17+ 不需要 import React
    "react/react-in-jsx-scope": "off",
    "no-console": ["warn", { allow: ["error"] }],
    "import/prefer-default-export": "off",
    "@typescript-eslint/no-unused-vars": ["warn"],
    "no-restricted-imports": "off",
    "@typescript-eslint/no-restricted-imports": [
      "warn",
      {
        paths: [
          {
            name: "react-redux",
            importNames: ["useDispatch", "useSelector"],
            message:
              "Use typed hooks `useAppDispatch` and `useAppSelector` instead.",
          },
        ],
      },
    ],
  },
};
