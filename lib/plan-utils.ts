import type { EssayPlan } from './schemas'

export function planToMarkdown(plan: EssayPlan): string {
  const lines: string[] = ['# IELTS Writing Task 2 Plan', '']

  lines.push('## Position', plan.position, '')
  lines.push('## Thesis', plan.thesis, '')

  for (const para of plan.body) {
    lines.push(`## ${para.label}`)
    lines.push(`- Argument: ${para.argument}`)
    lines.push(`- Support: ${para.support}`)
    lines.push(`- Example: ${para.example}`)
    lines.push('')
  }

  if (plan.concession) {
    lines.push('## Concession', plan.concession, '')
  }

  if (plan.writing_tips.length > 0) {
    lines.push('## Writing Tips')
    for (const tip of plan.writing_tips) {
      lines.push(`- ${tip}`)
    }
  }

  return lines.join('\n').trim()
}
