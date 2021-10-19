"use strict";

/**
 * @template T
 * @callback OnLoaded
 * @param {Error} error
 * @param {T} [payload]
 */

/**
 * Load one image asynchronously.
 * @param {string} url
 */
function preloadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Could not load image: " + url));
    image.src = url;
  });
}

/**
 * Load all images asynchronously.
 * @param {string[]} urls
 */
function preloadAllImages(urls) {
  return Promise.all(urls.map(preloadImage));
}

/**
 * Load all images asynchronously, signal as soon as one is ready.
 * @param {string[]} urls
 */
function preloadAnyImage(urls) {
  return Promise.any(urls.map(preloadImage));
}

/**
 * Load all images asynchronously, signal as soon as one is ready or errors.
 * @param {string[]} urls
 */
function tryPreloadAnyImage(urls) {
  return Promise.race(urls.map(preloadImage));
}

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

function spriteUrl(sprite) {
  return `images/${sprite.value}.png`;
}

document.addEventListener("DOMContentLoaded", () => {
  const spriteSelect = document.getElementById("sprite");
  const spriteImg = document.getElementById("sheet_display");

  const showcase = document.getElementById("showcase");

  const characterTemplate = document.querySelector(".character");
  const templateFactory = makeTemplateFactory(characterTemplate);

  const spriteOptions = [...spriteSelect.querySelectorAll("option")];
  const spriteUrls = spriteOptions.map(spriteUrl);

  spriteSelect.onchange = () => {
    document.body.classList.add("loading");
    spriteImg.src = spriteUrl(spriteSelect);
  };

  tryPreloadAnyImage(spriteUrls)
    .then((image) => {
      let template;

      spriteImg.onload = displayShowcase;
      if (image instanceof HTMLImageElement) {
        const [, value] = /\/([^\/]+)\.png$/.exec(image.src);
        spriteSelect.value = value;
        spriteSelect.onchange();
      } else {
        displayShowcase();
      }

      function displayShowcase() {
        document.body.classList.remove("loading");

        // cleanup
        template && template.destroy();
        showcase.textContent = "";

        // draw
        template = templateFactory(spriteImg);
        showcase.append(...NAMES.map(template));
      }
    })
    .catch((err) => alert(`Error! ${err.message}`));
});
