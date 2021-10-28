"use strict";

const me = {
  name: "Marco",
  age: 36,
};

const he = {
  name: "Jhonny",
  age: 25,
};

const personPrototype = {
  introduce() {
    console.log(`Hello, I'm ${this.name} and I am ${this.age} years old`);
  },
};

// factory
function newPerson(name, age) {
  // return { name, age };

  // const p = Object.create(personPrototype);
  // p.name = name;
  // p.age = age;

  const p = { name, age };
  Object.setPrototypeOf(p, personPrototype);

  return p;
}

console.log(me);
console.log(he);

const theOther = newPerson("Jim", 33);
console.log(theOther);
theOther.introduce();

function Person(name, age) {
  // if (!new.target) return new Person(name, age);

  this.name = name;
  this.age = age;
}
Person.prototype.introduce = function () {
  console.log(`Hello, I'm ${this.name} and I am ${this.age} years old`);
};

const anotherOne = new Person("Jeff", "57");
console.log(anotherOne);
anotherOne.introduce();
console.log("instanceof Person?", anotherOne instanceof Person);
console.log("instanceof Array?", anotherOne instanceof Array);

function Student(name, age, grade) {
  Person.call(this, name, age);
  this.grade = grade;
}
Student.prototype = Object.create(Person.prototype);
Object.defineProperty(Student.prototype, "constructor", {
  value: Student,
  enumerable: false,
  writable: true,
});
Student.prototype.introduce = function () {
  Person.prototype.introduce.call(this);
  console.log("My grade is " + this.grade);
};

const thatGuy = new Student("Jupiter", 18, "A");
console.log(thatGuy);
thatGuy.introduce();
console.log("instanceof Student?", thatGuy instanceof Student);
console.log("instanceof Person?", thatGuy instanceof Person);
console.log("instanceof Array?", thatGuy instanceof Array);
