import React, { useEffect } from 'react';

// Components
import Modal from '@components/Modals/Modal.component';
import { Tab } from '@headlessui/react';
import TabsTitle from './Tabs/TabsTitle.component';

// Constants
import { ModalConstants } from '@constants/constants';
import GeneralSettings from './Tabs/GeneralSettings/GeneralSettings.component';

// Hooks/Form
import { useForm, FormProvider } from 'react-hook-form';
import SubmitButton from '@components/Form/SubmitButton.component';

const ExperimentSettings = () => {
  useEffect(() => {
    return () => {};
  });
  // Used for deeply nested inputs
  const methods = useForm();

  const onSubmit = (data: any) => {
    console.log(data);
  };

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

          <Tab.Panels className="col-span-9 h-full w-full">
            <FormProvider {...methods}>
              <form onSubmit={methods.handleSubmit(onSubmit)}>
                <Tab.Panel>
                  <GeneralSettings />
                </Tab.Panel>
                <SubmitButton text={'Save'} />
              </form>
            </FormProvider>
          </Tab.Panels>
        </Tab.Group>
      </div>
    </Modal>
  );
};
export default ExperimentSettings;
