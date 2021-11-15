import { useAppSelector } from '@redux/hooks/hooks';
import React, { useEffect } from 'react';
import toast from 'react-hot-toast';

const ToastNotifications = () => {
  const exportStatus = useAppSelector((state) => state.chartState.exportStatus);
  useEffect(() => {
    toast.dismiss();
    exportStatus === 'loading' &&
      toast.loading('Exporting data', { duration: Infinity });
    exportStatus === 'done' && toast.success('Exporting data completed!');

    return () => {
      toast.dismiss;
    };
  }, [exportStatus]);
  return null;
};
export default React.memo(ToastNotifications);
