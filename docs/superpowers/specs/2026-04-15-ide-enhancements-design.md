# IDE Enhancements Design

**Date:** 2026-04-15
**Status:** Approved
**Branch strategy:** `ide-enhancements` branch off `main`, Vercel preview deploys, merge when approved.
**Depends on:** Site reframe (merged to main as of 2026-04-15).

## 1. Goals

Deepen the "you're inside a program" experience across the Fritz Automation marketing site. These enhancements build on the IDE-flavored foundation from the site reframe (status bar, monospace accents, file-tree Work page, terminal-style sections) and push the metaphor into navigation, boot behavior, keyboard interaction, and scroll experience.

## 2. Features

### 2.1 IDE Tab Bar (replaces current Header)

**Desktop (md: and above):** Single dark bar (`bg-slate-950`) pinned to the top of the viewport. Layout:

- **Left:** Fritz logo (compact), linking to `/`.
- **Center:** Tab buttons for each page. Each tab renders as a filename: `~/home`, `~/work`, `~/services`, `~/about`, `~/contact`. Active tab has a lighter background (`bg-slate-800/60`) and an emerald bottom border (`border-b-2 border-emerald-400`). Inactive tabs are `text-slate-500` with hover to `text-slate-300`.
- **Right:** `>_` command palette button + "Start a project" CTA button.

