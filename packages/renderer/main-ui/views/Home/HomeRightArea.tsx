import * as React from 'react';

// Components
import { LargeActionButton } from '/@/components/Elements/Buttons';

// Icons
import { FiFilePlus, FiUser, FiActivity } from 'react-icons/fi';

// Types
import type { IconType } from 'react-icons';

type ActionButtonsType = {
  text: string;
  icon: IconType;
  description: string;
  onClick?: React.MouseEventHandler<HTMLElement>;
};

const actionButtons: ActionButtonsType[] = [
  {
    text: 'New Experiment',
    icon: FiFilePlus,
    description: 'Create a new experiment',
  },
  {
    text: 'New Patient',
    icon: FiUser,
    description: 'Create a new patient',
  },
  {
    text: 'New Recording',
    icon: FiActivity,
    description: 'Create a new recording',
  },
];

const iconSize = '44px';
const iconStrokeWidth = 1.5;

export const HomeRightArea = () => {
  return (
    <div>
      <div className="text-larger mb">Get Started</div>
      <div>
        {actionButtons.map((button) => (
          <LargeActionButton
            key={button.text + button.description}
            text={button.text}
            description={button.description}
            onClick={button.onClick}
            icon={<button.icon size={iconSize} strokeWidth={iconStrokeWidth} />}
          />
        ))}
      </div>
    </div>
  );
};
