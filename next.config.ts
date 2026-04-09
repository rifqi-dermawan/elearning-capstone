import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ignore Prisma SQLite DB from triggering recompiles in dev mode
  serverExternalPackages: ["@prisma/client", "bcryptjs"],
};

export default nextConfig;
