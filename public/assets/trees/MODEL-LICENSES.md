# Conifer visual assets

Source assets:

- Fir Sapling: https://polyhaven.com/a/fir_sapling
- Fir Sapling Medium: https://polyhaven.com/a/fir_sapling_medium
- Source license: CC0 1.0, https://polyhaven.com/license
- Original modeling by Rico Cilliers; photography by Rob Tuytel.

The public-domain license permits commercial use and redistribution. These are decorative fir / conifer visual assets, not photographs of a specific nursery cultivar.

## Website models

- `conifer-growth-4k.glb`: one scene, named groups `adult-tree`, `young-tree`, and `sprout-tree`. The original adult/young geometries and PBR materials are preserved. The sprout uses exactly the same derived geometry as its poster. All ten embedded textures have native 4096×4096 resolution. Exact matching textures are shared between models; the sprout adds no textures. Meshopt compression is required; WebP images are embedded.
- `fir-adult-mobile.glb`: the same adult geometry with actual 2048×2048 textures for an optional mobile 3D viewer.
- Separate native 4K source models are retained as `fir-adult-4k.glb` and `fir-young-4k.glb`.
- Adult needles use the source's official 4096×4096 opacity mask, restored into RGBA WebP. The material uses alpha cutout (`MASK`, threshold 0.45).

## Poster renders

- `tree-mature-poster-4k.webp`
- `tree-young-poster-4k.webp`
- `tree-sprout-poster-4k.webp`

Each is a genuine 2160×3840 render of the three-dimensional source geometry, with transparent alpha and neutral studio lighting. The corresponding PNG originals are retained. WebP conversion preserves exact pixel dimensions. No low-resolution image was enlarged.

The sprout is an illustrative derivative of the original sapling's apical trunk and upper needle whorls. No roots were added. This sequence is a visual illustration of growth, not a botanical time-lapse simulation.

Per-file checksums, measured bounds, triangle counts, image sizes, and processing notes are in the adjacent JSON manifests. The locally authored renderer is `../studio.html`; it uses Three.js and an explicit visible 4K export button.
