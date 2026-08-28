import { getCurrentUser } from "@/lib/auth";
import { getSurveyCsv } from "@/lib/export";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const resolvedParams = await params;
        const id = await getCurrentUser();
        if(!id) {
            return NextResponse.json(
                { error: "Authentication error !!!" },
                { status: 401 }
            );
        }

        const surveyId = resolvedParams?.id;
        if(!surveyId) {
            return NextResponse.json(
                { error: "Invalid request !!!" },
                { status: 401 }
            );
        }

        const csvString = await getSurveyCsv(surveyId);
        return NextResponse.json(
            csvString,
            { status: 200, headers: {
                "Constent-Type": "text/csv; charset=utf-8",
                "Content-Disposition": `attachment; filename="survey-${surveyId}-responses.csv"`
            }}
        )
    }
    catch(error: any) {
         return NextResponse.json(
            { error: error.message || "Internal Server Error !!!" },
            { status: 500 }
         )
    }
}