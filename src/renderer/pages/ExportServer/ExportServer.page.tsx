import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@redux/hooks/hooks';
import InitExportServer from './initServer/InitServer';
import toast from 'react-hot-toast';

// Components
import ExportServerToolbar from './Toolbar/ExportServerToolbar.component';
import Page from '@components/Page/Page.component';
import ServerInfo from './ServerInfo/ServerInfo.component';
import ServerStatus from './ServerStatus/ServerStatus.component';
import ClientStatus from './ClientStatus/ClientStatus.component';

// Constants
import { SidebarType } from '@utils/constants';
import { setSidebar } from '@redux/AppStateSlice';

const ExportServerPage = () => {
  // Initialize the server
  InitExportServer();
  const sidebarState = useAppSelector((state) => state.appState.sidebar);
  const serverError = useAppSelector((state) => state.exportServerState.error);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (serverError) toast.error(serverError, { duration: 5000 });
  }, [serverError]);

  return (
    <Page
      sidebarType={SidebarType.EXPORT_SERVER}
      sidebarState={sidebarState}
      onSidebarClick={() => dispatch(setSidebar(!sidebarState))}
    >
      <ExportServerToolbar />
      <div className="flex gap-6 m-10 h-[calc(100%-130px)]">
        <div className="w-1/2 flex flex-col gap-6">
          <div className="h-3/5">
            <ServerInfo />
          </div>
          <div className="h-2/5">
            <ServerStatus />
          </div>
        </div>
        <div className="w-1/2 ">
          <ClientStatus />
        </div>
      </div>
    </Page>
  );
};
export default ExportServerPage;
