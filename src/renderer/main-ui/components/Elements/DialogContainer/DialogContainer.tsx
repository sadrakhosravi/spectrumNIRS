import * as React from 'react';

// Styles
import styles from './dialogContainer.module.scss';

// Components
import { CloseButton } from '../../Elements/Buttons';

// Icons
import { FiCornerUpLeft, FiInfo } from 'react-icons/fi';
import Tippy from '@tippyjs/react';

type DialogContainerType = {
  title: string;
  actionButtons: JSX.Element | JSX.Element[];
  topBarActionButtons?: JSX.Element | JSX.Element[];
  noContentMessage?: string | null;
  searchInput?: JSX.Element;
  closeSetter?: (value: boolean) => void;
  children: React.ReactNode;
  backButtonOnClick?: React.MouseEventHandler<HTMLButtonElement>;
};

export const DialogContainer = ({
  title,
  actionButtons,
  topBarActionButtons,
  searchInput,
  noContentMessage,
  closeSetter,
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
          {searchInput && (
            <span className={styles.SearchContainer}>{searchInput}</span>
          )}
          {actionButtons && (
            <span className={styles.ActionButtons}>{topBarActionButtons}</span>
          )}
          {closeSetter && (
            <CloseButton
              className={styles.CloseButton}
              onClick={() => closeSetter(false)}
            />
          )}
        </div>

        {/* Content Area */}
        <div className={styles.ContentArea}>
          {children}

          {/* Show a message if no recording exits */}
          {noContentMessage && (
            <div className={styles.NoContentContainer}>
              <FiInfo size="102px" opacity={0.6} strokeWidth={1.5} />
              <span className="text-larger">
                No recordings found! Please create a recording or import from a
                file.
              </span>
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        <div className={styles.BottomBar}>{actionButtons}</div>
      </div>
    </div>
  );
};
