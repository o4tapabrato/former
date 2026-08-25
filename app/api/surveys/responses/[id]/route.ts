import { NextResponse } from "next/server";
import { getSurveybyId, getSurveyByIdforResponse } from "@/lib/survey";
import { createResponse } from "@/lib/surveyResponse";
import { submitSurveyResponse } from "@/lib/response";
import { headers } from "next/headers";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> | { id: string } }) {
    try {
        const resolvedParams = await params;
        const surveyId = resolvedParams?.id;

        const body = await request.json();
        const { answers, token } = body;

        if (!answers) {
            return NextResponse.json(
                { error: "No answers are provided !!!" },
                { status: 400 }
            )
        }

        const survey = await getSurveybyId(surveyId);

        if (!survey) {
            return NextResponse.json(
                { error: "Survey not found !!!" },
                { status: 404 }
            );
        }

        if (survey.expiresAt && new Date() > new Date(survey.expiresAt)) {
            return NextResponse.json(
                { error: "This survey has expired and is no longer accepting responses." },
                { status: 403 }
            );
        }

        const headersList = await headers();
        const forwardedFor = headersList.get("x-forwarded-for");
        const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "unknown";
        const userAgent = headersList.get("user-agent") || "unknown";

        const newResponse = await submitSurveyResponse({ surveyId, answers, token, ip, userAgent });

        return NextResponse.json(
            { message: "Response submitted successfully" },
            { status: 201 }
        );
    }
    catch (error: any) {
        console.log(error);
        return NextResponse.json(
            { error: error.message || "Internal server error !!!" },
            { status: 500 }
        );
    }
}

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> | { id: string }}) {
    try {
        const resolvedParams = await params;
        const surveyId = resolvedParams?.id;
        const survey = await getSurveyByIdforResponse(surveyId);

        if (!survey) {
            return NextResponse.json(
                { error: "Survey not found !!!" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { data: survey },
            { status: 200 }
        );
    }
    catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: "Internal Server Error !!!" },
            { status: 500 }
        );
    }
}