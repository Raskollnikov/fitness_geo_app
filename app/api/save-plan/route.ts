// app/api/save-plan/route.ts
import { connectToDB } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const db = await connectToDB();
    if (!body?.userId || !body?.workoutPlan || !body?.dietPlan) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }
    const plan = {
      userId: body.userId,
      username: body.username,
      email: body.email,
      imageUrl: body.imageUrl,
      formData: body.formData,
      workoutPlan: body.workoutPlan,
      dietPlan: body.dietPlan,
      createdAt: new Date(),
    };

    await db.collection("userPlans").insertOne(plan);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to save plan", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
