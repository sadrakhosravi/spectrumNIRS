import React, { useEffect, useState } from 'react';

import Widget from '../../components/Widget/Widget.component';
import Tabs from '@components/Tabs/Tabs.component';
import ButtonMenu, {
  ButtonMenuItem,
} from '@components/Buttons/ButtonMenu.component';

import {
  lowpassFreq,
  lowpassOrder,
  highpassFreq,
  highpassOrder,
} from 'filters/filterConstants';
import { useAppSelector } from '@redux/hooks/hooks';
import FormGroup from '@components/Form/FormGroup.component';
import TogglableSelect from '@components/Form/TogglableSelect.component';

//Renders the filter widget on the sidebar
const Filter = () => {
  const liveFilter = useAppSelector((state) => state.global.liveFilter);

  // Lowpass
  const [LFc, setLFc] = useState(liveFilter?.lowpass.Fc);
  const [lOrder, setLOrder] = useState(liveFilter?.lowpass.order);

  // Highpass
  const [HFc, setHFc] = useState(liveFilter?.highpass.Fc);
  const [HOrder, setHOrder] = useState(liveFilter?.highpass.order);

  const [isLowpassActive, setIsLowpassActive] = useState(
    liveFilter?.lowpass.Fc ? true : false
  );
  const [isHighpassActive, setIsHighpassActive] = useState(
    liveFilter?.highpass.Fc ? true : false
  );

  // On state change, send the data to the controller
  useEffect(() => {
    if (isLowpassActive) {
      window.api.sendIPC('calc:live-filter-lowpass', {
        Fs: liveFilter?.Fs || 100,
        Fc: LFc || 5,
        order: lOrder || 6,
      });
    } else {
      window.api.sendIPC('calc:live-filter-lowpass', {
        Fs: liveFilter?.Fs || 100,
        Fc: null,
        order: null,
      });
    }
  }, [LFc, lOrder, isLowpassActive]);

  // On state change, send the data to the controller
  useEffect(() => {
    if (isHighpassActive) {
      window.api.sendIPC('calc:live-filter-highpass', {
        Fs: liveFilter?.Fs || 100,
        Fc: HFc || 0.02,
        order: HOrder || 3,
      });
    } else {
      window.api.sendIPC('calc:live-filter-highpass', {
        Fs: liveFilter?.Fs || 100,
        Fc: null,
        order: null,
      });
    }
  }, [HFc, HOrder, isHighpassActive]);

  console.log(isHighpassActive, isLowpassActive);

  return (
    <Widget span="3">
      <Tabs>
        <Tabs.Tab label="Filter">
          <div className="mb-4 mt-1" aria-disabled={true}>
            <FormGroup>
              <TogglableSelect
                text="Lowpass"
                isActive={isLowpassActive}
                setIsActive={setIsLowpassActive}
                zIndex={3}
              >
                <p className="text-sm">Frequency</p>
                <ButtonMenu text={liveFilter?.lowpass.Fc || 5} width="100%">
                  {lowpassFreq.map((Fc) => (
                    <ButtonMenuItem
                      key={Fc + 'cutoff+freq'}
                      text={Fc}
                      onClick={() => {
                        setLFc(Fc);
                      }}
                    />
                  ))}
                </ButtonMenu>
                <p className="text-sm">Order</p>
                <ButtonMenu text={liveFilter?.lowpass.order || 6} width="100%">
                  {lowpassOrder.map((order) => (
                    <ButtonMenuItem
                      key={order + 'cutoff+freq'}
                      text={order}
                      onClick={() => {
                        setLOrder(order);
                      }}
                    />
                  ))}
                </ButtonMenu>
              </TogglableSelect>
            </FormGroup>
          </div>

          <FormGroup>
            <TogglableSelect
              text="Highpass"
              isActive={isHighpassActive}
              setIsActive={setIsHighpassActive}
              zIndex={2}
            >
              <p className="mb-1 text-sm">Frequency</p>
              <ButtonMenu text={liveFilter?.highpass.Fc || 5} width="100%">
                {highpassFreq.map((Fc) => (
                  <ButtonMenuItem
                    key={Fc + 'cutoff+freq'}
                    text={Fc}
                    onClick={() => {
                      setHFc(Fc);
                    }}
                  />
                ))}
              </ButtonMenu>
              <p className="mt-3 mb-1 text-sm">Order</p>
              <ButtonMenu text={liveFilter?.highpass.order || 6} width="100%">
                {highpassOrder.map((order) => (
                  <ButtonMenuItem
                    key={order + 'cutoff+freq'}
                    text={order}
                    onClick={() => {
                      setHOrder(order);
                    }}
                  />
                ))}
              </ButtonMenu>
            </TogglableSelect>
          </FormGroup>
        </Tabs.Tab>
      </Tabs>
    </Widget>
  );
};

export default Filter;
