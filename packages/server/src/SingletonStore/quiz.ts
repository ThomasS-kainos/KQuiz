import fs from "node:fs";
import path from "node:path";
import type { Question } from "../types/questions.ts";
import { getServerRoot } from "../paths.ts";

type QuizData = {
    quizName: string;
    questions: Question[];
};

const questionsPath = path.join(getServerRoot(), "public", "data", "questions.json");
const quizData: QuizData = JSON.parse(fs.readFileSync(questionsPath, "utf-8"));

export class Quiz {
    public quizName: string = "Unnamed Quiz";

    public currentQuestion: Question | null = null;
    public Questions: Array<Question> = [];

    constructor(quizName: string, questions: Array<Question> = []) {
        this.quizName = quizName;
        this.Questions = questions;
    }

    // Returns false once the question list is exhausted, so callers know the quiz has ended.
    public NextQuestion(): boolean {
        const nextQuestion = this.Questions.shift();

        this.currentQuestion = nextQuestion ?? null;
        return nextQuestion !== undefined;
    }
}

export const quizStore: Quiz = new Quiz(quizData.quizName, quizData.questions);