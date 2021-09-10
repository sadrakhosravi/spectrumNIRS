import React, { useState } from 'react';
import { Listbox } from '@headlessui/react';

//Components
import Header from '@globalComponent/Widgets/Header/Header.component';

//Source Options
const sources = [
  { id: 1, name: 'NIRS Reader' },
  { id: 2, name: 'Reader2' },
];

//Renders the source widget on the sidebar
const Source = () => {
  const [source, setSource] = useState(sources[0]);

  return (
    <div className="bg-grey3 h-1/4 relative mt-5">
      <Header title="Source" />

      {/** Filter Form */}
      <div className="p-4">
        <Listbox value={source} onChange={setSource}>
          <Listbox.Button className="w-full py-0.5 px-2 text-left bg-grey1 border-3 border-grey1 transition duration-200 hover:border-accent focus-within:border-accent ">
            {source.name}
          </Listbox.Button>

          {/*
        By default, this will automatically show/hide when the
        Listbox.Button is pressed.
      */}
          <Listbox.Options className="w-full mt-1 py-0.5 px-2 text-left bg-grey2 ">
            {sources.map((source) => (
              <Listbox.Option
                className="py-1 pl-4 cursor-pointer"
                key={source.id}
                value={source}
              >
                {({ active, selected }) => (
                  <li
                    className={`${active && 'text-accent'} ${
                      selected && 'text-accent'
                    }`}
                  >
                    {selected && '✔  '}
                    {source.name}
                  </li>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Listbox>
      </div>
    </div>
  );
};

export default Source;
