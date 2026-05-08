'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import type { DebateOpener, DebateFollowUp } from '@/lib/schemas'

interface Props {
  debateOpener: DebateOpener
  debateFollowUp: DebateFollowUp | null
  debateRound: 1 | 2
  userPosition: string
  userArgument: string
  isLoading: boolean
  error: string | null
  hasPlan: boolean
  onSelectPosition: (p: string) => void
  onConfirmPosition: () => void
  onArgumentChange: (a: string) => void
  onGeneratePlan: () => void
  onBackToPlan: () => void
}

export default function DebateStep({
  debateOpener,
  debateFollowUp,
  debateRound,
  userPosition,
  userArgument,
  isLoading,
  error,
  hasPlan,
  onSelectPosition,
  onConfirmPosition,
  onArgumentChange,
  onGeneratePlan,
  onBackToPlan,
}: Props) {
  const [showPositionHints, setShowPositionHints] = useState(false)
  const [showArgumentHints, setShowArgumentHints] = useState(false)

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Let&apos;s find your angle</h2>
          <p className="text-muted-foreground mt-1 text-sm">{debateOpener.topic_summary}</p>
        </div>
        {hasPlan && (
          <button
            onClick={onBackToPlan}
            className="text-sm text-muted-foreground underline-offset-4 hover:underline shrink-0"
            type="button"
          >
            ← Back to current plan
          </button>
        )}
      </div>

      {debateRound === 1 && (
        <div className="flex flex-col gap-3">
          <p className="font-medium">{debateOpener.question}</p>

          <Textarea
            placeholder="Write your position in your own words…"
            className="min-h-24 resize-none"
            value={userPosition}
            onChange={(e) => onSelectPosition(e.target.value)}
            disabled={isLoading}
          />

          <div className="flex flex-col gap-2">
            <button
              onClick={() => setShowPositionHints((v) => !v)}
              className="text-sm text-muted-foreground underline-offset-4 hover:underline self-start"
              type="button"
            >
              {showPositionHints ? 'Hide hints' : 'Give me a hint'}
            </button>

            {showPositionHints && (
              <div className="flex flex-col gap-2">
                <p className="text-xs text-muted-foreground">Choose one to get started, then make it your own:</p>
                {debateOpener.position_options.map((option) => (
                  <button
                    key={option}
                    onClick={() => onSelectPosition(option)}
                    disabled={isLoading}
                    type="button"
                    className="text-left px-4 py-3 rounded-lg border border-border hover:border-primary/50 transition-colors text-sm"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Button
            onClick={onConfirmPosition}
            disabled={!userPosition.trim() || isLoading}
            className="self-start"
          >
            {isLoading ? 'Loading…' : 'Continue →'}
          </Button>
          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      )}

      {debateRound === 2 && debateFollowUp && (
        <div className="flex flex-col gap-4 border-t pt-4">
          <p className="text-sm text-muted-foreground italic">{debateFollowUp.acknowledgment}</p>
          <p className="font-medium">{debateFollowUp.question}</p>

          <Textarea
            placeholder="Write your main argument in your own words…"
            className="min-h-24 resize-none"
            value={userArgument}
            onChange={(e) => onArgumentChange(e.target.value)}
            disabled={isLoading}
          />

          <div className="flex flex-col gap-2">
            <button
              onClick={() => setShowArgumentHints((v) => !v)}
              className="text-sm text-muted-foreground underline-offset-4 hover:underline self-start"
              type="button"
            >
              {showArgumentHints ? 'Hide hints' : 'Give me a hint'}
            </button>

            {showArgumentHints && debateFollowUp.argument_hints && debateFollowUp.argument_hints.length > 0 && (
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 pl-1">
                {debateFollowUp.argument_hints.map((hint) => (
                  <li key={hint}>{hint}</li>
                ))}
              </ul>
            )}
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button
            onClick={onGeneratePlan}
            disabled={!userArgument.trim() || isLoading}
            className="self-start"
          >
            {isLoading ? 'Building plan…' : 'Generate my essay plan →'}
          </Button>
        </div>
      )}
    </div>
  )
}
