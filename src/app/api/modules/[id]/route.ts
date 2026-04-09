import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const targetModule = await prisma.module.findUnique({
      where: { id },
      include: {
        _count: { select: { logs: true } }
      }
    });

    if (!targetModule) return NextResponse.json({ error: "Not found" }, { status: 404 });
    
    return NextResponse.json(targetModule);
  } catch (error) {
    console.error("Get module error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN" && session?.user?.role !== "LECTURER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const { title, description, tags, level, thumbnail, published } = body;

    const updatedModule = await prisma.module.update({
      where: { id },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(tags && { tags: typeof tags === "string" ? tags : JSON.stringify(tags) }),
        ...(level && { level }),
        ...(thumbnail !== undefined && { thumbnail }),
        ...(published !== undefined && { published }),
      },
    });

    return NextResponse.json(updatedModule);
  } catch (error) {
    console.error("Update module error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN" && session?.user?.role !== "LECTURER") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;

    await prisma.module.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete module error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
