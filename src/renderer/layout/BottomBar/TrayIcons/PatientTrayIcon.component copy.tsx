import React from 'react';
import { useAppSelector } from '@redux/hooks/hooks';

import withTooltip from '@hoc/withTooltip.hoc';
import TrayIconButtons from './TrayIconButton.component';

import PatientIcon from '@icons/user-checked.svg';

const TrayIconWithTooltip = withTooltip(TrayIconButtons);

const PatientTrayIcon = () => {
  const patientData = useAppSelector(
    (state) => state.global.patient?.currentPatient
  );

  let patientTooltipText = null;

  if (patientData) {
    patientTooltipText = (
      <div className="px-2 py-2 text-left">
        <h2 className="text-xl text-accent mb-1">Patient</h2>

        <div className="ml-4">
          <p>Name: {patientData?.name}</p>
          <p>DOB: {patientData.dob}</p>
          {patientData?.description && (
            <p>Description: {patientData?.description}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      {patientData && (
        <TrayIconWithTooltip
          icon={PatientIcon}
          text={`Patient: ${patientData?.name}`}
          tooltip={patientTooltipText}
          interactive
        />
      )}
    </>
  );
};
export default PatientTrayIcon;
