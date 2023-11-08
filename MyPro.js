const PROMISE = {
    PENDING: 0,
    FULFILLED: 1,
    REJECTED: 2
}


class MyPromise {
    #result

    #state = PROMISE.PENDING

    #callbacks = []

    constructor(excutor) {
        excutor(this.#resolve.bind(this), this.#reject.bind(this))
    }

    #resolve(value) {
        if (this.#state == PROMISE.PENDING) {
            this.#state = PROMISE.FULFILLED
            this.#result = value
            queueMicrotask(() => {
                this.#callbacks != [] && this.#callbacks.forEach((a) => {
                    a.onFullFilled()
                })
            })

        }
    }

    #reject(reason) {
        if (this.#state == PROMISE.PENDING) {
            this.#state = PROMISE.REJECTED
            this.#result = reason
            queueMicrotask(() => {
                this.#callbacks != [] && this.#callbacks.forEach((a) => {
                    a.onRejected()
                })
            })

        }
    }

    then(onFullFilled, onRejected) {

        if (typeof onRejected != 'function') {
            onRejected = (rea) => {
                return ('错误信息：' + rea)
            }
        }
        if (typeof onFullFilled != 'function') {
            onFullFilled = (value) => {
                return value
            }
        }

        return new MyPromise((resolve, reject) => {
            if (this.#state == PROMISE.FULFILLED) {
                try {
                    const result = onFullFilled(this.#result)

                    if (result instanceof MyPromise) {
                        queueMicrotask(() => {
                            result.then((res) => {
                                resolve(res)
                            }, (rea) => {
                                reject(rea)
                            })
                        })
                    }
                    else {
                        queueMicrotask(() => {
                            resolve(result)
                        })
                    }
                } catch (e) {
                    queueMicrotask(() => {
                        reject(e)
                    })
                }
            }

            if (this.#state == PROMISE.REJECTED) {
                try {
                    const result = onRejected(this.#result)
                    if (result instanceof MyPromise) {
                        queueMicrotask(() => {
                            result.then((res) => {
                                resolve(res)
                            }, (rea) => {
                                reject(rea)
                            })
                        })
                    }
                    else {
                        queueMicrotask(() => {
                            reject(result)
                        })
                    }

                } catch (e) {
                    queueMicrotask(() => {
                        reject(e)
                    })
                }
            }

            if (this.#state == PROMISE.PENDING) {
                this.#callbacks.push({
                    onFullFilled: () => {
                        resolve(onFullFilled(this.#result))
                    },
                    onRejected: () => {
                        reject(onRejected(this.#result))
                    }
                })
            }

        })
    }

    catch(onRejected) {
        return this.then(undefined, onRejected)
    }

    static resolve(onResolve) {
        const res = onResolve
        return new MyPromise((resolve, reject) => {
            if (res instanceof MyPromise) {
                queueMicrotask(() => {
                    res.then((value) => {
                        resolve(value)
                    }, (rea) => {
                        reject(rea)
                    })
                })
            }
            else {
                queueMicrotask(() => {
                    resolve(res)
                })
            }
        })
    }

    static reject(onReject) {
        const res = onReject
        return new MyPromise((resolve, reject) => {
            if (res instanceof MyPromise) {
                queueMicrotask(() => {
                    res.then((value) => {
                        resolve(value)
                    }, (rea) => {
                        reject(rea)
                    })
                })
            }
            else {
                queueMicrotask(() => {
                    reject(res)
                })
            }
        })
    }


    static all(promises) {
        return new MyPromise((resolve, reject) => {
            queueMicrotask(() => {
                let count = 0
                let arr = []
                promises.forEach((item, index) => {
                    item.then((value) => {
                        count++;
                        arr[index] = value
                        if (count == promises.length) {
                            resolve(arr)
                        }
                    }, (rea) => {
                        reject(rea)
                    })
                })
            })
        })
    }

    static race(promises) {
        return new MyPromise((resolve, reject) => {
            queueMicrotask(() => {
                promises.forEach((item, index) => {
                    item.then((value) => {
                        resolve(value)
                    }, (rea) => {
                        reject(rea)
                    })
                })
            })
        })
    }

}


const pro = new MyPromise((resolve, reject) => {
    // resolve("123")
    // reject("nono")
    setTimeout(() => {
        reject("123")
    }, 1000);
    // setTimeout(() => {
    //     resolve("123")
    // }, 1000);
})

// pro.then((res) => {
//     console.log("获取数据:", res);
// }, (rea) => {
//     console.log("错误数据:", rea);
// })

pro.then((res) => {
    console.log("获取数据:", res);
}).catch((rea) => {
    console.log(rea)
})

// pro.then((res) => {
//     console.log("链式数据1:", res);
//     return "456"
// }).then((res) => {
//     console.log("链式数据2:", res);
// })

let p1 = new MyPromise((resolve, reject) => {
    resolve(123)
})
let p2 = new MyPromise((resolve, reject) => {
    resolve(456)
})
let p3 = new MyPromise((resolve, reject) => {
    // resolve(789)
    reject(789)
})
const res4 = MyPromise.all([p1, p2, p3])

console.log(res4);


let p5 = new MyPromise((resolve, reject) => {
    setTimeout(() => {
        resolve(123)
    }, 1000);
})
let p6 = new MyPromise((resolve, reject) => {
    resolve(456)
})
let p7 = new MyPromise((resolve, reject) => {
    resolve(789)
})
const res5 = MyPromise.race([p5, p6, p7])

console.log(res5);