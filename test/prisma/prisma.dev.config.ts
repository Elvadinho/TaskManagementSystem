import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "schema.dev.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: "file:./dev.db",
  },
});
