import './node_modules/zone.js/dist/zone.js'
import './node_modules/incremental-dom/dist/incremental-dom.js'

const btn1 = document.getElementById('btn1')
const btn2 = document.getElementById('btn2')
const btn3 = document.getElementById('btn3')

const {
    patch,
    elementOpen,
    elementVoid,
    elementClose,
    text,
} = IncrementalDOM;

function update(data) {
    patch(container, function() {
        if (window.count===3) {
            elementVoid('img',null, null,
                'src', 'https://angular.cn/assets/images/logos/angular/angular.svg',
                'style', {
                    'position': 'absolute',
                    'top': '400px',
                    'left': '50vw',
                    'width': '300px',
                    'height': '300px',
                })
            elementOpen('span', null);
            text("hello angular!");
            elementClose('span');
        }
        elementOpen('strong', null);
        text(data.text);
        elementClose('strong');
        for (let item of data.array){
            elementOpen('li')
            text(item)
            elementClose('li')
        }
    });
}

const angular = Zone.current
const initData = 'init'

var a = {
    text: 1,
    array: [1,2,3,4,5]
}

update(a)
const child1 = angular.fork({
    name: 'child',
    properties: {
        ...a,
    },
    onInvoke: (parentZoneDelegate, currentZone,targetZone, delegate, applyThis, applyArgs, source)=>{
        parentZoneDelegate.invoke(targetZone, delegate, applyThis, applyArgs)
    },
    onScheduleTask: (parentZoneDelegate, currentZone, targetZone, task)=> {
        currentZone._properties.cache = Object.assign({},currentZone._properties);
        // ...brefore
        return parentZoneDelegate.scheduleTask(targetZone, task)
    },
    onInvokeTask: (parentZoneDelegate, currentZone, targetZone, task, applyThis, applyArgs)=>{
        parentZoneDelegate.invokeTask(targetZone, task, applyThis, applyArgs)
        ///..
        if(Object.is(currentZone._properties, currentZone._properties.cache)){
            console.log('not change')
        }else{
            update(currentZone._properties)
            console.log('changed')
        }
        if(window.change){
            update(currentZone._properties)
        }
    }
})

window.count = a.text


const add = ()=>{
    btn1.onclick = ()=>{
        child1._properties = {...a,text: ++window.count}
    }
    // setTimeout(()=>{
    //     child1._properties = {text: ++window.count}
    // },2000)
}
child1.run(add)



const Decrease = ()=>{
    btn2.onclick = ()=>{
        child1._properties = {...a,text: --window.count}
    }
}
child1.run(Decrease)



const changeList = ()=>{
    btn3.onclick= ()=>{
        window.change = true
        child1._properties = {...a,array: a.array.map(d=>d*d)}
    }
}
child1.run(changeList)

// btn2.onclick = ()=>{
//     const ctx = ()=>{
//         setTimeout(()=>{
//             child1._properties = {text: --window.count}
//         })
//     }
//     child1.run(ctx)
//     // var strong = document.getElementsByTagName("strong")[0]
//     // strong.innerText = --window.count
// }
