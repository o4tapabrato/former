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