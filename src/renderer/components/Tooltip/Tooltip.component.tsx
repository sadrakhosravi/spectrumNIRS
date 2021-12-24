import React from 'react';

// Tippy tooltip
const Tippy = React.lazy(() => import('@tippyjs/react'));

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
      <React.Suspense fallback={'Loading ...'}>
        <Tippy
          placement={placement}
          delay={[0, 0]}
          duration={[0, 0]}
          content={text}
        >
          {props.children}
        </Tippy>
      </React.Suspense>
    );
  }

  return <>{props.children}</>;
};

export default Tooltip;
