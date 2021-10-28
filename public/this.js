"use strict";

console.log(this);

function testThisIsUndefined() {
  console.log(this);
}
testThisIsUndefined();

function hello() {
  console.log("Hello, " + this.name); // this depends on call site
}
// hello(); // this is undefined

function Person(name) {
  this.name = name;
}
Person.prototype.hello = hello;

const jim = new Person("Jim");
jim.hello(); // this === jim, because of . = call-site

const jackson = { name: "Jackson" };
jackson.hello1 = jim.hello;

jackson.hello1(); // this === jackson, because of . = call-site

hello = function (...args) {
  console.log("Hello,", this.name, args.join(" "));
};

const jill = { name: "Jill", hello };
jill.hello("Jonas", "Jamie");

const janet = { name: "Janet" };
hello.call(janet, "Jeff", "Jacob");
hello.apply(janet, ["Julie", "Jay"]);

const helloJimbo = hello.bind({ name: "Jimbo" }, "Jahera");
helloJimbo("Jamal");

const arrow = {
  name: "Arrow",
  hello: () => console.log("Hello,", this.name), // this bound at declaration
};
arrow.hello();

function Button(message) {
  this.message = message;
}
Button.prototype.display = function (parentElement) {
  const button = document.createElement("button");
  button.textContent = "Click me!";
  parentElement.append(button);

  // const self = this;
  // button.onclick = function () {
  //   // console.log(this, this.message);
  //   console.log(self, self.message);
  // };
  // button.onclick(event)
  button.onclick = () => console.log(this, this.message);
};
new Button("hello button").display(document.body);
