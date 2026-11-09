"""
Export the Blender model to a web-ready GLB for the Aspira website.

In Blender: Scripting tab > Open this file > Run Script (with your model open).
It writes public/models/cattle-market.glb next to this repo's tools/ folder,
or to the path in OUT below if you run it from elsewhere.

Command line (no Blender UI needed):
    blender -b cattle_market_model.blend -P tools/export_glb.py -- public/models/cattle-market.glb
"""
import bpy, os, sys

# Objects whose names start with these are left out of the web model.
# The big ground slab hides the subway, so the website uses a soft shadow instead.
SKIP_PREFIXES = ("Ground",)

argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
here = os.path.dirname(os.path.abspath(__file__)) if "__file__" in globals() else os.getcwd()
OUT = argv[0] if argv else os.path.join(here, "..", "public", "models", "cattle-market.glb")

bpy.ops.object.select_all(action="DESELECT")
for o in bpy.context.scene.objects:
    if o.visible_get() and not o.name.startswith(SKIP_PREFIXES):
        o.select_set(True)

bpy.ops.export_scene.gltf(
    filepath=OUT,
    export_format="GLB",
    use_selection=True,
    export_apply=True,          # apply modifiers
    export_yup=True,            # web convention: Y up
    export_draco_mesh_compression_enable=True,  # much smaller files once models get detailed
    export_draco_mesh_compression_level=6,
)
print("Wrote", OUT)
