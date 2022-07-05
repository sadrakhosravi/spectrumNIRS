import * as React from 'react';

// Styles
import styles from './listItem.module.scss';

// Icons
import { FiServer } from 'react-icons/fi';
import { Button } from '../Buttons';

type ListItem = {
  id?: string;
  title: string;
  buttonText: string;
  disabled?: boolean;
  active?: boolean;
  lastUpdate?: number;
  description?: string;
  onDoubleClick?: React.MouseEventHandler<HTMLDivElement>;
  onClick?: React.MouseEventHandler<HTMLDivElement | HTMLButtonElement>;
};

export const ListItem = ({
  title,
  disabled,
  description,
  lastUpdate,
  active,
  buttonText,
  onClick,
  onDoubleClick,
}: ListItem) => {
  return (
    <div
      className={`${styles.ListItem} ${disabled ? styles.Disabled : ''} ${
        active ? styles.Active : ''
      }`}
      onDoubleClick={onDoubleClick}
      tabIndex={1}
    >
      <span className={styles.Icon}>
        <FiServer size="38px" strokeWidth={1.5} />
      </span>
      <span className={styles.Info}>
        <span className="text-larger">{title}</span>
        {lastUpdate && <span className={styles.LastUpdate}>{lastUpdate}</span>}
        <span>{description || 'No description'}</span>
      </span>
      {!disabled && (
        <span className={styles.Buttons}>
          <Button text={buttonText} onClick={onClick} />
        </span>
      )}
    </div>
  );
};
