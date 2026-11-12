// Edit roles and bios here. Photos go in public/team/<id>.jpg (square, about 800 px).
export type Member = {
  id: string;
  name: string;
  role: string;
  nickname?: string;
  focus: string;
  bio: string;
  photo?: string;
  linkedin?: string;
};

export const team: Member[] = [
  {
    id: 'alex',
    name: 'Alex Robbins',
    role: 'Managing Director',
    nickname: 'The Gaffer',
    focus: 'Leads: client brief and context (section 1), legal and regulatory, corporate video',
    bio: 'Short professional bio (40 to 60 words).',
  },
  {
    id: 'matthew',
    name: 'Matthew Wheeler',
    role: 'Principal Conservation and Sustainability Consultant',
    nickname: 'The Renewal Doctor',
    focus: 'Leads: rehabilitation (section 4), sustainability and carbon (section 5), conclusions',
    bio: 'Short professional bio (40 to 60 words).',
  },
  {
    id: 'hassan',
    name: 'Hassan Sharif',
    role: 'Chief Building Surveyor',
    nickname: 'The Damp Whisperer',
    focus: 'Leads: inspection and pathology (section 2), work schedule (section 6)',
    bio: 'Short professional bio (40 to 60 words).',
  },
  {
    id: 'grant',
    name: 'Grant Sidwell',
    role: 'Head of Design and Visualisation',
    nickname: 'The Colouring-In Department',
    focus: 'Leads: existing and proposed drawings (section 3), 3D model and visuals',
    bio: 'Short professional bio (40 to 60 words): background, interests in building surveying, and what you bring to Aspira.',
  },
];

export const byId = (id?: string) => team.find((m) => m.id === id);
