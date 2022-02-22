import React from 'react';

type FormGroupProps = {
  children: React.ReactNode;
  className?: string;
};

const FormGroup = ({ children, className = '' }: FormGroupProps) => {
  return (
    <div
      className={`grid auto-rows-auto grid-cols-[125px_1fr] items-center gap-x-2 pb-4 ${className} border-primary rounded-md px-3 pt-4 pb-6`}
    >
      {children}
    </div>
  );
};
export default FormGroup;
