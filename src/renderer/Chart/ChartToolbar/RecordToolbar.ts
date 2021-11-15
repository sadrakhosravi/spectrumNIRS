// Icons
import StartIcon from '@icons/start.svg';
import PauseIcon from '@icons/pause.svg';
import ZoomInIcon from '@icons/zoom-in.svg';
import ZoomOutIcon from '@icons/zoom-out.svg';
import ResetZoom from '@icons/reset-zoom.svg';
import FocusModeIcon from '@icons/focus-mode.svg';
import ResetHeightIcon from '@icons/reset-height.svg';
import ChartScreenshotIcon from '@icons/chart-screenshot.svg';
import MarkerIcon from '@icons/marker.svg';
import RawDataIcon from '@icons/raw-data.svg';
import ExportTxtIcon from '@icons/export-txt.svg';

// Constants
import { RecordState } from '@utils/constants';
import { ChartChannels } from '@utils/channels';

// Adapters
import { handlePause, handleRecord } from '@adapters/recordAdapter';
import ChartOptions from '../ChartClass/ChartOptions';

// Store
import { dispatch, getState } from '@redux/store';
import {
  toggleRawData,
  toggleHypoxia,
  toggleEvent2,
  setExportStatus,
} from '@redux/ChartSlice';

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
  {
    label: 'separator',
  },
  {
    label: `exporttxt`,
    tooltip: 'Export Text File',
    icon: ExportTxtIcon,
    click: async () => {
      dispatch(setExportStatus('loading'));

      const experimentData = getState().experimentData;
      const result = await window.api.invokeIPC(
        ChartChannels.ExportAll,
        experimentData
      );
      result === 'canceled' && dispatch(setExportStatus('canceled'));
      result === true && dispatch(setExportStatus('done'));
      result === false && dispatch(setExportStatus('error'));
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
        case RecordState.CONTINUE:
          return 'Pause';
        case RecordState.PAUSED:
          return 'Continue';
      }
    },
    dynamicIcon: (state: RecordState) => {
      switch (state) {
        case RecordState.IDLE:
        case RecordState.PAUSED:
          return StartIcon;
        case RecordState.RECORD:
        case RecordState.CONTINUE:
          return PauseIcon;
      }
    },

    isActive: (state: RecordState) => state !== RecordState.IDLE,
    click: (state: RecordState) => {
      switch (state) {
        case RecordState.IDLE:
          return handleRecord;
        case RecordState.PAUSED:
        case RecordState.RECORD:
        case RecordState.CONTINUE:
          return handlePause;
      }
    },
  },
];
