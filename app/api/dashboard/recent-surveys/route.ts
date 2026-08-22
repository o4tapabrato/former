import { getCurrentUser } from "@/lib/auth";
import { getDashboardPageSurvey } from "@/lib/survey";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const id = await getCurrentUser();

        if(!id) {
            return NextResponse.json(
                { error: "Authentication error !!!" },
                { status: 401 }
            );
        }

        const surveys = await getDashboardPageSurvey(id);
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
        );
    }
}