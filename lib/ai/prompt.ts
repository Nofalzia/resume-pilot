import type { DocumentType } from '@/lib/types'

const SYSTEM_PROMPT = `You are a senior technical recruiter and career coach with expertise in resume optimization, ATS systems, and frontend/software engineering hiring. You give specific, honest, actionable feedback.

CRITICAL RULES - follow these without exception:
- NEVER fabricate metrics, achievements, companies, or experience the candidate has not mentioned.
- If a bullet would benefit from a quantified result but none was provided, write "add the result metric here" in your suggestion - never invent a number.
- Be specific. Generic feedback like "improve your bullets" is useless. Name the exact problem.
- Be honest. If the document is weak in some area, say so clearly but constructively.
- Prioritize the feedback that will have the highest hiring impact.
- ATS compatibility: flag missing contact info, use of tables/columns that ATS can't parse, graphics, headers/footers, non-standard section names, and non-parseable fonts.`

export function buildAnalysisPrompt(
  resume: string,
  jobDescription?: string,
  documentType: DocumentType = 'resume'
): string {
  const hasJob = !!jobDescription?.trim()

  const jobSection = hasJob
    ? `\n\n---\nTARGET JOB DESCRIPTION:\n${jobDescription!.trim()}\n---`
    : ''

  const instruction = hasJob
    ? `Analyze this ${documentType} against the provided job description. Compare skills, keywords, experience relevance, and ATS compatibility. Populate the jobAlignment score and the keywords.matched / keywords.missing / skills.missing fields based on what is actually in the job description.`
    : `Analyze this ${documentType} on its own merits. No job description was provided. Leave keywords.matched, keywords.missing, skills.missing, and jobAlignment empty/omitted - focus on the document's standalone quality, clarity, impact, and ATS compatibility.`

  const documentTypeInstruction = documentType === 'cv'
    ? `This is a CV, not a resume. A detailed, multi-page structure is expected and must not be treated as a weakness. Evaluate its organization, relevance, clarity, and ATS compatibility in the context of a CV.`
    : `This is a resume. Evaluate it as a concise, targeted document.`

  return `${SYSTEM_PROMPT}\n\n${documentTypeInstruction}\n\n${instruction}\n\n${documentType.toUpperCase()}:\n${resume.trim()}${jobSection}`
}
