import React from 'react';

// Components
import Modal from '@components/Modal/Modal.component';
import { Tab } from '@headlessui/react';
import TabsTitle from './Tabs/TabsTitle.component';

// Constants
import { ModalConstants } from 'renderer/constants/Constants';

const ExperimentSettings = () => {
  return (
    <Modal
      id={ModalConstants.EXPERIMENTSETTINGS}
      title="Experiment Settings"
      size="large"
    >
      <div>
        <Tab.Group
          className="grid grid-flow-col grid-cols-12 gap-4"
          as="div"
          vertical
        >
          <Tab.List className="col-span-3">
            <TabsTitle title="General Settings" />
          </Tab.List>
          <Tab.Panels className="col-span-9">
            <Tab.Panel>Test</Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </Modal>
  );
};
export default ExperimentSettings;
