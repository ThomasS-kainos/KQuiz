import fs from "node:fs";
import path from "node:path";
import type { Question } from "../types/questions.ts";

type QuizData = {
    quizName: string;
    questions: Question[];
};

const questionsPath = path.join(import.meta.dirname, "..", "..", "public", "data", "questions.json");
const quizData: QuizData = JSON.parse(fs.readFileSync(questionsPath, "utf-8"));

export class Quiz {
    public quizName: string = "Unnamed Quiz";

    public currentQuestion: Question | null = null;
    public Questions: Array<Question> = [];

    constructor(quizName: string, questions: Array<Question> = []) {
        this.quizName = quizName;
        this.Questions = questions;
    }

    public NextQuestion() {
        const nextQuestion = this.Questions.shift();

        if (nextQuestion) {
            this.currentQuestion = nextQuestion;
        }
    }
}

export const quizStore: Quiz = new Quiz(quizData.quizName, quizData.questions);