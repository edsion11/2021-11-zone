import './node_modules/zone.js/dist/zone.js'
import './node_modules/incremental-dom/dist/incremental-dom.js'

// const original = window.setTimeout
//
// window.setTimeout = (callback, delay, ...args)=>{
//     return callback.apply(this, [callback, delay, ...args])
// }




// const root = Zone.current;
// const string = JSON.stringify
// const child = root.fork({
//     name: 'child',
//     onInvoke: (parentZoneDelegate, currentZone,
//         targetZone, delegate, applyThis, applyArgs, source)=>{
//             console.log(`this is child`, 'start');
//             parentZoneDelegate.invoke(targetZone, delegate, applyThis, applyArgs)
//             console.log(`this is child`,'end');
//     },
//     onScheduleTask: (task)=>{
//         // console.log('onscheduleTask')
//         // console.log(task.type,task.data,task.state)
//     },
//     onHasTask: (parentZoneDelegate, currentZone, targetZone, hasTaskState)=>{
//         console.log(`has task ${string(hasTaskState)}`)
//     }
// })
// const event = ()=>{
//     console.log('user event')
//     setTimeout(()=>{
//         console.log('settimeout')
//     })
//     Promise.resolve(1).then(v=>console.log(v))
// }
// child.scheduleMacroTask(setTimeout(()=>{
//     console.log(111)
// }),()=>{
//     console.log(222)
// })
// child.run(child.scheduleMacroTask(setTimeout(()=>{
//     console.log(111)
// }),()=>{
//     console.log(222)
// }))

const {
    patch,
    elementOpen,
    elementVoid,
    elementClose,
    text,
} = IncrementalDOM;
function update(data) {
    patch(container, function() {
        // const moreThan = data.text.length > 8;
        elementOpen('div', null);
        // elementVoid('input', null, null,
        //     'value', data.text,
        //     'type', 'text',
        //     'oninput', handleInput,
        //     'style', {
        //         'background-color': !moreThan ? '' : 'rgba(255, 0, 0, 0.1)'
        //     });
        // elementClose('div');
        // elementOpen('div', null);
        // text('text:  ');
        elementOpen('strong', null);
        text(data.text);
        elementClose('strong');
        elementClose('div');
        //
        // if (moreThan) {
        //     text('A string with less than 8 characters');
        // }
    });
}

// function handleInput(e) {
//     update({
//         text: e.target.value,
//     });
// }



const angular = Zone.current
const initData = 'init'

var a = {
    text: 1
}
update(a)
const child1 = angular.fork({
    name: 'child',
    properties: {
        ...a
    },
    onInvoke: (parentZoneDelegate, currentZone,
        targetZone, delegate, applyThis, applyArgs, source)=>{
        // console.log(currentZone._properties)
        parentZoneDelegate.invoke(targetZone, delegate, applyThis, applyArgs)
        // console.log(currentZone._properties)
    },
    onScheduleTask: (parentZoneDelegate, currentZone, targetZone, task)=> {
        console.log('onScheduleTask')
        currentZone._properties.cache = Object.assign({},currentZone._properties);
        console.log(currentZone._properties.cache)
        return parentZoneDelegate.scheduleTask(targetZone, task)
    },
    onInvokeTask: (parentZoneDelegate, currentZone, targetZone, task, applyThis, applyArgs)=>{
        console.log('onInvokeTask')
        parentZoneDelegate.invokeTask(targetZone, task, applyThis, applyArgs)
        if(Object.is(currentZone._properties, currentZone._properties.cache)){
            console.log('not change')
        }else{
            update(currentZone._properties)
            console.log('changed')
        }
        console.log(currentZone._properties,'end')
    }
})
const ctx = ()=>{
    setTimeout(()=>{
        child1._properties = {text: 2}
    })
}
new Promise((resolve, reject)=>{
    setTimeout(()=>{
        resolve()
    },2000)
}).then(()=>{
    child1.run(ctx)
})
