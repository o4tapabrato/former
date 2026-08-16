import { createSession } from "@/lib/auth";
import { isPasswordMatched } from "@/lib/authUtils";
import { getuserData } from "@/lib/user";
import { NextResponse } from "next/server";

interface LoginRequestBody {
    username?: string;
    password?: string;
}

export async function POST(request: Request): Promise<NextResponse> {
    try {
        const body: LoginRequestBody = await request.json();

        const { username, password } = body;

        if(!username || !password) {
            return NextResponse.json(
                { error: "Missing required fields !!!" },
                { status: 400 }
            );
        }

        const user = await getuserData(username);

        if(!user) {
            return NextResponse.json(
                { error: "username doesnt exist" },
                { status: 401 }
            )
        }

        const isPasswordValid = await isPasswordMatched(password, user.password);

        if(!isPasswordValid) {
            return NextResponse.json(
                { error: "Username and Password didnot match !!!" },
                { status: 401 }
            );
        }

        await createSession(user.id);
        return NextResponse.json(
            { success: true, message: "Logged in successflly" },
            { status: 200 }
        );
    }
    catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: "internal Server Error !!!" },
            { status: 500 }
        );
    }
}