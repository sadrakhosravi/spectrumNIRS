import * as React from 'react';

// Styles
import * as styles from './deviceList.module.scss';

// Components
import { Popover } from '../Elements/Popover/Popover';
import { ButtonIconText } from '../Elements/Buttons';
import { DeviceListItem } from './DeviceListItem';

// Icons
import { FiServer, FiRefreshCcw } from 'react-icons/fi';

export const DeviceList = () => {
  const buttonRef = React.useRef<HTMLButtonElement>(null);
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <ButtonIconText
        buttonRef={buttonRef}
        icon={<FiServer size="16px" />}
        text="Devices"
        dropDownIndicator
        onClick={() => setIsOpen(true)}
      />
      {isOpen && (
        <Popover
          buttonRef={buttonRef.current as HTMLButtonElement}
          closeSetter={setIsOpen}
          title="Devices"
        >
          <DeviceListItem name="Beast" isConnected={true} />
          <ButtonIconText
            className={styles.DeviceListRefreshButton}
            text="Refresh"
            icon={<FiRefreshCcw size="15px" strokeWidth={3} />}
          />
        </Popover>
      )}
    </>
  );
};
