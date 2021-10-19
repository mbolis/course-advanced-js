"use strict";

/**
 * @template T
 * @callback OnLoaded
 * @param {Error} error
 * @param {T} [payload]
 */

/**
 * Load one image, call `onLoad` when it is loaded.
 * @param {string} url
 * @param {OnLoaded<HTMLImageElement>} onLoad
 */
function preloadImage(url, onLoad) {
  const image = new Image();
  image.onload = () => onLoad(null, image);
  image.onerror = () => onLoad(new Error("Could not load image: " + url));
  image.src = url;

  return image;
}

/**
 * Load all images in sequence, call `onLoad` when they are **all** loaded.
 * @param {string[]} urls
 * @param {OnLoaded<HTMLImageElement[]>} onLoad
 */
function preloadAllImagesSequence(urls, onLoad) {
  const images = [];
  preloadImage(urls.shift(), function doWork(err, image) {
    if (err) return onLoad(err);

    images.push(image);
    if (!urls.length) onLoad(null, images);
    else preloadImage(urls.shift(), doWork);
  });

  return images; // Will be empty at first...
}

/**
 * Load all images, call `onLoad` when they are **all** loaded.
 * @param {string[]} urls
 * @param {OnLoaded<HTMLImageElement[]>} onLoad
 */
function preloadAllImages(urls, onLoad) {
  let remaining = 0;
  let crashed = false;

  const images = urls.map((url) => {
    remaining++;
    return preloadImage(url, (err) => {
      if (crashed) return;
      if (err) {
        crashed = true;
        onLoad(err);
        return;
      }
      if (!--remaining) onLoad(null, images);
    });
  });

  return images;
}

/**
 * Load all images, call `onLoad` when **any** is loaded or fails.
 * @param {string[]} urls
 * @param {OnLoaded<HTMLImageElement>} onLoad
 */
function preloadAnyImage(urls, onLoad) {
  let done = false;

  return urls.map((url) =>
    preloadImage(url, (err, image) => {
      if (done) return;
      if (err) return onLoad(err);

      done = true;
      onLoad(null, image);
    })
  );
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

  preloadAnyImage(spriteUrls, (err, image) => {
    if (err) return alert(`Error! ${err.message}`);

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
  });
});
