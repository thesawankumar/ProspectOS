import { NextRequest } from "next/server";
import { ok } from "@/middleware/validate.middleware";
import type { HealthCheckResponse } from "@/types";

export const runtime = "nodejs";

export async function GET(_request: NextRequest) {
  let dbStatus: "ok" | "error" = "error";

  try {
    // Dynamically import prisma so build doesn't fail without DATABASE_URL
    const { prisma } = await import("@/lib/prisma");
    await prisma.$queryRaw`SELECT 1`;
    dbStatus = "ok";
  } catch {
    dbStatus = "error";
  }

  const health: HealthCheckResponse = {
    status: dbStatus === "ok" ? "ok" : "degraded",
    version: process.env.npm_package_version ?? "0.1.0",
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    services: {
      database: dbStatus,
      cache: "ok",   // extend when Redis is added
      email: "ok",   // extend when SMTP is configured
    },
  };

  return ok(health);
}
