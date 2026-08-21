import { db } from "./prisma";

export async function getSurveybyId(surveyId: string) {
    try {
        const survey = await db.survey.findUnique({
            where: {
                id: surveyId
            }
        });
        return survey;
    }
    catch (error) {
        throw error;
    }
}