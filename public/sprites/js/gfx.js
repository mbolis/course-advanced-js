//@ts-check
"use strict";

const TILE_SIZE = 16;

const SPRITE_COLS = 3;
const SPRITE_ROWS = 4;
const SPRITE_WIDTH = TILE_SIZE * SPRITE_COLS;
const SPRITE_HEIGHT = TILE_SIZE * SPRITE_ROWS;

/**
 *
 * @param {HTMLElement} el
 * @returns
 */
function makeTemplateFactory(el) {
  const h3 = el.querySelector("h3");

  el.remove();

  /**
   * @param {HTMLImageElement} spriteSheet
   */
  return (spriteSheet) => {
    const width = spriteSheet.naturalWidth;
    const height = spriteSheet.naturalHeight;

    const cols = width / SPRITE_WIDTH;
    const rows = height / SPRITE_HEIGHT;

    const sprites = [];
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * SPRITE_WIDTH;
        const y = row * SPRITE_HEIGHT;

        sprites.push({ x, y });
      }
    }

    const alts = 4;
    const steps = [0, 1, 2, 1];
    const reps = 2;

    const stepPeriod = 200;

    const altDuration = steps.length * reps;
    const cycleDuration = altDuration * alts;

    const renderers = [];
    const start = Date.now();
    let drawing = true;

    function render(title = "", index = 0) {
      h3.textContent = title;

      const sprite = sprites[index];

      const view = /** @type {HTMLElement} */ (el.cloneNode(true));
      const canvas = view.querySelector("canvas");
      const ctx = canvas.getContext("2d");

      const scale = canvas.width / TILE_SIZE;
      ctx.imageSmoothingEnabled = false;
      ctx.scale(scale, scale);

      renderers.push({ ctx, sprite });

      return view;
    }

    render.destroy = function () {
      renderers.length = 0;
      drawing = false;
    };

    function draw() {
      if (!drawing) return;
      requestAnimationFrame(draw);

      const delta = Date.now() - start;

      const totStep = (delta / stepPeriod) | 0;
      const cycleStep = totStep % cycleDuration;
      const alt = (cycleStep / altDuration) | 0;
      const step = (cycleStep % altDuration) % steps.length;

      const tx = steps[step] * TILE_SIZE;
      const ty = alt * TILE_SIZE;

      for (const {
        ctx,
        sprite: { x, y },
      } of renderers) {
        ctx.clearRect(0, 0, TILE_SIZE, TILE_SIZE);
        ctx.drawImage(
          spriteSheet,
          x + tx,
          y + ty,
          TILE_SIZE,
          TILE_SIZE,
          0,
          0,
          TILE_SIZE,
          TILE_SIZE
        );
      }
    }
    draw();

    return render;
  };
}
