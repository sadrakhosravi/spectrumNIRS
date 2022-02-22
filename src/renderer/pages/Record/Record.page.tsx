import React from 'react';
import { useAppDispatch, useAppSelector } from '@redux/hooks/hooks';
import { setRecordSidebar } from '@redux/AppStateSlice';

// Main area components
import RecordChart from 'renderer/charts/RecordChart.component';
import Page from '@components/Page/Page.component';

// Constants
import { SidebarType } from '@utils/constants';

const RecordPage = () => {
  const sidebarStatus = useAppSelector((state) => state.appState.recordSidebar);
  const dispatch = useAppDispatch();
  console.log('RECORD PAGE');
  return (
    <Page
      sidebarType={SidebarType.RECORD}
      sidebarState={sidebarStatus}
      onSidebarClick={() => dispatch(setRecordSidebar(!sidebarStatus))}
    >
      <RecordChart />
    </Page>
  );
};

export default RecordPage;
