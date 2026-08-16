import { db } from "./prisma";
import { User, Prisma } from "@prisma/client";

export async function createNewUser(user: any): Promise<User> {
    try {
        if (!user.email || !user.password || !user.username) {
            throw new Error("Missing required fields !!!");
        }

        const newUser = db.user.create({
            data: {
                email: user.email,
                password: user.password,
                username: user.username
            }
        })

        return newUser;
    }
    catch (error: any) {
        console.log(error);
        throw error;
    }
}

export async function updateUserData(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    try {
        const updatedUser = db.user.update({
            where: { id },
            data: data
        })
        return updatedUser;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getuserData(username: string): Promise<User|null> {
    try {
        const user = await db.user.findFirst({
            where: { username }
        })
        return user;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}

export async function deleteUser(username: string): Promise<User|null> {
    try {
        const deletedUser = db.user.delete({
            where: { username }
        })
        return deletedUser;
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}