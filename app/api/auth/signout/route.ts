import { destroySession } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request): Promise<NextResponse | null> {
    try {
        await destroySession();
    }
    catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: "Internal server error !!!" },
            { status: 500 }
        );
    }
    return NextResponse.redirect(new URL('/', request.url), {
        status: 303
    });
}