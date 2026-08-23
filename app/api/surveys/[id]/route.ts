import { getCurrentUser } from "@/lib/auth";
import { deleteSurveyById, getSurveybyId, updateSurvey } from "@/lib/survey";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> | { id: string } }) {
    try {

        const id = await getCurrentUser();
        if(!id) {
            return NextResponse.json(
                { error: "Unauthorized !!!" },
                { status: 401 }
            );
        }

        const resolvedParams = await params;
        const surveyId = resolvedParams?.id;

        const survey = await getSurveybyId(surveyId);

        if (!survey) {
            return NextResponse.json(
                { error: "Survey not found !!! " },
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

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> | { id: string } }) {
    try {
        const id = await getCurrentUser();
        if(!id) {
            return NextResponse.json(
                { error: "Unauthorized !!!" },
                { status: 401 }
            );
        }
        const body = await request.json();
        const resolvedParams = await params;

        const savedSurvey = await getSurveybyId(resolvedParams.id);

        if(savedSurvey.userId != id) {
            return NextResponse.json(
                { error: "Unauthorized !!!" },
                { status: 401 }
            )
        }

        if(!body.title || !body.description) {
            return NextResponse.json(
                { error: "Missing required params !!!" },
                { status: 401 },
            )
        }

        const result = await updateSurvey({
            ... body,
            id: resolvedParams.id
        });
        
        if(!result) {
            return NextResponse.json(
                { error: "Unable to update the survey !!!" },
                { status: 400 }
            )
        }
        return NextResponse.json(
            { message: "Survey has been updated successfully !!!" },
            { status: 201 }
        );
    }
    catch {
        return NextResponse.json(
            { error: "Internal Server Error !!!" },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const id = await getCurrentUser();
        if(!id) {
            return NextResponse.json(
                { error: "Unauthorized !!!" },
                { status: 401 }
            );
        }

        const resolvedParams = await params
        if (!resolvedParams.id) {
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