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
import { ChartChannels, DialogBoxChannels } from '@utils/channels';

import UIWorkerManager from 'renderer/UIWorkerManager';
import { getState } from '@redux/store';

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

const ExportForm = () => {
  const [exportOption, setExportOption] = useState(exportOptions[0].extension);
  const [exportRange, setExportRange] = useState([
    'No data found',
    'No data found',
  ]);
  const { register, handleSubmit } = useForm();
  const currentRecording = useAppSelector(
    (state) => state.global.recording?.currentRecording
  );

  useEffect(() => {
    const checkExportRange = async () => {
      const range = await window.api.invokeIPC(
        ChartChannels.GetExportRange,
        currentRecording?.id
      );
      if (!range) return;
      range.start !== undefined &&
        setExportRange([msToTime(range.start), msToTime(range.end)]);
    };

    (async () => {
      // Get the export range
      await checkExportRange();
    })();

    return () => UIWorkerManager.terminateExportdataWorker();
  }, []);

  // Handles form submit
  const onSubmit = async (_data: any) => {
    // const result = await window.api.invokeIPC(ChartChannels.ExportAll, {
    //   recordingId: currentRecording?.id,
    //   type: exportOption,
    // });

    const result = await handleExportData();

    console.log(result);
  };

  // Handles the export of data
  const handleExportData = async () => {
    const savePath = await window.api.invokeIPC(
      DialogBoxChannels.GetSaveDialog
    );
    if (!savePath) return;

    toast.loading('Exporting. This might take a while', { duration: Infinity });

    const dbFilePath = getState().global.filePaths?.dbFile;
    const recordingSetting = getState().global.recording?.currentRecording
      ?.settings as string | undefined;
    let samplingRate = 100;

    if (recordingSetting) {
      samplingRate = JSON.parse(recordingSetting).probe.samplingRate;
    }

    const exportWorker = UIWorkerManager.getExportdataWorker();
    const workerData = {
      dbFilePath,
      savePath,
      type: exportOption,
      samplingRate,
      recordingId: currentRecording?.id,
    };
    exportWorker.postMessage(workerData);

    exportWorker.onmessage = ({ data }) => {
      if (data === 'end') {
        toast.dismiss();
        // result === 'canceled' && toast.error('Export was canceled');
        toast.success('Data exported successfully');
      }
      UIWorkerManager.terminateExportdataWorker();
      exportWorker.terminate();
    };

    return true;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h3 className="text-medium pb-3 text-xl">Select File Type</h3>
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
                    } flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-md bg-grey2 transition-all duration-150 ${
                      disabled && 'cursor-not-allowed bg-light bg-opacity-40'
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
      <h3 className="text-medium mt-8 pb-3 text-xl">Select Time Range</h3>
      <div>
        <label className="inline-block w-1/2 pr-2 text-sm">
          <span className="block pb-1">Start:</span>
          <input
            className="w-full rounded-md py-3 px-2 hover:cursor-not-allowed"
            title="Currently not editable. Will be added in future updates"
            type="text"
            value={exportRange[0]}
            {...register('export.start', {
              required: true,
              disabled: true,
            })}
          />
        </label>
        <label className="inline-block w-1/2 pr-2 text-sm">
          <span className="block pb-1">End:</span>
          <input
            className="w-full rounded-md py-3 px-2 hover:cursor-not-allowed"
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

      <SubmitButton
        text={'Export Data'}
        disabled={exportRange[0] === 'No data found'}
      />
    </form>
  );
};
export default ExportForm;
