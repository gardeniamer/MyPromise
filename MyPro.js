const PROMISE = {
    PENDING: 0,
    FULFILLED: 1,
    REJECTED: 2
}


class MyPromise {
    #result

    #state = PROMISE.PENDING

    #callbacks = []

    #callbacksOppoSite = []

    constructor(excutor) {
        excutor(this.#resolve.bind(this), this.#reject.bind(this))
    }

    #resolve(value) {
        if (this.#state == PROMISE.PENDING) {
            this.#state = PROMISE.FULFILLED
            this.#result = value
            queueMicrotask(() => {
                this.#callbacks != [] && this.#callbacks.forEach((a) => {
                    a()
                })
            })

        }
    }

    #reject(reason) {
        if (this.#state == PROMISE.PENDING) {
            this.#state = PROMISE.REJECTED
            this.#result = reason
            queueMicrotask(() => {
                this.#callbacks != [] && this.#callbacksOppoSite.forEach((a) => {
                    a()
                })
            })

        }
    }

    then(onFullFilled, onRejected) {
        return new MyPromise((resolve, reject) => {
            if (this.#state == PROMISE.FULFILLED) {
                queueMicrotask(() => {
                    resolve(onFullFilled(this.#result))
                })
            }
            
            else if (this.#state == PROMISE.REJECTED) {
                queueMicrotask(() => {
                    reject(onRejected(this.#result))
                })
            }
            
            else if (this.#state == PROMISE.PENDING) {
                this.#callbacks.push(() => {
                    onFullFilled(this.#result)
                })
                this.#callbacksOppoSite.push(() => {
                    onRejected(this.#result)
                })
            }

        })
    }


}


const pro = new MyPromise((resolve, reject) => {
    // resolve("123")
    setTimeout(() => {
        reject("123")
    }, 1000);
})

pro.then((res) => {
    console.log("获取数据:", res);
}, (rea) => {
    console.log("错误数据:", rea);
})

// pro.then((res) => {
//     console.log("链式数据1:", res);
//     return "456"
// }).then((res) => {
//     console.log("链式数据2:", res);
// })