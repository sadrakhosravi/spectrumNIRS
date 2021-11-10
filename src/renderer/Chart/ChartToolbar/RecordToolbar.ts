// Icons
import StartIcon from '@icons/start.svg';
import StopIcon from '@icons/stop.svg';
import PauseIcon from '@icons/pause.svg';
import ZoomInIcon from '@icons/zoom-in.svg';
import ZoomOutIcon from '@icons/zoom-out.svg';
import ResetZoom from '@icons/reset-zoom.svg';
import FocusModeIcon from '@icons/focus-mode.svg';
import ResetHeightIcon from '@icons/reset-height.svg';
import ChartScreenshotIcon from '@icons/chart-screenshot.svg';
import MarkerIcon from '@icons/marker.svg';
import RawDataIcon from '@icons/raw-data.svg';

// Constants
import { RecordState } from '@utils/constants';

// Adapters
import { handlePause, handleRecord } from '@adapters/recordAdapter';
import ChartOptions from '../ChartClass/ChartOptions';
import { dispatch } from '@redux/store';
import { toggleRawData, toggleHypoxia, toggleEvent2 } from '@redux/ChartSlice';

export const RecordToolbar = [
  {
    label: 'Zoom In',
    tooltip: 'Zoom In',
    icon: ZoomInIcon,
    isActive: false,
    click: () => {},
  },
  {
    label: 'Zoom Out',
    tooltip: 'Zoom Out',
    icon: ZoomOutIcon,
    isActive: false,

    click: () => {},
  },
  {
    label: 'Reset Zoom',
    tooltip: 'Reset Zoom',
    icon: ResetZoom,
    isActive: false,

    click: () => {},
  },
  {
    label: 'separator',
  },
  {
    label: 'Focus Icon',
    tooltip: 'Focus Mode',
    icon: FocusModeIcon,
    isActive: false,

    click: () => {},
  },
  {
    label: 'Reset Layout',
    tooltip: 'Reset Charts Layout',
    icon: ResetHeightIcon,
    click: (chartOptions: ChartOptions) => {
      chartOptions.resetChartsHeight();
    },
  },
  {
    label: 'separator',
  },
  {
    label: 'Take Screenshot',
    tooltip: 'Take Screenshot',
    icon: ChartScreenshotIcon,
    click: (chartOptions: ChartOptions) => {
      chartOptions.screenshot();
    },
  },
  {
    label: 'rawdata',
    tooltip: 'Display Raw Data',
    icon: RawDataIcon,
    click: () => {
      dispatch(toggleRawData());
    },
  },
  {
    label: 'separator',
  },
  {
    label: `hypoxia`,
    tooltip: 'Hypoxia Event',
    icon: MarkerIcon,
    click: (chartOptions: ChartOptions) => {
      chartOptions.addMarker('Hypoxia', '#007ACD');
      dispatch(toggleHypoxia());
    },
  },
  {
    label: `event2`,
    tooltip: 'Event 2',
    icon: MarkerIcon,
    click: (chartOptions: ChartOptions) => {
      chartOptions.addMarker('Event2', '#fff');
      dispatch(toggleEvent2());
    },
  },
];

export const RecordButtons = [
  {
    dynamicLabel: (state: RecordState) => {
      switch (state) {
        case RecordState.IDLE:
          return 'Start';
        case RecordState.RECORD:
        case RecordState.PAUSED:
        case RecordState.CONTINUE:
          return 'Stop';
      }
    },
    dynamicIcon: (state: RecordState) =>
      state !== RecordState.IDLE ? StopIcon : StartIcon,
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
    click: handlePause,
  },
];
