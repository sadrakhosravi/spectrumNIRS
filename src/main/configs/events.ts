// Icons
import hypoxiaIcon from '@icons/hypoxia.svg';
import MarkerIcon from '@icons/marker.svg';
// Modules
import ChartOptions from '@chart/ChartClass/ChartOptions';

// State
import { toggleEvent2, toggleHypoxia } from '@redux/ChartSlice';
import { dispatch, getState } from '@redux/store';

// Constants
import { DialogBoxChannels } from '@utils/channels';

export const events = [
  {
    label: 'hypoxia',
    name: 'Hypoxia',
    tooltip: 'Hypoxia Event',
    color: '#0e7490',
    icon: hypoxiaIcon,
    end: true,
    click: (chartOptions: ChartOptions) => {
      const recordState = getState().recordState.value;
      if (recordState === 'idle') {
        window.api.invokeIPC(DialogBoxChannels.MessageBox, {
          title: 'Error',
          type: 'error',
          message: 'No Recording Found',
          detail: 'Please start a recording first',
        });
        return;
      }
      chartOptions.addMarker('Hypoxia', '#007ACD');
      setTimeout(() => {
        dispatch(toggleHypoxia());
      }, 0);
    },
  },
  {
    label: 'event2',
    name: 'Event2',
    tooltip: 'Event 2',
    color: '#4338ca',
    icon: MarkerIcon,
    end: true,
    click: (chartOptions: ChartOptions) => {
      const recordState = getState().recordState.value;
      if (recordState === 'idle') {
        window.api.invokeIPC(DialogBoxChannels.MessageBox, {
          title: 'Error',
          type: 'error',
          message: 'No Recording Found',
          detail: 'Please start a recording first',
        });
        return;
      }
      chartOptions.addMarker('Event2', '#fff');
      dispatch(toggleEvent2());
    },
  },
];

export const systemEvents = [
  {
    name: 'Intensity Change',
    color: '#94a3b8',
    end: false,
  },
  {
    name: 'Low Pass Filter',
    color: '#94a3b8',
    end: false,
  },
];
