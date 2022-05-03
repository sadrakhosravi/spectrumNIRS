import * as React from 'react';

// Widgets
import { CalibrationSettingsWidget } from './CalibrationSettingsWidget';
import { GlobalFiltersWidget } from './GlobalFiltersWidget';

export const CalibrationWidgets = () => {
  return (
    <>
      <CalibrationSettingsWidget />
      <GlobalFiltersWidget />
    </>
  );
};
