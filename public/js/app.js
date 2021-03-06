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

  newProjectForm.onsubmit = async (e) => {
    e.preventDefault();

    clearErrors(formFields);

    const data = getFormData(formFields);

    try {
      const project = await saveProject(data);
      newProjectForm.reset();

      displayNotification(
        notificationBox,
        "success",
        `Project "${project.name}" saved with tags [${project.tags.join(", ")}]`
      );
    } catch (err) {
      switch (err.type) {
        case "validation":
          displayNotification(
            notificationBox,
            "error",
            "Please resolve validation errors before submitting."
          );
          displayErrors(formFields, err.errors);
          return;

        default:
          displayNotification(
            notificationBox,
            "error",
            err.message ?? "Unexpected error."
          );
          return;
      }
    }
  };
});
