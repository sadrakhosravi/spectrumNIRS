import * as React from 'react';

// Styles
import * as styles from './deviceList.module.scss';

// Icons
import { FiServer, FiXCircle, FiCheckCircle } from 'react-icons/fi';

type DeviceListItemType = {
  name: string;
  isConnected: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export const DeviceListItem = ({ name, isConnected, onClick }: DeviceListItemType) => {
  return (
    <button className={styles.DeviceListItem} onClick={onClick}>
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
    </button>
  );
};
