import React from 'react';
import withTooltip from '@hoc/withTooltip.hoc';
import IconButton from '@components/Buttons/IconButton.component';
import WidgetsContainer from '@sidebar/WidgetsContainer.component';

import HideRightPanelIcon from '@icons/hide-right-panel.svg';

import { SidebarType } from '@utils/constants';

const IconButtonWithTooltip = withTooltip(IconButton, 'Hide sidebar');

type PageProps = {
  children: React.ReactNode;
  sidebarType?: SidebarType | undefined;
  onSidebarClick?: React.MouseEventHandler<HTMLDivElement> | undefined;
  sidebarState?: boolean;
};

const Page = ({
  children,
  sidebarType,
  sidebarState = true,
  onSidebarClick,
}: PageProps) => {
  return (
    <div className={`absolute top-0 left-0 h-full w-full flex`}>
      <div
        className={`h-full relative ${
          sidebarType && sidebarState
            ? 'w-[calc(100%-350px)]'
            : 'w-[calc(100%-20px)]'
        }`}
      >
        {children}
      </div>
      {!sidebarState && (
        <div
          className="h-full border-primary relative w-[20px] border-primary bg-grey1 hover:bg-accent hover:cursor-pointer duration-150"
          onClick={onSidebarClick}
        ></div>
      )}
      {sidebarType && sidebarState && (
        <div className={`h-full border-l-primary relative w-[350px]`}>
          <>
            <WidgetsContainer type={sidebarType} />
            <div className="absolute bottom-3 right-2 opacity-40 hover:opacity-100">
              <IconButtonWithTooltip
                icon={HideRightPanelIcon}
                onClick={onSidebarClick}
              />
            </div>
          </>
        </div>
      )}
    </div>
  );
};
export default Page;
