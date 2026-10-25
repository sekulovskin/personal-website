// A small BibTeX reader for the publication list. It covers what journal
// exports, Google Scholar and Zotero produce: braced or quoted values, nested
// braces, @string macros, `#` concatenation and LaTeX accents.

export type BibEntry = {
  type: string;
  key: string;
  /** Field values exactly as written in the .bib file (minus the outer braces). */
  fields: Record<string, string>;
};

const MONTHS: Record<string, string> = {
  jan: '1', feb: '2', mar: '3', apr: '4', may: '5', jun: '6',
  jul: '7', aug: '8', sep: '9', oct: '10', nov: '11', dec: '12',
};

export function parseBibtex(src: string): BibEntry[] {
  const entries: BibEntry[] = [];
  const macros: Record<string, string> = { ...MONTHS };
  let pos = 0;

  const fail = (msg: string): never => {
    const line = src.slice(0, pos).split('\n').length;
    throw new Error(`publications.bib, line ${line}: ${msg}`);
  };
  const skipWs = () => {
    while (pos < src.length && /\s/.test(src[pos])) pos++;
  };
  const readWord = () => {
    const m = /^[^\s,=#{}()"]+/.exec(src.slice(pos));
    pos += m ? m[0].length : 0;
    return m ? m[0] : '';
  };
  const readBraced = () => {
    const start = pos + 1;
    let depth = 0;
    for (; pos < src.length; pos++) {
      const c = src[pos];
      if (c === '\\') pos++;
      else if (c === '{') depth++;
      else if (c === '}' && --depth === 0) return src.slice(start, pos++);
    }
    return fail('unbalanced braces');
  };
  const readQuoted = () => {
    const start = ++pos;
    let depth = 0;
    for (; pos < src.length; pos++) {
      const c = src[pos];
      if (c === '\\') pos++;
      else if (c === '{') depth++;
      else if (c === '}') depth--;
      else if (c === '"' && depth === 0) return src.slice(start, pos++);
    }
    return fail('unterminated quoted value');
  };
  const readValue = () => {
    let out = '';
    for (;;) {
      skipWs();
      if (src[pos] === '{') out += readBraced();
      else if (src[pos] === '"') out += readQuoted();
      else {
        const word = readWord();
        out += macros[word.toLowerCase()] ?? word;
      }
      skipWs();
      if (src[pos] !== '#') return out;
      pos++;
    }
  };

  while ((pos = src.indexOf('@', pos)) !== -1) {
    pos++;
    const type = readWord().toLowerCase();
    skipWs();
    if (src[pos] !== '{') continue;
    if (type === 'comment' || type === 'preamble') {
      readBraced();
      continue;
    }
    pos++;
    skipWs();
    if (type === 'string') {
      const name = readWord().toLowerCase();
      skipWs();
      if (src[pos++] !== '=') fail(`expected "=" in @string{${name}`);
      macros[name] = readValue();
      continue;
    }

    const key = readWord();
    const fields: Record<string, string> = {};
    for (;;) {
      skipWs();
      if (src[pos] === ',') {
        pos++;
        skipWs();
      }
      if (src[pos] === '}' || pos >= src.length) {
        pos++;
        break;
      }
      const name = readWord().toLowerCase();
      skipWs();
      if (!name || src[pos] !== '=') fail(`expected "field = value" in @${type}{${key}`);
      pos++;
      fields[name] = readValue();
    }
    entries.push({ type, key, fields });
  }
  return entries;
}

// Combining marks for LaTeX accent commands, e.g. \v{s} -> s + caron -> š.
const ACCENTS: Record<string, string> = {
  '"': '̈', "'": '́', '`': '̀', '^': '̂', '~': '̃',
  '=': '̄', '.': '̇', u: '̆', v: '̌', H: '̋',
  c: '̧', k: '̨', r: '̊', d: '̣', b: '̱',
};
const SYMBOLS: Record<string, string> = {
  ss: 'ß', ae: 'æ', AE: 'Æ', oe: 'œ', OE: 'Œ', aa: 'å', AA: 'Å',
  o: 'ø', O: 'Ø', l: 'ł', L: 'Ł', i: 'ı', j: 'ȷ',
};

/** Turns a raw BibTeX value into plain Unicode text for display. */
export function latexToText(s: string): string {
  return s
    .replace(
      /\\([\x22'`^~=.]|[uvHckrdb](?![a-zA-Z]))\s*(?:\{\s*(\\?[a-zA-Z])\s*\}|(\\?[a-zA-Z]))/g,
      (_, accent: string, braced?: string, bare?: string) =>
        (braced ?? bare ?? '').replace(/^\\/, '') + ACCENTS[accent],
    )
    .replace(/\\(ss|ae|AE|oe|OE|aa|AA|o|O|l|L|i|j)(?![a-zA-Z])\s*(\{\})?/g, (_, c) => SYMBOLS[c])
    .replace(/\\([&%$#_{}])/g, '$1')
    .replace(/\\[a-zA-Z]+\s*/g, '')
    .replace(/[{}]/g, '')
    .replace(/---/g, '—')
    .replace(/--/g, '–')
    .replace(/~/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .normalize('NFC');
}

export type Name = { last: string; first: string };

/** Splits an author field on top-level "and" and reads "Last, First" or "First Last". */
export function parseNames(field: string): Name[] {
  const parts: string[] = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < field.length; i++) {
    const c = field[i];
    if (c === '{') depth++;
    else if (c === '}') depth--;
    else if (depth === 0) {
      const m = /^\s+and\s+/i.exec(field.slice(i));
      if (m) {
        parts.push(field.slice(start, i));
        i += m[0].length - 1;
        start = i + 1;
      }
    }
  }
  parts.push(field.slice(start));

  return parts.map((raw) => {
    const name = latexToText(raw);
    if (/^\{.*\}$/.test(raw.trim())) return { last: name, first: '' };
    const comma = name.indexOf(',');
    if (comma !== -1) {
      return { last: name.slice(0, comma).trim(), first: name.slice(comma + 1).trim() };
    }
    const words = name.split(' ');
    const von = words.findIndex((w, i) => i > 0 && i < words.length - 1 && /^[a-z]/.test(w));
    const split = von === -1 ? words.length - 1 : von;
    return { last: words.slice(split).join(' '), first: words.slice(0, split).join(' ') };
  });
}

/** "Eric-Jan" -> "E.-J.", "Jonas M. B." -> "J. M. B." */
export function initials(first: string): string {
  return first
    .split(/\s+/)
    .filter(Boolean)
    .map((part) =>
      part
        .split('-')
        .map((p) => p.charAt(0).toUpperCase() + '.')
        .join('-'),
    )
    .join(' ');
}
