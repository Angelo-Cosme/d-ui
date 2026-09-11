---
'd-ui': minor
---

Settle the notification pattern, and make Toast obey it.

Three surfaces already said "something happened" — `Alert` inline, `Notification` as the toast surface, `ToastProvider` / `useToast` — and nothing said which to pick. ADR 0002 does, on one axis: not severity, but how long the message must live and who owns it. State of a region → `Alert`. Immediate consequence of an action, nothing to follow up → toast. Comes from elsewhere and must survive a reload → the notification centre. The `Patterns/Notifications` page carries the same decision into Storybook, in French and English.

Two rules the documentation could not honestly state about the existing code, so the code moved:

`Notification` now takes its politeness from `feedbackLiveRole`, the function `Alert` already used: `info` and `success` announce as `role="status"`, `warning` and `danger` as `role="alert"`. It hardcoded `role="alert"` for every variant, so "Saved." interrupted the screen reader, and the `aria-live="polite"` on the toast container did nothing — a nested live region governs its own content. **A test asserting `getByRole('alert')` on an `info` or `success` toast now needs `status`.**

A toast that carries an action no longer auto-dismisses, and becomes dismissible so it can still be closed. At six seconds the action button vanished before a keyboard or screen-reader user could reach it: a function offered only through a timed control (WCAG 2.2.1). Passing `duration` explicitly still wins — the rule is a default, not a ban. Such a toast then holds its `maxVisible` slot until someone closes it, and the ones behind it wait; the queue already behaved that way for `duration: 0`, but the default path can now reach it.

Two knock-on changes worth knowing about. A CSS or test selector matching `[role=alert]` no longer catches `info` and `success` toasts — the toast container's own fade selector was one of them, and it now matches `[role]`. And the `Toast` "Default" story dropped its close button: a close button on a six-second toast disappears from under a keyboard user's finger, which the ADR now rules out until `ToastProvider` pauses on hover and focus.

The toast area is now a named `role="region"`. Its `aria-label` sat on a role-less `div`, which ARIA forbids: the name reached nothing, and `ToastProvider`'s `label` prop did nothing. Named, the area is a landmark you can jump to in order to find a toast that is still up.

The notification centre itself is not built here. The ADR fixes its contract in advance: a composition of `Popover`, `List`, `Tag` and `IconButton`, controlled, owning no read state.
