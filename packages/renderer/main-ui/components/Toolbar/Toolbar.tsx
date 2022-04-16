import * as React from 'react';

import * as styles from './toolbar.module.scss';

type ToolbarType = {
  children: React.ReactNode;
};

export const Toolbar = ({ children }: ToolbarType) => {
  return <div className={styles.Toolbar}>{children}</div>;
};

type ToolbarSectionType = {
  text: string;
  children: React.ReactNode;
};

export const ToolbarSection = ({ text, children }: ToolbarSectionType) => {
  return (
    <div className={styles.ToolbarSection}>
      <div className={styles.ToolbarSectionText}>{text}</div>
      <div className={styles.ToolbarSectionContent}>{children}</div>
    </div>
  );
};
