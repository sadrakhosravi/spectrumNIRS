import * as React from 'react';
import { observer } from 'mobx-react-lite';

// Components
import { Row, Column } from '/@/components/Elements/Grid';

const coefKey = 'hardwareCoef';

export const DataSettingsTab = observer(() => {
  const inputId = React.useId();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (value < 0) return;
    if (value > 100000) return;
    window.localStorage.setItem(coefKey, value.toString());
  };

  // Store the coef in the browser local storage for now.
  React.useEffect(() => {
    const coef = window.localStorage.getItem(coefKey);
    if (!coef) return;
  }, []);

  return (
    <>
      <span className="text-larger">Hardware Calibration Coefficient</span>

      <Row marginTop="1rem" marginBottom="1rem">
        <Column width="50%">
          <label htmlFor={inputId}>Calibration Factor</label>
        </Column>
        <Column width="50%">
          <input
            id={inputId}
            type={'number'}
            value={1}
            onChange={handleInputChange}
            min={0}
            max={10000}
            step="any"
          />
        </Column>
      </Row>
    </>
  );
});