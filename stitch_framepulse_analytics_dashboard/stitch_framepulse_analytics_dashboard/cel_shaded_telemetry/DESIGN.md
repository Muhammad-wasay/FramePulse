---
name: Cel Shaded Telemetry
colors:
  surface: '#fbf8fc'
  surface-dim: '#dcd9dd'
  surface-bright: '#fbf8fc'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f2f7'
  surface-container: '#f0edf1'
  surface-container-high: '#eae7eb'
  surface-container-highest: '#e4e1e6'
  on-surface: '#1b1b1e'
  on-surface-variant: '#3e484f'
  inverse-surface: '#303033'
  inverse-on-surface: '#f3f0f4'
  outline: '#6e7980'
  outline-variant: '#bdc8d1'
  surface-tint: '#00668a'
  primary: '#00668a'
  on-primary: '#ffffff'
  primary-container: '#38bdf8'
  on-primary-container: '#004965'
  inverse-primary: '#7bd0ff'
  secondary: '#735c00'
  on-secondary: '#ffffff'
  secondary-container: '#fed01b'
  on-secondary-container: '#6f5900'
  tertiary: '#a93349'
  on-tertiary: '#ffffff'
  tertiary-container: '#ff919e'
  on-tertiary-container: '#841630'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#c4e7ff'
  primary-fixed-dim: '#7bd0ff'
  on-primary-fixed: '#001e2c'
  on-primary-fixed-variant: '#004c69'
  secondary-fixed: '#ffe083'
  secondary-fixed-dim: '#eec200'
  on-secondary-fixed: '#231b00'
  on-secondary-fixed-variant: '#574500'
  tertiary-fixed: '#ffdadc'
  tertiary-fixed-dim: '#ffb2b9'
  on-tertiary-fixed: '#400010'
  on-tertiary-fixed-variant: '#891933'
  background: '#fbf8fc'
  on-background: '#1b1b1e'
  surface-variant: '#e4e1e6'
typography:
  display-hero:
    fontFamily: Space Grotesk
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 52px
    letterSpacing: -0.03em
  display-hero-mobile:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '700'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 30px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: 0em
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '500'
    lineHeight: 22px
  body-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
  label-lg:
    fontFamily: Space Grotesk
    fontSize: 14px
    fontWeight: '700'
    lineHeight: 18px
    letterSpacing: 0.04em
  label-md:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.06em
  label-sm:
    fontFamily: Space Grotesk
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 12px
    letterSpacing: 0.08em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-mobile: 0.75rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.25rem
  space-2xl: 3rem
---

## Brand & Style

This design system blends crisp cel-shaded comic aesthetics with clean neo-brutalist telemetry visualization. Inspired by high-octane anime HUDs, game-engine performance telemetry, and modern vibrant print manga, the style balances sharp physical line art with hyper-legible analytical clarity. 

The brand personality is electric, tactile, and precise:
- **Tone:** Energetic, confident, analytical, and distinctly expressive.
- **Audience:** Educators, competitive gaming analysts, esports coaches, and power users who need high-throughput data wrapped in an engaging, visual treat.
- **Emotional Response:** Immediate enthusiasm, focus, and tactile satisfaction. Every card, stat counter, and button feels mechanically responsive and inked by hand, yet backed by strict structural discipline.
- **Visual Mechanics:** Heavy dark ink strokes (`#18181b`), creamy paper-textured canvases, electric pop accents, and tactile offset drop shadows without ambient blur.

## Colors

The palette operates on high-contrast inked comic fundamentals over a clean, creamy paper base. All components are bound to a strict light-mode paradigm to maintain radiant visual punch and paper-like clarity.

### Primary Roles
- **Canvas Base (`#FAF9F6`):** The primary paper backdrop. Soft, warm, and low-fatigue.
- **Card Surface (`#FFFFFF`):** High-clarity white surface for containers, modules, and widgets.
- **Ink Border / Heavy Text (`#18181B`):** The foundational cel-shade ink color. Applied to outlines, structural dividers, hard drop shadows, and high-emphasis display type.
- **Primary Pop (`#38BDF8` - Electric Sky Blue):** Main interactive focus, active tab states, and key analytical line graphs.
- **Secondary Pop (`#FACC15` - Sun Yellow):** High-priority alerts, streak milestones, and attention callouts.
- **Tertiary Pop (`#FB7185` - Coral Pop):** Critical warnings, deficit indicators, and negative variance.
- **Quaternary Energy (`#4ADE80` - Mint Energy Green):** Success indicators, operational telemetry, uptime, and positive deltas.

### Hierarchy & Tint Application
- Never use diffuse translucent gradients; use flat color blocking separated by ink strokes.
- Secondary structural fills use 10% to 15% tints of primary tokens (`#E0F2FE` for sky, `#FEF9C3` for yellow, `#DCFCE7` for mint) to ground stat areas without overwhelming foreground line weights.

## Typography

The type system creates tension between the high-tech, angular punch of **Space Grotesk** and the clean, humanist geometric flow of **Plus Jakarta Sans**. 

