export type SingleChoiceQuestion = {
  type: 'single-choice';
  question: string;
  options: string[];
  answer: string;
};

export type MultipleChoiceQuestion = {
  type: 'multiple-choice';
  question: string;
  options: string[];
  answer: string[];
};

export type EnterTextQuestion = {
  type: 'enter-text';
  question: string;
  answer: string;
};

export type Question =
  | SingleChoiceQuestion
  | MultipleChoiceQuestion
  | EnterTextQuestion;

export type QuizData = {
  quizName: string;
  questions: Question[];
};

/** A quiz as persisted in the app, with an id for selection. */
export type StoredQuiz = QuizData & {
  id: string;
  updatedAt: number;
};
