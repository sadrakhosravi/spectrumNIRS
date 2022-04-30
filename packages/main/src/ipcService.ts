import type { RendererWindows } from '.';

export type ProcessesInfo = {
  mainWindow: {
    webContentsId: number;
  };
  reader: {
    webContentsId: number;
  };
};

export class IPCService {
  /**
   * The current application renderer processes
   */
  private readonly windows: RendererWindows;
  constructor(windows: RendererWindows) {
    this.windows = windows;
    setTimeout(() => this.sendProcessesInfoToMainWin(), 10);
  }

  /**
   * Sends the process info of all renderer to main window
   */
  sendProcessesInfoToMainWin() {
    const info = {
      mainWindow: {
        webContentsId: this.windows.mainWindow?.webContents.id,
      },
      reader: {
        webContentsId: this.windows.reader?.webContents.id,
      },
    };
    this.windows.mainWindow?.webContents.send('processes:info', info);
    this.windows.reader?.webContents.send('processes:info', info);
  }
}
