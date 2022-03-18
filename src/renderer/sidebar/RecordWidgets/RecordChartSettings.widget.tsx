import React, { useState, useEffect, useRef } from 'react';

import Widget from '../../components/Widget/Widget.component';
import Tabs from '@components/Tabs/Tabs.component';
import ButtonMenu, {
  ButtonMenuItem,
} from '@components/Buttons/ButtonMenu.component';
import FormGroup from '@components/Form/FormGroup.component';
import TogglableSelect from '@components/Form/TogglableSelect.component';

import { useChartContext } from 'renderer/context/ChartProvider';

const FPSLimits = [0.5, 1, 2, 5, 10];

const RecordChartSettingsWidget = () => {
  const [FPSLimiter, setFPSLimiter] = useState(false);
  const [FPSLimit, setFPSLimit] = useState(FPSLimits[1]);
  const firsLoadRef = useRef(false);

  const recordChart = useChartContext().recordChart;
  useEffect(() => {
    if (!firsLoadRef.current) {
      firsLoadRef.current = true;
      return;
    }
    recordChart?.stopListeningForData();
    console.log(FPSLimit, FPSLimiter);

    setTimeout(() => recordChart?.listenForData(FPSLimiter, FPSLimit), 100);
  }, [FPSLimit, FPSLimiter]);

  return (
    <Widget span="2">
      <Tabs>
        <Tabs.Tab label="General">
          <div className="mb-4 mt-1" aria-disabled={FPSLimiter}>
            <FormGroup>
              <TogglableSelect
                text="Refresh Limit"
                isActive={FPSLimiter}
                setIsActive={setFPSLimiter}
                zIndex={3}
              >
                <p className="text-sm">Refresh Per Sec</p>
                <ButtonMenu text={FPSLimit} width="100%">
                  {FPSLimits.map((fps) => (
                    <ButtonMenuItem
                      key={fps + 'fps'}
                      text={fps}
                      isActive={FPSLimit === fps}
                      onClick={() => {
                        setFPSLimit(fps);
                      }}
                    />
                  ))}
                </ButtonMenu>
              </TogglableSelect>
            </FormGroup>
          </div>
        </Tabs.Tab>
      </Tabs>
    </Widget>
  );
};

export default RecordChartSettingsWidget;
