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
      className="fixed m-0 py-1.5 z-50 w-[17rem]  list-none border-primary rounded-md bg-grey3 text-white"
      ref={ref}
      id="contextMenuList"
    >
      {items.map(({ label, value }: { label: string; value: string }, i) => {
        if (label === 'separator') {
          return (
            <div
              key={label + i + 'contextmenu'}
              className="w-full my-1 border-b-1 border-white border-opacity-20"
            />
          );
        } else {
          return (
            <button
              className="block py-1 w-[98%] mx-auto px-2 text-left rounded-md duration-150 hover:bg-grey0 active:ring-2 active:ring-accent "
              key={label + i + 'button-context-menu'}
              onClick={() => alert(`${label}: ${value}`)}
            >
              {label}
            </button>
          );
        }
      })}
    </ul>
  )
);
export default ContextMenu;
