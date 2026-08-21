import { use } from "react";
import { db } from "./prisma";

export async function getSurveybyId(surveyId: string) {
    try {
        const survey = await db.survey.findUnique({
            where: {
                id: surveyId
            },
            include: {
                questions: {
                    orderBy: { order: "asc" },
                },
            },
        });
        return survey;
    }
    catch (error) {
        throw error;
    }
}

export async function getSurveyByUserId(userId: string) {
    try {
        const currentDate = new Date();
        const surveys = await db.survey.findMany({
            where: {
                userId: userId,
                OR: [
                    { expiresAt: null },
                    { expiresAt: { gt: currentDate } }
                ]
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return surveys;
    }
    catch (error) {
        throw error;
    }
}