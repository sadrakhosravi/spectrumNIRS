import * as React from 'react';

// Styles
import styles from './deviceList.module.scss';

// Icons
import { FiServer, FiXCircle, FiCheckCircle, FiSettings } from 'react-icons/fi';
import { ButtonIconText } from '../Elements/Buttons';

type DeviceListItemType = {
  name: string;
  isConnected: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  onSettingsClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export const DeviceListItem = ({
  name,
  isConnected,
  onClick,
  onSettingsClick,
}: DeviceListItemType) => {
  return (
    <div className={styles.DeviceListItem} onClick={onClick}>
      <FiServer size="20px" />
      {name}
      <div>
        <span>Status:</span>
        <span>
          {isConnected ? (
            <FiCheckCircle size="18px" color="green" />
          ) : (
            <FiXCircle size="18px" color="red" />
          )}
        </span>
      </div>
      <ButtonIconText
        className={styles.DeviceSettingsButton}
        icon={<FiSettings size="16px" />}
        text="Settings"
        onClick={onSettingsClick}
      />
    </div>
  );
};
