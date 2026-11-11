---
name: better-typography
description: Web typography from choosing fonts to spacing, wrapping and accessibility. Use when picking or pairing typefaces, configuring variable fonts or OpenType features, setting up a type scale, checking heading hierarchy, styling text in components, truncating text, styling underlines, selection, placeholders or carets, or reviewing frontend code for typography. Triggers on typography, fonts, font formats, woff2, variable fonts, font-weight, opentype, font-feature-settings, letter-spacing, line-height, type scale, heading hierarchy, heading levels, tabular numbers, text-wrap, truncation, line clamp, underlines, text-decoration, text selection, iOS input zoom, scaled input text, font smoothing, text contrast, measure, line length, text-box, smart punctuation, drop cap.
---

# Great typography

Good typography is mostly restraint. A sensible scale, comfortable spacing and enough contrast beat any clever effect. A label, a table cell, a marketing headline and an article paragraph should not share one set of rules. Apply these principles when building or reviewing anything with text in it.

When reviewing, read the page instead of scanning the code: squint to check the hierarchy holds, read one full paragraph for comfort, and resize the viewport to catch bad wrapping, widows and truncation at real content lengths.

The words themselves (button labels, error messages, empty states) are covered by the `better-writing` skill; semantic heading structure by `better-accessibility`; spatial RTL layout and logical CSS properties by `better-layout`; rendered-pair contrast measurement and color remediation by `better-colors`. This skill owns how text renders, wraps, and behaves in mixed-direction content.

**Match the project's styling system.** Before suggesting or writing any fix, check how the codebase styles things and express every change in that system: Tailwind utilities in a Tailwind project, plain declarations in CSS, CSS Modules, styled-components or StyleX. The [cheat sheet](css-cheat-sheet.md) maps each declaration to its Tailwind equivalent. Never introduce a second styling approach just to apply a typography fix.

## Core Principles

### 1. Serve the Right Format
Use `.woff2` (Brotli compression, broadly supported) on the web. `.woff` is a fallback only for very old browsers.

### 2. Properties Over Raw Tags
When a CSS property exists, use it. `font-weight: 650` instead of `font-variation-settings: "wght" 650`, `font-optical-sizing: auto` instead of `"opsz"`, `font-variant-numeric: tabular-nums` instead of `font-feature-settings: "tnum" 1`.

### 3. Load Intended Weights and Styles
Prefer loading the faces the design actually uses. Set `font-synthesis: none` only after verifying required bold, italic, and emphasis forms.

### 4. Fewer Fonts, Sizes and Weights
Rarely use more than three fonts. Pair for contrast, not similarity. Below `18px`, stay at weight `400`+; weights under `300` are display-only (`28px`+).

### 5. Use a Type Scale with Semantic Names
Define a small set of sizes and deviate from it as little as possible. Name sizes by use (`text-body-sm`), not by size.

### 6. Heading Sizes Descend with Level
Within a coherent page hierarchy, map heading levels to descending steps of the type scale.

### 7. Line-Height by Role
Headings tighter, around `1.1` to `1.2`. Body copy `1.5` to `1.6`. Unitless values so line-height scales with font size. Anything that wraps to 3+ lines needs at least `1.4`.

### 8. Letter-Spacing by Size
Large headings slightly negative (`tracking-tight` or `-0.02em`). Small uppercase labels positive letter-spacing (`tracking-wider` or `0.05em`).

### 9. Cap the Measure
Cap long-form text around 60–75 characters per line (`max-w-prose` or `max-w-xl`).

### 10. Wrap Deliberately
`text-wrap: balance` on headings. `text-wrap: pretty` on descriptions to avoid orphans. `overflow-wrap: break-word` where long text could escape. `white-space: nowrap` on badges/chips.

### 11. Tabular Numbers on Changing Values
Digits have different widths by default, so timers, counters and prices shift layout. Apply `font-variant-numeric: tabular-nums` (`tabular-nums`) to all changing numerical data.

### 12. Truncate Without Losing Content
Single line: `text-overflow: ellipsis` with `overflow: hidden` and `white-space: nowrap`. Multiple lines: `line-clamp-2` or `line-clamp-3`.

### 13. Write Copy Naturally, Style with CSS
Store text in natural case and control presentation with `text-transform: uppercase` via CSS.

### 14. Underlines from the Font
`text-underline-position: from-font`, `text-decoration-skip-ink: auto`, `underline-offset-2`.

### 15. Inputs at 16px on Mobile
iOS Safari zooms when input text is smaller than `16px`. Ensure mobile inputs use `text-base` (16px) or appropriately scaled inputs to prevent iOS automatic zoom.

### 16. Size and Contrast Floors
UI body text 14px–16px, captions 12px–13px, rarely below 12px. Ensure high contrast against background.

### 17. Font Smoothing on Root
Apply `-webkit-font-smoothing: antialiased` and `-moz-osx-font-smoothing: grayscale` (`antialiased`) once on root layout.

### 18. Keep Useful Text Selectable
Do not disable user-select globally. Keep text selectable by default.
