import React from 'react';

type FormGridProps = {
  children: React.ReactNode;
  className?: string;
};

const FormGrid = ({ children, className = '' }: FormGridProps) => {
  return (
    <div
      className={`grid auto-rows-auto grid-cols-[125px_1fr] items-center gap-x-2 gap-y-6 pb-4 ${className}`}
    >
      {children}
    </div>
  );
};
export default FormGrid;
