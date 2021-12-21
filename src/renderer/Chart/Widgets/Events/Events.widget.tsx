import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAppSelector, useAppDispatch } from '@redux/hooks/hooks';
import { setCurrentEventTimeStamp } from '@redux/ChartSlice';

// HOC
import withLoading from '@hoc/withLoading.hoc';

//Components
import Tabs from '@components/Tabs/Tabs.component';
import Widget from '../Widget.component';
import InputField from '@components/Form/InputField.component';

// Icons
import LoadIcon from '@icons/load.svg';

//Renders the filter widget on the sidebar
const EventsWidget = ({ setLoading, children }: any) => {
  const dispatch = useAppDispatch();
  const { register, handleSubmit } = useForm();
  const allEvents = useAppSelector((state) => state.chartState.allEvents);
  const onTimeFormSubmit = (data: any) => {
    console.log(data);
  };

  useEffect(() => {
    // Wait for all events to load
    allEvents && setLoading(false);
    console.log(allEvents);
  }, [allEvents]);

  console.log(allEvents);

  return (
    <Widget span="3">
      <Tabs>
        <Tabs.Tab label="Events">
          <div className="overflow-y-auto h-full">
            <ul className="my-4 bg-grey1 p-3 w-full rounded-md h-[calc(100%-4rem)]">
              <div className="h-[100%] overflow-y-auto overflow-x-hidden">
                {allEvents?.map(
                  (event: any, i: number) =>
                    !event.end && (
                      <li
                        key={event + i}
                        className="w-full h-10 flex items-center gap-3 cursor-pointer bg-grey2 p-4 rounded-sm border-b-[3px] border-grey1 hover:text-blue-400 hover:bg-grey1"
                        onClick={() => {
                          dispatch(setCurrentEventTimeStamp(event.timeStamp));
                        }}
                        title={`Click to view the the event: ${event.name}`}
                      >
                        <span className="w-6/12 text-base">{event.name}</span>
                        <span className="w-6/12 text-base">{event.time}</span>
                      </li>
                    )
                )}
                {allEvents?.length === 0 && (
                  <p className="text-light2">No event found</p>
                )}
              </div>
            </ul>
          </div>
        </Tabs.Tab>
        <Tabs.Tab label="Quick Actions">
          <div className="slideLeft">
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
        </Tabs.Tab>
      </Tabs>

      {children}
    </Widget>
  );
};

export default withLoading(EventsWidget, 'Loading events ...');
