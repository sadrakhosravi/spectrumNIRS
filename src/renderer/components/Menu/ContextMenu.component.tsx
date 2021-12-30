import React, { forwardRef } from 'react';

type Items = {
  items: {
    label: string;
    value: string;
  }[];
};

const ContextMenu = forwardRef(
  ({ items }: Items, ref: React.Ref<HTMLUListElement>) => (
    <ul
      className="fixed m-0 px-2 py-1.5 z-50 min-w-[10rem] list-none border-primary rounded-md bg-grey2 text-white"
      ref={ref}
    >
      {items.map(({ label, value }) => (
        <li key={value} onClick={() => alert(`${label}: ${value}`)}>
          {label}
        </li>
      ))}
    </ul>
  )
);
export default ContextMenu;
