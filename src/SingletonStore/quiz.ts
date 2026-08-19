import type { Question } from "../types/questions.ts";

export class Quiz {
    public quizName: string = "Unnamed Quiz";

    public currentQuestion: Question = { question: "", answer: "" };
    public Questions: Array<Question> = [];

    constructor(quizName: string) {
        this.quizName = quizName;

        this.Questions = [
            { question: "What is the capital of France?", answer: "Paris" },
            { question: "What is 2 + 2?", answer: "4" },
            { question: "What is the largest ocean on Earth?", answer: "Pacific Ocean" },
        ];
    }

    public NextQuestion() {
        const nextQuestion = this.Questions.shift();
        if (nextQuestion) {
            this.currentQuestion = nextQuestion;
        } else {
            this.currentQuestion = { question: "No more questions available.", answer: "" };
        }
    }
}

export const quizStore: Quiz = new Quiz("Sample Quiz");