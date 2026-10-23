import { pipeline } from 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.8.1';
import { chunks } from './chunks.js';

const MODEL = 'Xenova/all-MiniLM-L6-v2';
const MIN_SCORE = 0.3;

let onStatus = () => {};
let embedderPromise = null;
let indexPromise = null;

function getEmbedder() {
  embedderPromise ??= pipeline('feature-extraction', MODEL, {
    dtype: 'q8',
    progress_callback: (info) => {
      if (info.status === 'progress') {
        onStatus(`Downloading the search model… ${Math.round(info.progress)}%`);
      }
    },
  });
  return embedderPromise;
}

// Returns a normalized vector, so a dot product equals cosine similarity.
async function embed(text) {
  const extractor = await getEmbedder();
  const output = await extractor(text, { pooling: 'mean', normalize: true });
  return output.data;
}

// For each chunk: one vector for its text plus one per example question.
function buildIndex() {
  indexPromise ??= (async () => {
    onStatus('Loading the search model…');
    const index = [];
    for (const chunk of chunks) {
      const vectors = [];
      for (const text of [`${chunk.source}. ${chunk.text}`, ...(chunk.asks ?? [])]) {
        vectors.push(await embed(text));
      }
      index.push(vectors);
    }
    return index;
  })();
  return indexPromise;
}

function dot(a, b) {
  let sum = 0;
  for (let i = 0; i < a.length; i++) sum += a[i] * b[i];
  return sum;
}

// Returns the best-matching chunks for a question, highest score first.
// A chunk scores as well as its closest vector, text or example question.
export async function search(question, { topK = 3, statusCallback } = {}) {
  onStatus = statusCallback ?? (() => {});
  const [index, queryVector] = await Promise.all([buildIndex(), embed(question)]);

  return chunks
    .map((chunk, i) => ({ ...chunk, score: Math.max(...index[i].map((v) => dot(queryVector, v))) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .filter((result) => result.score >= MIN_SCORE);
}
