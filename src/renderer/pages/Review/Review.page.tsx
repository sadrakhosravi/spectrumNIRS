import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setIsNewWindow } from '@redux/ReviewTabStateSlice';

// Main area components
const Chart = React.lazy(() => import('renderer/Chart/Chart.component'));

// Sidebar components
import WidgetsContainer from 'renderer/Chart/Widgets/WidgetsContainer.component';

// Constants
import { ChartType } from 'utils/constants';
import { ReviewTabChannels } from '@utils/channels';

const Review = () => {
  const dispatch = useDispatch();
  const isNewWindow = useSelector((state: any) => state.reviewTabState.value);
  console.log(isNewWindow);

  useEffect(() => {
    window.api.onIPCData(
      ReviewTabChannels.IsNewWindowOpened,
      (_event, data: boolean) => {
        dispatch(setIsNewWindow(data));
      }
    );
  }, []);

  return (
    <>
      {!isNewWindow && (
        <div className="grid grid-cols-12 grid-rows-3 gap-4 h-full w-full">
          <div className="col-span-10 h-full row-span-3">
            <React.Suspense fallback={<p>Loading ...</p>}>
              <Chart type={ChartType.REVIEW} />
            </React.Suspense>
          </div>
          <div className="col-span-2 mr-3 row-span-3">
            <WidgetsContainer />
          </div>
        </div>
      )}
      {isNewWindow && (
        <p className="text-xl text-light2 p-4">
          This tab is currently opened in a new window. Please close the window
          to be able to use the Review tab here.
        </p>
      )}
    </>
  );
};

export default Review;
