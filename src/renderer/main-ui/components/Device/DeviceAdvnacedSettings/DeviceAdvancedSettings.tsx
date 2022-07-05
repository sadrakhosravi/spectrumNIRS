import * as React from 'react';

// Styles
import styles from './deviceSettings.module.scss';

// Components
import { Dialog } from '../../Elements/Dialog';
import { DialogContainer } from '../../Elements/DialogContainer';
import { Column, Row } from '../../Elements/Grid';

// View Models
import { appRouterVM } from '@viewmodels/VMStore';
import { Separator } from '../../Elements/Separator';
import { DeviceInfoType } from 'reader/api/Types';

type DeviceSelectorType = {
  deviceName: string;
  open: boolean;
  closeSetter: (value: boolean) => void;
};

export const DeviceAdvancedSettings = ({
  deviceName,
  open,
  closeSetter,
}: DeviceSelectorType) => {
  const [deviceSettings, setDeviceSettings] =
    React.useState<DeviceInfoType | null>(null);

  React.useEffect(() => {
    (async () => {
      const settings = null;
      if (!settings) return;

      setDeviceSettings(settings);
    })();

    // Clear the loading state
    setTimeout(() => appRouterVM.setAppLoading(false), 500);
  }, []);

  return (
    <Dialog open={open} closeSetter={closeSetter}>
      <DialogContainer
        title={`${deviceName} Settings`}
        actionButtons={<></>}
        closeSetter={closeSetter}
      >
        {deviceSettings && (
          <>
            {/* PD settings */}
            <div className={styles.PDSettings}>
              <Row>
                <Column width="20%">
                  <span className="text-larger">PD Settings</span>
                </Column>
                <Column width="80%">
                  <div className={styles.PDSettingsPDColumns}>
                    <span>
                      <label htmlFor="test">PD 1</label>
                      <input type="checkbox" id="test" />
                    </span>
                  </div>
                </Column>
              </Row>
            </div>

            {/* Separator */}
            <Separator />

            {/* LED Settings */}
            <div className={styles.PDSettings}>
              <Row>
                <Column width="20%">
                  <span className="text-larger">LED Settings</span>
                </Column>
                <Column width="80%">
                  <div className={styles.PDSettingsPDColumns}>
                    <>
                      {deviceSettings.PDChannelNames.map((channelName) => (
                        <span>
                          <label htmlFor={channelName}>{channelName}</label>
                          <input type="checkbox" id={channelName} />
                        </span>
                      ))}
                    </>
                  </div>
                </Column>
              </Row>
            </div>
          </>
        )}
      </DialogContainer>
    </Dialog>
  );
};
