/**
 * GreenGrowth case-study walkthrough recorder.
 * Produces a screen recording with on-screen narration captions.
 *
 * Usage: node scripts/record-walkthrough.mjs
 */
import { chromium } from 'playwright'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ROOT = path.resolve(__dirname, '..')
const OUT_DIR = path.join(ROOT, 'walkthrough')
const BASE = process.env.WALKTHROUGH_URL || 'http://127.0.0.1:5173/'

const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function setCaption(page, title, body) {
  await page.evaluate(
    ({ title, body }) => {
      let bar = document.getElementById('gg-caption')
      if (!bar) {
        bar = document.createElement('div')
        bar.id = 'gg-caption'
        bar.style.cssText = `
          position: fixed; left: 16px; right: 16px; bottom: 16px; z-index: 99999;
          background: rgba(15, 61, 46, 0.94); color: #eef7f1;
          border-radius: 14px; padding: 14px 18px;
          font-family: "Instrument Sans", system-ui, sans-serif;
          box-shadow: 0 16px 40px rgba(0,0,0,.28);
          pointer-events: none;
        `
        bar.innerHTML = `<div id="gg-cap-title" style="font-weight:800;font-size:15px;margin-bottom:4px"></div>
          <div id="gg-cap-body" style="font-size:14px;line-height:1.45;opacity:.95"></div>`
        document.body.appendChild(bar)
      }
      document.getElementById('gg-cap-title').textContent = title
      document.getElementById('gg-cap-body').textContent = body
    },
    { title, body },
  )
}

async function narrate(page, title, body, ms = 4200) {
  await setCaption(page, title, body)
  await sleep(ms)
}

async function selectUser(page, name) {
  await page.locator('#user-switch').selectOption({ label: name })
  await sleep(700)
}

