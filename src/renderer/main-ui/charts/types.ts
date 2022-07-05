import type { ChartXY, PointMarker, UIBackground, LineSeries } from '@arction/lcjs';

/**
 * The type of an XY chart.
 */
export type ChartType = ChartXY<PointMarker, UIBackground>;

/**
 * Line series type from LCJS
 */
export type ChartSeriesType = LineSeries;

/**
 * The type of channel size method
 */
export type ChannelSizeType = {
  x: number;
  y: number;
  height: number;
  width: number;
};
