import React from 'react';

// Components
import IconButton from '@components/Buttons/IconButton.component';

// Icons
import FocusModeIcon from '@icons/focus-mode.svg';
import withTooltip from 'renderer/hoc/withTooltip.hoc';
const FocusButtonComp = withTooltip(IconButton, 'Focus Mode');

const FocusButton = () => {
  return <FocusButtonComp icon={FocusModeIcon} />;
};

export default FocusButton;
