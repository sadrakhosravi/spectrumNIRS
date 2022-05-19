import * as React from 'react';

// Styles
import * as styles from './listItem.module.scss';

// Icons
import { FiServer } from 'react-icons/fi';
import { Button } from '../Buttons';

type ListItem = {
  id: string;
  title: string;
  isSelected: boolean;
  disabled?: boolean;
  active?: boolean;
  lastUpdate?: number;
  description?: string;
  setter?: (id: string) => void;
  onDoubleClick?: React.MouseEventHandler<HTMLDivElement>;
  onClick?: React.MouseEventHandler<HTMLDivElement | HTMLButtonElement>;
};

export const ListItem = ({
  id,
  title,
  disabled,
  description,
  lastUpdate,
  isSelected,
  active,
  setter,
  onClick,
  onDoubleClick,
}: ListItem) => {
  return (
    <div
      className={`${styles.ListItem} ${disabled ? styles.Disabled : ''} ${
        isSelected ? styles.ListItemActive : ''
      } ${active ? styles.Active : ''}`}
      title="Double click to open the recording"
      onDoubleClick={onDoubleClick}
      onClick={() => setter && setter(id)}
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
          <Button text="Select" onClick={onClick} />
        </span>
      )}
    </div>
  );
};
