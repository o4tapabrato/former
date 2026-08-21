import { NextResponse } from "next/server";
import { getSurveybyId } from "@/lib/survey";
import { createResponse, getResponses } from "@/lib/surveyResponse";

export async function POST(request: Request, { params }: { params: { id: string} }) {
    try {
        const { id: surveyId } = params;
        const body = await request.json();
        const { answers } = body;

        if(!answers) {
            return NextResponse.json(
                { error: "No answers are provided !!!" },
                { status: 400 }
            )
        }

        const survey = await getSurveybyId(surveyId);

        if(!survey) {
            return NextResponse.json(
                { error: "Survey not found !!!" },
                { status: 404 }
            );
        }

        const newResponse = await createResponse({ surveyId, answers });

        return NextResponse.json(
            { message: "Response submitted successfully" },
            { status: 201 }
        );
    }
    catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: "Internal server error !!!" },
            { status: 500 }
        );
    }
}