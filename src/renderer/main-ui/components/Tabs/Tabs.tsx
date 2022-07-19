import * as React from 'react';

// Styles
import styles from './tabs.module.scss';

// Components
import { TabButton } from './TabButton';
import { TabIndicator } from './TabIndicator';

type TabsType = {
  children: JSX.Element | JSX.Element[];
};

export const Tabs = ({ children }: TabsType) => {
  const [activeTab, setActiveTab] = React.useState(0);
  const width = Array.isArray(children) ? 100 / children.length : 33.3;

  if (!Array.isArray(children)) {
    const { header } = children.props;

    return (
      <div className={styles.Tabs}>
        <div className={styles.TabButtonsContainer}>
          <TabButton
            text={header}
            isActive
            onClick={() => {}}
            key={header}
            style={{ width: width + '%' }}
          />
          <TabIndicator style={{ width: width + '%' }} />
        </div>
        <div className={styles.TabItemContainer}>{children}</div>
      </div>
    );
  }

  return (
    <div className={styles.Tabs}>
      <div className={styles.TabButtonsContainer}>
        {Array.isArray(children) &&
          children.map((child, i) => {
            const { header } = child.props;
            return (
              <TabButton
                text={header}
                isActive={activeTab === i}
                onClick={() => setActiveTab(i)}
                key={header + i}
              />
            );
          })}
        <TabIndicator
          style={{ left: activeTab * width + '%', width: width + '%' }}
        />
      </div>
      <div className={styles.TabItemContainer}>
        {Array.isArray(children) &&
          children.map((child, i) => activeTab === i && child)}
      </div>
    </div>
  );
};
