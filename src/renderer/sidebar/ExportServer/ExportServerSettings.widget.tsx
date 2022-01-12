import React, { useState } from 'react';

import Widget from '../../components/Widget/Widget.component';
import Tabs from '@components/Tabs/Tabs.component';
import ButtonMenu, {
  ButtonMenuItem,
} from '@components/Buttons/ButtonMenu.component';

// Icons
import CheckMarkIcon from '@icons/checkmark.svg';
import Separator from '@components/Separator/Separator.component';

const dataTypes = ['Single Data Point', 'Batch (25samples)'];
const protocolVersions = ['v1', 'v2'];

//Renders the filter widget on the sidebar
const ExportServerSettings = () => {
  const [outputDataType, setOutputDataType] = useState(dataTypes[0]);
  const [protocolVersion, setProtoclVersion] = useState(protocolVersions[0]);

  return (
    <Widget span="2">
      <Tabs>
        <Tabs.Tab label="Settings">
          <div className="py-2 w-full">
            <p className="mb-2">Output Data: </p>
            <ButtonMenu text={outputDataType} width="290px">
              {dataTypes.map((type) => (
                <ButtonMenuItem
                  text={type}
                  icon={type === outputDataType ? CheckMarkIcon : undefined}
                  onClick={() => setOutputDataType(type)}
                />
              ))}
            </ButtonMenu>
          </div>
          <Separator orientation="horizontal" margin="lg" />
          <div className="w-full">
            <p className="mb-2">Protocol Version: </p>
            <ButtonMenu text={protocolVersion} width="290px">
              {protocolVersions.map((version) => (
                <ButtonMenuItem
                  text={version}
                  icon={protocolVersion === version ? CheckMarkIcon : undefined}
                  onClick={() => setProtoclVersion(version)}
                />
              ))}
            </ButtonMenu>
          </div>
        </Tabs.Tab>
      </Tabs>
    </Widget>
  );
};

export default ExportServerSettings;
