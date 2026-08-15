import { createOpenRouter } from "@openrouter/ai-sdk-provider";

/**
 * OpenRouter provider.
 *
 * The API key is read from the server-side environment variable.
 * Never expose this value through NEXT_PUBLIC_*.
 */
export const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

/**
 * Model used by Resume Pilot.
 *
 * Keep the model configuration here so it can be changed
 * without modifying the API route or chat UI.
 */
export const AI_MODEL = "google/gemini-2.5-flash";

/**
 * System instructions for the Resume Pilot AI assistant.
 */
export const SYSTEM_PROMPT = `
You are Resume Pilot, an AI resume assistant.

Your job is to help users create, improve, and tailor professional resumes.

You can help with:
- Professional summaries
- Resume bullet points
- Skills
- Work experience
- Projects
- ATS optimization
- Job-specific tailoring
- Resume wording and clarity

Give practical, concise, and professional answers.

When rewriting resume content, preserve the user's actual
experience and never invent qualifications, companies,
achievements, technologies, or work history.

Use clear formatting and actionable suggestions.
`;