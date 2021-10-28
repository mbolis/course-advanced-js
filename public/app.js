"use strict";

function saveData(data, callback) {
  console.log(data);
  callback("done");
}

async function fetchSaveData(data, callback) {
  await fetch("/api/projects", {
    method: "POST",
    body: JSON.stringify(data),
  });
  callback("done");
}

function doSomething(saveData) {
  const data = { a: 1, b: 2 };
  saveData(data, console.log); // interface := (data, callback) => {}
}

doSomething(saveData); // <- inject saveData
doSomething(fetchSaveData); // <- inject fetchSaveData
