import React, { useEffect, useRef, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ChartPositions } from '@redux/ReviewChartSlice';

import styles from './SignalSettings.module.css';
import ColorPicker from '@components/ColorPicker/ColorPicker.component';
import MenuSeparator from '@components/Separator/MenuSeparator.component';

// Icons
import AddIcon from '@icons/add.svg';
import Button from '@components/Buttons/Button.component';
import Tabs from '@components/Tabs/Tabs.component';
import CloseButton from '@components/Buttons/CloseButton.component';

type SignalLabelAndSettingsProps = {
  name: string | undefined;
  color: string;
  chartPos: ChartPositions;
};

const SignalLabelAndSettings = ({
  name,
  color,
  chartPos,
}: SignalLabelAndSettingsProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isBottom, setIsBottom] = useState(false);
  const [buttonPos, setButtonPos] = useState<any>();
  const [signalColor, setSignalColor] = useState(color);
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (isOpen === true) {
      const position = buttonRef.current?.getBoundingClientRect() as DOMRect;

      if (position.y + 340 >= window.innerHeight) {
        position.y = position.y - position.height - 320;
        setIsBottom(true);
      } else {
        setIsBottom(false);
      }
      setButtonPos(position);
    }
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [isOpen]);

  return (
    <>
      {chartPos.height > 80 ? (
        <button
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 h-min w-full p-1.5 hover:bg-grey1 rounded-md slideLeft"
        >
          <div
            className="w-6 h-6 rounded-sm "
            style={{ background: signalColor }}
          ></div>
          <p className="text-lg">{name}</p>
        </button>
      ) : (
        <button
          className="flex items-center h-full w-full px-1.5 hover:bg-grey1 rounded-md ease-in"
          ref={buttonRef}
          onClick={() => setIsOpen(!isOpen)}
        >
          <div
            className="w-2 h-full rounded-sm "
            style={{ background: color }}
          ></div>
        </button>
      )}
      {buttonPos && (
        <Transition show={isOpen} className="fixed z-50">
          <Dialog
            open={isOpen}
            as="div"
            className="w-screen h-screen bg-dark"
            onClose={() => setIsOpen(false)}
          >
            <div className="min-h-screen px-4 text-center z-50">
              <Dialog.Overlay className="fixed inset-0" />
              <div
                className="pt-8 fixed w-[450px] h-80 z-50 slideLeft"
                style={{
                  top: buttonPos.y + buttonPos.height + 5 + 'px',
                  left: buttonPos.x,
                }}
              >
                <div
                  className={
                    isBottom
                      ? styles.SignalModuleTriangleBottom
                      : styles.SignalModuleTriangleTop
                  }
                />

                <div className="absolute top-3 left-0 w-[450px] h-80 z-10 overflow-y-auto bg-grey3 border-primary drop-shadow-lg rounded-md text-white text-left overflow-x-hidden">
                  {/** Close button */}

                  <CloseButton
                    className="absolute top-0.5 right-1 z-50"
                    onClick={() => setIsOpen(false)}
                  />

                  <Tabs>
                    <Tabs.Tab label="Signal">
                      {/** Channel color and name settings */}
                      <div className="flex items-center gap-1">
                        <ColorPicker
                          color={signalColor}
                          setColor={setSignalColor}
                        />
                        <input
                          className="h-8 px-2 bg-dark2 focus:ring-2 focus:ring-accent duration-150 rounded-md w-full border-primary"
                          title="Edit channel name"
                          defaultValue={name}
                          ref={inputRef}
                        />
                      </div>

                      <MenuSeparator className="my-4 w-full" />

                      {/** Channel signal settings */}
                      <div>
                        <h4 className="mb-1.5 text-light2">
                          Hide/Remove Signals
                        </h4>
                        <div className="flex items-center gap-2 w-full">
                          <div className="bg-dark w-1/2 py-2 rounded-md flex items-center gap-3 px-4 border-primary active:ring-2 active:ring-accent cursor-pointer duration-150">
                            <div
                              className="w-4 h-4 rounded-full"
                              style={{ background: color }}
                            />
                            {name}
                            <button className="px-2 py-1 absolute top-1/2 -translate-y-1/2 right-2 hover:bg-white hover:bg-opacity-30 active:bg-opacity-50 rounded-md">
                              ❌
                            </button>
                          </div>
                        </div>
                      </div>

                      <MenuSeparator className="my-4 w-full" />

                      {/** Channel filter and calculations settings */}
                      <div>
                        <h4 className="mb-2 text-light2">Filters</h4>
                        <div className="flex items-center gap-2 w-full">
                          <Button text="Add filter" icon={AddIcon} />
                        </div>
                      </div>
                    </Tabs.Tab>
                  </Tabs>
                </div>
              </div>
            </div>
          </Dialog>
        </Transition>
      )}
    </>
  );
};
export default SignalLabelAndSettings;
