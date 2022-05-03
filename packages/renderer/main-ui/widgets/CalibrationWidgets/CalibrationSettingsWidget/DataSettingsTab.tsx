import * as React from 'react';

// Components
import { Row, Column } from '/@/components/Elements/Grid';

const defaultCoef = 0.1;
const coefKey = 'hardwareCoef';

export const DataSettingsTab = () => {
  const [coefVal, setCoefVal] = React.useState(defaultCoef);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (value < 0) return;
    if (value > 100000) return;
    setCoefVal(value);
    window.localStorage.setItem(coefKey, value.toString());
  };

  // Store the coef in the browser local storage for now.
  React.useEffect(() => {
    const coef = window.localStorage.getItem(coefKey);
    if (!coef) return;
    setCoefVal(parseFloat(coef));
  }, []);

  return (
    <>
      <span className="text-larger">Hardware Calibration Coefficient</span>

      <Row marginTop="1rem" marginBottom="1rem">
        <Column width="50%">
          <span>Calibration Factor</span>
        </Column>
        <Column width="50%">
          <input
            type={'number'}
            value={coefVal}
            onChange={handleInputChange}
            min={0}
            max={10000}
            step="any"
          />
        </Column>
      </Row>
    </>
  );
};
