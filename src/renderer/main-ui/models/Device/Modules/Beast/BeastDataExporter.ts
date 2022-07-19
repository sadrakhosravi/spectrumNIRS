// A quick data export algorithm for Beast's data.

import ServiceManager from '@services/ServiceManager';
import fs from 'fs';

import { DataModelType } from '/@/models/Recording/RecordingDataModel';
import { appRouterVM } from '/@/viewmodels/VMStore';

export class BeastDataExporter {
  private readonly savePath: string;
  private readonly recordingId: number;
  private readonly data: DataModelType;

  constructor(savePath: string, recordingId: number, data: DataModelType) {
    this.savePath = savePath;
    this.recordingId = recordingId;
    this.data = data;
  }

  /**
   * Exports the beast data and writes it to the given file name.
   */
  public async exportData() {
    this.writeDataToFile();
  }

  private async writeDataToFile() {
    const deviceSettings = (
      await ServiceManager.dbConnection.recordingQueries.selectRecording(
        this.recordingId
      )
    ).devices[0].settings;
    const intensities = deviceSettings.LEDValues.splice(10, 14);

    appRouterVM.setAppLoading(true, true, 'Exporting data...');
    const writer = fs.createWriteStream(this.savePath + '.csv', 'utf-8');

    // Write the headers.
    writer.write('Interval=,0.001 \n');
    writer.write('Start Time=, Unknown \n');
    writer.write('End Time=, Unknown \n');
    writer.write('Duration=, Unknown\n');

    // Write LED Intensities
    writer.write(`LED Intensities=,${intensities.join(',')}\n`);

    // Write column names
    writer.write(
      'O2Hb,HHb,THb,ADC1_CH1,ADC1_CH2,ADC1_CH3,ADC1_CH4,ADC1_CH5,Ambient\n'
    );

    // Write the data.
    const data = this.data;
    const dataLength = data.ADC1.ch0.length;

    // Loop over data and write it.
    for (let i = 0; i < dataLength; i++) {
      // Calc data
      const O2Hb = data.calcData.O2Hb[i];
      const HHb = data.calcData.HHb[i];
      const THb = data.calcData.THb[i];

      // Raw data
      const Ambient = data.ADC1.ch0[i];
      const ADC1_CH1 = data.ADC1.ch1[i];
      const ADC1_CH2 = data.ADC1.ch2[i];
      const ADC1_CH3 = data.ADC1.ch3[i];
      const ADC1_CH4 = data.ADC1.ch4[i];
      const ADC1_CH5 = data.ADC1.ch5[i];

      writer.write(
        `${O2Hb},${HHb},${THb},${ADC1_CH1},${ADC1_CH2},${ADC1_CH3},${ADC1_CH4},${ADC1_CH5},${Ambient}\n`
      );
    }

    writer.close();
    appRouterVM.setAppLoading(false);
  }
}
