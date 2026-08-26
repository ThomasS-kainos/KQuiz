import type { ServerStatus } from './preload.ts';

declare global {
  interface Window {
    serverAPI: {
      start: () => Promise<ServerStatus>;
      stop: () => Promise<ServerStatus>;
      status: () => Promise<ServerStatus>;
    };
  }
}

export {};
