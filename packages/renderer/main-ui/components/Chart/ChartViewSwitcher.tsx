import * as React from 'react';
import { observer } from 'mobx-react-lite';

// Styles
// import * as styles from './chartViewSwitcher.module.scss';

// Components
import { ButtonIconText, SelectButton } from '../Elements/Buttons';
import { Popover } from '../Elements/Popover/Popover';
import { Column, Row } from '../Elements/Grid';

// Icons
import { FiGrid, FiBarChart2, FiActivity } from 'react-icons/fi';

// View Models
import { chartVM } from '@store';

export const ChartViewSwitcher = observer(() => {
  const [isOpen, setIsOpen] = React.useState(false);
  const buttonRef = React.useRef<HTMLButtonElement>(null);

  return (
    <>
      <ButtonIconText
        text="Chart View"
        icon={<FiGrid size="16px" />}
        dropDownIndicator
        buttonRef={buttonRef}
        onClick={() => setIsOpen(true)}
      />
      {isOpen && (
        <Popover
          title="Chart View"
          height={100}
          buttonRef={buttonRef.current as HTMLButtonElement}
          closeSetter={setIsOpen}
        >
          <Row marginTop="1rem">
            <Column width="50%">
              <SelectButton
                text="Line Chart"
                isActive={chartVM.currentView === 'line'}
                onClick={() => chartVM.setCurrentView('line')}
                icon={<FiActivity size="16px" />}
              />
            </Column>
            <Column width="50%">
              <SelectButton
                text="Bar Chart"
                isActive={chartVM.currentView === 'bar'}
                onClick={() => chartVM.setCurrentView('bar')}
                icon={<FiBarChart2 size="16px" />}
              />
            </Column>
          </Row>
        </Popover>
      )}
    </>
  );
});
