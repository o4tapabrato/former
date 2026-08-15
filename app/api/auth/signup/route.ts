import { NextResponse } from "next/server";
import { db } from '@/lib/prisma';
import { User, Prisma } from '@prisma/client';

export async function POST(request: Request) {
    try {
        const body: Prisma.UserCreateInput = await request.json();

        if (!body.email || !body.pasword || !body.username) {
            return NextResponse.json(
                { error: "Missing required argumebts !!!" },
                { status: 400 }
            )
        }

        const newUser: User = await db.user.create({
            data: {
                email: body.email,
                password: body.pasword,
                username: body.username,
            }
        })

        return NextResponse.json(
            { message: "user created successfully" },
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