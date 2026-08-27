import { getCurrentUser } from "@/lib/auth";
import { createNewToken, getAllGeneratedLinks } from "@/lib/surveyResponse";
import { NextResponse } from "next/server";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params;
        const surveyId = resolvedParams?.id;

        const id = await getCurrentUser();
        if (!id) {
            return NextResponse.json(
                { error: "Authentication error !!!" },
                { status: 401 }
            )
        }

        const newToken = await createNewToken(surveyId);

        return NextResponse.json(
            { success: true, message: "The token has been created successfully !!!", data: newToken },
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

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params;
        const id = await getCurrentUser();

        if (!id) {
            return NextResponse.json(
                { error: "Authentication error !!!" },
                { status: 401 }
            );
        }

        const surveyId = resolvedParams?.id;
        const links = await getAllGeneratedLinks(surveyId);
        return NextResponse.json(
            { data: links, success: true },
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