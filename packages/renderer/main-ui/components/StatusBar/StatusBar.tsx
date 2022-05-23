import * as React from 'react';
import { observer } from 'mobx-react-lite';

// Styles
import * as styles from './statusBar.module.scss';

// Components
import { StatusBarItem } from './';

// Icon
import { FiXCircle } from 'react-icons/fi';

// View Model
// import { deviceManagerVM } from '@store';

export const StatusBar = observer(() => {
  return (
    <footer className={styles.StatusBar}>
      <div className={styles.LeftItems}></div>
      <div className={styles.RightItems}>
        <StatusBarItem icon={<FiXCircle />} text={'No Connected'} />
      </div>
    </footer>
  );
});
