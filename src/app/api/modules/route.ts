import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  try {
    const modules = await prisma.module.findMany({
      where: { published: true },
      include: { _count: { select: { logs: true } } },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(modules);
  } catch (error) {
    console.error("Modules API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, tags, level } = body;

    if (!title || !description || !tags) {
      return NextResponse.json({ error: "Field wajib tidak lengkap" }, { status: 400 });
    }

    const module = await prisma.module.create({
      data: {
        title,
        description,
        tags: typeof tags === "string" ? tags : JSON.stringify(tags),
        level: level ?? "BEGINNER",
      },
    });

    return NextResponse.json(module, { status: 201 });
  } catch (error) {
    console.error("Create module error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
