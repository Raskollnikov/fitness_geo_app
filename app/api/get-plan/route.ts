// app/api/get-plan/route.ts
import { connectToDB } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ success: false, message: "Missing userId" }, { status: 400 });
    }

    const db = await connectToDB();
    const latestPlan = await db.collection("userPlans")
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json({ success: true, plans: latestPlan });
  } catch (error) {
    console.error("Failed to fetch plan", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
