import React from 'react';
import withTooltip from '@hoc/withTooltip.hoc';
import TrayIconButtons from './TrayIconButton.component';

import ExperimentIcon from '@icons/experiment.svg';
import { useAppSelector } from '@redux/hooks/hooks';

const TrayIconWithTooltip = withTooltip(TrayIconButtons);

const ExperimentTrayIcon = () => {
  const experimentData = useAppSelector(
    (state) => state.global.experiment?.currentExp
  );
  let experimentTooltipText = null;

  if (experimentData) {
    experimentTooltipText = (
      <div className="px-2 py-2 text-left">
        <h2 className="text-xl text-accent mb-1">Experiment</h2>

        <div className="ml-4">
          <p>Name: {experimentData.name}</p>
          <p>Date: {experimentData.date}</p>
          {experimentData.description && (
            <p>Description: {experimentData.description}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      {experimentData && (
        <TrayIconWithTooltip
          icon={ExperimentIcon}
          text={`Experiment: ${experimentData?.name}`}
          tooltip={experimentTooltipText}
          interactive
        />
      )}
    </>
  );
};
export default ExperimentTrayIcon;
