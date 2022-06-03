/*---------------------------------------------------------------------------------------------
 *  Device Model.
 *  Holds logic related to the device selection and configuration.
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/

import { deserialize } from 'v8';
import { action, makeObservable, observable, reaction } from 'mobx';

export type DeviceSettingsType = {
  numOfPDs: number;
  numOfLEDs: number;
  LEDValues: number[];
};

// View Models
import { appRouterVM, chartVM, barChartVM, deviceManagerVM } from '../../viewmodels/VMStore';

// Types & Enum
import type { IReactionDisposer } from 'mobx';
import type {
  DeviceCalculatedDataType,
  DeviceDataTypeWithMetaData,
  DeviceInfoType,
} from '../../renderer/reader/api/Types';
import type { ChartSeries, DashboardChart } from '../Chart';
import { AppNavStatesEnum } from '../../utils/types/AppStateEnum';

/**
 * The proxy device model used to synchronize the UI with the
 * reader process device model class.
 */
export class DeviceModelProxy {
  public readonly id: string;
  /**
   * The device message port used to transfer the ownership of data
   * from the reader to the UI thread.
   */
  private readonly devicePort: MessagePort;
  /**
   * Device name.
   */
  public readonly name: string;
  /**
   * Device LEDs as an array.
   */
  public readonly LEDs: number[];
  /**
   * Device PDs as an array.
   */
  public readonly PDs: number[];
  /**
   * The PD channel names.
   */
  public readonly PDChannelNames: string[];
  /**
   * The calculated channel names.
   */
  public readonly calcChannelNames: string[];
  /**
   * A boolean indication if the device has probe settings.
   */
  public readonly hasProbeSettings: boolean;
  /**
   * Current active LEDs.
   */
  @observable private _activeLEDs: number;
  /**
   * Current active PDs.
   */
  @observable private _activePDs: number;
  /**
   * The selected PD data to show.
   */
  @observable private _selectedPD: number;
  /**
   * The current sampling rate of the device.
   */
  @observable private _samplingRate: number;
  /**
   * Device connection status.
   */
  @observable private isConnected: boolean;
  /**
   * Device recording status.
   */
  @observable private isStarted: boolean;
  /**
   * LED intensities
   */
  @observable private _LEDIntensities: number[];
  /**
   * Observable reaction disposer array.
   */
  private reactions: IReactionDisposer[];
  /**
   * The chart channels created by this device.
   */
  private chartChannels: { chart: DashboardChart; series: ChartSeries }[];
  /**
   * The start time stamp of the recording NOT the device.
   * Used to sync devices with time offset.
   */
  private startTimestamp: number;
  /**
   * The stop timestamp.
   */
  protected stopTimestamp: number;

  constructor(deviceInfo: DeviceInfoType, devicePort: MessagePort) {
    this.id = deviceInfo.id;

    this.devicePort = devicePort;
    this.devicePort.start();

    this.name = deviceInfo.name;
    this.LEDs = new Array(deviceInfo.numOfChannelsPerPD).fill(0).map((_, i) => (_ = i + 1));
    this.PDs = new Array(deviceInfo.numOfADCs).fill(0).map((_, i) => (_ = i + 1));
    this.PDChannelNames = deviceInfo.PDChannelNames;
    this.calcChannelNames = deviceInfo.calculatedChannelNames;
    this.hasProbeSettings = deviceInfo.hasProbeSettings;

    // Observables
    this._activeLEDs = deviceInfo.numOfChannelsPerPD;
    this._activePDs = 1;
    this._selectedPD = 1;
    this._samplingRate = deviceInfo.defaultSamplingRate;

    this.isConnected = false;
    this.isStarted = false;
    this._LEDIntensities = new Array(deviceInfo.numOfChannelsPerPD).fill(0);

    // Trackers
    this.reactions = [];
    this.chartChannels = [];

    // Recording
    this.startTimestamp = Date.now();
    this.stopTimestamp = 0;

    makeObservable(this);

    this.handleReactions();

    setTimeout(() => this.createChartChannels(), chartVM.loaded ? 50 : 500);
  }

  /**
   * @returns the device connection status as boolean.
   */
  public get isDeviceConnected() {
    return this.isConnected;
  }

  /**
   * The total number of active LEDs.
   */
  public get activeLEDs() {
    return this._activeLEDs;
  }

