# Domoriks.com

This repository is the source for the Domoriks project website, built with Jekyll.

## Local development

```bash
bundle install
bundle exec jekyll serve --livereload
# → http://localhost:4000
```

## Project structure

```
_config.yml         Site config — title, GitHub URLs, feature text
_data/
  features.yml      Homepage features section
  nav.yml           Navigation links and docs sidebar
  stats.yml         Stats bar
_projects/          Project collection (one .md per project)
_docs/              Documentation pages
_posts/             Blog posts
_includes/          Reusable components (navbar, footer, search, cards, callouts)
_layouts/           Page layouts (default, project, doc, post)
assets/
  css/main.css      Custom styles
  js/main.js        Navbar, theme, scroll reveal, TOC, copy buttons
  js/search.js      Lunr.js full-text search
index.html          Homepage
projects.html       Projects listing with tag filter
blog.html           Blog with pagination
docs.html           Documentation index
search.json         Search index (Jekyll-generated)
404.html            Custom 404 page
.github/workflows/  GitHub Actions — build and deploy to Pages
```

## Adding content

### New project
Create `_projects/my-project.md` with front matter:
```yaml
---
title: "My Project"
description: "Short description."
image: "https://..."
tags: ["Python", "Hardware"]
github: "https://github.com/..."
language: "Python"
license: "MIT"
version: "1.0.0"
---
```

### New doc page
Create `_docs/my-topic.md` and add it to `_data/nav.yml` under the right sidebar section.

### New blog post
Create `_posts/YYYY-MM-DD-title.md` with `layout: post` in front matter.

## Deployment
Push to `main` — GitHub Actions builds and deploys to GitHub Pages automatically.
