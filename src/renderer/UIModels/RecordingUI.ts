import { dispatch } from '@redux/store';
import { setIsLoadingData } from '@redux/AppStateSlice';

import UIWorkerManager from 'renderer/UIWorkerManager';

import { IRecordingData } from '@electron/models/RecordingModel';
import GlobalStore from '@lib/globalStore/GlobalStore';

interface IRecording {
  currentRecording: IRecordingData;
  lastTimeStamp: number;
}

class RecordingUI {
  private recording: IRecordingData | null | undefined;
  lastTimeStamp: number;
  recordingData: null | any;
  isLoadingData: boolean;
  dataPromise: null | Promise<true | false>;

  constructor() {
    this.recording = null;
    this.lastTimeStamp = 0;
    this.isLoadingData = false;
    this.dataPromise = null;

    this.subToRecState();
    this.recordingData = null;
  }

  /**
   * @returns the recording data if available or null otherwise
   */
  public getRecordingData = async () => {
    if (!this.dataPromise) return null;

    await this.dataPromise;
    return this.recordingData;
  };

  /**
   * @returns the recording data if available or null otherwise
   */
  public getLastSectionOfData = async () => {
    if (!this.dataPromise) return null;
    await this.dataPromise;
    if (this.recordingData.data.length === 0) return null;

    const outputData: any[] = [];
    const outputTimeData: any[] = [];

    const dataLength = this.recordingData.data.length;

    for (let i = dataLength - 1; i > dataLength - 11; i -= 1) {
      outputData.push(this.recordingData.data[i]);
      outputTimeData.push(this.recordingData.timeData[i]);
    }

    return {
      batchSize: 10,
      data: outputData.reverse(),
      timeData: outputTimeData.reverse(),
    };
  };

  /**
   * Subscribes to recording state changes
   */
  private subToRecState() {
    const currentRecording = GlobalStore.getRecording('currentRecording');
    const lastTimeStamp = GlobalStore.getRecording('lastTimeStamp');
    this.setCurrentRecording({ currentRecording, lastTimeStamp } as IRecording);
    this.dispatchLoadingData(true);

    GlobalStore.store.onDidChange('recording', (newState) => {
      this.dispatchLoadingData(true);
      this.setCurrentRecording(newState as IRecording);
    });
  }

  /**
   * Sets the current recording state
   */
  private setCurrentRecording(newState: IRecording) {
    this.recording = newState?.currentRecording || null;
    this.lastTimeStamp = newState?.lastTimeStamp || 0;

    if (!this.recording) {
      this.recordingData = null;
      this.dispatchLoadingData(false);
      return;
    }

    this.loadRecordingData();
  }

  /**
   * Dispatches global loading state for the app
   */
  private dispatchLoadingData(isLoading: boolean = true) {
    dispatch(setIsLoadingData(isLoading));
    this.isLoadingData = isLoading;
  }

  /**
   * Loads initial data from the database
   */
  private loadRecordingData = async () => {
    const dbWorker = UIWorkerManager.getDatabaseWorker();
    const dbFilePath = await window.api.invokeIPC('get-database-path');

    let msgChannel = new MessageChannel();

    msgChannel.port1.start();
    msgChannel.port2.start();

    dbWorker.postMessage(
      {
        dbFilePath,
        recordingId: this.recording?.id as number,
        port: msgChannel.port1,
      },
      { transfer: [msgChannel.port1] }
    );

    this.dataPromise = new Promise((resolve) => {
      msgChannel.port2.onmessage = ({ data }) => {
        if (data) {
          this.recordingData = data;
          resolve(true);
        }
        this.dispatchLoadingData(false);
        UIWorkerManager.terminateDatabaseWorker();

        msgChannel.port1.close();
        msgChannel.port2.close();

        //@ts-ignore
        msgChannel = undefined;
      };
    });
  };
}

export default new RecordingUI();
