"use strict";

function clearErrors(fields) {
  for (const key in fields) {
    if (/^error/.test(key)) {
      fields[key].textContent = "";
    }
  }
}

function capitalize(string) {
  return string[0].toUpperCase() + string.slice(1).toLowerCase();
}

function displayErrors(fields, errors) {
  for (const fieldName in errors) {
    const field = fields[`error${capitalize(fieldName)}`];
    if (field) field.textContent = errors[fieldName];
  }
}

function displayNotification(el, type, message) {
  el.classList.add("notification-" + type);
  el.textContent = message;
}
