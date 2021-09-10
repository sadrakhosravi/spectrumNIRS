import React from 'react';

import SensorIcon from '@icons/sensor.svg';
import PatientIcon from '@icons/user-checked.svg';
import ExperimentIcon from '@icons/experiment.svg';

import Separator from '@globalComponent/Separator/Separator.component';

import styles from './TrayIcons.module.css';

const TrayIcons = () => {
  return (
    <footer className="text-right col-span-9">
      <Separator />
      <button className={`${styles.TrayIconsButton} px-2`}>
        <img
          src={ExperimentIcon}
          className={`${styles.TrayIcons} icon inline-block pr-2`}
          alt="Current Experiment"
        />
        Experiment: Name
      </button>
      <Separator />
      <button className={`${styles.TrayIconsButton} px-2`}>
        <img
          src={PatientIcon}
          className={`${styles.TrayIcons} icon inline-block pr-2`}
          alt="Current Patient"
        />
        Patient: Name
      </button>
      <Separator />
      <button className={`${styles.TrayIconsButton} px-2`}>
        <img src={SensorIcon} className={`${styles.TrayIcons} icon inline-block pr-2`} alt="Sensor Status" />
        Sensor: Connected
      </button>
    </footer>
  );
};

export default TrayIcons;
