import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();

    // Handle role change
    if (body.role !== undefined) {
      if (!["STUDENT", "LECTURER", "ADMIN"].includes(body.role)) {
        return NextResponse.json({ error: "Invalid role" }, { status: 400 });
      }
      if (id === session.user.id) {
        return NextResponse.json({ error: "Tidak dapat mengubah role akun sendiri" }, { status: 400 });
      }
      const user = await prisma.user.update({
        where: { id },
        data: { role: body.role },
        select: { id: true, name: true, email: true, role: true },
      });
      return NextResponse.json(user);
    }

    // Handle password reset
    if (body.password !== undefined) {
      if (!body.password || body.password.length < 6) {
        return NextResponse.json({ error: "Password minimal 6 karakter" }, { status: 400 });
      }
      const hashed = await bcrypt.hash(body.password, 12);
      await prisma.user.update({
        where: { id },
        data: { password: hashed },
      });
      return NextResponse.json({ success: true, message: "Password berhasil diubah" });
    }

    return NextResponse.json({ error: "No valid action provided" }, { status: 400 });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
