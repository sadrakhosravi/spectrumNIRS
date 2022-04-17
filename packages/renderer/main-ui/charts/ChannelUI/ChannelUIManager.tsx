import * as React from 'react';
import { observer } from 'mobx-react-lite';

// Models
import ChartModel from '@models/ChartModel';

// Components
import { ChannelUI } from './ChannelUI';

export const ChannelUIManager = observer(() => {
  return (
    <>
      {ChartModel.charts.map((_chart, i) => (
        <ChannelUI key={i} chartIndex={i} />
      ))}
    </>
  );
});
