// Icons
import RecordIcon from '@icons/record.svg';
import StopIcon from '@icons/stop.svg';
import PauseIcon from '@icons/pause.svg';
import ZoomInIcon from '@icons/zoom-in.svg';
import ZoomOutIcon from '@icons/zoom-out.svg';
import ResetZoom from '@icons/reset-zoom.svg';
import FocusModeIcon from '@icons/focus-mode.svg';
import ResetHeight from '@icons/reset-height.svg';
import ChartScreenshot from '@icons/chart-screenshot.svg';
import Marker from '@icons/marker.svg';

// Constants
import { RecordState } from '@utils/constants';

// Store
import store from '@redux/store';
import { changeRecordState } from '@redux/RecordStateSlice';
const { dispatch } = store;

// Adapters
import { handleRecord } from '@adapters/recordAdapter';
import ChartOptions from '../ChartClass/ChartOptions';

export const RecordToolbar = [
  {
    label: 'Zoom In',
    tooltip: 'Zoom In',
    icon: ZoomInIcon,
    click: () => {},
  },
  {
    label: 'Zoom Out',
    tooltip: 'Zoom Out',
    icon: ZoomOutIcon,
    click: () => {},
  },
  {
    label: 'Reset Zoom',
    tooltip: 'Reset Zoom',
    icon: ResetZoom,
    click: () => {},
  },
  {
    label: 'separator',
  },
  {
    label: 'Focus Icon',
    tooltip: 'Focus Mode',
    icon: FocusModeIcon,
    click: () => {},
  },
  {
    label: 'separator',
  },
  {
    label: 'Reset Layout',
    tooltip: 'Reset Charts Layout',
    icon: ResetHeight,
    click: (chartOptions: ChartOptions) => {
      chartOptions.resetChartsHeight();
    },
  },
  {
    label: 'Take Screenshot',
    tooltip: 'Take Screenshot',
    icon: ChartScreenshot,
    click: (chartOptions: ChartOptions) => {
      chartOptions.screenshot();
    },
  },
  {
    label: 'َAdd Marker',
    tooltip: 'Add Marker',
    icon: Marker,
    click: (chartOptions: ChartOptions) => {
      chartOptions.addMarker();
    },
  },
];

export const RecordButtons = [
  {
    dynamicLabel: (state: RecordState) => {
      switch (state) {
        case RecordState.IDLE:
          return 'Record';
        case RecordState.RECORD:
        case RecordState.PAUSED:
        case RecordState.CONTINUE:
          return 'Stop';
      }
    },
    dynamicIcon: (state: RecordState) =>
      state !== RecordState.IDLE ? StopIcon : RecordIcon,
    isActive: (state: RecordState) => state !== RecordState.IDLE,
    click: handleRecord,
  },
  {
    dynamicLabel: (state: RecordState) => {
      switch (state) {
        case RecordState.IDLE:
        case RecordState.RECORD:
        case RecordState.CONTINUE:
          return 'Pause';

        case RecordState.PAUSED:
          return 'Continue';
      }
    },
    icon: PauseIcon,
    tooltip: (state: RecordState) =>
      state === RecordState.IDLE ? 'Start a recording first' : null,
    isActive: (state: RecordState) => state === RecordState.PAUSED,
    isDisabled: (state: RecordState) => state === RecordState.IDLE,
    click: (state: RecordState) => {
      switch (state) {
        case RecordState.IDLE:
          break;
        case RecordState.RECORD:
        case RecordState.CONTINUE:
          dispatch(changeRecordState(RecordState.PAUSED));
          break;

        case RecordState.PAUSED:
          dispatch(changeRecordState(RecordState.CONTINUE));
          break;
      }
    },
  },
];
