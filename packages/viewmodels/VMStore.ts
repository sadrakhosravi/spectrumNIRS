/*---------------------------------------------------------------------------------------------
 *  Store.
 *  A global store for the application for view models that are used in multiple components
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/

// View Model imports - ORDER MATTERS
import { AppMenuViewModel } from './App/AppMenuViewModel';
import { AppStatesViewModel } from './App/AppStatesViewModel';

import { DeviceManagerViewModel } from './Device/DeviceManagerViewModel';

import { ChartViewModel } from './Chart/ChartViewModel';
import { BarChartViewModel } from './Chart/BarChartViewModel';

import { RecordingViewModel } from './Recording/RecordingViewModel';

/// ------------------------- App Global ------------------------- ///
/**
 * Application router view model singleton.
 */
export const appRouterVM = new AppStatesViewModel();
/**
 * Application menu view model singleton.
 */
export const appMenuVM = new AppMenuViewModel();

/// ------------------------- Recording -------------------------///
/**
 * Recording view model singleton.
 */
export const recordingVM = new RecordingViewModel();

/// ------------------------- Device -------------------------///

/**
 * Device Manager view model
 */
export const deviceManagerVM = new DeviceManagerViewModel();

/// ------------------------- Chart -------------------------///
/**
 * The chart view model singleton.
 */
export let chartVM: ChartViewModel = new ChartViewModel();

/**
 * Creates the chart view model instance.
 */
export const initChartVM = () => {
  if (!chartVM) chartVM = new ChartViewModel();
};

/**
 * Disposes the chart view model instance and cleanups listeners and memory.
 */
export const disposeChartVM = () => {
  chartVM.dispose();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-ignore
  chartVM = null;
};

/**
 * The bar chart view model instance
 */
export let barChartVM: BarChartViewModel | null;

/**
 * Initializes the barChartVM instance
 */
export const initBarChartVM = () => {
  if (!barChartVM) barChartVM = new BarChartViewModel();
};

/**
 * Disposes the bar chart view model instance.
 */
export const disposeBarChartVM = () => {
  barChartVM?.dispose();
  barChartVM = null;
};
