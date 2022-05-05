import * as React from 'react';
import { Dialog } from '@headlessui/react';

// Styles
import * as styles from './dialogBox.module.scss';

// Icons
import { FiX, FiAlertCircle } from 'react-icons/fi';

type DialogBoxType = {
  isOpen: boolean;
  type: 'error' | 'success' | 'info' | 'warning';
  title: string;
  children: JSX.Element | JSX.Element[];
  closeSetter: (value: boolean) => void;
};

export const DialogBox = ({ isOpen, type, title, children, closeSetter }: DialogBoxType) => {
  return (
    <>
      <div className={styles.DialogBoxOverlay} />
      <Dialog open={isOpen} onClose={() => closeSetter(false)} className={styles.DialogBox}>
        <div className={styles.DialogBoxContent}>
          <button className={styles.CloseButton} onClick={() => closeSetter(false)} title="Close">
            <FiX strokeWidth={3} size="24px" />
          </button>
          <div className={styles.DialogBoxChildren}>
            {type === 'error' && <FiAlertCircle color="red" size={58} />}
            <span>
              <span className={styles.Title}>{title}</span>
              <span className={styles.Message}>{children}</span>
            </span>
          </div>
        </div>
      </Dialog>
    </>
  );
};
