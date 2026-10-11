// Core stack from the CV (portfolio-site/content/CV.md). Technology names are not translated;
// prose items (skills.proseItems in the locale files) are appended per group.
export const SKILL_GROUPS = [
  { key: 'languages', items: ['TypeScript', 'Java', 'Go', 'Python', 'Dart'] },
  { key: 'frontend', items: ['React', 'Tailwind CSS', 'Flutter', 'HTML5 / CSS3'] },
  {
    key: 'backend',
    items: ['Node.js', 'NestJS', 'Express', 'REST', 'WebSocket', 'OAuth 2.0'],
  },
  {
    key: 'cloud',
    items: [
      'AWS Lambda',
      'API Gateway',
      'DynamoDB',
      'GCP',
      'Terraform',
      'Serverless Framework',
      'Docker',
      'GitHub Actions',
    ],
  },
  { key: 'data', items: ['PostgreSQL', 'MySQL', 'DynamoDB'] },
  { key: 'quality', items: ['Vitest', 'Jest', 'Patrol', 'CI/CD'] },
  { key: 'leading', items: [] },
] as const;

export type SkillGroupKey = (typeof SKILL_GROUPS)[number]['key'];
