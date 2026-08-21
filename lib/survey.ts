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
        const surveys = await db.survey.findMany({
            where: {
                userId: userId
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