import { NextResponse } from "next/server";
import { createSurvey } from "@/lib/surveybuilder"
import { getCurrentUser } from "@/lib/auth";
import { getUserDataFromId } from "@/lib/user";

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
        body.userId = id;
        body.user = user;
        const newSurvey = await createSurvey(body);
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