import {
  UIBackground,
  UIButtonPicture,
  UICheckBox,
  UIDraggingModes,
  UIElementBuilders,
  UILayoutBuilders,
  UIOrigins,
} from '@arction/lcjs';
import ChartClass from '../Chart';

function SeriesToggle(this: ChartClass) {
  const allToggles: UICheckBox<
    UIBackground,
    UIButtonPicture,
    UIButtonPicture
  >[][] = [];
  this.charts.forEach((chart, _i) => {
    const ui = chart.addUIElement(UILayoutBuilders.Column);
    ui.setOrigin(UIOrigins.RightTop);
    ui.setPosition({ x: 100, y: 100 });
    ui.setDraggingMode(UIDraggingModes.notDraggable);

    const chartSeriesToggles: UICheckBox<
      UIBackground,
      UIButtonPicture,
      UIButtonPicture
    >[] = [];
    chart.getSeries().forEach((series) => {
      const toggle = ui.addElement(UIElementBuilders.CheckBox);
      series.attach(toggle);
      chartSeriesToggles.push(toggle);
    });
    allToggles.push(chartSeriesToggles);
  });
  return allToggles;
}

export default SeriesToggle;
