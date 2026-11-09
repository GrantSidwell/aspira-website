// Edit roles and bios here. Photos go in public/team/<id>.jpg (square, about 800 px).
export type Member = {
  id: string;
  name: string;
  role: string;
  focus: string;
  bio: string;
  photo?: string;
  linkedin?: string;
};

export const team: Member[] = [
  {
    id: 'grant',
    name: 'Grant Sidwell',
    role: 'Role TBC',
    focus: 'Report sections led: TBC',
    bio: 'Short professional bio (40 to 60 words): background, interests in building surveying, and what you bring to Aspira.',
  },
  {
    id: 'alex',
    name: 'Alex Robbins',
    role: 'Role TBC',
    focus: 'Report sections led: TBC',
    bio: 'Short professional bio (40 to 60 words).',
  },
  {
    id: 'hassan',
    name: 'Hassan Sharif',
    role: 'Role TBC',
    focus: 'Report sections led: TBC',
    bio: 'Short professional bio (40 to 60 words).',
  },
  {
    id: 'matthew',
    name: 'Matthew Wheeler',
    role: 'Role TBC',
    focus: 'Report sections led: TBC',
    bio: 'Short professional bio (40 to 60 words).',
  },
];

export const byId = (id?: string) => team.find((m) => m.id === id);
