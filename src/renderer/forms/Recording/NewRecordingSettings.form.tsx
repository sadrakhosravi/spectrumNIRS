import React from 'react';
import { useFormContext } from 'react-hook-form';

// Adapters
import InputField from '@components/Form/InputField.component';
import FormGroup from '@components/Form/FormGroup.component';
import CheckBoxField from '@components/Form/CheckboxField.component';

type NewRecordingSettingsProps = {};

const NewRecordingSettings = (_props: NewRecordingSettingsProps) => {
  const { register, watch, setValue } = useFormContext();

  const TOIThreshold = watch('TOI.threshold');

  if (!TOIThreshold) {
    setValue('TOI.minimum', undefined);
    setValue('TOI.maximum', undefined);
  }

  return (
    <div className="w-full px-4 pt-2 ">
      <div className="w-full">
        <h3 className="pt-2 pb-6 text-xl">Recording Settings:</h3>
        <FormGroup>
          <div className="col-span-2 flex items-center">
            <label className="font-medium" htmlFor="TOIThresholdEnabler">
              TOI Threshold
            </label>
            <span className="ml-2 block pt-1">
              <CheckBoxField
                register={register('TOI.threshold')}
                id="TOIThresholdEnabler"
              />
            </span>
          </div>
          <div
            className={`col-span-2 ml-[3rem] mr-4 mt-2 grid grid-cols-2 gap-4 ${
              !TOIThreshold && 'text-light2'
            }`}
          >
            <div>
              <label className="text-sm" htmlFor="TOI.minimum">
                Minimum Value
              </label>
              <div>
                <InputField
                  type="number"
                  register={register('TOI.minimum')}
                  disabled={!TOIThreshold}
                />
              </div>
            </div>
            <div>
              <label className="text-sm" htmlFor="TOI.maximum">
                Maximum Value
              </label>
              <div>
                <InputField
                  type="number"
                  register={register('TOI.maximum')}
                  disabled={!TOIThreshold}
                />
              </div>
            </div>
          </div>
        </FormGroup>
      </div>
    </div>
  );
};
export default NewRecordingSettings;
