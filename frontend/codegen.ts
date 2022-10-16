import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "http://127.0.0.1:4000/graphql",
  documents: "src/*.graphql",
  ignoreNoDocuments: true,
  generates: {
    "./src/graphql/index.ts": [
      {
        typescript: {},
      },
      {
        "typescript-operations": {},
      },
      {
        "typescript-urql": {
          withHooks: true,
        },
      },
    ],
    "./graphql.schema.json": {
      plugins: ["introspection"],
    },
  },
};

export default config;
