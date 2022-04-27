export class BeastParser {
  private pd_num = 0; // 0 ~ 7 -- this variable is set by user
  private bytes_count = 8 * 2; // msb lsb
  private msb_indices = [13, 11, 9, 7, 5, 3, 1, 15]; // ch1 ch2 ch3 ... led

  /**
   * Processes the incoming data packet and return an object.
   * @param packet the packet received from the hardware.
   * @returns an object containing the processed data of all the channels of beast hardware.
   */
  public processPacket(packet: Buffer) {
    const data = new Uint8Array(packet);

    // fill channels data
    let res = { ch1: [], ch2: [], ch3: [], ch4: [], ch5: [], ch6: [], ch7: [], led_nums: [] }; // , digital_inputs: []
    for (let index = 0; index < this.msb_indices.length; index++) {
      if (index >= this.pd_num && index != 7) continue;

      let lsb = Int32Array.from(
        data.filter((_, i) => i % this.bytes_count === this.msb_indices[index] - 1),
      );
      let msb = Int32Array.from(
        data.filter((_, i) => i % this.bytes_count === this.msb_indices[index] - 0),
      );

      // if (index == 7) // index for led_nums and digital_inputs
      // {
      //     res[Object.keys(res)[index]] = lsb.map(function (e, i) { return e & 15; });// led_nums
      //     res[Object.keys(res)[index + 1]] = lsb.map(function (e, i) { return e & 112; });// digital_inputs
      // }
      // else // channels
      res[Object.keys(res)[index]] = lsb.map(function (e, i) {
        let d = e + (msb[i] << 8);
        d = (d << 16) >> 16;
        return d;
      });
    }

    // find indices of arrays with led_num
    let indexArray = [];
    indexArray = res.led_nums.reduce(function (b, e, i) {
      if (e === this.led_num) b.push(i);
      return b;
    }, []);

    res.ch1 = indexArray.map((i) => res.ch1[i]);
    res.ch2 = indexArray.map((i) => res.ch2[i]);
    res.ch3 = indexArray.map((i) => res.ch3[i]);
    res.ch4 = indexArray.map((i) => res.ch4[i]);
    res.ch5 = indexArray.map((i) => res.ch5[i]);
    res.ch6 = indexArray.map((i) => res.ch6[i]);
    res.ch7 = indexArray.map((i) => res.ch7[i]);
    res.led_nums = indexArray.map((i) => res.led_nums[i]);

    return res;
  }
}
