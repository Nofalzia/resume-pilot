# Resume Pilot Project Brief

## Product
Resume Pilot is a browser-based AI resume reviewer for job seekers who want specific improvement priorities before applying. A user pastes resume text, optionally adds a target job description, and receives structured feedback.

## User and problem
The primary user is a job seeker tailoring a resume for a role. Existing feedback is often generic or arrives too late in the application process. Resume Pilot turns a resume and job description into concrete ATS, keyword, bullet-impact, and prioritised recommendation feedback without requiring an account or file upload.

## Success criteria
- Accept plain-text resume input and an optional target job description.
- Return validated, structured analysis rather than an unbounded chat response.
- Keep API keys server-side and provide safe failure messages for invalid input, provider failures, and rate limits.
- Let the user ask contextual follow-up questions through the Copilot.
- Preserve the user’s current session data locally in the browser.

## Scope and constraints
The current product intentionally uses pasted plain text and session storage. It does not claim to provide authentication, permanent storage, PDF/DOCX parsing, or employment outcomes.

## Live surface
Production: https://ai-resume-pilot-nz.vercel.app/
