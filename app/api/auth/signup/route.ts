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

export async function GET(request: Request) {
    try {
        const body: { username: string, password: string } = await request.json();
        const user: User | null = await getuserData(body.username);

        if(!user) {
            return NextResponse.json(
                { error: "username doesnot exist !!!" },
                { status: 404 }
            )
        }
        
        if(await matchUserPassword(body.password, user.password)) {
            return NextResponse.json(
                { message: "User data fetched successfully !!!", data: user },
                { status: 200 }
            )
        }

        else {
            return NextResponse.json(
                { error: "username and password didnot match !!!" },
                { status: 400 }
            )
        }
    }
    catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: "Internal Server Error !!!" },
            { status: 500 }
        )
    }
    
}