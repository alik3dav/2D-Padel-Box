# 2D-Padel-Box

## Use SVG backgrounds via URL

If you upload SVG files to your server/CDN and want to use them in the editor, edit:

- `lib/object-svg-assets.ts`

### Steps

1. Upload each SVG file and copy its public URL.
2. Open `lib/object-svg-assets.ts`.
3. Find `objectSvgBackgrounds`.
4. Replace the URL value for each object type you want (for example: `"padel-court"`).
5. Save and refresh the editor.

### Quick example

```ts
"padel-court": cssUrl("https://cdn.example.com/padel/padel-court.svg"),
```

### Notes

- You can add more object types to the map at any time.
- If an object type has no SVG in the map, it falls back to color-only styling.
