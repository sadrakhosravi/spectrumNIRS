import * as React from 'react';

// Styles
import * as styles from './dialogContainer.module.scss';

// Components
import { CloseButton } from '../../Elements/Buttons';

// Icons
import { FiCornerUpLeft } from 'react-icons/fi';
import Tippy from '@tippyjs/react';

type DialogContainerType = {
  title: string;
  actionButtons: JSX.Element | JSX.Element[];
  topBarActionButtons?: JSX.Element | JSX.Element[];
  searchInput?: JSX.Element;
  closable?: boolean;
  children: React.ReactNode;
  backButtonOnClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export const DialogContainer = ({
  title,
  actionButtons,
  topBarActionButtons,
  searchInput,
  closable,
  children,
  backButtonOnClick,
}: DialogContainerType) => {
  return (
    <div className={styles.DialogContainer}>
      {/* Inner container */}
      <div className="relative h-full w-full">
        {/* Action Bar - Contains search and reload button */}
        <div className={styles.ActionBar}>
          {backButtonOnClick && (
            <Tippy content="Go Back">
              <button className={styles.BackButton} onClick={backButtonOnClick}>
                <FiCornerUpLeft size="22px" />
              </button>
            </Tippy>
          )}
          <span className="text-larger">{title}</span>
          {/* Search area */}
          {searchInput && <span className={styles.SearchContainer}>{searchInput}</span>}
          {actionButtons && <span className={styles.ActionButtons}>{topBarActionButtons}</span>}
          {closable && <CloseButton className={styles.CloseButton} />}
        </div>

        {/* Content Area */}
        <div className={styles.ContentArea}>{children}</div>

        {/* Bottom Bar */}
        <div className={styles.BottomBar}>{actionButtons}</div>
      </div>
    </div>
  );
};
