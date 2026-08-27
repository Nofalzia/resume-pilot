# Accessibility and Performance

## Audit date and tools
Audits were run on 2026-08-27 against the local rendered application and the deployed landing page.

- Accessibility: axe-core 4.x injected into the rendered browser page.
- Performance: Lighthouse run against `https://ai-resume-pilot-nz.vercel.app/`.

## Pages and flows checked
- Landing page `/`: navigation, hero actions, workflow sections, feature cards, CTA, footer.
- Workspace `/workspace`: resume form, document-type radios, optional job-description control, disabled analysis action, Copilot dialog shell.

## Accessibility results
Initial landing audit found 4 serious `color-contrast` violations in footer text and links at 2.56:1. The footer styles were changed to the existing secondary text token. The rerun reported **0 axe violations** on both `/` and `/workspace`.

Axe also reported 8 `color-contrast` checks as incomplete on the landing page. These are inconclusive checks, not passing violations; they are retained here rather than presented as a perfect WCAG claim. This audit does not establish WCAG conformance.

Concrete fix made: footer brand text, footer links, and the technology note were raised from 30% white to the existing `--text-secondary` token.

## Lighthouse results
Production landing page, fetched 2026-08-27:

| Category | Score |
| --- | ---: |
| Performance | 73 |
| Accessibility | 96 |
| Best Practices | 96 |
| SEO | 100 |

Notable measured performance values: LCP 3.3s, total blocking time 660ms, main-thread work 2.7s, and estimated unused JavaScript savings of 122 KiB. These remain future optimization opportunities. No score is fabricated or rounded upward.

After the local optimization pass, a clean rebuilt local production bundle measured Performance **72**, Accessibility **100**, Best Practices **96**, and SEO **100** in the latest Lighthouse run. Local values are included for engineering comparison only; they are not presented as the deployed production result. The local run measured LCP 3.9s, total blocking time 560ms, main-thread work 2.4s, and estimated unused JavaScript savings of 126 KiB. Lighthouse results vary between runs on this Windows environment. The deployed production score remains 73 until these changes are deployed.

Concrete performance changes made: migrated seven local logo uses from native `<img>` tags to `next/image` with explicit dimensions, eliminating all seven ESLint image warnings, and removed unnecessary client hydration from static landing navigation, hero wrapper, and footer event handlers while preserving CSS hover/focus behavior. The hero scene and splash remain client components because they require browser APIs and timed animation. The Performance >=85 target was not reached in the measured run; further bundle and main-thread optimization is still required.

## Final verification
- The local build and TypeScript checks pass.
- Axe reported no violations on the landing and workspace pages after the contrast fix.
- Lighthouse was run against production; the report is documented above.
