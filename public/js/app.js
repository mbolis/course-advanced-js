"use strict";

function SendDataToServer(data, callBack) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "/api/projects");
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.onload = () => {
    if (xhr.status === 200) {
      const body = JSON.parse(xhr.responseText);
      callBack(null, body);
      return;
    }

    if (xhr.status === 400) {
      callBack({
        type: "validation",
        errors: JSON.parse(xhr.responseText).errors,
      });
      return;
    }

    callBack({
      type: "error",
      status: xhr.status,
      error: xhr.responseText,
    });
  };
  xhr.onerror = callBack;
  xhr.send(JSON.stringify(data));
}

function fetchDataFromServer(data) {
  return fetch("/api/projects", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((resp) => {
    if (resp.status === 200) return resp.json();
    if (resp.status === 400)
      return resp.json().then((e) => {
        throw { type: "validation", errors: e.errors };
      });
    throw new Error("failed with status " + resp.status);
  });
}

function throwValidationError(errors) {
  const err = new Error();
  err.type = "validation";
  err.errors = errors;
  throw err;
}

function saveFormData({ name, tags }, onSuccess, onError) {
  name = name.trim();
  tags = tags.trim();

  // const errors = [];
  // if (!name) {
  //   errors.push(["project_name", "xxxxxxx"]);
  // }
  // if (!tags) {
  //   errors.push(["project_tags", "yyyyyyy"]);
  // }
  // if (errors.length) {
  //   throwValidationError(Object.fromEntries(errors));
  // }

  // localStorage.setItem("projects_list", JSON.stringify({ name, tags }));

  // SendDataToServer({ name, tags }, (err, response) => {
  //   if (err) {
  //     onError(err);
  //     return;
  //   }

  //   onSuccess(response);
  // });

  fetchDataFromServer({ name, tags }).then(onSuccess).catch(onError);
}

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

  newProjectForm.onsubmit = (e) => {
    // Prevent the form from submitting
    e.preventDefault();

    formFields.errorName.textContent = "";
    formFields.errorTags.textContent = "";

    // Call some abstract internal API to save form data
    saveFormData(
      {
        name: formFields.name.value,
        tags: formFields.tags.value,
      },
      ({ name, tags }) => {
        // Update notification
        notificationBox.classList.add("notification-success");
        notificationBox.textContent = `Project "${name}" added, with tags: ${tags.join(
          ", "
        )}`;

        formFields.name.value = "";
        formFields.tags.value = "";
      },
      (e) => {
        // Update errors and notification
        if (e.type === "validation") {
          const { project_name, project_tags } = e.errors;

          formFields.errorName.textContent = project_name ?? "";
          formFields.errorTags.textContent = project_tags ?? "";

          notificationBox.classList.add("notification-error");
          notificationBox.textContent = "Please check your form";
        } else {
          console.error(e);
        }
      }
    );
  };
});
