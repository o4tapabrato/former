import { db } from "./prisma";

export async function getSurveyCsv(surveyId: string) {
    try {
        const survey = await db.survey.findUnique({
            where: { id: surveyId },
            include: {
                questions: { orderBy: { order: 'asc' } },
            }
        });

        const responses = await db.surveyResponse.findMany({
            where: { surveyId: surveyId }
        })

        if (!survey) {
            throw new Error("Survey doesnt exist !!!");
        }

        // 1. Build CSV headers (wrapped individually in quotes to handle commas safely)
        const questionHeaders = survey.questions.map((q) => `"${q.text.replace(/"/g, '""')}"`);
        const headerRow = ["Submission ID", "Submitted At", ...questionHeaders];

        const csvRows: string[] = [headerRow.join(",")];

        // 2. Build data rows
        for (const res of responses) {
            const answersMap = (res.answers as Record<string, any>) || {};
            const submittedAt = new Date(res.createdAt).toISOString();

            const answerColumns = survey.questions.map((q) => {
                const rawAnswer = answersMap[q.id] ?? answersMap[q.text] ?? "";
                const formattedAnswer = Array.isArray(rawAnswer) ? rawAnswer.join("; ") : String(rawAnswer);
                return `"${formattedAnswer.replace(/"/g, '""')}"`;
            });

            csvRows.push([`"${res.id}"`, `"${submittedAt}"`, ...answerColumns].join(","));
        }
        return csvRows.join("\n");
    }
    catch (error) {
        throw error;
    }
}