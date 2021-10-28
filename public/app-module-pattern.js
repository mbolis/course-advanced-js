"use strict";

const thatGuy = new Student("Jupiter", 18, "A");
console.log(thatGuy);
console.log(thatGuy.lastExamDate);
thatGuy.introduce();
console.log("instanceof Student?", thatGuy instanceof Student);
console.log("instanceof Array?", thatGuy instanceof Array);
