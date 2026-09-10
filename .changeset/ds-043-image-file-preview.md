---
'd-ui': minor
---

Add Image and FilePreview, and give FileUpload a `preview` shape.

The ticket lists six Preline variants and four component names. Three of the variants — default upload, size validation, input-style picker — are settings `FileUpload` has had since DS-025, and "destroy and reinitialize" is Preline's imperative lifecycle, which in React is unmounting the component or clearing `files`. What was genuinely missing is the image side.

`Image` frames a picture and owns the two states every page rewrote by hand. `alt` is required, and `""` is a legitimate value: that is how a decorative image is declared, where leaving `alt` out has a screen reader read the file name instead (1.1.1). With `ratio` — or `width` and `height` together — the frame reserves the space before the file arrives, so the page does not jump; `ratio="auto"` with no height cannot, and says so. When the file fails, no broken `<img>` is rendered: the fallback becomes a `role="img"` carrying the same name, and a decorative image stays silent. Lazy by default.

`FilePreview` describes one chosen file — thumbnail for an image, extension otherwise, then name, weight, a progress slot and a remove button that names the file. Its object URL is created **and revoked** by the component; that is its reason to exist, since every hand-rolled preview forgot the `revokeObjectURL` and held the file in memory until a reload.

`FileUpload` renders its file list through `FilePreview` instead of its own inline markup, and takes `preview`: `list` (default), `grid` for a gallery of thumbnails, or `none` when the page draws its own. The list stays a named `<ul>` in every shape, so a screen reader still counts the files. Rows now carry a thumbnail or a file-type chip, which the previous list did not show; rejection behaviour is unchanged — an oversized or wrong-typed file still never enters `files`.

It now also follows its form's `reset`, and only when the reset actually happens: a form that asks for confirmation calls `preventDefault()` in a handler that runs after this one, so the decision is read once the event is over. Picking the same file twice adds one row, not two — the second used to land as a duplicate React key and as a second button reading out the same name.

`Thumbnail` and `ImageUploader` are not components: the first is `Image` at a small size, the second is `FileUpload` with `accept="image/*"` and `preview="grid"`. Both ship as stories.
