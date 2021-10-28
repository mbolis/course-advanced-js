// IIFE
(function (modules) {
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

  modules.Student = class Student extends Person {
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
  };
})(window);
