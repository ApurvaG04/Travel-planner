import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";
import eslintPluginNext from "@next/eslint-plugin-next";
import eslintPluginTypeScript from "@typescript-eslint/eslint-plugin";
import eslintParserTypeScript from "@typescript-eslint/parser";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Include Next.js recommended config
  ...compat.extends("next/core-web-vitals"),
  {
    files: ["**/*.{js,jsx,ts,tsx}"], 
    ignores: [".next/**"],
    languageOptions: {
      parser: eslintParserTypeScript,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: process.cwd(),
        ecmaFeatures: {
          jsx: true, // Enable JSX parsing
        },
      },
    },
    plugins: {
      "@typescript-eslint": eslintPluginTypeScript,
      "@next/next": eslintPluginNext, // Updated plugin namespace
    },
    rules: {
        "semi": ["error", "always"], // Adds missing semicolons
        "quotes": ["error", "single"], // Fixes quote styles
        "no-unused-vars": "warn", // This rule doesn't support auto-fix
      
      // Extend Next.js recommended rules
      // ...eslintPluginNext.configs["core-web-vitals"].rules,

      // Extend TypeScript recommended rules
      // ...eslintPluginTypeScript.configs.recommended.rules,

      // Additional custom rules
      // "@next/next/no-html-link-for-pages": "off", // Turn off warnings for non-Next.js link usage
    },
  },
];

export default eslintConfig;
