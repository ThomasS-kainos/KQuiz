type BaseQuestion = {
  question: string
}

export type SingleChoiceQuestion = BaseQuestion & {
  type: 'single-choice'
  options: string[]
}

export type MultipleChoiceQuestion = BaseQuestion & {
  type: 'multiple-choice'
  options: string[]
}

export type EnterTextQuestion = BaseQuestion & {
  type: 'enter-text'
}

// The current question as sent to clients, with the answer omitted server-side.
export type QuestionData = SingleChoiceQuestion | MultipleChoiceQuestion | EnterTextQuestion

export type AnswerValue = string | string[]
