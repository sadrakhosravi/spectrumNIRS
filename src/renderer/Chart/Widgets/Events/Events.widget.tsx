import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

// HOC
import withLoading from '@hoc/withLoading.hoc';

//Components
import Header from 'renderer/Chart/Widgets/Header/Header.component';
import TabButton from '../Tabs/TabButton.component';
import InputField from '@components/Form/InputField.component';

// Icons
import LoadIcon from '@icons/load.svg';

//Renders the filter widget on the sidebar
const EventsWidget = ({ setLoading, children }: any) => {
  const [currentTab, setCurrentTab] = useState(0);
  const { register, handleSubmit } = useForm();

  const onTimeFormSubmit = (data: any) => {
    console.log(data);
  };

  useEffect(() => {
    setLoading(false);
  }, []);
  return (
    <div className="bg-grey3 h-[calc(66.7%-3rem)] rounded-b-md duration-300 hover:drop-shadow-xl">
      <Header>
        <TabButton
          text="Events"
          isActive={currentTab === 0}
          onClick={() => setCurrentTab(0)}
        />
        <TabButton
          text="Events"
          isActive={currentTab === 1}
          onClick={() => setCurrentTab(1)}
        />
      </Header>

      {/** Filter Form */}

      <div className="px-4 py-4">
        <div hidden={currentTab !== 0}>
          <h3 className="text-xl font-medium">Jump to:</h3>
          <form
            onSubmit={handleSubmit(onTimeFormSubmit)}
            className="flex gap-4 items-center mt-4 "
          >
            <span className="w-1/4">Time(s)</span>
            <span className="w-full">
              <InputField
                type="number"
                register={register('time', { required: true })}
              />
            </span>
            <button
              className="w-1/4 text-right opacity-60 hover:opacity-100"
              type="submit"
            >
              <img src={LoadIcon} className="h-40px" title="Load Data" />
            </button>
          </form>
        </div>
      </div>
      {children}
    </div>
  );
};

export default withLoading(EventsWidget, 'Contacting Hardware ...');
