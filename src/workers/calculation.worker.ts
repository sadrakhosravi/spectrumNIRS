import V5Calculation from 'calculations/V5/V5Calculation';

self.onmessage = (event) => {
  console.log(event.data);
  const v5Calc = new V5Calculation();
  const processData = v5Calc.processDbData(event.data);
  self.postMessage(processData);
};