  /**
   * The total number of active PDs.
   */
  public get activePDs() {
    return this._activePDs;
  }

  /**
   * The selected PD to show the data from.
   */
  public get selectedPD() {
    return this._selectedPD;
  }

  /**
   * The current sampling rate of the device.
   */
  public get samplingRate() {
    return this._samplingRate;
  }

  /**
   * @returns the current LED intensities.
   */
  public get LEDIntensities() {
    return this._LEDIntensities;
  }

  /**
   * @returns the device recording status.
   */
  public get isDeviceStarted() {
    return this.isStarted;
  }

  /**
   * Sets whether the device is connected or not.
   */
  @action public setIsDeviceConnected(value: boolean) {
    this.isConnected = value;
  }

  /**
   *
   * Sets whether the device is recording or not.
   */
  @action public setIsDeviceStarted(value: boolean) {
    this.isStarted = value;
  }

  /**
   * Sets the total active LEDs number.
   */
  @action public setActiveLEDs(num: number) {
    this._activeLEDs = num;
  }

  /**
   * Sets the total active PDs number.
   */
  @action public setActivePDs(num: number) {
    this._activePDs = num;
  }

  /**
   * Sets the currently selected PD.
   */
  @action public setSelectedPD(num: number) {
    this._selectedPD = num;
  }

  /**
   * Updates the current LED intensities.
   * @param intensity the new intensity.
   * @param index the index of the led to update.
   */
  @action public setLEDIntensity(intensity: number, index: number) {
    this._LEDIntensities[index] = intensity;
  }

  /**
   * Sets the recording start timestamp.
   */
  public start(timestamp: number) {
    this.startTimestamp = timestamp;

    // Listen for calibration data
    if (appRouterVM.route === AppNavStatesEnum.CALIBRATION) {
      chartVM.currentView === 'line' &&
        this.devicePort.addEventListener('message', this.handleDeviceDataCalibration);

      chartVM.currentView === 'bar' &&
        this.devicePort.addEventListener('message', this.handleDeviceIntensityCalibrationData);
    }

    // Listen for calculated data
    if (appRouterVM.route === AppNavStatesEnum.RECORD) {
      this.devicePort.addEventListener('message', this.handleDeviceDataCalculated);
    }
  }

  public stop(timestamp: number) {
    this.stopTimestamp = timestamp;

    // Remove listeners
    this.devicePort.removeEventListener('message', this.handleDeviceDataCalibration);
    this.devicePort.removeEventListener('message', this.handleDeviceDataCalculated);
    this.devicePort.removeEventListener('message', this.handleDeviceIntensityCalibrationData);
  }

  /**
   * Creates the chart channels based on the device information and keeps
   * a reference to them.
   */
  private createChartChannels() {
    // If the app is in calibration, create calibration chart
    if (appRouterVM.route === AppNavStatesEnum.CALIBRATION) {
      // Add chart channels
      this.PDChannelNames.forEach((channelName) => {
        const chart = chartVM.addChart();
        const series = chartVM.addSeries(chart.id, channelName);

        this.chartChannels.push({ chart, series });
      });
    }

    // If the app is in record or review, create calculated channels.
    if (
      appRouterVM.route === AppNavStatesEnum.RECORD ||
      appRouterVM.route === AppNavStatesEnum.REVIEW
    ) {
      // Add chart channels
      this.calcChannelNames.forEach((channelName) => {
        const chart = chartVM.addChart();
        chart.removeGridLines();
        const series = chartVM.addSeries(chart.id, channelName);
        this.chartChannels.push({ chart, series });
      });
    }

    // Set the series sampling rate
    this.chartChannels.forEach((channel) => {
      channel.series.setSeriesCleaning(1);
      channel.series.setSeriesSamplingRate(this.samplingRate);
    });
  }

  /**
   * Deletes the chart channels that was created by the device.
   */
  private disposeChartChannels() {
    this.chartChannels.forEach((chart) => {
      chartVM.removeChart(chart.chart.id);
    });
    this.chartChannels.length = 0;
  }

