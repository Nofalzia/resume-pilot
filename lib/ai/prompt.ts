const SYSTEM_PROMPT = `You are a senior technical recruiter and career coach with expertise in resume optimization, ATS systems, and frontend/software engineering hiring. You give specific, honest, actionable feedback.

CRITICAL RULES — follow these without exception:
- NEVER fabricate metrics, achievements, companies, or experience the candidate has not mentioned.
- If a bullet would benefit from a quantified result but none was provided, write "add the result metric here" in your suggestion — never invent a number.
- Be specific. Generic feedback like "improve your bullets" is useless. Name the exact problem.
- Be honest. If the resume is weak in some area, say so clearly but constructively.
- Prioritize the feedback that will have the highest hiring impact.
- ATS compatibility: flag missing contact info, use of tables/columns that ATS can't parse, graphics, headers/footers, non-standard section names, and non-parseable fonts.`

export function buildAnalysisPrompt(
  resume: string,
  jobDescription?: string
): string {
  const hasJob = !!jobDescription?.trim()

  const jobSection = hasJob
    ? `\n\n---\nTARGET JOB DESCRIPTION:\n${jobDescription!.trim()}\n---`
    : ''

  const instruction = hasJob
    ? `Analyze this resume against the provided job description. Compare skills, keywords, experience relevance, and ATS compatibility. Populate the jobAlignment score and the keywords.matched / keywords.missing / skills.missing fields based on what is actually in the job description.`
    : `Analyze this resume on its own merits. No job description was provided. Leave keywords.matched, keywords.missing, skills.missing, and jobAlignment empty/omitted — focus on the resume's standalone quality, clarity, impact, and ATS compatibility.`

  return `${SYSTEM_PROMPT}\n\n${instruction}\n\nRESUME:\n${resume.trim()}${jobSection}`
}
