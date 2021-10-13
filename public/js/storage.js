"use strict";

function getFormData({ name, tags }) {
  return {
    name: name.value.trim().toLowerCase(),
    tags: tags.value
      .trim()
      .toLowerCase()
      .split(/\s*,\s*/)
      .filter((t) => !!t),
  };
}

function validateProjectData({ name, tags }, callback) {
  const errors = {};
  let valid = true;
  if (!name) {
    valid = false;
    errors.name = "Please select a name for your project";
  }
  if (!tags || !tags.length) {
    valid = false;
    errors.tags = "Please insert at least one tag";
  }

  if (!valid) {
    callback({ type: "validation", errors });
  } else {
    callback();
  }
}

function saveProject(data, callback) {
  validateProjectData(data, (err) => {
    if (err) {
      callback(err);
      return;
    }

    // TODO: save project to remote storage
    const project = { ...data };

    callback(null, project);
  });
}
