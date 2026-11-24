// Clickable labels on the 3D model. Positions are in metres in glTF axes:
//   glTF x = Blender x (east), glTF y = Blender z (up), glTF z = -(Blender y) (south).
// Origin = centre of the drum at ground floor level (tools/prepare_revit_glb.mjs moves the Revit export there).
// Easiest way to get a position: open /model?pick=1, click the model, copy the numbers shown.
export type Hotspot = {
  id: string;
  label: string;
  note: string;
  position: string; // "x y z"
  normal: string;   // "x y z" surface direction
  section?: string; // report section slug to link to
};

export const hotspots: Hotspot[] = [
  {
    id: 'glazing',
    label: 'Drum glazing',
    note: 'Example: check glazing seals, gaskets and mullion paint round the drum; a common source of leaks into the stair.',
    position: '-4.64 1.7 -1.69',
    normal: '-0.91 0 -0.42',
    section: '02-inspection-and-pathology',
  },
  {
    id: 'plinth',
    label: 'Brick plinth',
    note: 'Example: record salts, spalling and mortar loss at the base of the drum wall.',
    position: '-4.69 0.35 1.71',
    normal: '-0.95 0 0.33',
    section: '02-inspection-and-pathology',
  },
  {
    id: 'wing',
    label: 'Office wing windows',
    note: 'Example: check frames, sills and the joint between frame and brickwork on the office wing.',
    position: '-7.18 1.6 15.4',
    normal: '-1 0 0',
    section: '02-inspection-and-pathology',
  },
];
