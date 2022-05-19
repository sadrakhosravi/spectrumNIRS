import * as React from 'react';
import { Dialog as Popup } from '@headlessui/react';

// Styles
import * as styles from './dialog.module.scss';

type DialogType = {
  open: boolean;
  children: React.ReactNode;
  closeSetter: (value: boolean) => void;
};

export const Dialog = ({ open, children, closeSetter }: DialogType) => {
  return (
    <>
      <Popup open={open} onClose={() => closeSetter(false)} className={styles.Dialog}>
        {children}
        <div className={styles.Overlay} onClick={() => closeSetter(false)} />
      </Popup>
    </>
  );
};
