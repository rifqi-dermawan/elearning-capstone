import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const isGuest = session?.user?.role === "GUEST";

    const modules = await prisma.module.findMany({
      where: isGuest ? { published: true } : undefined,
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
      const session = await getServerSession(authOptions);
      if (session?.user?.role !== "ADMIN" && session?.user?.role !== "LECTURER") {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }

    const body = await request.json();
    const { title, description, tags, level, thumbnail, published } = body;

    if (!title || !description || !tags) {
      return NextResponse.json({ error: "Field wajib tidak lengkap" }, { status: 400 });
    }

    // Cari ID berurutan berdasarkan pola m1, m2, m3, dst
    const allModules = await prisma.module.findMany({
      select: { id: true },
    });
    
    let maxIdNum = 0;
    for (const m of allModules) {
      if (m.id.startsWith("m")) {
        const numPart = parseInt(m.id.substring(1));
        if (!isNaN(numPart) && numPart > maxIdNum) {
          maxIdNum = numPart;
        }
      }
    }
    const nextId = `m${maxIdNum + 1}`;

    const newModule = await prisma.module.create({
      data: {
        id: nextId,
        title,
        description,
        tags: typeof tags === "string" ? tags : JSON.stringify(tags),
        level: level ?? "BEGINNER",
        thumbnail: thumbnail || null,
        published: published ?? true,
      },
    });

    return NextResponse.json(newModule, { status: 201 });
  } catch (error) {
    console.error("Create module error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
