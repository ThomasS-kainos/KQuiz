import type { Question } from "../types/questions.ts";

export type QuizData = {
    quizName: string;
    questions: Question[];
};

export class Quiz {
    public quizName: string = "Unnamed Quiz";

    public currentQuestion: Question | null = null;
    public Questions: Array<Question> = [];

    constructor(quizName: string, questions: Array<Question> = []) {
        this.quizName = quizName;
        this.Questions = questions;
    }

    // Replaces the quiz contents in place so existing imports keep pointing at the same store.
    public Load({ quizName, questions }: QuizData): void {
        this.quizName = quizName;
        this.Questions = [...questions];
        this.currentQuestion = null;
    }

    // Returns false once the question list is exhausted, so callers know the quiz has ended.
    public NextQuestion(): boolean {
        const nextQuestion = this.Questions.shift();

        this.currentQuestion = nextQuestion ?? null;
        return nextQuestion !== undefined;
    }
}

export const quizStore: Quiz = new Quiz("Unnamed Quiz");

export function loadQuiz(quizData: QuizData): void {
    quizStore.Load(quizData);
}