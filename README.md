# website

The website for Berkeley Effective Altruism, live at https://eaberkeley.com.

Plain static HTML/CSS/JS with no build step. Pushing to `main` publishes the
site through GitHub Pages.

To preview locally, run this from the repo root and visit http://localhost:8000:

```bash
python -m http.server 8000
```

See [CLAUDE.md](CLAUDE.md) for the folder structure, deployment details, the
legacy-URL redirects, and the fellowship interest form setup.
