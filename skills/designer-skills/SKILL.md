---
name: designer-skills
description: Agentic designer skills, principles, commands, and critique frameworks from Owl-Listener/designer-skills. Covers UI design, interaction design, design systems, visual critique, UX strategy, design research, and prototyping. Use to guide visual hierarchy, micro-interactions, Gestalt laws, spacing, typography scales, accessibility, and design quality audits.
---

# Designer Skills Collection

This repository integrates the **Owl-Listener/designer-skills** collection into the application environment. It equips the agent with 111+ structured design skills, heuristics, Gestalt laws, and visual critique frameworks across 9 domains.

## Installed Domains & Paths

1. **UI Design** (`/skills/designer-skills/ui-design/skills/`)
   - `visual-hierarchy`: Establish clear scanning path (Primary, Secondary, Tertiary, Quaternary)
   - `typography-scale`: Strict modular scale ratios (4px/8px baseline rhythm)
   - `spacing-system`: Predictable spacing units (4, 8, 12, 16, 24, 32, 48px)
   - `color-system`: Semantic roles (Primary, Surface, Accent, State colors)
   - `layout-grid`: Proportional squircle grids, gutters, and responsive layouts
   - `aesthetic-usability`: The aesthetic-usability effect (polish as a signal of trust)
   - `gestalt-principles`: Law of Proximity, Law of Similarity, Law of Common Region, Law of Closure, Law of Figure-Ground

2. **Interaction Design** (`/skills/designer-skills/interaction-design/skills/`)
   - `doherty-threshold`: Sub-400ms system response time to keep user engagement
   - `hicks-law`: Minimize choices per decision step (4 primary actions, expandable secondary)
   - `fitts-law`: Touch targets >= 44x44px, primary actions easily accessible
   - `feedback-patterns`: Immediate visual/audio state confirmation on tap and state changes
   - `error-handling-ux`: Human, actionable, and non-accusatory error messages
   - `loading-states`: Skeletons matching exact layout geometry

3. **Visual Critique & Design Quality** (`/skills/designer-skills/visual-critique/skills/`)
   - `critique-visual-hierarchy`: Entry point, eye flow, weight distribution, emphasis check
   - `critique-typography`: Line length, font pairing, contrast, readability
   - `critique-composition`: Alignment, balance, white space discipline
   - `critique-affordance`: Actionable elements read as clickable; non-actionable read as static

4. **Design Systems** (`/skills/designer-skills/design-systems/skills/`)
   - `design-token`: Consistent color, typography, radius, and elevation tokens
   - `component-spec`: Button hierarchy (Primary CTA solid black, Secondary outline, Tertiary ghost)
   - `localization-design`: Bi-directional or multi-lingual typography harmony (IBM Plex Sans Thai for Thai, Plus Jakarta Sans for English)

5. **Gemini CLI Extensions** (`.gemini/extensions/`)
   - Fully loaded across all 9 design extensions ready for invocation and automated workflows.

## Operating Principles for this Project

- **Zero-Borders on Content Containers**: Adhere to the user's strict rule — cards, chips, badges, and stat boxes must use clean soft shadow elevation without harsh black borders; ONLY buttons and CTAs retain crisp border lines.
- **Thai Typography Discipline**: 100% of all Thai text must strictly use `IBM Plex Sans Thai` with appropriate font weight and optical balance.
- **One Primary CTA per Screen**: Keep the visual hierarchy focused (F-pattern scanning, clear entry point, no competing primaries).
- **Tactile Feedback**: Pair actions with subtle haptic audio feedback and active press scaling (`active:scale-95`).
