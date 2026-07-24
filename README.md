# GreenGrowth — AI Engineer Case Study

Working prototype of an AI-powered tax platform (greenfield). Covers all 10 case-study challenges in one clickable product.

**Live locally:** `npm install && npm run dev`

## Challenges mapped

| # | Challenge | Where to click |
|---|-----------|----------------|
| 01 | Source document traceability | **Return review** — select a field; right pane shows doc → page → extract → transform |
| 02 | Client & CPA collaboration | **Messages** — threads tied to docs/issues; internal vs client-visible; ownership |
| 03 | Where to start | Switch demo user to **Maya Chen** — first-run overlay + client Home |
| 04 | Getting lost | Breadcrumbs + related links between return ↔ document ↔ message ↔ task |
| 05 | Role-aware experiences | Sidebar **Demo user** / **Active role** (6 roles; multi-role accounts like Sam & Alex) |
| 06 | Return status & progress | Status rail on returns / **Return status**; client labels differ from firm |
| 07 | Actionable dashboard | Firm **Dashboard** — urgency-ranked actions, not vanity metrics |
| 08 | Clickable vs editable | Affordance legend + colored value chips across return review |
| 09 | Complexity made navigable | **Documents** — 225+ fake docs, search/filter, summary vs detail |
| 10 | Trustworthy AI | **AI insights** — why / evidence / uncertainty / action; optional raw JSON |

## What’s real vs simulated

**Real (working UI):** routing, role switching, prioritization sort, search/filter, message send (in-memory), verify/correct fields, onboarding gate, cross-object navigation.

**Simulated:** OCR/extraction, AI model, auth/permissions backend, document storage, messaging server. All data is hardcoded or generated in `src/data/mock.ts`. AI responses come from a stub (`getAiBundle`) returning plausible JSON.

## Design notes (short)

- One product shell that adapts by role instead of six apps.
- Clients see fewer phases and plain-language status; staff see ownership and blockers.
- AI is presented as inspectable leads with correction in-context, not a black box.
- Affordance language (dashed AI, solid editable border, muted locked) is reused everywhere.

## Host on GitHub Pages

After you create a repo and push (see chat instructions), enable Pages from the `gh-pages` branch or GitHub Actions. This project uses `base: './'` and `HashRouter` so it works under any repo name without server rewrites.

```bash
npm run build
# deploy the `dist/` folder to GitHub Pages
```
