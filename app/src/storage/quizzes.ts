import type { QuizData, StoredQuiz } from '../types/quiz';

const STORAGE_KEY = 'bench.quizzes';

// Seeded on first run so there is always something to host; previously shipped
// as packages/server/public/data/questions.json.
const SAMPLE_QUIZ: QuizData = {
  quizName: 'Sample Quiz',
  questions: [
    {
      type: 'single-choice',
      question: 'What is the capital of France?',
      options: ['Berlin', 'Madrid', 'Paris', 'Rome'],
      answer: 'Paris',
    },
    {
      type: 'single-choice',
      question: 'Which planet is known as the Red Planet?',
      options: ['Venus', 'Mars', 'Jupiter', 'Saturn'],
      answer: 'Mars',
    },
    {
      type: 'multiple-choice',
      question: 'Which of the following are programming languages?',
      options: ['Python', 'HTML', 'JavaScript', 'CSS'],
      answer: ['Python', 'JavaScript'],
    },
    {
      type: 'multiple-choice',
      question: 'Which of these are primary colors?',
      options: ['Red', 'Green', 'Blue', 'Orange'],
      answer: ['Red', 'Blue'],
    },
    {
      type: 'enter-text',
      question: 'What is 7 multiplied by 6?',
      answer: '42',
    },
    {
      type: 'enter-text',
      question: 'What is the chemical symbol for water?',
      answer: 'H2O',
    },
  ],
};

function readAll(): StoredQuiz[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as StoredQuiz[]) : [];
  } catch {
    return [];
  }
}

function writeAll(quizzes: StoredQuiz[]): void {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(quizzes));
}

export function listQuizzes(): StoredQuiz[] {
  const quizzes = readAll();
  if (quizzes.length === 0) {
    const seeded = [toStoredQuiz(SAMPLE_QUIZ)];
    writeAll(seeded);
    return seeded;
  }
  return quizzes;
}

export function saveQuiz(quiz: QuizData, id?: string): StoredQuiz {
  const quizzes = readAll();
  const stored = toStoredQuiz(quiz, id);
  const index = quizzes.findIndex((existing) => existing.id === stored.id);
  if (index >= 0) quizzes[index] = stored;
  else quizzes.push(stored);
  writeAll(quizzes);
  return stored;
}

export function deleteQuiz(id: string): void {
  writeAll(readAll().filter((quiz) => quiz.id !== id));
}

function toStoredQuiz(quiz: QuizData, id?: string): StoredQuiz {
  return {
    ...quiz,
    id: id ?? crypto.randomUUID(),
    updatedAt: Date.now(),
  };
}
