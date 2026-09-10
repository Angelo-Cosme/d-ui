---
'd-ui': minor
---

Add data-table behaviour as props on `Table`, and open Pagination to composition.

`Table` already shipped the semantic markup (caption, numeric cells, keyboard overflow). Sort, search, selection and pagination now sit on that same component when you pass `columns`, `rows` and `rowId` — there is no second `DataTable` public API. Cell density, `align` / `numeric`, and the scroll region that becomes a named, keyboard-reachable region when the table overflows stay in one place.

Each of sort, search, page and selection accepts a controlled prop and otherwise falls back to internal state, like `Tabs`. The page is clamped in one place so a shrinking dataset cannot leave someone on a page that no longer exists. `toolbar` receives the visible rows, the search and its setter, and the checked ids: the component builds no file. `loading` replaces the body with a skeleton and sets `aria-busy`; `empty` is a slot for `EmptyState` / `ErrorState` so the table does not own those product states.

Pagination gains `PaginationPrevious`, `PaginationPages`, `PaginationNext` and `PaginationStatus`, plus optional `children` for free layouts. The default rendering keeps the original single `<ul>`, previous and next included.

The chevron glyphs Calendar and Pagination each drew privately now live in one shared module. `TableHead` / `TableCell` omit the native `align` attribute so `start` / `end` type-check, and the last body row no longer doubles a bordered container’s rule.
