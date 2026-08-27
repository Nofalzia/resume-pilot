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

## Final verification
- The local build and TypeScript checks pass.
- Axe reported no violations on the landing and workspace pages after the contrast fix.
- Lighthouse was run against production; the report is documented above.
