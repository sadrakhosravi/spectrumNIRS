import {
  ColorHEX,
  ColorRGBA,
  customTheme,
  emptyLine,
  FontSettings,
  SolidFill,
  SolidLine,
  Themes,
} from '@arction/lcjs';

export const seriesFillStyle = new SolidFill({
  color: ColorHEX('#000'),
});

export const darkFillStyle = new SolidFill({
  color: ColorHEX('#222'),
});
export const darkFillStyle2 = new SolidFill({
  color: ColorHEX('#0a0a0a'),
});

export const textFillStyle = new SolidFill({
  color: ColorHEX('#fff'),
});

export const titleFillStyle = new SolidFill({
  color: ColorHEX('#7f7f7f'),
});

export const axisStyle = new SolidLine({
  thickness: 1,
  fillStyle: new SolidFill({ color: ColorHEX('#525252') }),
});

export const fontStyle = new FontSettings({
  size: 14,
  family: 'Inter, Arial, sans-serif',
});

export const uiMinorTickFont = new FontSettings({
  size: 10,
  family: 'Inter, Arial, sans-serif',
  style: 'normal',
});

export const uiMajorTickFont = new FontSettings({
  size: 12,
  family: 'Inter, Arial, sans-serif',
  style: 'normal',
});

export const bandFillStyle = new SolidFill({
  color: ColorRGBA(255, 255, 255, 50),
});

export const bandStrokeStyle = new SolidLine({
  thickness: 1,
  fillStyle: new SolidFill({ color: ColorRGBA(255, 255, 255, 90) }),
});

export const spectrumTheme = customTheme(Themes.darkGold, {
  panelBackgroundFillStyle: seriesFillStyle,
  uiBackgroundFillStyle: darkFillStyle2,
  lcjsBackgroundFillStyle: darkFillStyle2,
  seriesBackgroundFillStyle: seriesFillStyle,
  uiTextFillStyle: textFillStyle,
  axisTitleFillStyle: textFillStyle,
  chartTitleFillStyle: titleFillStyle,
  axisStyle: axisStyle,
  uiTickStrokeStyle: axisStyle,
  uiBackgroundStrokeStyle: emptyLine,
  lcjsBackgroundStrokeStyle: emptyLine,
  panelBackgroundStrokeStyle: emptyLine,
  uiTickTextFillStyle: titleFillStyle,
  customTickGridStrokeStyle: axisStyle,
  uiFont: fontStyle,
  uiPointableTextBoxFillStyle: darkFillStyle,
  uiPointableTextBoxStrokeStyle: emptyLine,
  bandFillStyle,
  bandStrokeStyle,
});

export default spectrumTheme;
