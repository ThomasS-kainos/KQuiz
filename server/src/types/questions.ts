type SingleChoiceQuestion = {
    type: "single-choice";
    question: string;
    options: string[];
    answer: string;
};

type MultipleChoiceQuestion = {
    type: "multiple-choice";
    question: string;
    options: string[];
    answer: string[];
};

type EnterTextQuestion = {
    type: "enter-text";
    question: string;
    answer: string;
};

type Question =
    | SingleChoiceQuestion
    | MultipleChoiceQuestion
    | EnterTextQuestion;


export type {
    Question,
    SingleChoiceQuestion,
    MultipleChoiceQuestion,
    EnterTextQuestion,
};