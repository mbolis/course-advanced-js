"use strict";

// All seems to work well, but... What if the connection is not good?

// TODO: preload images
// How to orchestrate?
// - one after the other?
// - in parallel?

const NAMES = [
  "Garrett",
  "Lynn",
  "Arvald",
  "Celina",
  "Burt",
  "Osyria",
  "Tycho",
  "Remedia",
];

document.addEventListener("DOMContentLoaded", () => {
  const spriteSelect = document.getElementById("sprite");
  const spriteImg = document.getElementById("sheet_display");

  const showcase = document.getElementById("showcase");

  const characterTemplate = document.querySelector(".character");
  const templateFactory = makeTemplateFactory(characterTemplate);

  let template;

  spriteImg.onload = () => {
    document.body.classList.remove("loading");

    // cleanup
    template && template.destroy();
    showcase.textContent = "";

    // draw
    template = templateFactory(spriteImg);
    showcase.append(...NAMES.map(template));
  };

  spriteSelect.onchange = () => {
    document.body.classList.add("loading");
    spriteImg.src = `images/${spriteSelect.value}.png`;
  };
});
