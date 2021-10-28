import Student, { Person } from "./module-es.js";

const thatGuy = new Student("Jupiter", 18, "A");
console.log(thatGuy);
console.log(thatGuy.lastExamDate);
thatGuy.introduce();
console.log("instanceof Student?", thatGuy instanceof Student);
console.log("instanceof Person?", thatGuy instanceof Person);
console.log("instanceof Array?", thatGuy instanceof Array);
