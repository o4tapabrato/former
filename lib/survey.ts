import { use } from "react";
import { db } from "./prisma";
import { userInfo } from "os";
import { Survey } from "@prisma/client";

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

export async function updateSurvey(newSurvey: any) {
    try {
        await db.surveyQuestion.deleteMany({
            where: {
                surveyId: newSurvey.id
            }
        })

        const res = await db.survey.update({
            where: {
                id: newSurvey.id
            },
            data: {
                title: newSurvey.title,
                description: newSurvey.description,
                expiresAt: newSurvey.expiresAt,
                published: newSurvey.published ?? false,
                questions: {
                    create: (newSurvey.questions || []).map((q: any, index: number) => ({
                        type: q.type,
                        text: q.text,
                        order: q.order ?? index,
                        required: q.required || false,
                        options: q.options || [],
                        imageUrl: q.imageUrl || null,
                        maxRating: q.maxRating || null
                    }))
                }
            },
            include: { questions: true }
        });
        return true;
    }
    catch (error) {
        throw error;
    }
}