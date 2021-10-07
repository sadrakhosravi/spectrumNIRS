import React from 'react';

const TextAreaField = (props: any) => {
  return (
    <textarea
      {...props.register}
      className="px-3 py-2 w-full bg-light text-dark focus:ring-2 ring-accent rounded-sm"
    />
  );
};

export default TextAreaField;
