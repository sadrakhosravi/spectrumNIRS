import type { ChartXY, PointMarker, UIBackground } from '@arction/lcjs';

/**
 * The type of an XY chart.
 */
export type ChartType = ChartXY<PointMarker, UIBackground>;

/**
 * The type of channel size method
 */
export type ChannelSizeType = {
  x: number;
  y: number;
  height: number;
  width: number;
};
