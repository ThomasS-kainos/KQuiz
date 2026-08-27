// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron';
import type { QuizData } from './types/quiz';

export interface ServerStatus {
  running: boolean;
  port: number;
}

contextBridge.exposeInMainWorld('serverAPI', {
  start: (quiz: QuizData): Promise<ServerStatus> =>
    ipcRenderer.invoke('server:start', quiz),
  stop: (): Promise<ServerStatus> => ipcRenderer.invoke('server:stop'),
  status: (): Promise<ServerStatus> => ipcRenderer.invoke('server:status'),
});

contextBridge.exposeInMainWorld('networkAPI', {
  getLocalIp: (): Promise<string> => ipcRenderer.invoke('network:local-ip'),
});
