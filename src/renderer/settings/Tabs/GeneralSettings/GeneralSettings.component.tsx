import React from 'react';

// Components
import InputLabelGroup from '@components/Form/InputLabelGroup.component';

// Hooks
import { useFormContext } from 'react-hook-form';

// The general settings tab in the Experiment Settings modal
const GeneralSettings = () => {
  // Form context for deeply nested inputs
  const { register } = useFormContext();

  return (
    <>
      <div className="bg-grey2 h-full w-full py-4 px-8">
        <InputLabelGroup
          label={'Sampling Rate'}
          register={register('experiment.SamplingRate')}
        />
      </div>
      <div className="bg-grey2 h-full w-full py-4 px-8">
        <InputLabelGroup
          label={'Number of Channels'}
          register={register('experiment.NumOfChannels')}
        />
      </div>
    </>
  );
};
export default GeneralSettings;
