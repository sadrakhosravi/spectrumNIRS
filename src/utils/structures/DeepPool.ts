export class DeepPool {
  objPool: any[];
  nextIndex: number;
  constructor(creator: any, size: number) {
    this.objPool = [];
    this.nextIndex = 0;

    for (let i = 0; i < size; i++) {
      this.objPool.push(creator());
    }
  }

  use() {
    if (this.objPool.length === 0)
      throw new Error('Too many object requests, the pool ran out!');

    const objToReturn = this.objPool[this.nextIndex];
    this.nextIndex++;
    return objToReturn;
  }

  recycle(obj: any) {
    this.objPool.push(obj);
    this.nextIndex--;
  }
}
