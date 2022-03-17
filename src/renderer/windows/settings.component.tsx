import React from 'react';
import ChildTitlebar from '@layout/TitleBar/ChildTitlebar.component';

// Icons
import SpectrumIcon from '@icons/spectrum-settings.svg';

const SettingsWindow = () => {
  return (
    <div>
      <ChildTitlebar text="Spectrum Settings" icon={SpectrumIcon} />
    </div>
  );
};
export default SettingsWindow;
