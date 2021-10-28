import './node_modules/zone.js/dist/zone.js'

const root = Zone.current;
const string = JSON.stringify
const child = root.fork({
    name: 'child',
    onInvoke: (parentZoneDelegate, currentZone, 
        targetZone, delegate, applyThis, applyArgs, source)=>{
            console.log(`this is child`, 'start');
            parentZoneDelegate.invoke(targetZone, delegate, applyThis, applyArgs)
            console.log(`this is child`,'end');
    },
    onScheduleTask: (task)=>{
        // console.log('onscheduleTask')
        // console.log(task.type,task.data,task.state)
    },
    onHasTask: (parentZoneDelegate, currentZone, targetZone, hasTaskState)=>{
        console.log(`has task ${string(hasTaskState)}`)
    }
})
const event = ()=>{
    console.log('user event')
    setTimeout(()=>{
        console.log('settimeout')
    })
    Promise.resolve(1).then(v=>console.log(v))
}
child.scheduleMacroTask(setTimeout(()=>{
    console.log(111)
}),()=>{
    console.log(222)
})
child.run(child.scheduleMacroTask(setTimeout(()=>{
    console.log(111)
}),()=>{
    console.log(222)
}))
