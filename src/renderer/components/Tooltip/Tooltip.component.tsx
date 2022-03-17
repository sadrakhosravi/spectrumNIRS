import React from 'react';
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
      <Tippy
        placement={placement}
        className="font-inherit text-white border-primary drop-shadow-md
          bg-grey3
          "
        delay={[100, 0]}
        duration={[150, 0]}
        content={text}
      >
        {props.children}
      </Tippy>
    );
  }

  return <>{props.children}</>;
};

export default Tooltip;
