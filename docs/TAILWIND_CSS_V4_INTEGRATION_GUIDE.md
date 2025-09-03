# Tailwind CSS v4 Integration Guide

> **CRITICAL**: This project uses **Tailwind CSS v4** - NOT v3. The syntax and configuration are significantly different.

## Table of Contents

1. [Version Identification](#version-identification)
2. [Critical Breaking Changes](#critical-breaking-changes)
3. [Proper Configuration](#proper-configuration)
4. [CSS Syntax Requirements](#css-syntax-requirements)
5. [Common Errors & Solutions](#common-errors--solutions)
6. [Migration Checklist](#migration-checklist)
7. [AI Agent Guidelines](#ai-agent-guidelines)

## Version Identification

**Current Installation:**

```json
{
  "devDependencies": {
    "@tailwindcss/postcss": "^4.1.12",
    "tailwindcss": "^4.1.12"
  }
}
```

**How to Check Version:**

```bash
npm list tailwindcss
# Should show 4.x.x, NOT 3.x.x
```

## Critical Breaking Changes

### 1. CSS Import Syntax

| Version | Syntax                                                                                                     | Status               |
| ------- | ---------------------------------------------------------------------------------------------------------- | -------------------- |
| **v3**  | `@import 'tailwindcss/base';`<br>`@import 'tailwindcss/components';`<br>`@import 'tailwindcss/utilities';` | ❌ **INVALID in v4** |
| **v4**  | `@import "tailwindcss";`                                                                                   | ✅ **REQUIRED**      |

### 2. Configuration File

| Version | File                 | Required      |
| ------- | -------------------- | ------------- |
| **v3**  | `tailwind.config.js` | Optional      |
| **v4**  | `tailwind.config.ts` | **MANDATORY** |

### 3. PostCSS Configuration

**v3 Syntax (INVALID in v4):**

```javascript
// ❌ DON'T USE
module.exports = {
  plugins: ['tailwindcss', 'autoprefixer'],
};
```

**v4 Syntax (REQUIRED):**

```javascript
// ✅ CORRECT
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
};
export default config;
```

### 4. Custom Utility Classes

**v3 Syntax (INVALID in v4):**

```css
/* ❌ DON'T USE - Will cause compilation errors */
@utility btn-primary {
  background-color: blue;
}

@utility btn-primary:hover {
  background-color: darkblue;
}
```

**v4 Syntax (REQUIRED):**

```css
/* ✅ CORRECT - Use @layer components */
@layer components {
  .btn-primary {
    background-color: blue;
  }

  .btn-primary:hover {
    background-color: darkblue;
  }
}
```

## Proper Configuration

### 1. Required Files Structure

```
project/
├── tailwind.config.ts        # MANDATORY
├── postcss.config.mjs        # MANDATORY
├── src/app/globals.css       # MANDATORY
└── package.json              # Check versions
```

### 2. Complete tailwind.config.ts

```typescript
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Custom colors here
        agro: {
          primary: 'var(--agro-primary)',
          'primary-dark': 'var(--agro-primary-dark)',
          secondary: 'var(--agro-secondary)',
          accent: 'var(--agro-accent)',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;

export default config;
```

### 3. Complete postcss.config.mjs

```javascript
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
};

export default config;
```

### 4. Complete globals.css Structure

```css
/* 1. IMPORTS FIRST - MANDATORY ORDER */
@import 'tailwindcss';
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');

/* 2. CSS VARIABLES */
:root {
  --agro-primary: #22c55e;
  --agro-primary-dark: #16a34a;
  /* ... other variables */
}

/* 3. DARK MODE VARIABLES */
.dark {
  /* Dark mode overrides */
}

/* 4. BASE LAYER */
@layer base {
  * {
    border-color: hsl(var(--border));
  }
  body {
    background-color: hsl(var(--background));
    color: hsl(var(--foreground));
  }
}

/* 5. COMPONENTS LAYER */
@layer components {
  .btn-primary {
    /* Custom component styles */
  }
}

/* 6. KEYFRAMES (AFTER LAYERS) */
@keyframes fadeIn {
  /* Animation definitions */
}
```

## Common Errors & Solutions

### Error 1: "Parsing css source code failed"

```
@import rules must precede all rules aside from @charset and @layer statements
```

**Cause:** `@import` statements not at the beginning of CSS file

**Solution:**

```css
/* ✅ CORRECT ORDER */
@import 'tailwindcss';
@import url('...');

/* ALL OTHER CSS BELOW */
:root {
  /* ... */
}
```

### Error 2: "Cannot apply unknown utility class"

```
Error: Cannot apply unknown utility class `border-border`
```

**Cause:** Using v3 utility class names in v4

**Solution:** Replace with standard CSS properties:

```css
/* ❌ v3 syntax */
@apply border-border;

/* ✅ v4 compatible */
border-color: hsl(var(--border));
```

### Error 3: "Package path ./base is not exported"

```
Package path ./base is not exported from package tailwindcss
```

**Cause:** Using v3 import syntax with v4 installation

**Solution:**

```css
/* ❌ v3 syntax */
@import 'tailwindcss/base';

/* ✅ v4 syntax */
@import 'tailwindcss';
```

### Error 4: "Invalid utility name"

```
@utility btn-primary:hover defines an invalid utility name
```

**Cause:** v4 doesn't support `@utility` with pseudo-selectors

**Solution:**

```css
/* ❌ Invalid */
@utility btn-primary:hover {
  /* ... */
}

/* ✅ Correct */
@layer components {
  .btn-primary:hover {
    /* ... */
  }
}
```

## Migration Checklist

### Pre-Migration Checks

- [ ] Confirm Tailwind CSS version: `npm list tailwindcss`
- [ ] Backup current `globals.css`
- [ ] Check if `tailwind.config.ts` exists

### Configuration Setup

- [ ] Create/update `tailwind.config.ts` with v4 syntax
- [ ] Update `postcss.config.mjs` with object syntax
- [ ] Install missing dependencies: `npm install autoprefixer`

### CSS File Updates

- [ ] Replace `@import 'tailwindcss/base'` etc. with `@import "tailwindcss"`
- [ ] Move all `@import` statements to the top
- [ ] Convert `@utility` declarations to `@layer components`
- [ ] Replace `@apply` with custom CSS properties where needed
- [ ] Remove duplicate imports

### Testing

- [ ] Clear Next.js cache: `rm -rf .next`
- [ ] Restart development server
- [ ] Verify no compilation errors
- [ ] Test basic Tailwind classes (e.g., `bg-blue-500`)
- [ ] Test custom components and utilities

## AI Agent Guidelines

### When Working with This Project:

1. **ALWAYS CHECK VERSION FIRST**

   ```bash
   npm list tailwindcss
   ```

2. **NEVER USE v3 SYNTAX**
   - No `@import 'tailwindcss/base'`
   - No `@utility` declarations with pseudo-selectors
   - No array syntax in PostCSS config

3. **REQUIRED FILES CHECK**
   - Ensure `tailwind.config.ts` exists
   - Verify `postcss.config.mjs` uses object syntax
   - Check `@import "tailwindcss"` in globals.css

4. **CSS STRUCTURE ENFORCEMENT**

   ```css
   /* MANDATORY ORDER */
   @import 'tailwindcss'; /* FIRST */
   @import url('...'); /* SECOND */

   :root {
     /* ... */
   } /* THIRD */
   .dark {
     /* ... */
   } /* FOURTH */

   @layer base {
     /* ... */
   } /* FIFTH */
   @layer components {
     /* ... */
   } /* SIXTH */

   @keyframes {
     /* ... */
   } /* LAST */
   ```

5. **ERROR DEBUGGING STEPS**
   - Clear cache: `rm -rf .next`
   - Check import order in CSS
   - Verify config file syntax
   - Ensure v4-compatible utility classes

6. **TESTING COMMANDS**

   ```bash
   # Clear cache and restart
   rm -rf .next
   npm run dev

   # Check for specific errors
   npm list tailwindcss
   ```

### Quick Reference Card

| Issue            | v3 (Wrong)                      | v4 (Correct)                              |
| ---------------- | ------------------------------- | ----------------------------------------- |
| **CSS Import**   | `@import 'tailwindcss/base'`    | `@import "tailwindcss"`                   |
| **Config File**  | `tailwind.config.js` (optional) | `tailwind.config.ts` (required)           |
| **PostCSS**      | `plugins: ['tailwindcss']`      | `plugins: { '@tailwindcss/postcss': {} }` |
| **Custom Utils** | `@utility`                      | `@layer components`                       |
| **Dependencies** | `tailwindcss` only              | `@tailwindcss/postcss` + `tailwindcss`    |

---

**Remember:** Tailwind CSS v4 is a complete rewrite with breaking changes. Always verify the version before making any modifications to ensure compatibility.
