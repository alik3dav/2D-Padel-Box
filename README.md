# 2D-Padel-Box

## Manually upload an SVG into the code

If you want to use your own SVG for an object (court, wall, etc.), edit:

- `lib/object-svg-assets.ts`

### Steps

1. Open `lib/object-svg-assets.ts`.
2. Find `objectSvgBackgrounds`.
3. Pick an object type key (for example: `"padel-court"`) and replace its SVG string.
4. Paste your full SVG markup as a template string inside `svgDataUrl(...)`.
5. Keep `viewBox` in your SVG and set `preserveAspectRatio='none'` so it scales with the box.
6. Use **single quotes** inside the SVG XML to avoid escaping issues in the template string.
7. Save and refresh the editor.

### Quick example

```ts
"padel-court": svgDataUrl(
  `<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 50' preserveAspectRatio='none'>
    <rect width='100' height='50' fill='black'/>
    <circle cx='50' cy='25' r='10' fill='white'/>
  </svg>`,
),
```

### Notes

- You can add more object types to the map at any time.
- The app encodes the SVG into a data URL automatically.
- If an object type has no SVG in the map, it falls back to color-only styling.
