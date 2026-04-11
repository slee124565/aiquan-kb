# CLAUDE.md

This repo is a compiled knowledge base for AI学习圈 / 快刀廣播站 course content.

Operating rules:

1. Treat `raw/` as immutable source material.
2. Create or update one broadcast card per meaningful course item in `wiki/broadcasts/`.
3. Merge reusable ideas into `wiki/themes/`, `wiki/playbooks/`, or `wiki/series/` instead of leaving everything inside broadcast pages.
4. Create `wiki/maps/` pages only when a topic has become a stable navigation entry point.
5. Keep `index.md` thin and `log.md` chronological.
6. Prefer synthesis, practical framing, and backlinks over copied summaries.
7. When a claim is uncertain, keep the uncertainty explicit and point back to the source file in `raw/`.
8. Use `broadcast_id` as the canonical key whenever possible.

Default workflow:

1. inspect `index.md`
2. inspect relevant `wiki/` pages
3. inspect the corresponding source in `raw/`
4. update the broadcast page
5. merge relevant changes into theme / playbook / series / map pages
6. append a short note to `log.md`
