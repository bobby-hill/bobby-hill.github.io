// Edit this file to change what the site says.
// "Ask my portfolio" builds its searchable index from these same values.

export const profile = {
  name: 'Nikolai Pokrishchenko',
  tagline: 'MSc Artificial Intelligence student at Vrije Universiteit Amsterdam, specialising in applied AI and robotics.',
  bio: "I'm a MSc Artificial Intelligence student at Vrije Universiteit Amsterdam, specialising in applied AI, robotics and model efficiency. I'm passionate about bridging the gap between research and practical implementation, building helpful real-world systems with a visible impact. I'm based in the Netherlands.",
  hobbies:
    "Outside of AI, I like to play instruments and record music. I also love travelling and taking photos of the places I see, and I keep fit with gym and cycling.",
  email: 'nipokri.work@gmail.com',
  links: {
    github: 'https://github.com/bobby-hill',
    linkedin: 'https://www.linkedin.com/in/nikolai-pokrishchenko-50989a1b3/',
  },
};

export const skills = [
  'Python',
  'Building production-ready apps with AI coding assistants like Claude Code',
  'LLM agents and tool calling',
  'Model Context Protocol (MCP)',
  'LLM evaluation',
  'Robotics with the NAO robot',
  'Speech interfaces (Dialogflow)',
];

// `asks` (optional) are questions this project should answer; see chunks.js.
export const projects = [
  {
    title: 'Ledger: AI finance copilot',
    summary:
      'Upload a bank export and an LLM categorises every transaction, while a chat agent answers questions by calling deterministic tools, so every number comes from code rather than the model. Labelling each merchant once instead of each row cut 731 transactions to 46 labels and reached 95.3% categorisation accuracy. A custom evaluation exposed four flaws in the agent; after fixing them in the tools, it answered all 42 development questions correctly.',
    tags: ['Claude Code', 'Python', 'OpenAI API', 'Function calling', 'Next.js', 'Docker'],
    link: 'https://github.com/bobby-hill/finance-copilot',
    asks: [
      'Have you built an LLM agent?',
      'Have you worked with finance data?',
      'How do you evaluate LLMs?',
      'Have you built a full-stack web app?',
      'Do you use AI coding tools?',
      'Have you used Claude Code?',
      'Can you build production-ready apps?',
    ],
  },
  {
    title: 'BSc thesis: MCP for human-robot interaction',
    summary:
      'My BSc thesis explored the Model Context Protocol (MCP) in human-robot interaction. I built a demo in which a NAO robot acts as a friendly programming buddy: it listens with Dialogflow speech recognition, answers through an LLM that can read the code being debugged, and picks matching body gestures through an MCP tool. I built versions with and without MCP to compare the two.',
    tags: ['Python', 'NAO robot', 'MCP', 'OpenAI API', 'Dialogflow', 'Social Interaction Cloud'],
    link: 'https://github.com/bobby-hill/BSc-Thesis-SAIL',
    asks: [
      'Have you worked with robots?',
      'Have you worked with the NAO robot?',
      'What was your thesis about?',
      'Do you know MCP?',
      'Have you done research?',
    ],
  },
];
