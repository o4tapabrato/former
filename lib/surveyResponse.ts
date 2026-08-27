import { link } from "fs";
import { db } from "./prisma";

export async function getResponses(surveyid: string) {
    try {
        const responses = await db.surveyResponse.findMany({
            where: {
                surveyId: surveyid
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return responses;
    }
    catch (error) {
        throw error;
    }
}

export async function createResponse(response: any) {
    try {
        const newResponse = await db.surveyResponse.create({
            data: {
                surveyId: response.surveyId,
                answers: response.answers
            }
        });
    }
    catch (error) {
        throw error;
    }
}

export async function createNewToken(surveyId: string) {
    try {
        const newToken = await db.surveyToken.create({
            data: {
                surveyId: surveyId,
                isUsed: false
            }
        });
        return newToken;
    }
    catch(error) {
        throw error;
    }
}

export async function getAllGeneratedLinks(surveyId: string) {
    try {
        const links = await db.surveyToken.findMany({
            where: {
                surveyId: surveyId,
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return links;
    }
    catch (error) {
        throw error;
    }
}