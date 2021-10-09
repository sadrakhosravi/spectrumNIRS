import Tippy from '@tippyjs/react';
import React from 'react';

// Returns a component with a hoverable tooltip text
const withTooltip = (
  WrappedComponent: JSX.Element | any,
  tooltipText: string,
  tooltipPosition?: 'top' | 'right' | 'bottom' | 'left'
) => {
  // Return a component with tooltip
  return (props: any) => {
    return (
      <Tippy
        placement={tooltipPosition || 'bottom'}
        delay={[0, 0]}
        content={tooltipText}
      >
        <span>
          <WrappedComponent {...props} />
        </span>
      </Tippy>
    );
  };
};
export default withTooltip;
