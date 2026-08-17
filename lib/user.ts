import { db } from "./prisma";
import { User, Prisma } from "@prisma/client";
import bcrypt from "bcrypt";
import { hash } from "crypto";

export async function createNewUser(user: any): Promise<User> {
    try {
        if (!user.email || !user.password || !user.username) {
            throw new Error("Missing required fields !!!");
        }

        const saltRounds = 10;
        const hashedPassword: string = await bcrypt.hash(user.password, saltRounds)

        const newUser = db.user.create({
            data: {
                email: user.email,
                password: hashedPassword,
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

export async function matchUserPassword(inputPassword: string, userPassword: string): Promise<boolean> {
    try {
        return await bcrypt.compare(inputPassword, userPassword);
    }
    catch (error) {
        console.log(error);
        throw error;
    }
}

export async function getUserDataFromId(id: string): Promise<User | null> {
    try {
        const user = await db.user.findFirst({
            where: { id }
        });
        return user;
    }
    catch (error) {
        throw error;
    }
}