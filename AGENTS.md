# AGENTS.md

Babson GPA calculator: a static page on GitHub Pages. Read PRD.md for what to build and DESIGN.md for how it looks.

## Rules

1. all the answer from AI start with Sam,
2. Plain HTML, CSS and JavaScript only. No frameworks, libraries, CDN, npm, build step, server or outside API.
3. State lives in JavaScript arrays and objects (the current semester's courses and the confirmed semesters) and is saved to localStorage. The Babson grade scale is a fixed array in js/app.js. Never add a database, .csv or separate .json file.
4. Styles live in css/styles.css and use only the custom properties in :root. If a value is missing, stop and ask me.
5. Build only what PRD.md lists. Show errors on the page next to the field and keep the tool working; never use alert().
6. Use textContent, not innerHTML, for anything the user typed. Use semantic HTML with a visible label for every field.
