const GLYPHS = '!"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[]^_`{|}~';
const CELL = 16; // px per character cell
const RIPPLE_COUNT = 5;
const RIPPLE_GAP = 350; // ms between the start of each ripple
const RIPPLE_TRAVEL = 1600; // ms for one ripple to reach the corners
const BAND = 36; // px width of the bright wavefront
// Resting brightness once a ripple has passed. Each ripple dims the field further.
const SETTLE = [0.7, 0.56, 0.42, 0.28, 0.14];
const RIPPLE_END =(RIPPLE_COUNT - 1) * RIPPLE_GAP + RIPPLE_TRAVEL;

// Deterministic hash so a character stays put between frames.
function hash(a, b, c) {
  return (Math.imul(a, 73856093) ^ Math.imul(b, 19349663) ^ Math.imul(c, 83492791)) >>> 0;
}

// Draws five ripples of ASCII characters expanding from the centre.
// Each ripple leaves the characters it passed a little dimmer than before.
export function runRipples(canvas, { color = '#d2d2d2', onDone = () => {} } = {}) {
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  let width;
  let height;
  let cols;
  let rows;
  let cx;
  let cy;
  let speed;
  let lastT = RIPPLE_END;

  function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.font = `${CELL - 2}px ui-monospace, Menlo, Consolas, monospace`;
    ctx.fillStyle = color;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    cols = Math.ceil(width / CELL);
    rows = Math.ceil(height / CELL);
    cx = width / 2;
    cy = height / 2;
    speed = Math.hypot(cx, cy) / RIPPLE_TRAVEL;
  }

  function draw(t) {
    ctx.clearRect(0, 0, width, height);

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const x = col * CELL + CELL / 2;
        const y = row * CELL + CELL / 2;
        const distance = Math.hypot(x - cx, y - cy);

        let passed = 0;
        let lit = 0;
        for (let k = 0; k < RIPPLE_COUNT; k++) {
          const start = k * RIPPLE_GAP;
          if (t < start) break; // later ripples haven't started either
          const front = (t - start) * speed;
          if (front >= distance) passed++;
          const gap = Math.abs(front - distance);
          if (gap < BAND) lit = Math.max(lit, 1 - gap / BAND);
        }

        const alpha = Math.max(passed ? SETTLE[passed - 1] : 0, lit);
        if (alpha < 0.02) continue;

        // The glyph shimmers while the wavefront is on it, then settles.
        const seed = lit > 0 ? Math.floor(t / 60) : passed;
        ctx.globalAlpha = alpha;
        ctx.fillText(GLYPHS[hash(col, row, seed) % GLYPHS.length], x, y);
      }
    }

    ctx.globalAlpha = 1;
  }

  resize();

  let startTime = null;
  function frame(now) {
    startTime ??= now;
    lastT = now - startTime;
    draw(lastT);

    if (lastT < RIPPLE_END) {
      requestAnimationFrame(frame);
    } else {
      onDone();
    }
  }
  requestAnimationFrame(frame);

  // Keep the picture correct if the window changes size.
  window.addEventListener('resize', () => {
    resize();
    draw(lastT);
  });
}
