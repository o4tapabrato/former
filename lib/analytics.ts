import { db } from "./prisma";

export async function getSurveyAnalytics(surveyId: string) {
    const survey = await db.survey.findUnique({
        where: { id: surveyId },
        include: { questions: { orderBy: { order: "asc" } } },
    });

    if (!survey) {
        throw new Error("Survey not found");
    }

    const responses = await db.surveyResponse.findMany({
        where: { surveyId },
    });

    const totalResponses = responses.length;

    // Process analytics per question
    const questionAnalytics = survey.questions.map((q) => {
        let optionCounts: Record<string, number> = {};
        let textAnswers: string[] = [];
        let ratingSum = 0;
        let ratingCount = 0;

        // Initialize option counters for choice-based questions
        if (q.options && Array.isArray(q.options)) {
            q.options.forEach((opt: string) => {
                optionCounts[opt] = 0;
            });
        }

        responses.forEach((res) => {
            const answersMap = (res.answers as Record<string, any>) || {};
            const rawAnswer = answersMap[q.id] ?? answersMap[q.text];

            if (rawAnswer !== undefined && rawAnswer !== null && rawAnswer !== "") {
                if (q.type === "MULTIPLE_CHOICE" || q.type === "IMAGE_CHOICE") {
                    const valStr = String(rawAnswer);
                    optionCounts[valStr] = (optionCounts[valStr] || 0) + 1;
                } else if (q.type === "CHECKBOX" && Array.isArray(rawAnswer)) {
                    rawAnswer.forEach((val) => {
                        const valStr = String(val);
                        optionCounts[valStr] = (optionCounts[valStr] || 0) + 1;
                    });
                } else if (q.type === "RATING") {
                    const num = Number(rawAnswer);
                    if (!isNaN(num)) {
                        ratingSum += num;
                        ratingCount++;
                    }
                } else if (q.type === "TEXT") {
                    textAnswers.push(String(rawAnswer));
                }
            }
        });

        const analyticsData: any = {
            questionId: q.id,
            text: q.text,
            type: q.type,
        };

        if (q.type === "MULTIPLE_CHOICE" || q.type === "CHECKBOX" || q.type === "IMAGE_CHOICE") {
            analyticsData.distribution = optionCounts;
        } else if (q.type === "RATING") {
            analyticsData.averageRating = ratingCount > 0 ? (ratingSum / ratingCount).toFixed(1) : 0;
            analyticsData.totalRated = ratingCount;
        } else if (q.type === "TEXT") {
            analyticsData.textAnswers = textAnswers;
        }

        return analyticsData;
    });

    return {
        surveyTitle: survey.title,
        restrictionPolicy: survey.restrictionPolicy,
        expiresAt: survey.expiresAt,
        totalResponses,
        questionAnalytics,
    };
}