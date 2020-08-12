import React, { useState } from 'react'

import {
    of, from, fromEvent,range,
    Observable, Subject } from 'rxjs';
import { map, filter } from "rxjs/operators";

let helloworld = of(1, 2, 3)
helloworld.subscribe((val) => console.log(val, 'helloworld'))
console.log(from([2, 3, 4]))
console.log(fromEvent(document.querySelector('div'), 'click'))
range(1, 20)
    .pipe(
        filter(x => x % 2 === 1),
        map(x => x + x)
    )
    .subscribe(x => console.log(x))

// Observable.create静态方法 等同于 new Observable
Observable.create(observer => observer.next(1)).subscribe(val => console.log(val, 'Observable.create'))
new Observable(observer => observer.next(1)).subscribe(val => console.log(val, 'new Observable'))

let myObservable = new Subject()
myObservable.subscribe(val => console.log(val))
myObservable.next('foo')

export default function() {
    let [state, setState] = useState(0)
    return <div onClick={() => setState(++state)}>
        hello world,{state}
    </div>
}