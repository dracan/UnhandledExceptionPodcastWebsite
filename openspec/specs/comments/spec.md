# Comments

### Requirement: Giscus rendered on post pages only

Every post page SHALL render the Giscus widget. Pages under `/pages/` SHALL NOT render the Giscus widget.

#### Scenario: Post page includes Giscus

- **WHEN** a post page at `/posts/<slug>/` is rendered
- **THEN** the output HTML contains a `<script src="https://giscus.app/client.js" ...>` tag configured for the `dracan/unhandledexceptionpodcast-comments` repository

#### Scenario: Static page excludes Giscus

- **WHEN** a page under `/pages/` is rendered
- **THEN** the output HTML contains no reference to `giscus.app`

### Requirement: Giscus configuration unchanged

The Giscus widget SHALL be configured with the same parameters as the Hugo site, preserving existing comment threads:

- `data-repo` = `dracan/unhandledexceptionpodcast-comments`
- `data-repo-id` = `R_kgDOQSZ8HA`
- `data-category` = `Comments`
- `data-category-id` = `DIC_kwDOQSZ8HM4CxnOC`
- `data-mapping` = `pathname`
- `data-strict` = `0`
- `data-reactions-enabled` = `1`
- `data-emit-metadata` = `0`
- `data-input-position` = `bottom`
- `data-theme` = `dark_dimmed`
- `data-lang` = `en`

#### Scenario: Widget attributes match

- **WHEN** the rendered HTML of any post page is inspected
- **THEN** the Giscus `<script>` tag has the exact attribute values listed above

### Requirement: Existing threads remain attached

Because Giscus uses `data-mapping="pathname"`, no comment thread SHALL become orphaned as a result of the migration.

#### Scenario: Thread attachment verified post-deploy

- **WHEN** a post that previously had comments is loaded on the deployed Eleventy site
- **THEN** the Giscus widget displays the same comment thread that was visible on the Hugo site
