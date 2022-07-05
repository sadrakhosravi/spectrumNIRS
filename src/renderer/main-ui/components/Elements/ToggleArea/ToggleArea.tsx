import * as React from 'react';

// Style
import styles from './toggleArea.module.scss';

type ToggleAreaProps = {
  children: React.ReactNode;
  isActive: boolean;
  setter: (value: boolean) => void;
};

export const ToggleArea = ({ isActive, setter, children }: ToggleAreaProps) => {
  const id = React.useId();

  return (
    <div>
      <div className={styles.ToggleButton}>
        <label htmlFor={id}>Lowpass Filter</label>

        <input
          id={id}
          type="checkbox"
          onChange={() => setter(!isActive)}
          checked={isActive}
        />
      </div>
      {isActive && children}
      {!isActive && (
        <p className={styles.DisabledText}>
          Enable this area to see the options.
        </p>
      )}
    </div>
  );
};
