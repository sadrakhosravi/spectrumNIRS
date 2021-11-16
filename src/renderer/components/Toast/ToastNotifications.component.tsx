import { useAppSelector } from '@redux/hooks/hooks';
import React, { useEffect } from 'react';
import toast from 'react-hot-toast';

const ToastNotifications = () => {
  const exportStatus = useAppSelector((state) => state.chartState.exportStatus);
  useEffect(() => {
    toast.dismiss();
    exportStatus === 'loading' &&
      toast.loading('Exporting data', { duration: Infinity });
    exportStatus === 'done' && toast.success('Data export completed!');
    exportStatus === 'error' &&
      toast.error('An error has occurred during export');
    exportStatus === 'canceled' && toast('Export was canceled');
    return () => {
      toast.dismiss;
    };
  }, [exportStatus]);
  return null;
};
export default React.memo(ToastNotifications);
