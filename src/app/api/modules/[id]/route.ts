import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const module = await prisma.module.findUnique({
      where: { id },
      include: {
        _count: { select: { logs: true } }
      }
    });

    if (!module) {
      return NextResponse.json({ error: "Module not found" }, { status: 404 });
    }

    return NextResponse.json(module);
  } catch (error) {
    console.error("Get module error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
