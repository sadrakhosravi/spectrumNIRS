import React from 'react';

type WidgetProps = {
  span?: '1' | '2' | '3' | '4' | '5';
  children: JSX.Element | JSX.Element[];
};

const Widget = ({ span = '2', children }: WidgetProps) => {
  return (
    <div
      className={`rounded-md overflow-x-hidden overflow-y-hidden drop-shadow-md`}
      style={{ gridRow: `span ${span} / span ${span}` }}
    >
      <div className="rounded-md h-full">{children}</div>
    </div>
  );
};
export default Widget;
