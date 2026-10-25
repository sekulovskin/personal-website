// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://nikolasekulovski.com',
  trailingSlash: 'ignore',
  // Old URLs from the Hugo site, so existing links keep working.
  redirects: {
    '/blog/post1': '/blog/two-level-bayes-factor/',
    '/blog/post2': '/blog/sbm-clustering/',
    '/publications': '/#publications',
    '/software': '/#software',
  },
});
