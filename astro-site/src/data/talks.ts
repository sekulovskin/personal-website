// Talks and workshops, newest first. `date` is "YYYY-MM"; `url` is optional
// (slides, recording, event page).

export type Talk = {
  date: string;
  title: string;
  event: string;
  place: string;
  kind: 'Invited' | 'Talk' | 'Poster';
  url?: string;
};

export const talks: Talk[] = [
  {
    date: '2026-07',
    title: 'LLM-based prior elicitation for Bayesian graphical modeling',
    event: 'International Meeting of the Psychometric Society (IMPS)',
    place: 'Seoul, South Korea',
    kind: 'Talk',
  },
  {
    date: '2025-12',
    title: 'Frequentist and Bayesian statistics with examples in JASP',
    event: 'Ss. Cyril and Methodius University',
    place: 'Skopje, North Macedonia',
    kind: 'Invited',
  },
  {
    date: '2025-12',
    title: 'A stochastic block prior for clustering in graphical models',
    event: 'CFE-CMStatistics',
    place: 'London, UK',
    kind: 'Talk',
  },
  {
    date: '2025-12',
    title: 'LLM-based prior elicitation for Bayesian graphical modeling',
    event: 'IOPS Winter Conference',
    place: 'Utrecht, the Netherlands',
    kind: 'Talk',
  },
  {
    date: '2025-07',
    title: 'Using the stochastic block model for clustering in psychological networks',
    event: 'European Association of Methodology (EAM)',
    place: 'Tenerife, Spain',
    kind: 'Talk',
  },
  {
    date: '2024-10',
    title: 'A Good check on the Bayes factor',
    event: 'Bayesian Methods for the Social Sciences II',
    place: 'Amsterdam, the Netherlands',
    kind: 'Poster',
  },
  {
    date: '2024-07',
    title: 'Testing conditional independence in psychometric networks',
    event: 'International Meeting of the Psychometric Society (IMPS)',
    place: 'Prague, Czech Republic',
    kind: 'Talk',
  },
  {
    date: '2023-09',
    title:
      'Bayesian approaches for assessing conditional independence and prior sensitivity in network psychometrics',
    event: 'DynaNeT Workshop, Utrecht University',
    place: 'Utrecht, the Netherlands',
    kind: 'Invited',
  },
  {
    date: '2023-06',
    title: 'Testing conditional independence in psychometric networks: An analysis of three Bayesian methods',
    event: 'IOPS Summer Conference',
    place: 'Tilburg, the Netherlands',
    kind: 'Poster',
  },
];

export type Workshop = {
  when: string;
  title: string;
  event: string;
  role?: string;
  url?: string;
};

export const workshops: Workshop[] = [
  {
    when: '2025–2026',
    title: 'The Bayesian analysis of networks',
    event: 'PSYNETS workshops (January and July editions)',
    role: 'with Maarten Marsman',
  },
  {
    when: 'Oct 2024',
    title: 'Bayesian graphical modeling',
    event: 'Bayesian Methods for the Social Sciences II, Amsterdam',
    role: 'with Maarten Marsman',
  },
  {
    when: 'Sep 2024',
    title: 'Bayesian graphical modeling',
    event: 'What is Psychometrics? (IOPS course)',
    role: 'with Maarten Marsman',
  },
  {
    when: 'Jun 2024',
    title: 'An introduction to JASP',
    event: 'New Horizons in Psychological Science and Practice, Skopje',
  },
  {
    when: 'Jul 2022',
    title: 'Introduction to multilevel analysis',
    event: 'Utrecht Summer School',
    role: 'teaching assistant',
  },
];
