# Nikolai Pokrishchenko — portfolio

A minimal portfolio site with an "ask my portfolio" search. Visitors type a question in plain language, and a small sentence-embedding model ([all-MiniLM-L6-v2](https://huggingface.co/Xenova/all-MiniLM-L6-v2) via [Transformers.js](https://github.com/huggingface/transformers.js)) finds the closest matching parts of the portfolio. The model runs entirely in the browser, so there is no server and no API key.

## Run locally

ES modules don't load from `file://`, so serve the folder:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Editing content

- `js/content.js`: name, bio, links, skills and projects. Each project can list `asks`, example questions it should answer.
- `js/chunks.js`: how the content is split into searchable entries, with example questions for each.

## Files

- `index.html`, `css/minimal.css`: the page.
- `js/intro.js`: the intro sequence (ripples, typing) and the question flow.
- `js/ripple.js`: the ASCII ripple animation.
- `js/search.js`: loads the model, embeds the entries and ranks them by cosine similarity.
