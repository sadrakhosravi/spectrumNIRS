import * as React from 'react';

// Widgets
import { ProbeSettingsWidget } from './ProbeSettingsWidget';
import { GlobalFiltersWidget } from './GlobalFiltersWidget';

export const CalibrationWidgets = () => {
  return (
    <>
      <ProbeSettingsWidget />
      <GlobalFiltersWidget />
    </>
  );
};
