import * as React from 'react';

// Style
import * as styles from './toggleArea.module.scss';

type ToggleAreaProps = {
  children: React.ReactNode;
  defaultState?: boolean;
  setter?: (value: boolean) => void;
};

export const ToggleArea = ({ defaultState = false, setter, children }: ToggleAreaProps) => {
  const [isActive, setIsActive] = React.useState(defaultState);
  const id = React.useId();

  return (
    <div>
      <div className={styles.ToggleButton}>
        <label htmlFor={id}>Lowpass Filter</label>

        <input
          id={id}
          type="checkbox"
          onChange={() => {
            setter && setter(!isActive);
            setIsActive(!isActive);
          }}
          checked={isActive}
        />
      </div>
      {isActive && children}
      {!isActive && <p className={styles.DisabledText}>Enable this area to see the options.</p>}
    </div>
  );
};
