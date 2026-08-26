// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron';

export interface ServerStatus {
  running: boolean;
  port: number;
}

contextBridge.exposeInMainWorld('serverAPI', {
  start: (): Promise<ServerStatus> => ipcRenderer.invoke('server:start'),
  stop: (): Promise<ServerStatus> => ipcRenderer.invoke('server:stop'),
  status: (): Promise<ServerStatus> => ipcRenderer.invoke('server:status'),
});
