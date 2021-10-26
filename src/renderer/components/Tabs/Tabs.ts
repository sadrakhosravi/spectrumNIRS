// Icons
import RecordingIcon from '@icons/graph-lines.svg';
import ReviewIcon from '@icons/review-white.svg';
import { AppState } from '@utils/constants';

// All tabs in the app
export const Tabs = [
  {
    id: 'record',
    name: 'Recording',
    icon: RecordingIcon,
    path: AppState.RECORD,
    isActive: (appState: AppState) => appState === AppState.RECORD,
  },
  {
    id: 'review',
    name: 'Review',
    icon: ReviewIcon,
    path: AppState.REVIEW,
    isActive: (appState: AppState) => appState === AppState.REVIEW,
  },
];
