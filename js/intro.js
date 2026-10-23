import { search } from './search.js';
import { runRipples } from './ripple.js';
import { profile } from './content.js';

const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const TYPE_DELAY = reduceMotion ? 0 : 90;
const ERASE_DELAY = reduceMotion ? 0 : 45;
const WELCOME_HOLD = 1400; // ms "welcome" stays on screen before it's erased

const canvas = document.querySelector('#ripples');
const masthead = document.querySelector('#masthead');
const line = document.querySelector('.line');
const prompt = document.querySelector('#prompt');
const typed = document.querySelector('#typed');
const caret = document.querySelector('.caret');
const field = document.querySelector('#field');
const statusEl = document.querySelector('#status');
const results = document.querySelector('#results');

// 'intro' | 'question' | 'busy'. Only 'question' accepts input.
let phase = 'intro';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function setInteractive(on) {
  field.readOnly = !on;
  if (on) field.focus();
}

async function typeOut(text) {
  for (const char of text) {
    prompt.textContent += char;
    await sleep(TYPE_DELAY);
  }
}

async function erase() {
  for (const el of [typed, prompt]) {
    while (el.textContent) {
      el.textContent = el.textContent.slice(0, -1);
      await sleep(ERASE_DELAY);
    }
  }
  field.value = '';
}

function showResults(question, ranked) {
  statusEl.textContent = ranked.length
    ? `Closest matches for "${question}"`
    : 'Nothing matched that. Try asking about projects, skills, or background.';

  for (const result of ranked) {
    const item = document.createElement('li');

    const heading = document.createElement('h3');
    heading.textContent = result.source;

    const text = document.createElement('p');
    text.textContent = result.text;

    item.append(heading, text);

    const links = result.links ?? (result.link ? [{ label: 'Open →', href: result.link }] : []);
    for (const { label, href } of links) {
      const link = document.createElement('a');
      link.href = href;
      link.textContent = label;
      link.target = '_blank';
      link.rel = 'noopener';
      item.append(link);
    }

    results.append(item);
  }
}

async function ask(question) {
  phase = 'busy';
  setInteractive(false);
  typed.textContent = '';
  field.value = '';
  results.replaceChildren();
  statusEl.textContent = 'Searching…';

  try {
    const ranked = await search(question, {
      statusCallback: (message) => {
        statusEl.textContent = message;
      },
    });
    showResults(question, ranked);
  } catch (error) {
    console.error(error);
    statusEl.textContent = "Couldn't load the search model. Check your connection and try again.";
  }

  phase = 'question';
  setInteractive(true);
}

field.addEventListener('input', () => {
  typed.textContent = field.value;
});

field.addEventListener('keydown', (event) => {
  if (event.key !== 'Enter' || event.isComposing) return;
  event.preventDefault();

  const value = field.value.trim();
  if (value && phase === 'question') ask(value);
});

// Tapping anywhere brings the keyboard back on phones.
document.addEventListener('click', () => {
  if (!field.readOnly) field.focus();
});

function fillMasthead() {
  document.querySelector('#masthead-name').textContent = profile.name;
  document.querySelector('#link-github').href = profile.links.github;
  document.querySelector('#link-linkedin').href = profile.links.linkedin;
  document.querySelector('#link-email').href = `mailto:${profile.email}`;
}

// The page itself doesn't scroll, so the wheel scrolls the results from anywhere.
document.addEventListener(
  'wheel',
  (event) => {
    if (!results.contains(event.target)) results.scrollTop += event.deltaY;
  },
  { passive: true },
);

async function intro() {
  fillMasthead();

  if (!reduceMotion) {
    const color = getComputedStyle(document.documentElement).getPropertyValue('--glyph').trim();
    await new Promise((resolve) => runRipples(canvas, { color, onDone: resolve }));
  }
  canvas.classList.add('faded');
  masthead.classList.add('shown');
  caret.hidden = false;

  await typeOut('welcome');
  await sleep(WELCOME_HOLD);
  await erase();

  await typeOut('ask my portfolio');
  line.classList.add('stacked'); // the question is typed on the line below
  phase = 'question';
  setInteractive(true);
}

intro();
