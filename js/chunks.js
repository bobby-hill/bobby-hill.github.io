import { profile, projects, skills } from './content.js';

// Each chunk is one searchable piece of the portfolio. `asks` are example
// questions it answers: short questions like "who are you?" match these much
// better than they match the descriptive text itself.
export const chunks = [
  {
    source: 'About me',
    text: profile.bio,
    asks: [
      'Who are you?',
      'What do you do?',
      'Tell me about yourself',
      'What are you studying?',
      'Where do you study?',
      'What are you interested in?',
      'What is your background?',
      'Where are you based?',
      'Where do you live?',
      'Which country are you in?',
    ],
  },
  ...projects.map((p) => ({
    source: p.title,
    link: p.link,
    text: `${p.summary} Built with ${p.tags.join(', ')}.`,
    asks: [
      'What projects have you built?',
      'What have you worked on?',
      `Tell me about ${p.title}`,
      ...(p.asks ?? []),
    ],
  })),
  {
    source: 'Skills',
    text: `${skills.join(', ')}.`,
    asks: [
      'What are your skills?',
      'What tools do you use?',
      'What programming languages do you know?',
      'What technologies do you work with?',
      'Do you use AI coding assistants?',
    ],
  },
  {
    source: 'Contact',
    text: `You can reach ${profile.name} by email at ${profile.email}, or connect on GitHub and LinkedIn.`,
    links: [
      { label: 'Email', href: `mailto:${profile.email}` },
      { label: 'GitHub', href: profile.links.github },
      { label: 'LinkedIn', href: profile.links.linkedin },
    ],
    asks: [
      'How can I contact you?',
      'What is your email?',
      'Where can I find you online?',
      'Do you have a GitHub or LinkedIn?',
    ],
  },
];
