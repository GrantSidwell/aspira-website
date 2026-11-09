# Aspira website

Website for **Aspira Preservation and Development Limited**, the hypothetical consultancy for our CE7718 Inspection and Building Pathology group project (Kingston University, MSc Building Surveying). It mirrors the client report on the Cattle Market subway entrance, Wheatfield Way, Kingston, and lets visitors explore the 3D model.

Built with [Astro](https://astro.build) (static site) and Google's [`<model-viewer>`](https://modelviewer.dev) for the 3D model.

## Run it locally

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static site in dist/
```

## Where to edit things

| What | File |
|---|---|
| Report sections (one Markdown file each) | `src/content/report/*.md` |
| Team names, roles, bios, photos | `src/data/team.ts` (photos in `public/team/`) |
| Company name, tagline, disclaimer | `src/data/site.ts` |
| Clickable markers on the 3D model | `src/data/hotspots.ts` |
| Home page (vision, services) | `src/pages/index.astro` |
| Colours and fonts | `src/styles/global.css` |
| Report images | `public/images/` then `![caption](/images/name.jpg)` in the Markdown |

Each report section has a `status` (placeholder, draft, final) and an optional `lead` (team member id) in its front matter.

## Updating the 3D model (Blender → web)

1. Open the model in Blender.
2. Scripting tab → open `tools/export_glb.py` → Run Script. It exports everything visible except the ground slab to `public/models/cattle-market.glb` (glTF binary, Y up, modifiers applied, Draco-compressed).
   Or by hand: File → Export → glTF 2.0, Format *glTF Binary (.glb)*, Include *Visible objects*, Transform *+Y Up*, Mesh *Apply Modifiers*, Compression on.
3. Commit the new `.glb`. The site picks it up on the next deploy.

Keep the GLB under about 10 MB so it loads quickly on phones: use Principled BSDF materials (they export cleanly), bake or simplify textures to 2K or less, and decimate dense meshes.

**Placing a marker:** open `/model?pick=1`, click the model where the marker should go, copy the `position` and `normal` it shows into `src/data/hotspots.ts`.

## Deploying

Pushes to `main` deploy automatically once the repo is connected to the host (see the thread for the chosen host and the GoDaddy DNS records for aspira.agency).
