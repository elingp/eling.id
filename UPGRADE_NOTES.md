# Astro Cactus Theme Upgrade Notes

## v4.9.0 → v4.11.0 (Completed ✓)

**Date:** October 13, 2025  
**Branch:** `upgrade-to-v4.11.0`  
**Status:** ✅ Completed and tested

### Changes Applied

#### 1. Dependencies Updated

**Added:**
- `astro-robots-txt@^1.0.0` - Automatic robots.txt generation
- `astro-webmanifest@^1.0.0` - Automatic web manifest generation

**Removed:**
- `@tailwindcss/aspect-ratio@^0.4.2` - Deprecated plugin (core CSS now handles aspect ratios)

#### 2. Configuration Changes

**`astro.config.ts`:**
- Added `robotsTxt()` integration for automatic robots.txt generation
- Added `webmanifest()` integration with configuration:
  - Uses site config for title, description, and language
  - Points to `public/icon.svg` as source for favicon generation
  - Configured icons: apple-touch-icon (180x180), icon-192 (192x192), icon-512 (512x512)
  - Background color: `#1d1f21`, Theme color: `#2bbc8a`
  - Display mode: `standalone`
  - Disabled auto-insertion of favicon, theme color, and manifest links (we handle these manually)

**`tailwind.config.ts`:**
- Removed `aspectRatio: false` from `corePlugins` (no longer needed)
- Removed `@tailwindcss/aspect-ratio` from plugins array
- Added `kbd` element styling fix for dark mode: `"@apply dark:bg-textColor": ""`
- Added table alignment CSS for better markdown rendering:
  - `th[align="center"], td[align="center"]`
  - `th[align="right"], td[align="right"]`
  - `th[align="left"], td[align="left"]`
- Updated comment: `/* Admonitions/Aside css*/` → `/* Admonitions/Aside */`
- Added comment: `/* Table */` before table-related styles

**`package.json`:**
- Updated version from `4.9.0` to `4.11.0`

#### 3. What Changed in Upstream (v4.9.0 → v4.11.0)

**v4.10.0 (Sept 23, 2024):**
- Added automatic robots.txt and webmanifest generation
- New integrations: `astro-robots-txt` and `astro-webmanifest`

**v4.11.0 (Oct 8, 2024):**
- Bug fix: markdown `<kbd>` content styling
- Fixed: manifest link to prevent 404 in dev mode
- Removed: `@tailwindcss/aspect-ratio` dependency

### Files Preserved (Your Customizations)

The following customizations were **preserved** during the upgrade:

#### Content & Branding:
- All blog posts in `src/content/post/`
- Custom images: `src/assets/eling.jpg`, `src/assets/eling-about.jpg`
- Site configuration: `src/site.config.ts`
- Custom public assets (favicons, social card)

#### Fonts:
- Merriweather (serif): `@fontsource/merriweather`
- Raleway (sans-serif): `@fontsource/raleway`

#### Component/Layout Modifications:
- All customized components and layouts remain unchanged
- Your specific styling choices in `tailwind.config.ts` (colors, typography, admonitions)

### Build Verification

✅ Build successful with no errors:
```bash
pnpm run build
# Result: 17 pages built successfully
# Pagefind: 10 pages indexed
```

### Next Steps

1. **Test locally:**
   ```bash
   pnpm run dev
   ```
   Visit http://localhost:4321 and verify:
   - Home page renders correctly
   - Blog posts display properly
   - Theme switching works
   - Navigation works
   - Images load correctly

2. **Deploy to dev:**
   ```bash
   git checkout dev
   git merge upgrade-to-v4.11.0
   git push origin dev
   ```
   - Check Cloudflare build succeeds
   - Test on dev URL

3. **If everything looks good, merge to main:**
   ```bash
   git checkout main
   git merge dev
   git push origin main
   ```

### Future Upgrades

**Planned Upgrade Path:**
- ✅ v4.9.0 → v4.11.0 (COMPLETED)
- ⏭️ v4.11.0 → v5.x.x (Next major version)
- ⏭️ v5.x.x → v6.9.0 (Latest version)

**Important Notes for Future Upgrades:**
- Always check release notes for breaking changes
- Test incrementally (minor → major → latest)
- Keep `customized-files.txt` updated for reference
- Preserve custom fonts and branding
- Review component changes carefully

### Resources

- [Astro Cactus GitHub](https://github.com/chrismwilliams/astro-theme-cactus)
- [v4.10.0 Release Notes](https://github.com/chrismwilliams/astro-theme-cactus/releases/tag/v4.10.0)
- [v4.11.0 Release Notes](https://github.com/chrismwilliams/astro-theme-cactus/releases/tag/v4.11.0)
- [Full Changelog: v4.9.0...v4.11.0](https://github.com/chrismwilliams/astro-theme-cactus/compare/v4.9.0...v4.11.0)

---

**Generated on:** October 13, 2025  
**Upgrade performed by:** GitHub Copilot (Agentic Mode)
