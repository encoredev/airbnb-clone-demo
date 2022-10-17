module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json"],
  },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking", // Type aware checking errors
    "plugin:@next/next/recommended",
    "prettier", // Disable any formatting related lint issues (as prettier can fix these for us)
    "next/core-web-vitals",
  ],
  rules: {
    // These are switched off for now because we have 900+ of these!
    // As we go we should fix these one by one
    "@typescript-eslint/no-explicit-any": ["off"],
    "@typescript-eslint/no-unsafe-member-access": ["off"],
    "@typescript-eslint/no-unsafe-assignment": ["off"],
    "@typescript-eslint/no-unsafe-call": ["off"],
    "@typescript-eslint/no-unsafe-argument": ["off"],
    "@typescript-eslint/no-unused-vars": ["off"],
    "@typescript-eslint/no-unsafe-return": ["off"],
    "@typescript-eslint/no-non-null-assertion": ["off"],
    "@typescript-eslint/require-await": ["off"],
    "@typescript-eslint/restrict-plus-operands": ["off"],
    "@typescript-eslint/no-floating-promises": ["off"],
    "@typescript-eslint/no-misused-promises": ["off"],
    "@typescript-eslint/restrict-template-expressions": ["off"],
    "@typescript-eslint/unbound-method": ["off"],
    "@next/next/no-css-tags": ["off"],
    "@next/next/link-passhref": ["off"],
    "@next/next/no-img-element": ["off"],
  },
};
