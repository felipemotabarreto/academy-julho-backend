import { PrismaClient } from "@prisma/client";

export const prisma = global.prisma || new PrismaClient();

if (process.env.VERCEL_ENV !== "production") global.prisma = prisma;
