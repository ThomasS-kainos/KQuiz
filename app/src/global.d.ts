import type { ServerStatus } from './preload.ts';
import type { QuizData } from './types/quiz';

declare global {
  interface Window {
    serverAPI: {
      start: (quiz: QuizData) => Promise<ServerStatus>;
      stop: () => Promise<ServerStatus>;
      status: () => Promise<ServerStatus>;
    };
    networkAPI: {
      getLocalIp: () => Promise<string>;
    };
  }
}

export {};
