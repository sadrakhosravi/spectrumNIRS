import { dialog } from 'electron';

class UIError {
  constructor(title: string, content: string) {
    dialog.showErrorBox(title, content);
  }
}

export default UIError;
