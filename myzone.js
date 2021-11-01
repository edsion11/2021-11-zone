const original = window.setTimeout

window.setTimeout = (callback, delay, ...args)=>{
    const start = new Date.now();
    // ...args
    return callback.apply(this, [callback, delay, ...args])
}
