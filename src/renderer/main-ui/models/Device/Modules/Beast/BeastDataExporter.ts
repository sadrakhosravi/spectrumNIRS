// A quick data export algorithm for Beast's data.

import ServiceManager from '@services/ServiceManager';
import fs from 'fs';

import { DataModelType } from '/@/models/Recording/RecordingDataModel';
import { appRouterVM } from '/@/viewmodels/VMStore';

export class BeastDataExporter {
  private readonly savePath: string;
  private readonly recordingId: number;
  private readonly data: DataModelType;
  private readonly sensorType: string;

  constructor(
    savePath: string,
    recordingId: number,
    data: DataModelType,
    sensorType: 'v5' | 'v6'
  ) {
    this.savePath = savePath;
    this.recordingId = recordingId;
    this.data = data;
    this.sensorType = sensorType;
  }

  /**
   * Exports the beast data and writes it to the given file name.
   */
  public async exportData() {
    this.writeDataToFile();
  }

  /**
   * Writes the data to file.
   */
  private async writeDataToFile() {
    appRouterVM.setAppLoading(true, true, 'Exporting data...');
    const deviceSettings = (
      await ServiceManager.dbConnection.recordingQueries.selectRecording(
        this.recordingId
      )
    ).devices[0].settings;

    appRouterVM.setAppLoading(true, true, 'Exporting data...');
    const writer = fs.createWriteStream(this.savePath + '.csv', 'utf-8');

    // Write the headers.
    writer.write('Interval=, 0.004\n');
    writer.write('Start Time=, Unknown \n');
    writer.write('End Time=, Unknown \n');
    writer.write('Duration=, Unknown\n');

    // Process data
    if (this.sensorType === 'v5')
      this.writeToFileV5(writer, deviceSettings.LEDValues);

    if (this.sensorType === 'v6')
      this.writeToFileV6(writer, deviceSettings.LEDValues);

    writer.close();
    setTimeout(() => appRouterVM.setAppLoading(false), 500);
  }

  /**
   * Handles the V5 data export.
   */
  private writeToFileV5(writer: fs.WriteStream, intensities: number[]) {
    // Write LED Intensities
    const ints = intensities.splice(10, 14);
    writer.write(`LED Intensities=,${ints.join(',')}\n`);

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
      const O2Hb = data.calcData.ADC1.O2Hb[i];
      const HHb = data.calcData.ADC1.HHb[i];
      const THb = data.calcData.ADC1.THb[i];

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
  }

  /**
   * Handles the V6 data export.
   */
  private writeToFileV6(writer: fs.WriteStream, intensities: number[]) {
    // Write LED Intensities
    const ints = intensities.splice(0, 8);
    writer.write(`LED Intensities=,${ints.join(',')}\n`);

    // Write column names
    writer.write(
      'O2Hb,HHb,THb,ADC1_CH1,ADC1_CH2,ADC1_CH3,ADC1_CH4,ADC1_CH5,ADC1_CH6,ADC1_CH7,ADC1_CH8,Ambient,O2Hb,HHb,THb,ADC2_CH1,ADC2_CH2,ADC2_CH3,ADC2_CH4,ADC2_CH5,ADC2_CH6,ADC2_CH7,ADC2_CH8,Ambient\n'
    );

    // Write the data.
    const data = this.data;
    const dataLength = data.ADC1.ch0.length;

    // Loop over data and write it.
    for (let i = 0; i < dataLength; i++) {
      // Calc data
      const O2Hb = data.calcData.ADC1.O2Hb[i];
      const HHb = data.calcData.ADC1.HHb[i];
      const THb = data.calcData.ADC1.THb[i];

      const O2Hb2 = data.calcData.ADC2.O2Hb[i];
      const HHb2 = data.calcData.ADC2.HHb[i];
      const THb2 = data.calcData.ADC2.THb[i];

      // Raw data
      // ADC1
      const Ambient = data.ADC1.ch0[i];
      const ADC1_CH1 = data.ADC1.ch1[i];
      const ADC1_CH2 = data.ADC1.ch2[i];
      const ADC1_CH3 = data.ADC1.ch3[i];
      const ADC1_CH4 = data.ADC1.ch4[i];
      const ADC1_CH5 = data.ADC1.ch5[i];
      const ADC1_CH6 = data.ADC1.ch6[i];
      const ADC1_CH7 = data.ADC1.ch7[i];
      const ADC1_CH8 = data.ADC1.ch8[i];

      // ADC2
      const Ambient2 = data.ADC2.ch0[i];
      const ADC2_CH1 = data.ADC2.ch1[i];
      const ADC2_CH2 = data.ADC2.ch2[i];
      const ADC2_CH3 = data.ADC2.ch3[i];
      const ADC2_CH4 = data.ADC2.ch4[i];
      const ADC2_CH5 = data.ADC2.ch5[i];
      const ADC2_CH6 = data.ADC2.ch6[i];
      const ADC2_CH7 = data.ADC2.ch7[i];
      const ADC2_CH8 = data.ADC2.ch8[i];

      writer.write(
        `${O2Hb},${HHb},${THb},${ADC1_CH1},${ADC1_CH2},${ADC1_CH3},${ADC1_CH4},${ADC1_CH5},${ADC1_CH6},${ADC1_CH7},${ADC1_CH8},${Ambient},${O2Hb2},${HHb2},${THb2},${ADC2_CH1},${ADC2_CH2},${ADC2_CH3},${ADC2_CH4},${ADC2_CH5},${ADC2_CH6},${ADC2_CH7},${ADC2_CH8},${Ambient2}\n`
      );
    }
  }
}
