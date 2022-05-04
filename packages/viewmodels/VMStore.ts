/*---------------------------------------------------------------------------------------------
 *  Store.
 *  A global store for the application for view models that are used in multiple components
 *  @version 0.1.0
 *--------------------------------------------------------------------------------------------*/

// View Model imports
import { AppMenuViewModel } from './App/AppMenuViewModel';
import { AppStatesViewModel } from './App/AppStatesViewModel';
import { ChartViewModel } from './Chart/ChartViewModel';
import { DeviceSettingsViewModel } from './Device/DeviceSettingsViewModel';

/// ------------------------- App Global ------------------------- ///
/**
 * Application menu view model singleton.
 */
export const appMenuVM = new AppMenuViewModel();
/**
 * Application router view model singleton.
 */
export const appRouterVM = new AppStatesViewModel();

/// ------------------------- Chart -------------------------///
/**
 * The chart view model singleton.
 */
export let chartVM: ChartViewModel;

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

/// ------------------------- Device -------------------------///

/**
 * Device settings view model instance.
 */
export const deviceVM = new DeviceSettingsViewModel();
