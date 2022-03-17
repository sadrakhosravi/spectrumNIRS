import React from 'react';
import { useAppDispatch } from '@redux/hooks/hooks';
import { closeModal } from '@redux/ModalStateSlice';

import { useForm } from 'react-hook-form';

// Components
import InputField from '@components/Form/InputField.component';
import SubmitButton from '@components/Form/SubmitButton.component';

import { IEvents } from '@electron/models/DeviceReader/EventManager';
import { ChartChannels } from '@utils/channels';
import { useChartContext } from 'renderer/context/ChartProvider';

type CustomEventFormData = {
  name: string;
};

const CustomEventForm = () => {
  const dispatch = useAppDispatch();
  const { register, handleSubmit } = useForm();

  const recordChart = useChartContext().recordChart;

  const onSubmit = async (data: CustomEventFormData) => {
    const eventObj: IEvents = {
      name: data.name,
      system: false,
      type: 'single',
      category: 'custom',
    };

    // Add event to the chart
    const eventTime = recordChart?.series[0].getXMax() as number;
    recordChart?.chartOptions?.drawMarker(eventTime, data.name, '#CCC');

    await window.api.invokeIPC(ChartChannels.Event, eventObj);

    requestAnimationFrame(() => dispatch(closeModal()));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label className="inline-block w-full pr-2 text-sm">
        <span className="block pb-1">Event Name</span>
        <InputField register={register('name', { required: true })} />
      </label>

      <SubmitButton text={'Add Event'} />
    </form>
  );
};
export default CustomEventForm;
