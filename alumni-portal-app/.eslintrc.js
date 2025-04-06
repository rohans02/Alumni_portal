module.exports = {
  extends: ["next/core-web-vitals"],
  rules: {
    // Example rules you might want to adjust
    "react/no-unescaped-entities": "warn",
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
  }
};
