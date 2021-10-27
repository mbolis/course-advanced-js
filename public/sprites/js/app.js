"use strict";

// function sync() {
//   console.log("before");
//   // ...
//   return "something"; ///////////////////////////
// }
// const what = sync(); ///////////////////////////
// console.log("after", what);

// function async(Return) {
//   console.log("before async");
//   setTimeout(() => Return("something"), 100); //////////////// // schedule
//   console.log("???"); // mysterious undefined time!!!
// }
// async((what) => console.log("after async", what)); //////////////// // sometimes
// console.log("???"); // mysterious undefined time!!!

// function preloadImage(url, callback) {
//   const image = new Image();
//   image.onload = () => callback(null, image);
//   image.onerror = (e) => callback(e);
//   image.src = url;
// }

/**
 *
 * @param {string} url
 * @returns {Promise<HTMLImageElement>}
 */
function preloadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = (e) => reject(e);
    image.src = url;
  });
}

// /**
//  * @template T
//  * @callback AsyncCallback
//  * @param {Error} err
//  * @param {T} returnValue
//  */

// /**
//  * @param {string[]} urls
//  * @param {AsyncCallback<HTMLImageElement[]>} callback
//  */
// function preloadAllImages(urls, callback) {
//   const images = [];
//   let count = 0;

//   for (let i = 0; i < urls.length; i++) {
//     count++;

//     preloadImage(urls[i], (err, image) => {
//       if (count < 0) return;

//       if (err) {
//         count = -1;
//         callback(err);
//         return;
//       }

//       count--;
//       images[i] = image;

//       if (count === 0) {
//         callback(null, images);
//       }
//     });
//   }

//   // 0: /sprites/images/02-bard.png  .........
//   // 1: /sprites/images/03-soldier.png  ......
//   // 2: /sprites/images/04-scout.png  ...................V
// }

/**
 * @param {string[]} urls
 * @returns {Promise<HTMLImageElement[]>}
 */
function preloadAllImages(urls) {
  return Promise.any(urls.map(preloadImage));

  return preloadImage("/sprites/images/02-bard.png")
    .then((image1) =>
      preloadImage("/sprites/images/03-soldier.png").then((image2) => [
        image1,
        image2,
      ])
    )
    .then(([image1, image2]) =>
      preloadImage("/sprites/images/04-scout.png").then((image3) => [
        image1,
        image2,
        image3,
      ])
    )
    .then(([image1, image2, image3]) =>
      preloadImage("/sprites/images/05-devout.png").then((image4) => [
        image1,
        image2,
        image3,
        image4,
      ])
    );
}

function preloadOptions() {
  const urls = [...document.querySelectorAll("#sprite option")].map(
    (o) => `images/${o.value}.pngx`
  );

  console.log(urls);

  preloadAllImages(urls, console.log);
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
