import { NextResponse } from "next/server";
import { createSurvey } from "@/lib/surveybuilder"
import { getCurrentUser } from "@/lib/auth";
import { getUserDataFromId } from "@/lib/user";
import { isPasswordMatched } from "@/lib/authUtils";
import { getSurveyByUserId } from "@/lib/survey";

export async function POST(request: Request) {
    try {
        const id = await getCurrentUser();

        if(!id) {
            return NextResponse.json(
                { error: "Invalid credentials !!!" },
                { status: 401 }
            )
        }
        const user = await getUserDataFromId(id);

        const body = await request.json();
        const expiresAt = body.expiresAt;
        const surveyData = {
            ...body,
            userId: id,
            user: user,
            published: body.published ?? true,
            expiresAt: expiresAt,
        };
        const newSurvey = await createSurvey(surveyData);
        return NextResponse.json(
            { success: true, message: "Survey created successfully !!!" },
            { status: 201 }
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

export async function GET(request: Request) {
    try {
        const id = await getCurrentUser();

        if(!id) {
            return NextResponse.json(
                { error: "Invalid credentials !!!" },
                { status: 401 }
            );
        }
        const surveys = await getSurveyByUserId(id);
        return NextResponse.json(
            { data: surveys },
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