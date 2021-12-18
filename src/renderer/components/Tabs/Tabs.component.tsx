import React, { useState } from 'react';

import IconText from '@components/MicroComponents/IconText/IconText.component';

const Tabs = ({ children }: { children: JSX.Element[] | JSX.Element }) => {
  const [activeTab, setActiveTab] = useState(0);

  if (!Array.isArray(children)) {
    const { label } = children.props;

    return (
      <>
        <div className="h-40px bg-grey1">
          <Tabs.Button
            label={label}
            isActive={true}
            onClick={() => {}}
            key={label}
          />
        </div>
        <div>{children}</div>
      </>
    );
  }

  return (
    <div className="h-full">
      <div className="flex">
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
      <div className="h-full">
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
    <div className="slideLeft my-3 px-3 h-[calc(100%-2rem)]" id={label}>
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
    ? `bg-grey3 z-10 border-accent hover:border-accent`
    : `bg-grey1 border-grey1 hover:bg-grey2 hover:border-grey2 z-0`;

  return (
    <button
      type="button"
      className={`w-1/2 px-3 h-40px border-t-4 grid grid-flow-col auto-cols-max items-center transition duration-100 ${tabColor}`}
      onClick={onClick}
      id={label}
    >
      <IconText text={label} />
    </button>
  );
};
