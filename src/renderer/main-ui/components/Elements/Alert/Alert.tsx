import * as React from 'react';

// Icons
import {
  FiInfo,
  FiAlertCircle,
  FiAlertTriangle,
  FiCheckCircle,
} from 'react-icons/fi';

// Styles
import styles from './alert.module.scss';

type AlertType = {
  message: string;
  type: 'info' | 'error' | 'warning' | 'success';
};

const iconSettings = {
  size: '32px',
};

export const Alert = ({ message, type }: AlertType) => {
  let className;
  let icon;

  if (type === 'info') {
    className = styles.Info;
    icon = FiInfo;
  }
  if (type === 'error') {
    className = styles.Error1;
    icon = FiAlertCircle;
  }
  if (type === 'warning') {
    className = styles.Warning;
    icon = FiAlertTriangle;
  }
  if (type === 'success') {
    className = styles.Success;
    icon = FiCheckCircle;
  }

  return (
    <div className={`${styles.Alert} ${className}`}>
      {icon?.call(null, { ...iconSettings })}
      {message}
    </div>
  );
};
