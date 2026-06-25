# Deployment

LearnRPG is a static site. It can be deployed anywhere that hosts HTML, CSS, and JavaScript.

## GitHub Pages

1. Create a GitHub repository.
2. Upload everything inside the `learnrpg` folder.
3. Commit to `main`.
4. Open repository settings.
5. Go to `Pages`.
6. Set source to `Deploy from a branch`.
7. Select branch `main`.
8. Select folder `/root`.
9. Save.

GitHub will publish a public URL after the first build.

## Netlify

1. Open Netlify.
2. Drag and drop the `learnrpg` folder.
3. Netlify will deploy it as a static site.

## Vercel

1. Import the repository.
2. Use the default static site settings.
3. Deploy.

## Local Development

Direct file open works:

```text
index.html
```

Or serve locally:

```bash
npm run dev
```

Alternative:

```bash
python -m http.server 8080
```

## Notes

- No server environment variables are required.
- No database setup is required.
- Progress is stored in browser `localStorage`.
- `.nojekyll` is included so GitHub Pages serves static assets normally.
