# 🚨 TAILWIND CSS v4 QUICK FIX GUIDE

## This Project Uses Tailwind CSS v4 - NOT v3!

### Quick Version Check

```bash
npm list tailwindcss
# Should show: tailwindcss@4.1.12 (or 4.x.x)
```

### ⚡ Emergency Fix Commands

```bash
# 1. Clear cache
rm -rf .next

# 2. Restart dev server
npm run dev
```

### 🔥 Most Common Errors & Instant Fixes

#### Error: "Parsing css source code failed - @import rules must precede"

**Fix:** Move ALL @import statements to TOP of globals.css

```css
/* ✅ CORRECT ORDER */
@import "tailwindcss";
@import url('https://fonts.googleapis.com/...');

/* ❌ WRONG - imports after other rules */
:root { ... }
@import "tailwindcss"; /* TOO LATE! */
```

#### Error: "Package path ./base is not exported"

**Fix:** Wrong import syntax

```css
/* ❌ v3 syntax (BREAKS v4) */
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

/* ✅ v4 syntax (REQUIRED) */
@import 'tailwindcss';
```

#### Error: "Cannot apply unknown utility class"

**Fix:** Replace @apply with direct CSS

```css
/* ❌ Breaks in v4 */
@apply border-border;

/* ✅ Works in v4 */
border-color: hsl(var(--border));
```

#### Error: "Invalid utility name" with @utility

**Fix:** Use @layer components instead

```css
/* ❌ v3 syntax (BREAKS v4) */
@utility btn-primary:hover {
  background: blue;
}

/* ✅ v4 syntax (REQUIRED) */
@layer components {
  .btn-primary:hover {
    background: blue;
  }
}
```

### 📁 Required Files Checklist

- [ ] `tailwind.config.ts` exists (MANDATORY in v4)
- [ ] `postcss.config.mjs` uses object syntax
- [ ] `globals.css` starts with `@import "tailwindcss"`

### 🚀 Nuclear Option (Complete Reset)

If everything breaks:

1. **Backup your custom styles**
2. **Replace globals.css** with clean v4 template
3. **Clear cache**: `rm -rf .next`
4. **Restart**: `npm run dev`

### 📖 Full Documentation

See: `/docs/TAILWIND_CSS_V4_INTEGRATION_GUIDE.md`
