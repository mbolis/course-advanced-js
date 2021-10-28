"use strict";

var x = theElement(); // ???
var c;
while ((c = x.firstChild)) {
  c = procDElem(c); // ???
  if (c) break;
}

function theElement() {}

function procDElem() {}
