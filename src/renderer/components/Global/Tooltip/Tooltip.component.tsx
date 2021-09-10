import React from 'react';

// Tippy tooltip
import Tippy from '@tippyjs/react';

const Tooltip = (props: any) => {
  const { tooltip = true, placement, text } = props;

  if (tooltip === true) {
    return (
      <Tippy placement={placement} delay={[0, 0]} content={text}>
        {props.children}
      </Tippy>
    );
  }
  // eslint-disable-next-line react/destructuring-assignment
  return <>{props.children}</>;
};

export default Tooltip;
