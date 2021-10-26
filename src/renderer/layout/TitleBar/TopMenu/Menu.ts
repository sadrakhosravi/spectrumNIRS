import { openModal } from '@redux/ModalStateSlice';
import { ModalConstants } from '@utils/constants';

import { DialogBoxChannels } from '@utils/channels';

import store from '@redux/store';
const { dispatch } = store;

export const TopMenu = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Open',
        click: () => {},
      },
      {
        label: 'Close',
      },
      {
        label: 'Exit',
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
        click: () => dispatch(openModal(ModalConstants.NEWPATIENT)),
      },
      {
        label: 'Recording',
        click: () => dispatch(openModal(ModalConstants.NEWRECORDING)),
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
            detail: "Powered by Microsoft's Electron. Current version: 0.1.0",
          }),
      },
    ],
  },
];
