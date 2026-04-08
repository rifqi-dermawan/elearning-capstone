import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await request.json();
    const { userId, moduleId, action, rating } = body;

    const effectiveUserId = userId || session?.user?.id;
    if (!effectiveUserId || !moduleId || !action) {
      return NextResponse.json({ error: "Field wajib tidak lengkap" }, { status: 400 });
    }

    const log = await prisma.userLog.create({
      data: {
        userId: effectiveUserId,
        moduleId,
        action,
        rating: rating ?? null,
      },
    });

    return NextResponse.json(log, { status: 201 });
  } catch (error) {
    console.error("Log API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const limit = parseInt(searchParams.get("limit") ?? "20");

    const logs = await prisma.userLog.findMany({
      where: userId ? { userId } : undefined,
      include: {
        module: { select: { title: true, tags: true } },
        user: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json(logs);
  } catch (error) {
    console.error("Get logs error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
