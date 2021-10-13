"use strict";

const express = require("express");

const app = express();
app.use(express.static("./public"));
app.use(express.json(), express.urlencoded({ extended: true }));

app.set("views", "./views");
app.set("view engine", "hbs");

const projects = {};
function projectsList() {
  return Object.entries(projects)
    .map(([name, tags]) => ({ name, tags: tags.join(", ") }))
    .sort((p1, p2) => p1.name.localeCompare(p2.name));
}

// app.get("/", (_, resp) => {
//   resp.render("form", {
//     projects: projectsList(),
//     form: {},
//   });
// });

function getData(body) {
  const name = body.name?.trim();
  const tags = body.tags
    ?.trim()
    .split(/\s*,\s*/)
    .filter((t) => !!t);

  return { name, tags };
}

function validate({ name, tags }) {
  const errors = [];
  if (!name) {
    errors.push(["project_name", "Please select a name for your project"]);
  }
  if (!tags || !tags.length) {
    errors.push(["project_tags", "Please insert at least one tag"]);
  }
  if (errors.length) return Object.fromEntries(errors);
}

function addProject({ name, tags }) {
  const existing = projects[name] ?? (projects[name] = []);
  existing.splice(0, existing.length, ...tags);
}

app.post("/projects", (req, resp) => {
  const form = req.body;
  const data = getData(form);

  const errors = validate(data);
  if (errors) {
    return resp.status(400).render("form", {
      projects: projectsList(),
      form,
      errors,
    });
  }

  addProject(data);
  resp.redirect("/");
});

app
  .route("/api/projects")
  .get((_, resp) => {
    resp.json(projectsList());
  })
  .post((req, resp) => {
    const form = req.body;
    const data = getData(form);

    const errors = validate(data);
    if (errors) {
      return resp.status(400).json({ errors });
    }

    addProject(data);
    resp.json(data);
  });

const port = 7000;
app.listen(port, () => console.log(`listening at http://localhost:7000`));
