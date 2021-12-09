import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAppSelector, useAppDispatch } from '@redux/hooks/hooks';
import { setCurrentEventTimeStamp } from '@redux/ChartSlice';

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
  const dispatch = useAppDispatch();
  const { register, handleSubmit } = useForm();
  const allEvents = useAppSelector((state) => state.chartState.allEvents);
  const onTimeFormSubmit = (data: any) => {
    console.log(data);
  };

  useEffect(() => {
    setLoading(false);
  }, []);
  return (
    <div className="bg-grey3 h-[calc(66.7%-3rem)] rounded-b-md">
      <Header>
        <TabButton
          text="Events"
          isActive={currentTab === 0}
          onClick={() => setCurrentTab(0)}
        />
        <TabButton
          text="Quick Actions"
          isActive={currentTab === 1}
          onClick={() => setCurrentTab(1)}
        />
      </Header>

      {/** Filter Form */}

      <div className="px-4 py-4">
        <div hidden={currentTab !== 0}>
          <h3 className="text-xl font-medium">All Events:</h3>
          <div className="overflow-y-auto">
            <ul className="my-4 bg-grey1 p-3 w-full rounded-md">
              <li className="w-full border-b-grey2 border-b-2 h-8 flex items-center mb-2">
                <span className="w-1/12">#</span>
                <span className="w-7/12">Name</span>
                <span className="w-4/12">Time</span>
              </li>
              <div className="h-72 overflow-y-auto  overflow-x-hidden">
                {allEvents?.map((event: any, i: number) => (
                  <li
                    className="w-full h-8 flex items-center cursor-pointer hover:text-accent"
                    onClick={() => {
                      dispatch(setCurrentEventTimeStamp(event.timeStamp));
                    }}
                    title={`Click to view the the event: ${event.name}`}
                  >
                    <span className="w-1/12">{i + 1}.</span>
                    <span className="w-7/12">{event.name}</span>
                    <span className="w-4/12">{event.time}</span>
                  </li>
                ))}
              </div>
            </ul>
          </div>
        </div>
        <div hidden={currentTab !== 1}>
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
