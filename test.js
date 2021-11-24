
let i = 0;
let counter = 0;
function* a (){
        let a = yield 5;
      yield  console.log(a);
}

let e = a();
e.next();
e.next();
e.next();
