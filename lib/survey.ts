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