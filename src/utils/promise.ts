/* eslint-disable */
// @ts-ignore

export class PromisePool {
  max: any;

  fn: any;

  cb?: () => void;

  pool: any[];

  list: any[];

  constructor(
    max: number,
    fn: (...args: any[]) => Promise<void>,
    cb?: () => void,
  ) {
    this.max = max; // 最大并发量
    this.fn = fn; // 自定义的请求函数
    this.cb = cb; // 剩余的请求地址
    this.pool = []; // 并发池
    this.list = []; // 剩余的请求地址
  }

  start(list: any[]) {
    this.list = list; // 先循环把并发池塞满
    while (this.pool.length < this.max) {
      if (this.list.length === 0) break;
      const item = this.list.shift();
      this.setTask(item);
    }
    // 利用Promise.race方法来获得并发池中某任务完成的信号
    const race = Promise.race(this.pool);
    return this.run(race);
  }

  run(race: Promise<any>) {
    race.then(() => {
      // 每当并发池跑完一个任务，就再塞入一个任务
      // const item = this.list.shift();
      // this.setTask(item);

      while (this.pool.length < this.max) {
        if (this.list.length === 0) break;
        const item = this.list.shift();
        this.setTask(item);
      }

      return this.run(Promise.race(this.pool));
    });
  }

  setTask(item: any) {
    if (!item) return;
    const task = this.fn(item);
    this.pool.push(task); // 将该任务推入pool并发池中
    console.log(`${item.subject} 开始，当前并发剩余：${this.pool.length}`);

    task.then(() => {
      // 请求结束后将该Promise任务从并发池中移除
      this.pool.splice(this.pool.indexOf(task), 1);
      console.log(`${item.subject} 结束，当前并发剩余：${this.pool.length}`);

      console.log(this.pool.length, this.list.length);
      if (this.pool.length === 0 && this.list.length === 0) {
        if (typeof this.cb === 'function') {
          this.cb();
        }
      }
    });
  }
}

export function batchTask(
  requestFn: (arg0: any) => any,
  list: any,
  concurrent = 10,
) {
  return new Promise((resolve) => {
    const result: unknown = [];

    const fn = async (...args: any[]) => {
      // @ts-ignore
      const res = await requestFn(...args);
      // @ts-ignore
      result.push(res);
    };

    const cb = () => {
      resolve(result);
    };

    const pool = new PromisePool(concurrent, fn, cb); // 并发数
    pool.start(list);
  });
}
