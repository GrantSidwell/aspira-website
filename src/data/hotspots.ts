// Clickable labels on the 3D model. Positions are in metres in glTF axes:
//   glTF x = Blender x (east), glTF y = Blender z (up), glTF z = -(Blender y) (south).
// Origin = centre of the drum at ground floor level.
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
    id: 'lantern',
    label: 'Glazed lantern',
    note: 'Example: check glazing seals, putty and frame paint at the lantern; a common source of leaks into the drum.',
    position: '1.62 4.27 0',
    normal: '1 0 0',
    section: '02-inspection-and-pathology',
  },
  {
    id: 'plinth',
    label: 'Brick plinth',
    note: 'Example: record salts, spalling and mortar loss at the base of the drum wall.',
    position: '-4.72 0.35 0',
    normal: '-1 0 0',
    section: '02-inspection-and-pathology',
  },
  {
    id: 'liftbox',
    label: 'Raised lift block',
    note: 'Example: flashings where the raised block meets the lower roofs; ventilation of the lift motor room.',
    position: '-2.4 4.72 9.0',
    normal: '0 1 0',
    section: '02-inspection-and-pathology',
  },
];
