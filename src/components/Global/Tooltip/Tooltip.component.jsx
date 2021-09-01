import React from 'react';

//Tippy tooltip
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light.css';

const Tooltip = props => {
  const { tooltip = true, placement, text } = props;

  if (tooltip === true) {
    return (
      <Tippy placement={placement} delay={[0, 0]} content={text}>
        {props.children}
      </Tippy>
    );
  } else {
    return <>{props.children}</>;
  }
};

export default Tooltip;
