import { useState } from 'react';
import { getQuiz, saveQuiz } from './storage/quizzes';
import type { Question, QuizData } from './types/quiz';

interface QuizEditorPageProps {
  quizId: string | null;
  onClose: () => void;
  onSaved: () => void;
}

const QUESTION_TYPE_LABELS: Record<Question['type'], string> = {
  'single-choice': 'Single choice',
  'multiple-choice': 'Multiple choice',
  'enter-text': 'Text answer',
};

function createQuestion(type: Question['type'], question = ''): Question {
  switch (type) {
    case 'single-choice':
      return { type, question, options: ['', ''], answer: '' };
    case 'multiple-choice':
      return { type, question, options: ['', ''], answer: [] };
    case 'enter-text':
      return { type, question, answer: '' };
  }
}

// Keeps the question text (and options where both types have them) when switching type.
function convertQuestion(current: Question, type: Question['type']): Question {
  if (current.type === type) return current;
  const next = createQuestion(type, current.question);
  if ('options' in next && 'options' in current) {
    return { ...next, options: [...current.options] } as Question;
  }
  return next;
}

function QuizEditorPage({ quizId, onClose, onSaved }: QuizEditorPageProps) {
  const existing = quizId ? getQuiz(quizId) : null;
  const [quizName, setQuizName] = useState(existing?.quizName ?? '');
  const [questions, setQuestions] = useState<Question[]>(existing?.questions ?? []);
  const [error, setError] = useState<string | null>(null);

  const updateQuestion = (index: number, next: Question) => {
    setQuestions((current) =>
      current.map((question, i) => (i === index ? next : question)),
    );
  };

  const removeQuestion = (index: number) => {
    setQuestions((current) => current.filter((_, i) => i !== index));
  };

  const moveQuestion = (index: number, offset: number) => {
    setQuestions((current) => {
      const target = index + offset;
      if (target < 0 || target >= current.length) return current;
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  };

  const handleSave = () => {
    const validationError = validate(quizName, questions);
    if (validationError) {
      setError(validationError);
      return;
    }
    const quiz: QuizData = { quizName: quizName.trim(), questions };
    saveQuiz(quiz, quizId ?? undefined);
    onSaved();
  };

  return (
    <div className="app-titlebar-page">
      <header className="app-titlebar">
        <h1>{quizId ? 'Edit Quiz' : 'New Quiz'}</h1>
      </header>
      <div className="app-content app-content--wide">
        <div className="panel panel--wide">
          <label className="field">
            <span className="field__label">Quiz name</span>
            <input
              className="text-input"
              value={quizName}
              placeholder="e.g. Friday Pub Quiz"
              onChange={(event) => setQuizName(event.target.value)}
            />
          </label>

          {error && <p className="error-text">{error}</p>}

          <div className="question-list">
            {questions.length === 0 ? (
              <p className="empty-state">No questions yet</p>
            ) : (
              questions.map((question, index) => (
                <QuestionEditor
                  key={index}
                  index={index}
                  total={questions.length}
                  question={question}
                  onChange={(next) => updateQuestion(index, next)}
                  onRemove={() => removeQuestion(index)}
                  onMove={(offset) => moveQuestion(index, offset)}
                />
              ))
            )}
          </div>

          <div className="add-question-row">
            {(Object.keys(QUESTION_TYPE_LABELS) as Question['type'][]).map((type) => (
              <button
                key={type}
                type="button"
                className="button--subtle"
                onClick={() =>
                  setQuestions((current) => [...current, createQuestion(type)])
                }
              >
                + {QUESTION_TYPE_LABELS[type]}
              </button>
            ))}
          </div>

          <div className="control-grid control-grid--row">
            <button type="button" onClick={handleSave}>
              Save Quiz
            </button>
            <button type="button" className="button--subtle" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface QuestionEditorProps {
  index: number;
  total: number;
  question: Question;
  onChange: (question: Question) => void;
  onRemove: () => void;
  onMove: (offset: number) => void;
}

function QuestionEditor({
  index,
  total,
  question,
  onChange,
  onRemove,
  onMove,
}: QuestionEditorProps) {
  const setOption = (optionIndex: number, value: string) => {
    if (!('options' in question)) return;
    const options = question.options.map((option, i) =>
      i === optionIndex ? value : option,
    );
    onChange({ ...question, options } as Question);
  };

  const removeOption = (optionIndex: number) => {
    if (!('options' in question)) return;
    const removed = question.options[optionIndex];
    const options = question.options.filter((_, i) => i !== optionIndex);
    if (question.type === 'single-choice') {
      onChange({
        ...question,
        options,
        answer: question.answer === removed ? '' : question.answer,
      });
    } else if (question.type === 'multiple-choice') {
      onChange({
        ...question,
        options,
        answer: question.answer.filter((answer) => answer !== removed),
      });
    }
  };

  const addOption = () => {
    if (!('options' in question)) return;
    onChange({ ...question, options: [...question.options, ''] } as Question);
  };

  return (
    <div className="question-card">
      <div className="question-card__header">
        <span className="question-card__number">Question {index + 1}</span>
        <div className="question-card__actions">
          <button
            type="button"
            className="button--icon"
            aria-label="Move question up"
            disabled={index === 0}
            onClick={() => onMove(-1)}
          >
            ↑
          </button>
          <button
            type="button"
            className="button--icon"
            aria-label="Move question down"
            disabled={index === total - 1}
            onClick={() => onMove(1)}
          >
            ↓
          </button>
          <button
            type="button"
            className="button--icon button--danger"
            aria-label="Delete question"
            onClick={onRemove}
          >
            ✕
          </button>
        </div>
      </div>

      <label className="field">
        <span className="field__label">Type</span>
        <select
          className="text-input"
          value={question.type}
          onChange={(event) =>
            onChange(convertQuestion(question, event.target.value as Question['type']))
          }
        >
          {(Object.keys(QUESTION_TYPE_LABELS) as Question['type'][]).map((type) => (
            <option key={type} value={type}>
              {QUESTION_TYPE_LABELS[type]}
            </option>
          ))}
        </select>
      </label>

      <label className="field">
        <span className="field__label">Question</span>
        <input
          className="text-input"
          value={question.question}
          placeholder="What is the capital of France?"
          onChange={(event) => onChange({ ...question, question: event.target.value })}
        />
      </label>

      {'options' in question && (
        <div className="field">
          <span className="field__label">
            Options {question.type === 'single-choice' ? '(pick the answer)' : '(tick all answers)'}
          </span>
          <ul className="option-list">
            {question.options.map((option, optionIndex) => (
              <li key={optionIndex} className="option-row">
                <input
                  type={question.type === 'single-choice' ? 'radio' : 'checkbox'}
                  name={`question-${index}-answer`}
                  checked={
                    question.type === 'single-choice'
                      ? question.answer === option && option !== ''
                      : question.answer.includes(option) && option !== ''
                  }
                  disabled={option === ''}
                  onChange={(event) => {
                    if (question.type === 'single-choice') {
                      onChange({ ...question, answer: option });
                    } else if (question.type === 'multiple-choice') {
                      const answer = event.target.checked
                        ? [...question.answer, option]
                        : question.answer.filter((value) => value !== option);
                      onChange({ ...question, answer });
                    }
                  }}
                />
                <input
                  className="text-input"
                  value={option}
                  placeholder={`Option ${optionIndex + 1}`}
                  onChange={(event) => setOption(optionIndex, event.target.value)}
                />
                <button
                  type="button"
                  className="button--icon button--danger"
                  aria-label="Remove option"
                  disabled={question.options.length <= 2}
                  onClick={() => removeOption(optionIndex)}
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
          <button type="button" className="button--subtle" onClick={addOption}>
            + Add option
          </button>
        </div>
      )}

      {question.type === 'enter-text' && (
        <label className="field">
          <span className="field__label">Answer</span>
          <input
            className="text-input"
            value={question.answer}
            placeholder="42"
            onChange={(event) => onChange({ ...question, answer: event.target.value })}
          />
        </label>
      )}
    </div>
  );
}

function validate(quizName: string, questions: Question[]): string | null {
  if (!quizName.trim()) return 'Give the quiz a name';
  if (questions.length === 0) return 'Add at least one question';

  for (const [index, question] of questions.entries()) {
    const label = `Question ${index + 1}`;
    if (!question.question.trim()) return `${label} needs some text`;

    if ('options' in question) {
      if (question.options.some((option) => !option.trim())) {
        return `${label} has an empty option`;
      }
      const unique = new Set(question.options.map((option) => option.trim()));
      if (unique.size !== question.options.length) {
        return `${label} has duplicate options`;
      }
    }

    if (question.type === 'single-choice' && !question.answer) {
      return `${label} needs a correct answer selected`;
    }
    if (question.type === 'multiple-choice' && question.answer.length === 0) {
      return `${label} needs at least one correct answer`;
    }
    if (question.type === 'enter-text' && !question.answer.trim()) {
      return `${label} needs an answer`;
    }
  }

  return null;
}

export default QuizEditorPage;
