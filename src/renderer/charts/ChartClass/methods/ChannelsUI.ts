import {
  UILayoutBuilders,
  UIOrigins,
  emptyFill,
  emptyLine,
  UIElementBuilders,
  SolidFill,
  ColorHEX,
  translatePoint,
} from '@arction/lcjs';
import ChartClass from '../Chart';

function channelsUI(this: ChartClass) {
  this.charts.forEach((_chart, i) => {
    // const axisX = chart.getDefaultAxisX();
    // const axisY = chart.getDefaultAxisY();
    const panel = this.dashboard.createUIPanel({
      columnIndex: 0,
      rowIndex: i + 1,
    });
    panel.setMinimumSize({ x: 50, y: 25 });
    panel.setBackgroundFillStyle(new SolidFill({ color: ColorHEX('#0f0f0f') }));

    i == 0 &&
      panel.onResize((_) => {
        requestAnimationFrame(() => {});
      });

    requestAnimationFrame(() => {
      const posEngine = translatePoint(
        { x: 50, y: 10 },
        panel.uiScale,
        panel.engine.scale
      );
      const posDocument = panel.engine.engineLocation2Client(
        posEngine.x,
        posEngine.y
      );

      console.log(posDocument);
    });

    const legendLayout = panel
      .addUIElement(UILayoutBuilders.Column)
      .setOrigin(UIOrigins.Center)
      .setMargin({ top: -10 })
      .setMouseInteractions(false)
      .setBackground((bg: any) =>
        bg.setFillStyle(emptyFill).setStrokeStyle(emptyLine)
      );

    if (this.channels[i] === 'TOI') {
      legendLayout
        .addElement(UIElementBuilders.TextBox)
        .setText(this.channels[i])
        .setTextFont((font: any) => font.setSize(16));
    } else {
      legendLayout
        .addElement(UIElementBuilders.TextBox)
        .setText(this.channels[i])
        .setTextFont((font: any) => font.setSize(16));
    }

    legendLayout
      .addElement(UIElementBuilders.TextBox)
      .setText(' ')
      .setMargin({ top: 5 })
      .setBackground((background: any) =>
        background.setFillStyle(
          new SolidFill({
            color: ColorHEX(this.seriesLineColorArr[i]),
          })
        )
      );

    legendLayout
      .addElement(UIElementBuilders.TextBox)
      .setText(this.samplingRate.toString() + ' samples/s')
      .setTextFont((font: any) => font.setSize(9))
      .setMargin({ top: 10 });

    if (this.channels[i] === 'TOI') {
      this.TOILegend = legendLayout
        .addElement(UIElementBuilders.TextBox)
        .setText('-')
        .setMargin({ top: 5, bottom: 0 })
        .setTextFont((font: any) => font.setSize(24));
    }

    const legendLayoutSmall = panel
      .addUIElement(UILayoutBuilders.Column)
      .setOrigin(UIOrigins.Center)
      .setMargin({ top: -10 })
      .setMouseInteractions(false)
      .setBackground((bg: any) =>
        bg.setFillStyle(emptyFill).setStrokeStyle(emptyLine)
      );
    legendLayoutSmall
      .addElement(UIElementBuilders.CheckBox)
      .setText('')
      .setMargin({ top: 5 })
      .setBackground((background: any) =>
        background.setFillStyle(
          new SolidFill({
            color: ColorHEX(this.seriesLineColorArr[i]),
          })
        )
      );
    legendLayoutSmall.dispose();

    panel.onResize((_chart, width, height) => {
      requestAnimationFrame(() => {
        if (height < 100 || width < 80) {
          legendLayout.dispose();
          legendLayoutSmall.restore();
        } else {
          legendLayoutSmall.dispose();
          legendLayout.restore();
        }
      });
    });
  });
}

export default channelsUI;