async function main() {
  fs.rmSync(OUT_DIR, { recursive: true, force: true })
  fs.mkdirSync(OUT_DIR, { recursive: true })

  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    recordVideo: { dir: OUT_DIR, size: { width: 1440, height: 900 } },
  })
  const page = await context.newPage()
  page.setDefaultTimeout(20000)

  await page.goto(BASE, { waitUntil: 'networkidle' })
  await sleep(800)

  await narrate(
    page,
    'GreenGrowth — case study walkthrough',
    'AI-powered tax platform prototype. I’ll show what I built, the key design decisions, and how the interactions work end-to-end.',
    5200,
  )

  await narrate(
    page,
    'Challenge 07 — Actionable dashboard',
    'Firm landing answers “what should I work on right now?” — urgency-ranked actions, not vanity charts. Default user: Sam the preparer.',
    4800,
  )
  await page.getByRole('link', { name: 'Go' }).first().click()
  await sleep(1000)

  await narrate(
    page,
    'Challenge 01 + 08 — Traceability & affordances',
    'Every figure is inspectable. Color and border language show AI vs verified vs editable vs locked — consistent across the product.',
    5000,
  )

  // Click interest field (needs approval)
  const interest = page.getByRole('button', { name: /Taxable interest/i })
  if (await interest.count()) {
    await interest.click()
    await sleep(1200)
  }

  await narrate(
    page,
    'Source trace',
    'Field → source document → page/section → extracted value → transformation. Trust comes from the path, not a black-box number.',
    5200,
  )

  await page.getByRole('link', { name: 'AI insights' }).click()
  await sleep(900)
  await narrate(
    page,
    'Challenge 10 — Trustworthy AI',
    'Recommendations show why, evidence, uncertainty, and one suggested action. Raw JSON is optional so transparency doesn’t become overload.',
    5200,
  )
  await page.getByRole('button', { name: /Possible missing interest/i }).click()
  await sleep(800)
  await page.getByRole('button', { name: 'Accept suggestion' }).click()
  await sleep(700)

  await page.getByRole('link', { name: 'Messages' }).click()
  await sleep(900)
  await narrate(
    page,
    'Challenge 02 — Collaboration',
    'Threads are anchored to documents and tax issues — not a generic inbox. Internal notes are visually distinct from client-visible messages.',
    5000,
  )
  await page.getByRole('button', { name: 'Internal note' }).click()
  await page.locator('textarea').fill(
    'Internal: if she confirms none, zero Harbor interest and document in workpapers.',
  )
  await page.getByRole('button', { name: 'Send' }).click()
  await sleep(1000)

  await narrate(
    page,
    'Challenge 04 — Context preserved',
    'Related links keep return ↔ document ↔ message ↔ task connected, so moving around never costs your place.',
    4200,
  )
  await page.getByRole('link', { name: 'Document' }).first().click()
  await sleep(1000)

  await page.getByRole('link', { name: 'Documents' }).click()
  await sleep(900)
  await narrate(
    page,
    'Challenge 09 — Complexity made navigable',
    'Hundreds of documents. Search and filter first; open detail only when needed. Progressive disclosure, not a wall of cards.',
    4800,
  )
  await page.getByLabel('Search documents').fill('W-2')
  await sleep(1200)

  await page.getByRole('link', { name: 'Dashboard' }).click()
  await sleep(700)
  await narrate(
    page,
    'Challenge 05 — Role-aware shell',
    'One product, six roles. Same objects; navigation and priorities adapt. Switching to Maya shows the client experience.',
    4500,
  )
  await selectUser(page, 'Maya Chen')
  await sleep(1200)

  // Onboarding may appear
  const startBtn = page.getByRole('link', { name: /Start: verify identity/i })
  if (await startBtn.count()) {
    await narrate(
      page,
      'Challenge 03 — Where to start',
      'A first-time client sees one next action within seconds. Everything else is deferred until it’s relevant.',
      5000,
    )
    await startBtn.click()
    await sleep(1000)
  }

  await narrate(
    page,
    'Client home',
    'Client copy stays plain. Firm-side complexity stays out of the way. Status and open asks are obvious.',
    4200,
  )

  await page.getByRole('link', { name: 'Return status' }).click()
  await sleep(900)
  await narrate(
    page,
    'Challenge 06 — Shared status language',
    'Same underlying phases for everyone. Clients get human labels; staff see ownership and blockers.',
    4800,
  )

  await page.getByRole('link', { name: 'Messages' }).click()
  await sleep(900)
  await narrate(
    page,
    'Permissions in practice',
    'As Maya, only client-visible messages appear — the internal note we sent earlier is hidden. Permissions are demonstrated, not just described.',
    5200,
  )

  await selectUser(page, 'Priya Nair')
  await sleep(1000)
  await narrate(
    page,
    'Reviewer context',
    'Priya’s dashboard prioritizes review work. Role architecture without splintering into six separate products.',
    4500,
  )

  await narrate(
    page,
    'What’s simulated vs real',
    'UI, navigation, prioritization, and correction flows are real. OCR, the AI model, auth server, and messaging backend are mocked with hardcoded data — as the brief recommends.',
    5600,
  )

  await narrate(
    page,
    'Thanks',
    'Prototype + README cover all ten challenges. Decisions favor clarity, trust, and time-to-action over production infrastructure.',
    4500,
  )

  const videoPath = await page.video().path()
  await context.close()
  await browser.close()

  const finalPath = path.join(OUT_DIR, 'GreenGrowth-Walkthrough.webm')
  // Playwright finalizes the file on context close; rename the recorded file.
  const files = fs.readdirSync(OUT_DIR).filter((f) => f.endsWith('.webm'))
  const recorded = files.map((f) => path.join(OUT_DIR, f)).find((f) => f === videoPath) || path.join(OUT_DIR, files[0])
  if (recorded && fs.existsSync(recorded)) {
    fs.renameSync(recorded, finalPath)
  }

  console.log(`Walkthrough saved to: ${finalPath}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
