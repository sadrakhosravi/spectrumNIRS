import React from 'react';

// Tippy tooltip
import Tippy from '@tippyjs/react';

interface IProps {
  tooltip?: boolean;
  placement?: 'top' | 'right' | 'bottom' | 'left';
  text: string;
  children: any;
}

const Tooltip: React.FC<IProps> = (props) => {
  const { tooltip = true, placement, text } = props;

  if (tooltip === true) {
    return (
      <Tippy placement={placement} delay={[0, 0]} content={text}>
        {props.children}
      </Tippy>
    );
  }

  return <>{props.children}</>;
};

export default Tooltip;
