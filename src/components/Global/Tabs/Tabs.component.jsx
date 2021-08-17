import React from 'react';

import TabItem from '@globalComponent/Tabs/TabItem.component';

import GraphLinesIcon from '@icons/graph-lines.svg';
import ReviewIcon from '@icons/review-white.svg';

const Tabs = () => {
  return (
    <div className="w-full bg-dark grid grid-flow-col auto-cols-max">
      <TabItem text="Record" icon={GraphLinesIcon} isActive={true} />
      <TabItem text="Review" icon={ReviewIcon} />
    </div>
  );
};

export default Tabs;
