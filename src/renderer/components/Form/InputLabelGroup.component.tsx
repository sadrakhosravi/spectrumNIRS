import React from 'react';

// Components
import InputField from './InputField.component';

interface IProps {
  label: string;
  register?: any;
}

/**
 * Label and Input form group
 */
const InputLabelGroup: React.FC<IProps> = (props) => {
  const { label, register } = props;
  return (
    <span className="grid w-full grid-flow-col grid-cols-9 items-center">
      <label htmlFor={register?.name} className="col-span-2">
        {label}
      </label>
      <span className="col-span-7">
        <InputField register={register} />
      </span>
    </span>
  );
};
export default InputLabelGroup;
