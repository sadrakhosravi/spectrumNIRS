import { dispatch, getState } from '@redux/store';
import { version } from '~/package.json';
import toast from 'react-hot-toast';

// Actions
import { openModal } from '@redux/ModalStateSlice';

// Constants
import { ModalConstants } from '@utils/constants';
import {
  DialogBoxChannels,
  ExperimentChannels,
  RecordChannels,
  UpdaterChannels,
} from '@utils/channels';

export const TopMenu = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Open',
        checkRecording: true,
        click: () => {
          dispatch(openModal(ModalConstants.OPEN_EXPERIMENT));
        },
      },
      {
        label: 'Close',
        checkRecording: true,
        click: async () => {
          await window.api.invokeIPC(RecordChannels.Stop);

          const isClosed = await window.api.invokeIPC(
            ExperimentChannels.CloseExperiment
          );

          isClosed &&
            setTimeout(() => {
              toast.success('Experiment closed', { duration: 3000 });
            }, 500);
        },
      },
      {
        label: 'separator',
        click: () => {},
      },
      {
        label: 'Reload',
        checkRecording: true,
        click: () => {
          window.location.reload();
        },
      },
      {
        label: 'Exit',
        checkRecording: true,
        click: () => {
          window.api.window.close();
        },
      },
    ],
  },
  {
    label: 'New',
    submenu: [
      {
        label: 'Experiment',
        checkRecording: true,

        click: () => dispatch(openModal(ModalConstants.NEWEXPERIMENT)),
      },
      {
        label: 'Patient',
        checkRecording: true,

        click: () =>
          getState().global.experiment?.currentExp?.name
            ? dispatch(openModal(ModalConstants.NEWPATIENT))
            : dispatch(openModal(ModalConstants.NEWEXPERIMENT)),
      },
      {
        label: 'Recording',
        checkRecording: true,

        click: () =>
          getState().global.patient?.currentPatient?.name
            ? dispatch(openModal(ModalConstants.NEWRECORDING))
            : dispatch(openModal(ModalConstants.NEWEXPERIMENT)),
      },
    ],
  },
  {
    label: 'Probe',
    submenu: [
      {
        label: 'Select Probe',
        checkRecording: true,

        click: () => {
          dispatch(openModal(ModalConstants.SELECT_PROBE));
        },
      },
      {
        label: 'New Probe',
        checkRecording: true,

        click: () => {
          dispatch(openModal(ModalConstants.NEW_PROBE));
        },
      },
    ],
  },
  {
    label: 'Database',

    submenu: [
      {
        label: 'Optimize',
        checkRecording: true,
        click: async () => {
          toast.loading('Optimizing database ...');
          await window.api.invokeIPC('database-vacuum');
          setTimeout(() => {
            toast.dismiss();
            toast.success('Database optimization was successful');
          }, 3000);
        },
      },
    ],
  },
  {
    label: 'Help',
    submenu: [
      {
        label: 'About',
        checkRecording: false,

        click: () =>
          window.api.invokeIPC(DialogBoxChannels.MessageBox, {
            title: 'Photon Lab Software',
            message: 'Photon Lab',
            type: 'info',
            detail:
              "Powered by Microsoft's Electron. Current version: " + version,
          }),
      },
      {
        label: 'Check for Updates',
        checkRecording: false,
        click: () => window.api.sendIPC(UpdaterChannels.CheckForUpdate),
      },
    ],
  },
];
