import { useEffect } from 'react';

const initDataManager = () => {
  useEffect(() => {
    (async () => {
      (await import('../DataManager/DataManager')).default;
    })();
  }, []);
};
export default initDataManager;