- **Space Grotesk** drives all visual anchoring: major stats, counters, headers, labels, and badges. Its quirky retro-futuristic glyphs reinforce game HUD telemetry. Labels and stat units utilize all-caps tracking (`letter-spacing: 0.04em` to `0.08em`) to mimic instrumentation panels.
- **Plus Jakarta Sans** acts as the analytical anchor. Body paragraphs, dense data tables, student logs, and analytical narratives use medium-to-bold weights for rapid parsing through heavy line-art environments.

## Layout & Spacing

The layout philosophy uses a structured 12-column fluid grid underpinned by comic-book panel discipline:
- **Rhythm & Grid:** Heavy modular grouping. Elements snap rigidly into rows and columns, creating distinct telemetry "panes" reminiscent of manga frames and mission-control monitors.
- **Desktop (>= 1200px):** 12-column layout with `2rem` outer margins and `1.25rem` gutters. High panel density allowed (3–4 stat modules per row).
- **Tablet (768px - 1199px):** 8-column layout with `1.5rem` outer margins and `1rem` gutters. Modules collapse into 2-column stacked pairings.
- **Mobile (< 768px):** 4-column layout with `1rem` margins and `0.75rem` gutters. Elements stack vertically, preserving full horizontal ink borders and card presence without sideways scroll.

## Elevation & Depth

This system intentionally rejects diffuse ambient drop shadows and glassmorphic blurs in favor of **hard-offset retro ink shadows**:

- **The Cel-Shade Rule:** Depth is physically simulated using a solid, non-blurred offset fill matched directly to the ink tone (`#18181B`).
- **Standard Card Elevation:** `box-shadow: 4px 4px 0px 0px #18181B`. Cards feel grounded, tactile, and physically stamped onto the cream canvas.
- **Interactive Hover Elevation:** Increases the offset to `6px 6px 0px 0px #18181B` while translating the element up and left by `2px` (`transform: translate(-2px, -2px)`).
- **Active / Pressed State:** The element flattens down to `0px 0px 0px 0px #18181B` with `transform: translate(4px, 4px)`, providing instant mechanical button travel.
- **Subtle Layering:** For nested sub-cards or badges, use `2px 2px 0px 0px #18181B`.
- **Outline Standard:** All elevated surfaces carry an explicit `2.5px solid #18181B` boundary stroke.

## Shapes

The shape system pairs solid ink strokes with rounded forms to soften the aggressive brutalist borders into a friendly, toon-shaded finish:

- **Border Weight:** Standard components use a continuous `2.5px solid #18181B` stroke. Primary heroes and focus cards scale up to `3px solid #18181B`.
- **Card Containers:** Curvature is set to `0.75rem` (`12px`), preventing cards from feeling overly boxy while preserving panel geometry.
- **Badge & Pill Elements:** Heavy, full-radius pills (`rounded-full` / `9999px`) create visual contrast against rectangular telemetry panels.
- **Micro UI (Checkboxes, Inputs, Progress Tracks):** Defined at `0.5rem` (`8px`) roundedness to maintain mechanical precision.

## Components

### Buttons
- **Primary:** Background `#38BDF8`, text `#18181B`, border `2.5px solid #18181B`, shadow `3px 3px 0px #18181B`. Bold `Space Grotesk` uppercase type.
- **Accent / Alert:** Background `#FACC15` or `#FB7185`, styled with the same ink border and hard offset.
- **Interaction:** Hover lifts by `-2px, -2px` with a `5px 5px` shadow; active press translates `+3px, +3px` with zero shadow.

### Cards & Panels
- **Container Structure:** Background `#FFFFFF`, outline `2.5px solid #18181B`, `4px 4px 0px #18181B` offset shadow, `1rem` internal padding.
- **Header Accents:** Headers feature a subtle pastel strip or an inked pill tag to denote the telemetry stream (e.g., "LIVE LOG", "ACCURACY", "SESSION 04").

### Badges & Pill Chips
- **Geometry:** Height `28px`, full pill radius (`9999px`), `1.5px solid #18181B`, horizontal padding `12px`.
- **Palettes:** Mint (`#4ADE80` background) for optimal states; Coral (`#FB7185`) for alerts; Sky (`#38BDF8`) for neutral info tags.

### Inputs & Select Fields
- **Base:** Background `#FAF9F6`, `2px solid #18181B`, `8px` border radius, padding `10px 14px`.
- **Focus:** Canvas shifts to `#FFFFFF` with an electric blue outline (`2.5px solid #38BDF8`), accompanied by a sharp `3px 3px 0px #18181B` offset shadow.

### Checkboxes & Radios
- **Checkbox:** `20px x 20px`, border `2px solid #18181B`, `4px` border radius. Unchecked background is pure white; checked state fills with `#4ADE80` and displays a bold black checkmark.
- **Radio:** Circular `20px x 20px`, `2px solid #18181B`. Active state displays a centered solid black dot inside an anime-yellow fill.

### Telemetry Bars & Progress Meters
- **Track:** Background `#E4E4E7`, border `2px solid #18181B`, height `16px`, rounded `9999px`, inner shadow off.
- **Fill Bar:** Dynamic solid fills (`#38BDF8`, `#4ADE80`, or `#FB7185`) partitioned with vertical black tick marks every 20% for tactical game-HUD readouts.