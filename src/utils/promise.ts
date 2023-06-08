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
    console.log(`等待队列长度：${this.list.length}`);
    console.log(`执行队列长度：${this.pool.length}`);
    const task = this.fn(item);
    this.pool.push(task); // 将该任务推入pool并发池中
    task.then(() => {
      // 请求结束后将该Promise任务从并发池中移除
      this.pool.splice(this.pool.indexOf(task), 1);
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

// function concurrentLimit(tasks, limit) {
//   const results = []; // 存放执行结果的数组
//   let runningCount = 0; // 正在执行的任务数量

//   // 定义一个递归函数，用于逐个执行任务
//   function runTask(task) {
//     runningCount++; // 增加正在执行的任务数量
//     return Promise.resolve(task()).then((result) => {
//       results.push(result); // 将执行结果存入数组
//       runningCount--; // 完成执行后将正在执行的任务数量减1
//       if (tasks.length) {
//         // 如果还有未执行的任务，则继续执行
//         return runTask(tasks.shift());
//       } else {
//         return results; // 如果所有任务都已经执行完，则返回所有任务的结果
//       }
//     });
//   }

//   // 构造Promise.race数组，用于限制并发执行的任务数量
//   const promiseRaceArray = [];
//   for (let i = 0; i < limit && i < tasks.length; i++) {
//     promiseRaceArray.push(runTask(tasks.shift()));
//   }

//   // 返回一个Promise，等待所有任务执行完毕后返回任务结果
//   return Promise.all(promiseRaceArray).then(() => {
//     if (tasks.length) {
//       // 如果还有未执行的任务，则继续执行
//       return runTask(tasks.shift());
//     } else {
//       return results; // 如果所有任务都已经执行完，则返回所有任务的结果
//     }
//   });
// }

// // 示例用法
// const tasks = [];
// for (let i = 1; i <= 100; i++) {
//   tasks.push(createTask(i));
// }
// concurrentLimit(tasks, 10).then((results) => {
//   console.log(results); // 打印任务结果数组
// });
