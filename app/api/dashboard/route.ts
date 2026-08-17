import { NextResponse } from "next/server";
import { getUserDataFromId } from "@/lib/user";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
    try {
        const id = await getCurrentUser();

        if(!id) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            )
        }

        const user = await getUserDataFromId(id);

        if (!user) {
            return NextResponse.json(
                { error: "User data not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            user,
            { status: 200 }
        )
    }
    catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: "Internal Server Error !!!" },
            { status: 500 }
        )
    }

}