  /**
   * Handles the incoming data from the reader process.
   */
  private handleDeviceDataCalculated = (event: MessageEvent<Buffer>) => {
    const data = deserialize(event.data) as DeviceDataTypeWithMetaData[];

    requestAnimationFrame(() => {
      for (let i = 0; i < data.length; i++) {
        // Get the current packet timestamp.
        const startTS = data[i].metadata.timestamp - this.startTimestamp;

        // Add the packet to each chart.
        for (let j = 0; j < this.calcChannelNames.length; j++) {
          const channelDataY = (data[i].calcData as DeviceCalculatedDataType)['ADC1'][
            this.calcChannelNames[j]
          ];
          this.chartChannels[j].series.addArrayY(channelDataY, startTS);
        }
      }
    });
  };

  /**
   * Handles the incoming data from the reader process.
   */
  private handleDeviceDataCalibration = (event: MessageEvent<Buffer>) => {
    const selectedPD = this.selectedPD;
    const data = deserialize(event.data) as DeviceDataTypeWithMetaData[];

    requestAnimationFrame(() => {
      for (let i = 0; i < data.length; i++) {
        // Get the current packet timestamp.
        const startTS = data[i].metadata.timestamp - this.startTimestamp;

        // Add the packet to each chart.
        for (let j = 0; j < this.chartChannels.length; j++) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-ignore
          const channelDataY = data[i].data[('ADC' + selectedPD) as any]['ch' + j] as Int32Array;
          this.chartChannels[j].series.addArrayY(channelDataY, startTS);
        }
      }
    });
  };

  private handleDeviceIntensityCalibrationData = (event: MessageEvent<Buffer>) => {
    const deviceData = deserialize(event.data) as DeviceDataTypeWithMetaData[];
    if (event.data.length === 0) return;
    const dataPoint: number[] = [];
    const dataPacket = deviceData[deviceData.length - 1];

    for (const ADC in dataPacket.data) {
      const channels = Object.keys((dataPacket.data as any)[ADC]);

      channels.forEach((channel) => {
        const pointPacket = (dataPacket.data as any)[ADC][channel];
        dataPoint.push(pointPacket[pointPacket.length - 1]);
      });
    }
    barChartVM?.addData(dataPoint);
  };

  /**
   * Sends the new device settings to the reader process.
   */
  public sendDeviceSettingsToReader = () => {
    setTimeout(() => {
      const settings = this.getDeviceSettings();
      deviceManagerVM.updateDeviceSettings(settings, this.name);
    }, 30);
  };

  /**
   * @returns the device settings read from the UI.
   * TODO: Update the LED intensities to use observable instead of getElementById.
   */
  protected getDeviceSettings = () => {
    // The settings object
    const settings: DeviceSettingsType = {
      numOfPDs: this.activePDs,
      numOfLEDs: this.activeLEDs,
      LEDValues: [],
    };

    for (let i = 0; i < this.activeLEDs; i++) {
      const ledSlider = document.getElementById('led-intensities-' + i) as HTMLInputElement;
      settings.LEDValues.push(~~ledSlider.value);
    }
    return settings;
  };

  /**
   * Handles observable changes.
   */
  private handleReactions() {
    const LEDChangeReactionDisposer = reaction(
      () => this._activeLEDs,
      () => this.sendDeviceSettingsToReader(),
    );

    const PDChangeReactionDisposer = reaction(
      () => this._activePDs,
      () => this.sendDeviceSettingsToReader(),
    );

    const intensityChangeDisposer = reaction(
      () => this._LEDIntensities,
      () => {
        console.log('Intensity change');
      },
    );

    // Handle chart channel creation
    const chartChannelCreatorDisposer = reaction(
      () => appRouterVM.route,
      () => {
        if (
          appRouterVM.route === AppNavStatesEnum.CALIBRATION ||
          appRouterVM.route === AppNavStatesEnum.RECORD ||
          appRouterVM.route === AppNavStatesEnum.REVIEW
        ) {
          // Dispose the current channels
          this.disposeChartChannels();

          // Create new channels.
          setTimeout(
            () => {
              this.createChartChannels();
            },
            chartVM.loaded ? 200 : 1500,
          );
        }
      },
    );

    this.reactions.push(
      LEDChangeReactionDisposer,
      PDChangeReactionDisposer,
      intensityChangeDisposer,
      chartChannelCreatorDisposer,
    );
  }

  /**
   * Cleans up the reactions.
   */
  public cleanup() {
    this.reactions.forEach((disposer) => disposer());
    this.reactions.length = 0;
    this.disposeChartChannels();

    this.stop(0);
    this.devicePort.close();
  }
}
