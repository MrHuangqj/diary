```
MyPromise.all = function (promisesList) {
  return new MyPromise((resolve, reject) => {
    if (!Array.isArray(promisesList)) return reject(new Error('必须是数组'));
    if (!promisesList.length) return resolve([]);

    let result = [], count = 0;
    
    promisesList.forEach((promise, index) => {
      promise.then(res => {
        result[index] = res;
        count++;
        if (count === promisesList.length) {
          resolve(result)
        }
      }).catch(error => {
        reject(error)
      })
    })
  })
}
```
