import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@redux/hooks/hooks';
import { setCurrentEventTimeStamp } from '@redux/ChartSlice';

// HOC
import withLoading from '@hoc/withLoading.hoc';

//Components
import Tabs from '@components/Tabs/Tabs.component';
import Widget from '../../components/Widget/Widget.component';

// Icons

//Renders the filter widget on the sidebar
const EventsWidget = ({ setLoading, children }: any) => {
  const dispatch = useAppDispatch();
  const allEvents = useAppSelector((state) => state.chartState.allEvents);

  useEffect(() => {
    // Wait for all events to load
    allEvents && setLoading(false);
    console.log(allEvents);
  }, [allEvents]);
  setLoading(false);

  return (
    <Widget span="3">
      <Tabs>
        <Tabs.Tab label="Events">
          <div className="h-full overflow-y-auto">
            <ul className="my-4 h-[calc(100%-4rem)] w-full rounded-md bg-grey1 p-3">
              <div className="h-[100%] overflow-y-auto overflow-x-hidden">
                {allEvents?.map(
                  (event: any, i: number) =>
                    !event.end && (
                      <li
                        key={event + i}
                        className="flex h-10 w-full cursor-pointer items-center gap-3 rounded-sm border-b-[3px] border-grey1 bg-grey2 p-4 hover:bg-grey1 hover:text-blue-400"
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
      </Tabs>

      {children}
    </Widget>
  );
};

export default withLoading(EventsWidget, 'Loading events ...');
