import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { useAppSelector } from '@redux/hooks/hooks';
import { useForm } from 'react-hook-form';
import { RadioGroup } from '@headlessui/react';

// Components
import SubmitButton from '@components/Form/SubmitButton.component';

// Icons
import ExportExcelIcon from '@icons/export-excel.svg';
import ExportTextIcon from '@icons/export-txt.svg';

// Utils
import msToTime from '@utils/msToTime';

// Constants
import { ChartChannels } from '@utils/channels';

const ExportForm = () => {
  const [exportRange, setExportRange] = useState([
    'No data found',
    'No data found',
  ]);
  const currentRecording = useAppSelector(
    (state) => state.experimentData.currentRecording
  );
  const exportOptions = [
    {
      type: 'Text File (TXT)',
      icon: ExportTextIcon,
      extension: 'txt',
    },
    {
      type: 'Excel File (CSV)',
      icon: ExportExcelIcon,
      extension: 'csv',
    },
  ];
  const [exportOption, setExportOption] = useState(exportOptions[0].extension);
  const { register, handleSubmit } = useForm();

  const onSubmit = async (_data: any) => {
    toast.loading('Exporting. This might take a while', { duration: Infinity });

    const result = await window.api.invokeIPC(ChartChannels.ExportAll, {
      recordingId: currentRecording.id,
      type: exportOption,
    });

    toast.dismiss();
    result === 'canceled' && toast.error('Export was canceled');
    result === true && toast.success('Data exported successfully');

    console.log(result);
  };

  useEffect(() => {
    (async () => {
      const range = await window.api.invokeIPC(
        ChartChannels.GetExportRange,
        currentRecording.id
      );
      console.log(range);
      range.start !== undefined &&
        setExportRange([msToTime(range.start), msToTime(range.end)]);
    })();
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h3 className="text-xl text-medium pb-3">Select File Type</h3>
      <RadioGroup value={exportOption} onChange={setExportOption}>
        <RadioGroup.Label className="sr-only">Server size</RadioGroup.Label>
        <div className="grid grid-cols-2 gap-6">
          {exportOptions.map((exportOption) => (
            <RadioGroup.Option
              value={exportOption.extension}
              key={exportOption.extension}
            >
              {({ checked, disabled }) => (
                <>
                  <div
                    className={`${
                      checked && 'ring-2 ring-accent'
                    } w-full h-32 bg-grey2 rounded-md flex flex-col items-center justify-center cursor-pointer ${
                      disabled && 'bg-light bg-opacity-40 cursor-not-allowed'
                    }`}
                  >
                    <img
                      src={exportOption.icon}
                      width="56px"
                      height="56px"
                      alt="Filetype"
                    />
                    <p className="mt-2">{exportOption.type}</p>
                  </div>
                </>
              )}
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
      <h3 className="text-xl text-medium pb-3 mt-8">Select Time Range</h3>
      <div>
        <label className="text-sm inline-block w-1/2 pr-2">
          <span className="block pb-1">Start:</span>
          <input
            className="py-3 px-2 rounded-md w-full hover:cursor-not-allowed"
            title="Currently not editable. Will be added in future updates"
            type="text"
            value={exportRange[0]}
            {...register('export.start', {
              required: true,
              disabled: true,
            })}
          />
        </label>
        <label className="text-sm inline-block w-1/2 pr-2">
          <span className="block pb-1">End:</span>
          <input
            className="py-3 px-2 rounded-md w-full hover:cursor-not-allowed"
            title="Currently not editable. Will be added in future updates"
            type="text"
            value={exportRange[1]}
            {...register('export.end', {
              required: true,
              disabled: true,
            })}
          />
        </label>
      </div>

      <SubmitButton text={'Export Data'} />
    </form>
  );
};
export default ExportForm;
