---
'd-ui': minor
---

Add Drawer, a Dialog anchored to a screen edge.

`Drawer` is the panel for what you consult without leaving the page: filters, a mobile navigation, a detail sheet. It is `Dialog` with a different position and motion, and it is built that way: the same `@floating-ui/react` layer (trapped focus, inert page, locked scroll, focus returned to the trigger, `Escape` and backdrop close), and the same interior, now extracted into a shared `DialogFrame` so the two overlays cannot drift apart. The parts are the Dialog parts under their panel name — `DrawerHeader`, `DrawerTitle`, `DrawerDescription`, `DrawerBody`, `DrawerActions` — the same components, so a title still names the panel and the confirming action still comes last.

`side` anchors the panel to `right` (default), `left`, `top` or `bottom`; it spans the whole edge and slides in from it, with the animation dropped under `prefers-reduced-motion`. `size` reuses the Dialog scale — `tiny`, `regular`, `big`, `huge` — as a width for side panels and a height for top and bottom ones; on a small screen the panel fills its edge.

The dismiss button is on by default, unlike `Dialog`: a side panel usually has no actions, and the cross is its visible exit for mouse and touch, where a modal with a footer never needed one. `dismissible={false}` hands the exit to `DrawerActions`. `id` is forwarded so a `Navbar` menu button can point at the panel with `aria-controls`.

Out of scope, on purpose: stacked drawers, swipe-to-close and sheet physics. `Sidebar` keeps its own `overlay` mode for the application shell.
