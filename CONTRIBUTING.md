# Contributing

Thanks for improving LearnRPG.

## Good Contributions

- Add a new course mission.
- Improve an explanation.
- Fix a UI bug.
- Add a career path.
- Improve accessibility.
- Improve mobile layout.
- Add tests or validation scripts.

## Course Content Rules

Each mission should teach by doing. Avoid long lecture text.

Use one of these mission types:

- `choice`: learner picks from options.
- `code`: learner writes a short answer checked by required keywords.
- `think`: learner writes a reasoning answer with a minimum length.

Every mission should include:

- `prompt`
- `code`
- `concept`
- `pattern`
- `example`
- `why`

## Development

This is a static site. No build step is required.

```bash
npm run dev
```

## Pull Request Checklist

- The app opens from `index.html`.
- No console errors on the main pages.
- New courses appear in the catalog.
- New role paths reference valid course IDs.
- Text is concise and learner-friendly.
- Mobile layout still works.
