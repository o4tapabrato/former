import { NextResponse } from "next/server";
import { User, Prisma } from '@prisma/client';
import { createNewUser, getuserData, matchUserPassword } from "@/lib/user";

export async function POST(request: Request) {
    try {
        const body: Prisma.UserCreateInput = await request.json();

        const newUser = await createNewUser(body);

        if(!newUser) {
            return NextResponse.json(
                { error: "Unable to create new user" },
                { status: 400 }
            )
        }

        return NextResponse.json(
            { message: "user created successfully", data: newUser },
            { status: 201 }
        )

    }
    catch (error: any) {
        console.error("Signup Error: ", error);
        return NextResponse.json(
            { error: "Internal Server Error !!!" },
            { status: 500 }
        )
    }
}