module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "prettier"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "plugin:prettier/recommended",
  ],
  // parserOptions: {
  //   ecmaVersion: 2020,
  //   sourceType: "module"
  // },
  // env: {
  //   es6: true
  // }
  rules: {
    // "react/jsx-filename-extension": [
    //   2,
    //   { extensions: [".js", ".jsx", ".ts", ".tsx"] }
    // ],
  },
};
