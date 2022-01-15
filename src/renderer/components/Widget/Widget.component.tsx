import React from 'react';
import Container from '@components/Containers/Container.component';

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
      <Container noPadding>{children}</Container>
    </div>
  );
};
export default Widget;
