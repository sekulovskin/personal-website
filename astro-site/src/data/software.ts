export type Software = {
  name: string;
  description: string;
  note?: string;
  links: { label: string; href: string }[];
};

export const created: Software[] = [
  {
    name: 'bgmElicit',
    description:
      'Uses large language models to help you set priors on the network structure in Bayesian graphical models.',
    links: [{ label: 'GitHub', href: 'https://github.com/sekulovskin/bgmElicit' }],
  },
];

export const contributed: Software[] = [
  {
    name: 'bgms',
    description: 'Bayesian analysis of networks of binary, ordinal and continuous variables.',
    links: [
      { label: 'CRAN', href: 'https://cran.r-project.org/package=bgms' },
      { label: 'Docs', href: 'https://bayesian-graphical-modelling-lab.github.io/bgms/' },
      { label: 'GitHub', href: 'https://github.com/Bayesian-Graphical-Modelling-Lab/bgms' },
    ],
  },
  {
    name: 'easybgm',
    description: 'A user-friendly wrapper for Bayesian graphical modeling in R.',
    links: [
      { label: 'CRAN', href: 'https://cran.r-project.org/package=easybgm' },
      { label: 'GitHub', href: 'https://github.com/KarolineHuth/easybgm' },
    ],
  },
  {
    name: 'JASP',
    description:
      'Free, open-source statistics software from the University of Amsterdam. I work on its Bayesian network module.',
    links: [{ label: 'Website', href: 'https://jasp-stats.org/' }],
  },
];
