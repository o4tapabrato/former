import { db } from "./prisma";

export async function createSurvey(survey: any) {
    try {
        if(!survey.title) {
            throw new Error
            ("Missing required fields !!!");
        }

        const expiresAt = new Date(survey.expiresAt);

        const newSurvey = await db.survey.create({
            data: {
                title: survey.title,
                description: survey.description || "",
                userId: survey.userId,
                expiresAt: expiresAt,
                questions: {
                    create: (survey.questions || []).map((q: any, index: number) => ({
                        type: q.type,
                        text: q.text,
                        order: q.order ?? index,
                        required: q.required || false,
                        options: q.options || [],
                        imageUrl: q.imageUrl || null,
                        maxRating: q.maxRating || null
                    })),
                }
            },
            include: {
                questions: true
            }
        });
        return newSurvey;
    }
    catch (error) {
        console.error("Database Error !!!");
        throw error;
    }
}