import React from 'react';

// Components
import IconText from '@components/MicroComponents/IconText/IconText.component';

// Icons
import PatientIcon from '@icons/patient.svg';

const NewPatientButton = () => {
  return (
    <li className="absolute top-0 left-64 h-full top-menu">
      <button className="h-full px-3 grid items-center bg-dark hover:bg-accent">
        <IconText icon={PatientIcon} text="New Patient" />
      </button>
    </li>
  );
};

export default NewPatientButton;
