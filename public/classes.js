"use strict";

class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
  }

  introduce() {
    console.log(`Hello, I'm ${this.name} and I am ${this.age} years old`);
  }
}

const anotherOne = new Person("Jeff", "57");
console.log(anotherOne);
anotherOne.introduce();
console.log("instanceof Person?", anotherOne instanceof Person);
console.log("instanceof Array?", anotherOne instanceof Array);

class Student extends Person {
  static lastId = 0;

  #lastExamDate = new Date();

  constructor(name, age, grade) {
    super(name, age);
    this.id = ++Student.lastId;
    this.grade = grade;
  }

  get lastExamDate() {
    return this.#lastExamDate;
  }

  introduce() {
    super.introduce(this);
    console.log("My grade is " + this.grade);
  }
}

const thatGuy = new Student("Jupiter", 18, "A");
console.log(thatGuy);
console.log(thatGuy.lastExamDate);
thatGuy.introduce();
console.log("instanceof Student?", thatGuy instanceof Student);
console.log("instanceof Person?", thatGuy instanceof Person);
console.log("instanceof Array?", thatGuy instanceof Array);
