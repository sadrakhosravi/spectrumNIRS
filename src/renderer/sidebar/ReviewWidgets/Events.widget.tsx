import React, { useEffect } from 'react';
import { useAppSelector } from '@redux/hooks/hooks';

// HOC
import withLoading from '@hoc/withLoading.hoc';

//Components
import Tabs from '@components/Tabs/Tabs.component';
import Widget from '../../components/Widget/Widget.component';
import { useLocation } from 'react-router-dom';
import { useChartContext } from 'renderer/context/ChartProvider';
import msToTime from '@utils/msToTime';

import ReviewChart from 'renderer/charts/ChartClass/ReviewChart';
import RecordChart from 'renderer/charts/ChartClass/RecordChart';

// Icons

//Renders the filter widget on the sidebar
const EventsWidget = ({ setLoading, children }: any) => {
  const allEvents = useAppSelector((state) => state.chartState.allEvents);
  const location = useLocation();

  let chart: ReviewChart | RecordChart;

  if (location.pathname.includes('review')) {
    chart = useChartContext().reviewChart as ReviewChart;
  } else {
    chart = useChartContext().recordChart as RecordChart;
  }

  useEffect(() => {
    // Wait for all events to load
    allEvents && setLoading(false);
  }, [allEvents]);
  setLoading(false);

  const handleJumpToEvent = (time: number) => {
    const timeDiv = chart.chartOptions?.getTimeDivision() as number;

    chart.xAxisChart
      .getDefaultAxisX()
      .setInterval(time - 200, time - 200 + timeDiv);
  };

  return (
    <Widget span="5">
      <Tabs>
        <Tabs.Tab label="Events">
          <div className="h-full overflow-y-auto">
            <ul className="my-4 h-[calc(100%-4rem)] w-full rounded-md bg-grey1 p-3">
              <div className="h-[100%] overflow-y-auto overflow-x-hidden px-2 py-2">
                <div className="mb-3 flex h-10 w-full cursor-pointer items-center gap-3 rounded-sm border-b-[3px] border-b-white/30 px-2 ">
                  <span className="w-2/3 text-base">Name</span>
                  <span className="w-1/3 text-base">Time</span>
                </div>
                {allEvents?.map((event: any, i: number) => (
                  <>
                    <button
                      key={event + i}
                      className="border-primary mb-1 flex w-full cursor-pointer items-center gap-3 rounded-sm bg-grey2 p-4 text-left duration-150 hover:bg-grey0 active:ring-2 active:ring-accent"
                      onClick={() => {
                        handleJumpToEvent(event.timeSequence);
                      }}
                      title={`Click to view the event: ${event.name}`}
                    >
                      <span className="w-2/3 text-sm">{event.name}</span>
                      <span className="w-1/3 text-sm">
                        {msToTime(event.timeSequence)}
                      </span>
                    </button>
                  </>
                ))}
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
