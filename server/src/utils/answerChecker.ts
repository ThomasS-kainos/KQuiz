import type { Question } from "../types/questions.ts";

function normalize(value: string): string {
    return value.trim().toLowerCase();
}

// Compares a submitted answer against a question's answer, handling each question type's shape.
export function isCorrectAnswer(question: Question, submitted: string | string[]): boolean {
    switch (question.type) {
        case "single-choice":
        case "enter-text":
            return typeof submitted === "string" && normalize(submitted) === normalize(question.answer);

        case "multiple-choice": {
            if (!Array.isArray(submitted)) {
                return false;
            }

            const expected = new Set(question.answer.map(normalize));
            const actual = new Set(submitted.map(normalize));

            return expected.size === actual.size && [...expected].every(value => actual.has(value));
        }
    }
}
