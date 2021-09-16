import React from 'react';

const InputField = (props: any) => {
  return (
    <input
      {...props.register}
      className="px-3 py-2 w-full bg-light text-dark focus:ring-2 ring-accent"
    />
  );
};

export default InputField;
