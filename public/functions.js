"use strict";

console.log("begin global");

let count = 0;

// do sth once
count++;
// do sth once more
count++;

function main() {
  {
    console.log("begin fn scope");
    let count = 0;

    // do sth once
    count++;
    // do sth once more
    count++;
    // do sth once more
    count++;
  }
  console.log("fn scope", count);
}
main();

console.log(count);
