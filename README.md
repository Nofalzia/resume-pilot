# Resume Pilot

## Overview

Resume Pilot is a browser-based AI resume reviewer for job seekers. Paste a resume and optionally a target job description to receive structured feedback on ATS compatibility, keyword gaps, bullet impact, strengths, weaknesses, and the highest-priority improvements.

## Problem

Resume feedback is often generic, disconnected from the target role, or difficult to act on. Resume Pilot turns plain-text resume content into specific, role-aware next steps without requiring an account or permanent storage.

## Design Inspiration

Resume Pilot's visual direction was inspired by the FlyRank website, particularly its dark premium visual language, emerald-led color palette, contrast, typography direction, visual hierarchy, spacing, and modern AI product feel. The interface was independently designed and implemented for this internship capstone; it is not an official FlyRank product and does not claim FlyRank branding or design-system ownership.

## Features

- Resume and CV analysis from pasted plain text.
- Optional job-description comparison with matched and missing keywords.
- Overall score, rationale, ATS issues, strengths, weaknesses, bullet feedback, and ranked recommendations.
- Context-aware AI Copilot for follow-up questions and truthful bullet rewrites.
- Session-only browser persistence for the current resume, job description, document type, and analysis.
- Loading, retry, timeout, rate-limit, and provider-failure states.
- Responsive landing page and workspace with keyboard focus and reduced-motion support.

## AI Integration

The server routes in `app/api/analyze` and `app/api/chat` use OpenRouter through the Vercel AI SDK. The analysis route receives only the submitted resume text, optional job description, and document type. The Copilot receives bounded message history, the resume text, and validated analysis context.

Analysis uses `generateObject` with `AnalysisSchema` from Zod, so the response must match the application’s typed structure before the client renders it. The prompt identifies the model as a recruiter and career coach, asks for specific evidence-based feedback, and explicitly forbids fabricated metrics, companies, achievements, and experience. When a job description is absent, job-comparison fields are left empty or omitted.

The Copilot is not a generic chatbot: its system prompt grounds responses in the candidate’s resume and, when available, the structured analysis. It is instructed to provide direct rewrites while preserving truth and to show where a missing metric should be added instead of inventing one.

## Architecture

```text
Next.js App Router
  -> pages and layouts
  -> reusable UI/workspace/analysis components
  -> /api/analyze -> OpenRouter -> Zod AnalysisSchema -> JSON result
  -> /api/chat    -> OpenRouter stream -> Copilot UI
  -> browser sessionStorage for temporary client state
```

- `app/` owns routes, layouts, error boundaries, and API handlers.
- `components/` contains landing, workspace, analysis, and shared UI components.
- `lib/ai/` contains model configuration, prompts, schema, and types.
- Server-only API keys stay in route handlers; client components call same-origin APIs.
- Input limits and schema checks protect both API routes and the client rendering boundary.

## Tech Stack

- Next.js 16 App Router and React 19
- TypeScript
- Vercel AI SDK
- OpenRouter
- Zod
- Tailwind CSS 4 and CSS variables
- Vitest, jsdom, React Testing Library, axe-core, and Lighthouse for verification

## Getting Started

Prerequisites: Node.js 20+ and npm.

```bash
git clone https://github.com/Nofalzia/resume-pilot.git
cd resume-pilot
npm install
```

Copy `.env.example` to `.env.local` and set the server-side OpenRouter key. Start development with:

```bash
npm run dev
```

Open http://localhost:3000. For a production-style run:

```bash
npm run build
npm run start
```

## Environment Variables

Documented variable names only:

- `OPENROUTER_API_KEY`: server-only credential for OpenRouter.
- `ANALYSIS_MODEL`: optional model override for resume analysis.
- `COPILOT_MODEL`: optional model override for the Copilot.
- `NEXT_PUBLIC_API_URL`: retained public API URL template; the current client uses same-origin routes.

Never commit `.env.local` or expose the OpenRouter key to browser code.

## Testing

Vitest covers prompt branches, schema bounds, API validation and safe failure paths, plus shared UI behavior. The latest run passed 19 tests in 7 files with 56.12% statement coverage. See [docs/testing.md](docs/testing.md) for commands and measured coverage.

## Accessibility & Performance

The 2026-08-27 axe-core rerun found zero violations on `/` and `/workspace`; eight landing contrast checks remained inconclusive. Lighthouse against production returned Performance 73, Accessibility 96, Best Practices 96, and SEO 100. A clean rebuilt local production bundle measured Performance 72 after image and hydration optimizations, so the deployed target still requires a future release and further performance work. Details and limitations are in [docs/accessibility-performance.md](docs/accessibility-performance.md).

## Deployment & Operations

The deployed application is hosted on Vercel. API failures return sanitized messages, with explicit handling for invalid input, rate limits, and provider failures. Vercel build/runtime logs are the current monitoring signals. See [docs/deployment-checklist.md](docs/deployment-checklist.md) for release verification and rollback steps.

## Known Limitations

- Resume input is pasted plain text; PDF/DOCX parsing and file upload are not implemented.
- Data is session-only; there is no account system, database, saved history, or cross-device sync.
- AI output depends on the configured provider and can require retrying.
- The dashboard, templates, cover-letter, profile, and settings routes are present but not full product workflows.
- No custom monitoring or automated alerting provider is configured.

## Future Improvements

- Add authentication and durable, user-controlled resume history.
- Add privacy-conscious PDF/DOCX parsing and export workflows.
- Improve performance by reducing client JavaScript and main-thread work.
- Add broader component and end-to-end coverage for results and Copilot interactions.
- Add production health monitoring and alerting.

## Live Demo

https://ai-resume-pilot-nz.vercel.app/

## Repository

https://github.com/Nofalzia/resume-pilot

## Capstone Documents

- [Project brief](docs/project-brief.md)
- [Testing evidence](docs/testing.md)
- [Accessibility and performance audit](docs/accessibility-performance.md)
- [Deployment checklist](docs/deployment-checklist.md)
- [Reflection](docs/reflection.md)
