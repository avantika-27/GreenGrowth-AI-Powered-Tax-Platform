# GreenGrowth — AI-Powered Tax Platform

Greenfield prototype for the AI Engineer case study: a client + CPA tax workspace designed from scratch.

**Prototype:** https://avantika-27.github.io/GreenGrowth-AI-Powered-Tax-Platform/

**Walkthrough video:** [`walkthrough/GreenGrowth-Walkthrough.mp4`](./walkthrough/GreenGrowth-Walkthrough.mp4) (~1.5 min, screen recording + narration). Re-record with your own voice using [`walkthrough/NARRATION_SCRIPT.md`](./walkthrough/NARRATION_SCRIPT.md) if preferred.

**Run locally:** `npm install && npm run dev`

---

## What’s real vs simulated

Per the brief: the frontend is the deliverable; the backend is intentionally fake.

### Wired up (real interactions)

- Role-aware shell: switch demo users and active roles; nav and screens change by audience
- First-run client onboarding (Maya) with a single clear next action
- Return review: click a field → side-by-side source trace (document → page/section → extract → transformation)
- Field affordances: AI / verified / editable / needs approval / locked / client answer — same visual system across screens
- Verify and correct field values in-session (in-memory)
- Messages: threads anchored to documents/issues; client-visible vs internal notes; next-owner + outstanding request; send works in-memory
- Cross-object navigation: breadcrumbs + links between return ↔ document ↔ message ↔ task
- Status timeline with shared phases; client labels hide firm jargon
- Firm dashboard with real prioritization (urgency, then due date) over mock tasks/returns
- Documents library over a large generated dataset (search, filter, summary vs detail)
- AI insights UI: confidence, why, evidence, uncertainty, suggested action, accept/dismiss/correct path; optional raw JSON

### Simulated (not a real system)

- No OCR, document parsing, or AI model — values and recommendations are fabricated
- No auth server or real permissions engine — role switcher is the demo stand-in
- No document storage, messaging backend, or database — everything lives in `src/data/mock.ts` (plus a tiny in-memory layer for sends/edits)
- Document “previews” are mocked panels with highlighted excerpts, not real PDFs
- AI “API” is a stub (`getAiBundle`) that returns plausible JSON

---

## Design decisions worth explaining

1. **One product, six roles** — Same shell and objects; navigation and copy adapt by role. Multi-role users (e.g. preparer who also has a personal return) switch context explicitly instead of getting a separate app.
2. **Traceability before polish** — Every number in return review is inspectable to source + transform. Trust comes from the path, not from a confidence percentage alone.
3. **Collaboration is contextual, not inbox-first** — Threads must attach to a document or tax issue, show who owns the next step, and keep internal notes visually distinct and hidden from clients.
4. **First run = one job** — New clients see one primary action in ~10 seconds; secondary firm complexity is deferred.
5. **Shared status, different language** — Same underlying phases for everyone; clients get plain labels (“We need your answers”), staff get ownership and blockers.
6. **Dashboard answers “what now?”** — Ranked actions and blocked returns, not charts. Managers get firm-wide attention queues; preparers get their own work.
7. **Affordance system is global** — Dashed AI chips, solid editable borders, muted locked fields — introduced once and reused so mixed AI/human data doesn’t feel ambiguous.
8. **AI transparency without dump** — Default view: what / why / evidence / uncertainty / next action. Raw model JSON is opt-in so power users can dig without overwhelming everyone else.
9. **Scale via progressive disclosure** — Hundreds of documents are searchable/filterable; detail opens only when selected, with links back into the workflow.

---

## Challenge map (where to click)

| # | Challenge | In the prototype |
|---|-----------|------------------|
| 01 | Source document traceability | **Return review** — select any field; inspect the source pane |
| 02 | Client & CPA collaboration | **Messages** — try firm user vs Maya; send client vs internal |
| 03 | Where to start | Demo user → **Maya Chen** (first-run overlay + **Home**) |
| 04 | Getting lost between parts | Follow “Related” links across return / docs / messages |
| 05 | Role-aware experiences | Sidebar **Demo user** + **Active role** (all six roles) |
| 06 | Return status & progress | Status rail on returns / **Return status** |
| 07 | Actionable dashboard | Firm **Dashboard** (default: Sam / preparer) |
| 08 | Clickable vs editable | Affordance legend + value chips on return review |
| 09 | Complexity made navigable | **Documents** — search/filter ~225 items |
| 10 | Trustworthy AI | **AI insights** — then correct in return review |

---

## Suggested walkthrough

1. Start as **Sam Okonkwo** (preparer) → Dashboard → open Maya’s return → click interest / Schedule C fields.
2. Open **AI insights**, accept or inspect a recommendation, jump back to correct the field.
3. Open **Messages**, send an internal note, then switch to **Maya Chen** and confirm she cannot see it.
4. As Maya, complete/dismiss onboarding and use **Home** for the next client action.
5. Switch to **Priya** (reviewer) or **Alex** (admin) to see how the same shell re-prioritizes.
