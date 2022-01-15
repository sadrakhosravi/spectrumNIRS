// Accurate timer by: https://github.com/Aaronik/accurate_timer/tree/c6e7d618d3f4b9273c642706ec06b2ca9c4eb82f

// A self adjusting accurate interval timer
class AccurateTimer {
  timer: any;
  callback: any;
  interval: number;
  _lastTimestamp: number;
  intervalTimer: any;
  constructor(callback: any, interval: number) {
    this.timer = null;
    this.callback = callback;
    this.interval = interval;
    this._lastTimestamp = 0;
    this.intervalTimer = null;
  }

  _startSI = () => {
    this._lastTimestamp = new Date().getTime();
    var that = this;

    this.intervalTimer = setInterval(function () {
      var elapsedTime = new Date().getTime() - that._lastTimestamp;

      if (elapsedTime >= that.interval) {
        that._lastTimestamp = that._lastTimestamp + that.interval;
        that.callback();
      }
    }, 1);
  };

  start() {
    this.stop();
    this._startSI();
  }

  stop() {
    clearInterval(this.intervalTimer);
    delete this.intervalTimer;
  }
}

export default AccurateTimer;
