"use strict";

const x = { a: 1, b: 2 };
console.log("x =", x);
console.log("constructor =", x.constructor);
console.log("x has own property a?", x.hasOwnProperty("a"));
console.log("x has own property constructor?", x.hasOwnProperty("constructor"));

const proto = Object.getPrototypeOf(x);
console.log("prototype =", proto);
console.log("proto == Object.prototype?", proto === Object.prototype);

const y = Object.create(x);
console.log("y has own property a?", y.hasOwnProperty("a"));
console.log("y.a = ", y.a);

y.a = 3;
console.log("y has own property a?", y.hasOwnProperty("a"));
console.log("y.a = ", y.a);
console.log("x.a = ", x.a);

Array.prototype.comb = function () {
  const even = [];
  const odd = [];
  for (let i = 0; i < this.length; i++) {
    if (i % 2) {
      odd.push(this[i]);
    } else {
      even.push(this[i]);
    }
  }
  return [even, odd];
};
const [even, odd] = [1, 2, 3, 4, 5, 6, 7].comb();
console.log("comb even:", even);
console.log("comb odd:", odd);

// Polyfill
if (typeof String.prototype.trim !== "function") {
  String.prototype.trim = function () {
    return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
  };
}
