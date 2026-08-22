import { deleteSurveyById, getSurveybyId } from "@/lib/survey";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> | { id: string }}) {
    try {
        const resolvedParams = await params;
        const surveyId = resolvedParams?.id;

        const survey = await getSurveybyId(surveyId);

        if(!survey) {
            return NextResponse.json(
                { error: "Survey not found !!! "},
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
            { error: "Internal server error !!!" },
            { status: 500 }
        )
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{id: string}> }) {
    try {
        const resolvedParams = await params
        if(!resolvedParams.id) {
            throw new Error("survey id is missing !!!");
        }
        await deleteSurveyById(resolvedParams.id);
        return NextResponse.json(
            { success: true, message: "Survey has been delted successfully !!!" },
            { status: 200 }
        )
    }
    catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: "Internal server error !!!" },
            { status: 500 }
        )
    }
}