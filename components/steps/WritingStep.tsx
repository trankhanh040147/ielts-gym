'use client'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import type { EssayPlan } from '@/lib/schemas'

interface Props {
  prompt: string
  plan: EssayPlan
  essay: string
  onEssayChange: (v: string) => void
  onGetFeedback: () => void
}

export default function WritingStep({ prompt, plan, essay, onEssayChange, onGetFeedback }: Props) {
  const wordCount = essay.trim() ? essay.trim().split(/\s+/).length : 0

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-xl font-semibold">Write your essay</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Your plan is on the left. Aim for 250–300 words.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col gap-3 text-sm">
          <div className="rounded-lg border p-4 flex flex-col gap-1">
            <p className="font-medium text-foreground">Topic</p>
            <p className="text-muted-foreground">{prompt}</p>
          </div>

          <p className="font-medium">Plan reference</p>
          <div className="rounded-lg border p-4 flex flex-col gap-3 text-muted-foreground">
            <div>
              <span className="font-medium text-foreground">Thesis: </span>
              {plan.thesis}
            </div>
            <Separator />
            {plan.body.map((para) => (
              <div key={para.label}>
                <p className="font-medium text-foreground">{para.label}</p>
                <p>{para.argument}</p>
                <p className="text-xs mt-1">eg. {para.example}</p>
              </div>
            ))}
            {plan.concession && (
              <>
                <Separator />
                <p><span className="font-medium text-foreground">Concession: </span>{plan.concession}</p>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <p className="font-medium text-sm">Your essay</p>
            <span className="text-xs text-muted-foreground">{wordCount} words</span>
          </div>
          <Textarea
            placeholder="Start writing your essay here…"
            className="min-h-64 resize-none"
            value={essay}
            onChange={(e) => onEssayChange(e.target.value)}
          />
          <Button
            onClick={onGetFeedback}
            disabled={wordCount < 50}
          >
            Get feedback preview →
          </Button>
          {wordCount < 50 && wordCount > 0 && (
            <p className="text-xs text-muted-foreground">Write at least 50 words to continue.</p>
          )}
        </div>
      </div>
    </div>
  )
}
