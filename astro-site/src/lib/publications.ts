// Reads src/data/publications.bib and prepares each entry for the page.
// See the comment at the top of the .bib file for the extra link fields.

import bibSource from '../data/publications.bib?raw';
import { initials, latexToText, parseBibtex, parseNames, type BibEntry } from './bibtex';

/** Matched against last names to highlight your own name in author lists. */
export const MY_LAST_NAME = 'Sekulovski';

// Extra fields that turn into buttons, in the order they appear.
const LINK_FIELDS: [field: string, label: string][] = [
  ['preprint', 'Preprint'],
  ['pdf', 'PDF'],
  ['code', 'Code'],
  ['data', 'Data'],
  ['osf', 'OSF'],
  ['tutorial', 'Tutorial'],
  ['blog', 'Blog post'],
  ['slides', 'Slides'],
];
// Fields that are only for the website and are left out of the copyable BibTeX.
const SITE_ONLY = new Set(['note', ...LINK_FIELDS.map(([f]) => f)]);

const STATUS: Record<string, string> = {
  submitted: 'Submitted',
  accepted: 'Accepted',
  forthcoming: 'Accepted',
  inpress: 'In press',
  prepublished: 'Preprint',
};

export type Author = { name: string; me: boolean };
export type Link = { label: string; href: string };
export type Publication = {
  key: string;
  title: string;
  authors: Author[];
  year: string;
  venue: string;
  volume?: string;
  issue?: string;
  pages?: string;
  status?: string;
  note?: string;
  href?: string;
  links: Link[];
  bibtex: string;
};

const asUrl = (v: string) => (/^10\.\d{4,}\//.test(v) ? `https://doi.org/${v}` : v);

function toBibtex({ type, key, fields }: BibEntry): string {
  const lines = Object.entries(fields)
    .filter(([name]) => !SITE_ONLY.has(name))
    .map(([name, value]) => `  ${name} = {${value}},`);
  return `@${type}{${key},\n${lines.join('\n')}\n}`;
}

function toPublication(entry: BibEntry): Publication {
  const f = entry.fields;
  const text = (name: string) => (f[name] ? latexToText(f[name]) : undefined);

  const paper = f.doi ? `https://doi.org/${f.doi.replace(/^https?:\/\/(dx\.)?doi\.org\//, '')}` : f.url;
  const links: Link[] = [];
  if (paper) links.push({ label: 'Paper', href: paper });
  for (const [field, label] of LINK_FIELDS) {
    if (f[field]) links.push({ label, href: asUrl(f[field].trim()) });
  }

  return {
    key: entry.key,
    title: text('title') ?? '(untitled)',
    authors: parseNames(f.author ?? '').map(({ last, first }) => ({
      name: first ? `${last}, ${initials(first)}` : last,
      me: last === MY_LAST_NAME,
    })),
    year: text('year') ?? '',
    venue: text('journal') ?? text('booktitle') ?? text('publisher') ?? '',
    volume: text('volume'),
    issue: text('number'),
    pages: text('pages') ?? text('eid'),
    status: f.pubstate ? (STATUS[f.pubstate.toLowerCase()] ?? f.pubstate) : undefined,
    note: text('note'),
    href: links[0]?.href,
    links,
    bibtex: toBibtex(entry),
  };
}

const all = parseBibtex(bibSource).map(toPublication);

const STATUS_ORDER = ['Submitted', 'Preprint', 'Accepted', 'In press'];

/** Papers that are submitted, accepted or in press (in that order), then the rest by year. */
export const forthcoming = all
  .filter((p) => p.status)
  .sort((a, b) => STATUS_ORDER.indexOf(a.status!) - STATUS_ORDER.indexOf(b.status!));

const published = all.filter((p) => !p.status);
export const byYear: [year: string, pubs: Publication[]][] = [
  ...new Set(published.map((p) => p.year)),
]
  .sort((a, b) => Number(b) - Number(a))
  .map((year) => [year, published.filter((p) => p.year === year)]);

export const publicationCount = all.length;
