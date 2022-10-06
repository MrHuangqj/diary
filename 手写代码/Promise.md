
```
const PENDING = 'pending'; 
const RESOLVED = "resolved"; 
const REJECTED = 'rejected'; 


function myPromise (fn) {
  let self = this;

  this.state = PENDING;

  this.value = null;

  this.resolvedCallbacks = [];

  this.rejectedCallbacks = [];

  function resolve (value) {
    if (value instanceof myPromise) {
      return value.then(resolve, reject);
    }
    setTimeout(() => {
      if (self.state === PENDING) {
        self.state = RESOLVED;

        self.value = value;

        self.resolvedCallbacks.forEach(callback => {
          callback(value)
        })
      }
    }, 0)
  }

  function reject (error) {
    setTimeout(() => {
      if (self.state === PENDING) {
        self.state = REJECTED;

        self.value = error;

        self.rejectedCallbacks.forEach(callback => {
          callback(error);
        })
      }

    }, 0)
  }

  try {
    fn(resolve, reject);
  } catch (e) {
    reject(e)
  }

}

myPromise.prototype.then = function (onResolved, onRejected) {
  onResolved =
    typeof onResolved === 'function'
      ? onResolved
      : function (value) { return value };
  onRejected =
    typeof onRejected === 'function'
      ? onRejected
      : function (value) { return value };

  if (this.state === PENDING) {
    this.resolvedCallbacks.push(onResolved);
    this.rejectedCallbacks.push(onRejected);
  }

  if (this.state === RESOLVED) {
    onResolved(this.value)
  }

  if (this.state === REJECTED) {
    onRejected(this.value)
  }
}

new myPromise((resolve, reject) => {
  console.log(1);
  resolve(2)
}).then(res => { console.log(res) })
```
