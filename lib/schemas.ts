import { z } from 'zod'

export const DebateOpenerSchema = z.object({
  topic_summary: z.string(),
  question: z.string(),
  position_options: z.array(z.string()),
})

export const DebateFollowUpSchema = z.object({
  acknowledgment: z.string(),
  question: z.string(),
  argument_hints: z.array(z.string()).optional(),
})

export const EssayPlanBodyItemSchema = z.object({
  label: z.string(),
  argument: z.string(),
  support: z.string(),
  example: z.string(),
})

export const EssayPlanSchema = z.object({
  position: z.string(),
  thesis: z.string(),
  body: z.array(EssayPlanBodyItemSchema),
  concession: z.string().optional(),
  writing_tips: z.array(z.string()),
})

export const MockedFeedbackTopIssueSchema = z.object({
  title: z.string(),
  why_it_matters: z.string(),
  fix: z.string(),
})

export const MockedFeedbackSchema = z.object({
  band_estimate: z.string(),
  top_issues: z.array(MockedFeedbackTopIssueSchema),
  rewrite_sample: z.string(),
  next_actions: z.array(z.string()),
})

export type DebateOpener = z.infer<typeof DebateOpenerSchema>
export type DebateFollowUp = z.infer<typeof DebateFollowUpSchema>
export type EssayPlan = z.infer<typeof EssayPlanSchema>
export type MockedFeedback = z.infer<typeof MockedFeedbackSchema>
