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
import InputField from '@components/Form/InputField.component';
import FormGroup from '@components/Form/FormGroup.component';
import SelectField, {
  SelectOption,
} from '@components/Form/SelectField.component';

import { IExportOptions } from '@electron/models/Export/Export';

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
  const onSubmit = async (_data: IExportOptions) => {
    console.log(_data);
    const isValidSamplingRate = checkDownsampledRate(~~_data.downSampledRate);
    if (!isValidSamplingRate) return;

    const savePath = await window.api.invokeIPC(
      DialogBoxChannels.GetSaveDialog
    );
    if (!savePath) return;

    toast.loading('Exporting. This might take a while', { duration: Infinity });

    const dbFilePath = getState().global.filePaths?.dbFile;
    const currentRecording = getState().global.recording?.currentRecording;

    const exportWorker = UIWorkerManager.getExportdataWorker();
    const workerData = {
      dbFilePath,
      savePath,
      type: exportOption,
      currentRecording,
      options: _data,
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

  const checkDownsampledRate = (samplingRate: number) => {
    const currSamplingRate =
      getState().global.recording?.currentRecording?.probeSettings
        ?.samplingRate;
    if (samplingRate > currSamplingRate) {
      toast.error(
        'Down sampling rate cannot be greater than the recorded sampling rate'
      );
      return false;
    }

    if (currSamplingRate % samplingRate !== 0) {
      toast.error(
        'Down sampling rate should be a factor of the original sampling rate'
      );
      return false;
    }

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
                    } border-primary flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-md bg-grey2 transition-all duration-150 ${
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
      <h3 className="text-medium mt-8 pb-3 text-xl">Options</h3>
      <FormGroup>
        <div className="col-span-2 grid grid-cols-2 gap-6">
          <div>
            <label className="inline-block w-full pr-2 text-sm">
              Exported Sampling Rate
            </label>
            <InputField
              type="number"
              register={register('downSampledRate', {
                required: true,
                value: 100,
              })}
            />
          </div>
          <div>
            <label className="inline-block w-full pr-2 text-sm">Splitter</label>
            <SelectField
              register={register('splitter', {
                required: true,
                value: 'Comma',
              })}
            >
              <SelectOption name="Comma" value={'Comma'} />
              <SelectOption name="Space" value={'Space'} />
            </SelectField>
          </div>
          <div>
            <label className="inline-block w-full pr-2 text-sm">
              Add Parameter Names
            </label>
            <SelectField
              register={register('parameterNames', {
                required: true,
              })}
              defaultValue="Yes"
            >
              <SelectOption name="Yes" value={'Yes'} />
              <SelectOption name="No" value={'No'} />
            </SelectField>
          </div>
          <div>
            <label className="inline-block w-full pr-2 text-sm">
              Add Recording Info Header
            </label>
            <SelectField
              register={register('headers', {
                required: true,
              })}
              defaultValue="Yes"
            >
              <SelectOption name="Yes" value={'Yes'} />
              <SelectOption name="No" value={'No'} />
            </SelectField>
          </div>
          <div>
            <label className="inline-block w-full pr-2 text-sm">
              Fix Sampling Rate
            </label>
            <SelectField
              register={register('fixSamplingRate', {
                required: true,
              })}
              defaultValue="No"
            >
              <SelectOption name="No" value={'No'} />
              <SelectOption name="Yes" value={'Yes'} />
            </SelectField>
          </div>
        </div>
      </FormGroup>

      <h3 className="text-medium mt-8 pb-3 text-xl">Select Time Range</h3>
      <FormGroup>
        <div className="col-span-2 grid grid-cols-2 gap-4">
          <label className="inline-block pr-2 text-sm">
            <span className="block pb-1">Start:</span>
            <input
              className="w-full rounded-md py-3 px-2 hover:cursor-not-allowed"
              title="Currently not editable. Will be added in future updates"
              type="text"
              value={exportRange[0]}
              {...register('start', {
                required: true,
                disabled: true,
              })}
            />
          </label>
          <label className="inline-block pr-2 text-sm">
            <span className="block pb-1">End:</span>
            <input
              className="w-full rounded-md py-3 px-2 hover:cursor-not-allowed"
              title="Currently not editable. Will be added in future updates"
              type="text"
              value={exportRange[1]}
              {...register('end', {
                required: true,
                disabled: true,
              })}
            />
          </label>
        </div>
      </FormGroup>

      <SubmitButton
        text={'Export Data'}
        disabled={exportRange[0] === 'No data found'}
      />
    </form>
  );
};
export default ExportForm;
