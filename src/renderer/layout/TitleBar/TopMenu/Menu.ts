import { version } from '~/package.json';
// Actions
import { openModal } from '@redux/ModalStateSlice';

// Constants
import { ModalConstants } from '@utils/constants';
import { DialogBoxChannels } from '@utils/channels';

import store from '@redux/store';
const { dispatch, getState } = store;

export const TopMenu = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Open',
        click: () => {
          dispatch(openModal(ModalConstants.OPEN_EXPERIMENT));
        },
      },
      {
        label: 'Close',
      },
      {
        label: 'Exit',
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
        click: () => dispatch(openModal(ModalConstants.NEWEXPERIMENT)),
      },
      {
        label: 'Patient',
        click: () =>
          getState().experimentData.currentExperiment.name
            ? dispatch(openModal(ModalConstants.NEWPATIENT))
            : dispatch(openModal(ModalConstants.NEWEXPERIMENT)),
      },
      {
        label: 'Recording',
        click: () =>
          getState().experimentData.currentPatient.name
            ? dispatch(openModal(ModalConstants.NEWRECORDING))
            : dispatch(openModal(ModalConstants.NEWEXPERIMENT)),
      },
    ],
  },
  {
    label: 'Help',
    submenu: [
      {
        label: 'About',
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
        click: () =>
          window.api.invokeIPC(DialogBoxChannels.MessageBox, {
            title: 'No updates available',
            message: 'No updates available',
            detail: 'No updates currently available, please check back later.',
            type: 'info',
          }),
      },
    ],
  },
];
