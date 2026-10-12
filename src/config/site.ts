// Public destinations linked from the landing page.
export const SITE_LINKS = {
  game: 'https://game.hassasin.com',
  cv: 'https://onepage.hassasin.com',
  matrixIntro: 'https://portfolio.hassasin.com',
  github: 'https://github.com/IAmHassasin',
  linkedin: 'https://www.linkedin.com/in/kh%E1%BA%A3-ph%E1%BA%A1m-7408a5163',
} as const;

// Stored in two parts and joined in the browser to keep the address away from simple scrapers.
export const CONTACT_EMAIL = { user: 'phamduckha21123', domain: 'gmail.com' } as const;

export const THEME_STORAGE_KEY = 'hassasin-theme';

// Section anchors shared by the header nav and the sections themselves.
export const SECTION_IDS = {
  help: 'help',
  projects: 'projects',
  skills: 'skills',
  journey: 'journey',
  awards: 'awards',
  contact: 'contact',
} as const;
