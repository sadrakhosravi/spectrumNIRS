import React, { useState } from 'react';

import IconText from '@components/MicroComponents/IconText/IconText.component';

const Tabs = ({ children }: { children: JSX.Element[] | JSX.Element }) => {
  const [activeTab, setActiveTab] = useState(0);

  if (!Array.isArray(children)) {
    const { label } = children.props;

    return (
      <div className="h-full border-1">
        <div className="h-10 bg-grey1">
          <Tabs.Button
            label={label}
            isActive={true}
            onClick={() => {}}
            key={label}
          />
        </div>
        <div className="bg-grey3 h-[calc(100%-2.5rem)] py-2">{children}</div>
      </div>
    );
  }

  return (
    <div className="h-full border-1 rounded-md">
      <div className="flex rounded-md">
        {Array.isArray(children) &&
          children.map((child, i) => {
            const { label } = child.props;
            return (
              <Tabs.Button
                label={label}
                isActive={activeTab === i}
                onClick={() => setActiveTab(i)}
                key={label + i}
              />
            );
          })}
      </div>
      <div className="bg-grey3 h-[calc(100%-2.5rem)] py-2">
        {Array.isArray(children) &&
          children.map((child, i) => activeTab === i && child)}
      </div>
    </div>
  );
};
export default Tabs;

type TabProps = {
  label: string;
  children: JSX.Element | JSX.Element[];
};

Tabs.Tab = ({ label, children }: TabProps) => {
  return (
    <div className="slideLeft px-3 " id={label}>
      {children}
    </div>
  );
};

type ButtonProps = {
  label: string;
  onClick: React.MouseEventHandler<HTMLButtonElement> | undefined;
  isActive?: boolean;
};

Tabs.Button = ({ label, isActive = false, onClick }: ButtonProps) => {
  const tabColor = isActive
    ? `bg-grey3 z-10 border-0`
    : `bg-grey1 hover:bg-grey2 z-0 `;

  return (
    <button
      type="button"
      className={`w-1/2 px-3 h-10 flex items-center border-r-2 border-white border-opacity-20 ${tabColor} last:border-r-0`}
      onClick={onClick}
      id={label}
    >
      <IconText text={label} />
    </button>
  );
};
