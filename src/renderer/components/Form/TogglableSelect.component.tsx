import React from 'react';
import CheckBoxField from './CheckboxField.component';

type TogglableSelectProps = {
  text: string;
  isActive?: boolean;
  zIndex?: number;
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
  children: React.ReactNode;
};

const TogglableSelect = ({
  text,
  isActive,
  zIndex,
  children,
  setIsActive,
}: TogglableSelectProps) => {
  return (
    <div className="col-span-2">
      <div className="col-span-2 flex items-center gap-2">
        <label
          className="cursor-pointer select-none duration-150 hover:opacity-80"
          htmlFor={text + 'toggle'}
        >
          {text}
        </label>
        <CheckBoxField
          id={text + 'toggle'}
          className={`cursor-pointer select-none duration-150 hover:opacity-80`}
          onChange={() => setIsActive(!isActive)}
          checked={isActive}
        />
      </div>
      {isActive && (
        <div
          className="slideLeft mt-4 grid grid-cols-2 items-center gap-y-2"
          style={{ zIndex }}
        >
          {children}
        </div>
      )}
      {!isActive && (
        <div className="z-[-1] mt-2 select-none text-xs opacity-40">
          To view this section you need to first enable it.
        </div>
      )}
    </div>
  );
};
export default TogglableSelect;
