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

## Updating the 3D model (Revit → web)

The site shows `public/models/the-drum.glb`, made from the Revit model.

1. Export the Revit model to GLB (via Blender or any glTF exporter).
2. Run `npm install` once, then `node tools/prepare_revit_glb.mjs path/to/export.glb`. It removes the level markers and stray default cube, moves the model so the drum centre at ground level is the origin (the hotspots rely on this), gives each Revit family a material (brick, roof, concrete, glass, green paint, doors) and writes `public/models/the-drum.glb`.
3. Check `/model` locally (`npm run dev`), fix any hotspots that moved, and commit the new `.glb`. The site picks it up on the next deploy.

The earlier Blender massing model is kept as `public/models/cattle-market-blender-backup.glb`. To show it again, change the default `src` in `src/components/ModelViewer.astro`. `tools/export_glb.py` still exports from Blender (change its output name first so it does not overwrite anything you need).

Keep the GLB under about 10 MB so it loads quickly on phones: use Principled BSDF materials (they export cleanly), bake or simplify textures to 2K or less, and decimate dense meshes.

**Placing a marker:** open `/model?pick=1`, click the model where the marker should go, copy the `position` and `normal` it shows into `src/data/hotspots.ts`.

## Deploying

Pushes to `main` deploy automatically once the repo is connected to the host (see the thread for the chosen host and the GoDaddy DNS records for aspira.agency).