No close buttons on tabs (avoids confusion — clicking a tab navigates, there's nothing to "close").

Tabs transition on hover with the same stagger-mount animation the current header uses.

**Mobile (below md:):** The tab bar does not render. A dark hamburger menu replaces it — functionally identical to the current mobile menu slide-out, but with `bg-slate-950` instead of `bg-slate-900` to match the tab bar's color. Logo + hamburger icon in a compact top bar.

**Replaces:** `src/components/layout/Header.tsx` entirely. The white `bg-white/80` header is deleted.

### 2.2 Dark-mode everything

The site should have zero light (`bg-white`) sections remaining. After the reframe, most pages are already dark. This task audits and flips any remaining light sections:

- Header: becomes dark via the tab bar replacement (2.1).
- Footer: if any `bg-white` or `bg-slate-50` remains, convert to `bg-slate-950` with `border-t border-slate-800`.
- Any remaining `bg-white` sections in page bodies: convert to dark equivalents.
- Loading states (`loading.tsx` files): if they use light backgrounds, convert.

### 2.3 Boot sequence

**Behavior:** Plays on every full page load (SSR / hard refresh / new tab). Does NOT replay on client-side navigation (Next.js App Router handles this naturally — the layout persists across route changes, so the boot component only mounts once per full load). Total duration: under 2 seconds.

**Visual sequence:**
1. Full-screen overlay: `fixed inset-0 z-[60] bg-slate-950` (above everything including the status bar at z-40 and header at z-50).
2. Centered monospace text block. Lines appear sequentially, ~150ms apart:
   ```
   [fritz-automation v1.0.0]
   loading modules........... OK
   establishing connection... OK
   initializing ui........... OK
   ready.
   ```
   "OK" for each line appears after the dots, in emerald (`text-emerald-400`). "ready." appears in white.
3. After the last line, 300ms pause.
4. Overlay fades out: `opacity 1 → 0` over 200ms, then `display: none` / unmount.
5. Site content is visible underneath (it was rendering behind the overlay the whole time — no flash of unstyled content).

**Implementation:** Modify the existing `src/components/animations/BootSplash.tsx` (or replace entirely if the current implementation is too different). The component is already mounted in `src/app/layout.tsx`.

### 2.4 Keyboard shortcuts

**Global shortcut handler:** A client component (`KeyboardShortcuts.tsx`) mounted once in the root layout. Registers a single `keydown` listener on `document`.

**Guard:** If `document.activeElement` is an `<input>`, `<textarea>`, or `<select>`, or has `contentEditable`, ALL shortcuts except `Escape` are suppressed. This prevents interfering with form input.

| Key | Action |
|-----|--------|
| `Ctrl+K` / `Cmd+K` | Open command palette (already wired via existing CommandPalette) |
| `1` | Navigate to `/` (Home) |
| `2` | Navigate to `/work` |
| `3` | Navigate to `/services` |
| `4` | Navigate to `/about` |
| `5` | Navigate to `/contact` |
| `?` | Toggle shortcut overlay |
| `Escape` | Close any open overlay (command palette, shortcut overlay, context menu) |

Navigation shortcuts (`1`–`5`) use Next.js `router.push()` for client-side navigation (no full page reload, no boot replay).

**Shortcut overlay (`ShortcutOverlay.tsx`):** A centered modal listing all shortcuts. Dark card (`bg-slate-900 border border-slate-800 rounded-xl`), monospace text, two columns (key + description). Dismisses on `Escape`, click outside, or pressing `?` again (toggle behavior).

**Status bar hint:** Add a small `?` element to the right side of the existing StatusBar that hints at keyboard shortcuts. Clicking it opens the overlay. Text: `? shortcuts`.

### 2.5 Code-style micro-animations

**Section scroll-reveal:** A reusable `<ScrollReveal>` wrapper component using `IntersectionObserver`. When the wrapped element enters the viewport (threshold: 0.1), it transitions from `opacity: 0; transform: translateY(8px)` to `opacity: 1; transform: translateY(0)` over 400ms ease-out. Each section triggers once — no re-animation on scroll-up. The observer disconnects after triggering.

Apply `<ScrollReveal>` to each major `<section>` on the homepage (6 sections), and to the main content sections on About, Services, and Work pages.

**IDE line-highlight hover:** Interactive cards and list items get a full-width background glow on hover. Implementation: `hover:bg-slate-800/40 transition-colors duration-200`. Apply to:
- Homepage "what I build" file-cards (already partially there)
- Work page file-tree sidebar items (already partially there)
- Services tab buttons
- Any other clickable card/list elements

This is mostly a Tailwind class audit — ensure consistent hover treatment across all interactive elements.

**Cursor blink:** The existing `TypingHero` component's cursor already uses `animate-pulse` and blinks indefinitely after typing completes. No change needed. Confirm this behavior still works.

### 2.6 Right-click context menu

**Custom context menu** component (`ContextMenu.tsx`) that intercepts the `contextmenu` event on `<main>`.

**Guard:** Does NOT intercept right-click on `<input>`, `<textarea>`, `<select>`, or `<a>` elements — these keep native browser context menu for copy/paste/link operations.

**Menu items:**
1. **Navigate to** → submenu: Home, Work, Services, About, Contact
2. **Open command palette** — dispatches `open-command-palette` custom event
3. **Copy page URL** — copies `window.location.href` to clipboard, shows brief "Copied!" feedback
4. **Keyboard shortcuts** — opens the shortcut overlay
5. Divider
6. **View source on GitHub** — opens `https://github.com/FritzAutomation/fritz-automation` in a new tab

**Styling:** `bg-slate-900 border border-slate-800 rounded-lg shadow-xl`, monospace `text-sm`, items with `hover:bg-emerald-500/10 hover:text-emerald-300` highlight. Positioned at `(clientX, clientY)` of the right-click event, clamped so the menu doesn't overflow viewport edges.

**Dismisses on:** click outside, `Escape`, selecting a menu item, scrolling.

**Navigate submenu:** Renders inline (not a hover-nested submenu — those are hard on mobile and annoying on desktop). Instead, clicking "Navigate to" expands the submenu items in place within the same card.

### 2.7 Adaptive minimap

**Component:** `<Minimap />`, a fixed-position element on the right edge of the viewport.

**Visibility logic:**
- Measures `document.body.scrollHeight` vs `window.innerHeight` on mount and on resize.
- Only renders (or fades in) if page height exceeds 2x viewport height.
- Hidden below `md:` breakpoint (not enough horizontal space).
- Fades to 30% opacity when not hovered; 80% opacity on hover. Transition: 200ms.

**Visual:**
- Fixed to right edge: `fixed right-0 top-[48px] bottom-[24px]` (below tab bar, above status bar).
- Width: 40px.
- Background: `bg-slate-900/40`.
- Section blocks: the component queries all `<section>` elements in `<main>` on mount (and on resize/route change). Each section's vertical position and height is mapped proportionally onto the minimap strip as a `bg-slate-700/60` block with 1px gap between blocks.
- Viewport indicator: a semi-transparent rectangle (`bg-emerald-400/15 border border-emerald-400/30`) showing the current scroll position and viewport height, proportionally mapped. Updates on scroll via `requestAnimationFrame`-throttled scroll listener.
- Clicking a section block scrolls to that section (`element.scrollIntoView({ behavior: 'smooth' })`).

**Route change handling:** When Next.js navigates client-side, the minimap re-measures sections. Use a `usePathname()` dependency to trigger re-measurement.

## 3. Components created / modified

| Path | Action | Description |
|------|--------|-------------|
| `src/components/layout/Header.tsx` | **Replace** | IDE tab bar (desktop) + dark hamburger (mobile) |
| `src/components/layout/StatusBar.tsx` | **Modify** | Add `? shortcuts` hint |
| `src/components/animations/BootSplash.tsx` | **Replace** | New boot sequence with terminal text |
| `src/components/KeyboardShortcuts.tsx` | **Create** | Global keydown handler |
| `src/components/ShortcutOverlay.tsx` | **Create** | `?` key cheatsheet modal |
| `src/components/ContextMenu.tsx` | **Create** | Custom right-click menu |
| `src/components/Minimap.tsx` | **Create** | Adaptive page minimap |
| `src/components/ScrollReveal.tsx` | **Create** | IntersectionObserver fade-in wrapper |
| `src/app/layout.tsx` | **Modify** | Mount KeyboardShortcuts, ContextMenu, Minimap |
| Various page files | **Modify** | Wrap sections in ScrollReveal, audit hover classes |

## 4. Out of scope

- Tab close buttons (decorative confusion)
- Drag-to-reorder tabs
- Split-pane / resizable panels
- Mobile minimap
- Keyboard navigation within the minimap
- Minimap for auth-gated pages (portal/admin)
- Any changes to portal/admin functionality
- Blog or changelog page

## 5. Development process

1. All work on branch `ide-enhancements` off `main`.
2. Vercel preview deploys on every push.
3. Production untouched until PR merged.
