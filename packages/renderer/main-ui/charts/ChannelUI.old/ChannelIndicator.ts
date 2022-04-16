/**
 * Class for creating channel Y axis and updating it
 * @version 0.1.0
 * @alpha
 */
export class ChannelIndicator {
  /**
   * The container that will hold the channel UI container
   */
  private container: HTMLDivElement;
  /**
   * The indicator container
   */
  private indicatorContainer: HTMLDivElement | null;
  /**
   * The number of total possible tick indicators
   */
  totalTicks: number;
  ticks: HTMLDivElement[];

  constructor(_container: HTMLDivElement) {
    this.container = _container;
    this.indicatorContainer = null;
    this.createContainer();
    this.totalTicks = this.calcNumOfPossibleTicks();
    this.ticks = [];
    this.appendTicks();
  }

  /**
   * Creates the container for Y axis ticks
   */
  createContainer() {
    this.indicatorContainer = document.createElement('div');
    this.indicatorContainer.classList.add('channel-indicator');
    this.container.appendChild(this.indicatorContainer);
  }

  /**
   * Calculates the total number of possible indicators
   * form the available pixel height
   * @return number
   */
  calcNumOfPossibleTicks() {
    const height = this.indicatorContainer?.offsetHeight as number;

    if (height <= 200) {
      return 3;
    }

    if (height > 200 && height <= 300) {
      return 5;
    }

    if (height > 300 && height < 400) {
      return 7;
    }

    if (height >= 400) {
      return 11;
    }

    return 3;
  }

  appendTicks() {
    const height = this.indicatorContainer?.offsetHeight as number;
    const tickHeight = height / 10;

    const first = this.indicatorContainer?.appendChild(this.createTick(0, 'Test'));
    const last = this.indicatorContainer?.appendChild(this.createTick(height, 'Test2'));

    this.ticks.push(first as HTMLDivElement);

    for (let i = 1; i < 10; i++) {
      const tick = this.createTick(tickHeight * i, `${i}`);
      this.indicatorContainer?.appendChild(tick);
      this.ticks.push(tick);
    }

    this.ticks.push(last as HTMLDivElement);
  }

  updateTicks(start: number, end: number) {
    const tickDiff = (end - start) / this.ticks.length;
    this.ticks[0].innerText = end.toString();

    for (let i = 2; i < this.ticks.length - 3; i++) {
      this.ticks[i].innerText = (tickDiff * i).toString();
    }

    this.ticks[1].innerText = start.toString();
  }

  createTick(top: number, text: string) {
    const div = document.createElement('div');
    div.classList.add('channel-tick');
    div.style.top = top + 'px';
    div.innerText = text + 'px';

    return div;
  }
}
