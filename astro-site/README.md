# nikolasekulovski.com

A one-page site built with [Astro](https://astro.build). Needs Node 22.12 or newer.

```sh
npm install
npm run dev      # live preview at http://localhost:4321
npm run build    # static site in dist/
```

## Where things live

| What | File |
| --- | --- |
| Name, links, nav sections | `src/data/site.ts` |
| Bio at the top | `src/text/bio.md` |
| Publications | `src/data/publications.bib` |
| Software | `src/data/software.ts` |
| Talks and workshops | `src/data/talks.ts` |
| Blog posts | `src/content/blog/` (+ `public/blog/` for Quarto output) |
| Photo | `src/assets/avatar.jpg` |
| Colours and fonts | `src/styles/global.css` |
| Redirects from old URLs | `astro.config.mjs` |

## Adding a paper

Paste its BibTeX into `src/data/publications.bib`. The comment at the top of
that file lists the extra fields the site understands (`preprint`, `code`,
`tutorial`, `pubstate`, ...). Your name is bolded automatically, and the
"BibTeX" button on the site shows a clean copy without those extra fields.

## Adding a blog post

**Written in Markdown:** add `src/content/blog/my-post.md`:

```md
---
title: My post
date: 2026-11-01
summary: One sentence for the list on the home page.
---

The post itself, in Markdown.
```

It appears at `/blog/my-post/`.

**Rendered with Quarto or R Markdown:** put the rendered HTML (and its
`_files` folder) in `public/blog/my-post/index.html`, then add a short
`src/content/blog/my-post.md` with the same front matter plus
`href: /blog/my-post/` and no body. Use `embed-resources: true` in Quarto
if you want a single file.

**Posted somewhere else:** same as above, with `href` set to the full URL.

Add `draft: true` to hide a post.
