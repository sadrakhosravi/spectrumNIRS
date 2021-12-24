import Tippy from '@tippyjs/react';
import React from 'react';

// Returns a component with a hoverable tooltip text
const withTooltip = (
  WrappedComponent: any,
  tooltipText?: string,
  tooltipPosition?: 'top' | 'right' | 'bottom' | 'left'
) => {
  // Return a component with tooltip
  return (props: any) => {
    if (!tooltipText && !props.tooltip) {
      return (
        <span>
          <WrappedComponent {...props} />
        </span>
      );
    } else {
      return (
        <Tippy
          placement={tooltipPosition || 'bottom'}
          delay={[0, 0]}
          duration={[0, 0]}
          content={tooltipText || props.tooltip}
          interactive={props.interactive || false}
        >
          <span>
            <WrappedComponent {...props} />
          </span>
        </Tippy>
      );
    }
  };
};
export default withTooltip;
