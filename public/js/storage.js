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
    // callback({ type: "validation", errors });
    return Promise.reject({ type: "validation", errors });
  } else {
    // callback();
    return Promise.resolve();
  }
}

function saveProjectLocal(data, callback) {
  try {
    const stored = localStorage.getItem("projects_list");
    const projects = stored ? JSON.parse(stored) : [];

    const project = projects.find((p) => p.name === data.name);
    if (project) {
      project.tags = data.tags;
    } else {
      projects.push(data);
      projects.sort((p1, p2) => p1.name.localeCompare(p2.name));
    }

    localStorage.setItem("projects_list", JSON.stringify(projects));

    callback(null, data);
  } catch (err) {
    callback(err);
  }
}

function saveProjectXHR(data, callback) {
  const xhr = new XMLHttpRequest();
  xhr.open("POST", "/api/projects", true);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.onreadystatechange = () => {
    if (xhr.readyState === 4) {
      try {
        if (xhr.status === 200) {
          const project = JSON.parse(xhr.responseText);
          callback(null, project);
        } else {
          const error = JSON.parse(xhr.responseText);
          if (xhr.status === 400) {
            error.type = "validation";
          }

          callback(error);
        }
      } catch (err) {
        callback(err);
      }
    }
  };
  xhr.send(JSON.stringify(data));
}

function saveProjectJQuery(data, callback) {
  $.post({
    url: "/api/projects",
    contentType: "application/json",
    data: JSON.stringify(data),
    dataType: "json",
    success(project) {
      callback(null, project);
    },
    error(xhr) {
      try {
        const error = JSON.parse(xhr.responseText);
        if (xhr.status === 400) {
          error.type = "validation";
        }

        callback(error);
      } catch (err) {
        callback(err);
      }
    },
  });
}

function saveProjectAxios(data) {
  return axios
    .post("/api/projects", data)
    .then((resp) => resp.data)
    .catch((err) => {
      if (err.response) {
        const additionalData = {};
        if (err.response.status === 400) {
          additionalData.type = "validation";
        }
        throw Object.assign(err.response.data, additionalData);
      }

      throw error;
    });
}

function saveProjectFetch(data) {
  return fetch("/api/projects", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((resp) => {
    const json = resp.json();
    if (resp.ok) {
      return json;
    }
    return json.then((json) => {
      if (resp.status === 400) {
        json = Object.assign(json, { type: "validation" });
      }
      throw json;
    });
  });
}

function saveProject(data) {
  return validateProjectData(data).then(() => saveProjectFetch(data));
}
