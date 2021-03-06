import React, { useState } from 'react';

import IconText from '@components/MicroComponents/IconText/IconText.component';

type TabsProps = {
  children: JSX.Element | JSX.Element[];
  tabTopBorder?: boolean;
  noBorder?: boolean;
};

const Tabs = ({
  noBorder = false,
  tabTopBorder = true,
  children,
}: TabsProps) => {
  const [activeTab, setActiveTab] = useState(0);

  if (!Array.isArray(children)) {
    const { label } = children.props;

    return (
      <div className={`h-full ${noBorder ? '' : ''}`}>
        <div className="h-10 bg-grey1">
          <Tabs.Button
            label={label}
            isActive={true}
            topBorder={tabTopBorder}
            onClick={() => {}}
            key={label}
          />
        </div>
        <div className="h-[calc(100%-2.5rem)] bg-grey3 py-2">{children}</div>
      </div>
    );
  }

  return (
    <div className={`h-full rounded-md ${noBorder ? '' : ''}`}>
      <div className="flex rounded-md">
        {Array.isArray(children) &&
          children.map((child, i) => {
            const { label } = child.props;
            return (
              <Tabs.Button
                label={label}
                isActive={activeTab === i}
                topBorder={tabTopBorder}
                onClick={() => setActiveTab(i)}
                key={label + i}
              />
            );
          })}
      </div>
      <div className="h-[calc(100%-2.5rem)] bg-grey3 py-2">
        {Array.isArray(children) &&
          children.map((child, i) => activeTab === i && child)}
      </div>
    </div>
  );
};
export default Tabs;

type TabProps = {
  label: string;
  children: JSX.Element | JSX.Element[] | React.ReactChildren;
};

Tabs.Tab = ({ label, children }: TabProps) => {
  return (
    <div
      className="slideLeft h-[calc(100%-0px)] w-full overflow-y-auto px-3"
      id={label}
    >
      {children}
    </div>
  );
};

type ButtonProps = {
  label: string;
  topBorder?: boolean;
  onClick: React.MouseEventHandler<HTMLButtonElement> | undefined;
  isActive?: boolean;
};

Tabs.Button = ({
  label,
  isActive = false,
  topBorder = true,
  onClick,
}: ButtonProps) => {
  const tabColor = isActive
    ? `bg-grey3 z-10 border-0 ${
        topBorder ? 'border-t-4 border-t-accent border-t-opacity-100' : ''
      }`
    : `bg-grey1 hover:bg-grey2 z-0 `;

  return (
    <button
      type="button"
      className={`flex h-10 w-1/3 items-center border-r-2 border-grey0 px-3 ${tabColor} last:border-r-0`}
      onClick={onClick}
      id={label}
    >
      <IconText text={label} />
    </button>
  );
};
