import { error } from "console";
import { db } from "./prisma";
import crypto from "crypto";
import { escapeIdentifier } from "pg";

export async function getSurveyFortaker(surveyId: string) {
    try {
        const survey = await db.survey.findUnique({
            where: { id: surveyId },
            include: {
                questions: {
                    orderBy: { order: 'asc' }
                }
            }
        });

        if (!survey || !survey?.published) {
            throw new Error("Survey nor found or is inactive !!!");
        }

        const isExpired = new Date(survey.expiresAt) < new Date();

        if (isExpired) {
            throw new Error("Survey  is no longer accepting responses !!!");
        }
        return survey;
    }
    catch (error) {
        throw error;
    }
}

export async function submitSurveyResponse({
    surveyId,
    answers,
    token,
    ip = "unknown",
    userAgent = "unknown"
}: {
    surveyId: string,
    answers: any,
    token?: string,
    ip?: string,
    userAgent?: string
}) {
    try {
        const survey = await db.survey.findUnique({
            where: { id: surveyId }
        });

        if (!survey || !survey.published) {
            throw new Error("Survey not found or inactive");
        }
        const isExpired = new Date(survey.expiresAt) < new Date();

        if (isExpired) {
            throw new Error("Survey is no longer accepting responses !!!");
        }

        if (survey.restrictionPolicy === "UNIQUE_TOKENS") {
            if (!token) {
                throw new Error("Missing required token !!!");
            }

            const tokenRecord = await db.surveyToken.findUnique({
                where: { token }
            });

            if (!tokenRecord || tokenRecord.surveyId !== surveyId) {
                throw new Error("Invalid token !!!");
            }

            if (tokenRecord.isUsed) {
                throw new Error("survey link already used !!!");
            }
        }

        let deviceIdentifier: string | null = null;
        if (survey.restrictionPolicy === "ONE_PER_DEVICE") {
            deviceIdentifier = crypto.createHash('sha256').update(`${ip}-${userAgent}`).digest("hex");

            const existingResponse = await db.surveyResponse.findFirst({
                where: {
                    surveyId,
                    deviceidentifier: deviceIdentifier as any
                }
            });

            if (existingResponse) {
                throw new Error("Survey  alrady answered from this device !!!");
            }
        }

        return await db.$transaction(async (tx) => {
            const response = await tx.surveyResponse.create({
                data: {
                    surveyId,
                    answers,
                    deviceIdentifier: deviceIdentifier as any,
                },
            });

            if (survey.restrictionPolicy === "UNIQUE_TOKENS" && token) {
                await tx.surveyToken.update({
                    where: { token },
                    data: { isUsed: true, usedAt: new Date() },
                });
            }

            return response;
        });
    }
    catch (error) {
        throw error;
    }
}