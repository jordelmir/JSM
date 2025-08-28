const globals = require("globals");
const tseslint = require("typescript-eslint");
const react = require("eslint-plugin-react");
const reactHooks = require("eslint-plugin-react-hooks");
const prettier = require("eslint-config-prettier");
const reactRefresh = require("eslint-plugin-react-refresh");

module.exports = tseslint.config(
  {
    // Global ignores
    ignores: ["dist", "node_modules"],
  },
  {
    // Common configuration for all files
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        // Add any other global variables here if needed
      },
    },
    plugins: {
      "@typescript-eslint": tseslint.plugin,
      react: react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      // General ESLint rules
      "no-unused-vars": "warn",
      "no-console": "warn",

      // TypeScript ESLint rules
      "@typescript-eslint/no-unused-vars": "warn",
      "@typescript-eslint/explicit-module-boundary-types": "off", // Adjust as needed

      // React rules
      "react/react-in-jsx-scope": "off", // Not needed for React 17+ JSX transform
      "react/prop-types": "off", // Not needed with TypeScript

      // React Hooks rules
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // React Refresh rules
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
    },
  },
  // Prettier integration
  prettier,
);
