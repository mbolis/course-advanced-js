"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const notificationBox = document.querySelector(".notification");
  notificationBox.onclick = () => (notificationBox.className = "notification");

  const newProjectForm = document.querySelector(".project-form");
  const formFields = {
    name: newProjectForm.querySelector("[name=name]"),
    tags: newProjectForm.querySelector("[name=tags]"),

    errorName: newProjectForm.querySelector(".error-name"),
    errorTags: newProjectForm.querySelector(".error-tags"),
  };

  newProjectForm.onsubmit = () => {
    // Prevent the form from submitting
    // Call some abstract internal API to save form data
    // Update errors and notification
  };
});
