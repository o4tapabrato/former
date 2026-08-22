import { use } from "react";
import { db } from "./prisma";
import { userInfo } from "os";

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

        if(!survey?.published) {
            throw new Error("Survey not published !!!");
        }
        
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
                expiresAt: { gte: currentDate }
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

export async function getDashboardPageSurvey(userId: string) {
    try {
        const currentDate = new Date();
        const surveys = await db.survey.findMany({
            where: {
                userId: userId,
                published: true,
                expiresAt: { gte: currentDate }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 5
        });
        return surveys;
    }
    catch (error) {
        throw error;
    }
}

export async function deleteSurveyById(surveyId: string) {
    try {
        await db.survey.delete({
            where: {
                id: surveyId
            }
        });
    }
    catch (error) {
        throw error;
    }
}