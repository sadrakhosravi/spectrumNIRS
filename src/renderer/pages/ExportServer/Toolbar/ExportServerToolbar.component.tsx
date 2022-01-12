import React from 'react';

// Components
import ToolbarContainer from '@components/Toolbar/ToolbarContainer.component';
import Button from '@components/Buttons/Button.component';

// Icons
import StartIcon from '@icons/start.svg';

const ExportServerToolbar = () => {
  return (
    <ToolbarContainer>
      <div className="grid grid-cols-6 items-center w-full h-full px-6">
        <div className="text-lg">Export Server</div>
        <div className="col-start-6 text-right">
          <Button text="Send Data" className="bg-accent" icon={StartIcon} />
        </div>
      </div>
    </ToolbarContainer>
  );
};
export default ExportServerToolbar;
