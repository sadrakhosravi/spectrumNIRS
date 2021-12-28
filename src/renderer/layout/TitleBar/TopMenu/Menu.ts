import { dispatch, getState } from '@redux/store';
import { version } from '~/package.json';
import toast from 'react-hot-toast';

// Actions
import { openModal } from '@redux/ModalStateSlice';
import { resetExperimentData } from '@redux/ExperimentDataSlice';
import { changeRecordState } from '@redux/RecordStateSlice';

// Constants
import { ModalConstants, RecordState } from '@utils/constants';
import { DialogBoxChannels, UpdaterChannels } from '@utils/channels';

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
        click: () => {
          dispatch(changeRecordState(RecordState.IDLE));

          const noExperimentOpened =
            getState().experimentData.currentExperiment.id === -1;
          if (noExperimentOpened) return;

          dispatch(resetExperimentData());
          toast.success('Experiment closed.', { duration: 3000 });
        },
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
        click: () => window.api.sendIPC(UpdaterChannels.CheckForUpdate),
      },
    ],
  },
];
