
import {
    of, from, fromEvent,range,interval,
    Observable, Subject } from 'rxjs';
import { map, filter, switchMap } from "rxjs/operators";

// 构造Observable + 操作符
let helloworld = of(1, 2, 3)
helloworld.subscribe((val) => console.log(val, 'helloworld'))
console.log(from([2, 3, 4]))
console.log(fromEvent(document.querySelector('div'), 'click'))
range(1, 10)
    .pipe(
        filter(x => x % 2 === 1),
        map(x => x + x)
    )
    .subscribe(x => console.log(x))
// interval(1000)
//     .pipe(
//         map(increase => increase * 10)
//     )
//     .subscribe(x => console.log(x))

// rxjs非常适合场景：按顺序轮训table的每条row记录，同时可做到顺序固定 + 可过滤已完成状态
interval(1000)
    .pipe(
        map(increase => increase * 10),
        filter(val => val < 100),
        switchMap(val => from(ajax(val)))
    )
    .subscribe(x => console.log(x))

function ajax(val) {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(val + 1), 500)
    })
}

// Observable.create静态方法 等同于 new Observable
Observable.create(observer => observer.next(1)).subscribe(val => console.log(val, 'Observable.create'))
new Observable(observer => observer.next(1)).subscribe(val => console.log(val, 'new Observable'))

let myObservable = new Subject()
myObservable.subscribe(val => console.log(val))
myObservable.next('foo')

// 高级
// const post$ = of({id: 1});
// const getPostInfo$ = timer(3000).mapTo({title: "Post title"});

// const posts$ = post$.mergeMap(post => getPostInfo$).subscribe(res => console.log(res));

// const clicks$ = fromEvent(document, 'click');
// const innerObservable$ = interval(1000);
// clicks$.pipe(
//     // 类似于 mergeMap，但是当源 Observable 发出值时会取消内部 Observable 先前的所有订阅
//     switchMap(event => innerObservable$)
// ).subscribe(val => console.log(val));