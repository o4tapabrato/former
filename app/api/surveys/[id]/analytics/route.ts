import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getSurveyAnalytics } from "@/lib/analytics";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const userId = await getCurrentUser();
    if (!userId) {
      return NextResponse.json({ error: "Authentication error !!!" }, { status: 401 });
    }

    const surveyId = resolvedParams?.id;
    if (!surveyId) {
      return NextResponse.json({ error: "Invalid request !!!" }, { status: 400 });
    }

    const analyticsData = await getSurveyAnalytics(surveyId);

    return NextResponse.json({
      success: true,
      data: analyticsData,
    }, { status: 200 });

  } catch (error: any) {
    console.error("Analytics Error:", error);
    return NextResponse.json(
      { error: error.message || "Internal Server Error !!!" },
      { status: 500 }
    );
  }
}