import type { Question } from "../types/questions.ts";

export class Quiz {
    public quizName: string = "Unnamed Quiz";

    public currentQuestion: Question | null = null;
    public Questions: Array<Question> = [];

    constructor(quizName: string) {
        this.quizName = quizName;
    }

    public NextQuestion() {
        const nextQuestion = this.Questions.shift();

        if (nextQuestion) {
            this.currentQuestion = nextQuestion;
        }
    }
}

export const quizStore: Quiz = new Quiz("Sample Quiz");