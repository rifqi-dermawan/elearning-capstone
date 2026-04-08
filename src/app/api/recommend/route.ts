import { NextResponse } from "next/server";
import { getHybridRecommendations } from "@/lib/recommender";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const session = await getServerSession(authOptions);
    
    // Allow userId from query param (for demo) or from session
    const userId = searchParams.get("userId") || session?.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "User ID diperlukan" }, { status: 400 });
    }

    const recommendations = await getHybridRecommendations(userId);

    return NextResponse.json({
      userId,
      count: recommendations.length,
      recommendations,
    });
  } catch (error) {
    console.error("Recommend API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
