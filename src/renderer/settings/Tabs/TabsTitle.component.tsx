import React, { Fragment } from 'react';
import { Tab } from '@headlessui/react';

interface IProps {
  title: string;
}

const TabsTitle: React.FC<IProps> = ({ title }) => {
  return (
    <Tab as={Fragment}>
      {({ selected }) => (
        <button
          className={`${selected && 'bg-white bg-opacity-30'} w-full px-6 py-4`}
        >
          {title}
        </button>
      )}
    </Tab>
  );
};
export default TabsTitle;
