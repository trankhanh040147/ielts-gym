'use client'

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
  onSelectPosition: (p: string) => void
  onConfirmPosition: () => void
  onArgumentChange: (a: string) => void
  onGeneratePlan: () => void
}

export default function DebateStep({
  debateOpener,
  debateFollowUp,
  debateRound,
  userPosition,
  userArgument,
  isLoading,
  error,
  onSelectPosition,
  onConfirmPosition,
  onArgumentChange,
  onGeneratePlan,
}: Props) {
  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <div>
        <h2 className="text-xl font-semibold">Let's find your angle</h2>
        <p className="text-muted-foreground mt-1 text-sm">{debateOpener.topic_summary}</p>
      </div>

      <div className="flex flex-col gap-3">
        <p className="font-medium">{debateOpener.question}</p>
        <div className="flex flex-col gap-2">
          {debateOpener.position_options.map((option) => (
            <button
              key={option}
              onClick={() => onSelectPosition(option)}
              disabled={isLoading}
              className={`text-left px-4 py-3 rounded-lg border transition-colors ${
                userPosition === option
                  ? 'border-primary bg-primary/5 font-medium'
                  : 'border-border hover:border-primary/50'
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {debateRound === 1 && (
        <Button
          onClick={onConfirmPosition}
          disabled={!userPosition || isLoading}
        >
          {isLoading ? 'Loading…' : 'Continue →'}
        </Button>
      )}

      {debateRound === 2 && debateFollowUp && (
        <div className="flex flex-col gap-4 border-t pt-4">
          <p className="text-sm text-muted-foreground italic">{debateFollowUp.acknowledgment}</p>
          <p className="font-medium">{debateFollowUp.question}</p>

          {debateFollowUp.argument_hints && debateFollowUp.argument_hints.length > 0 && (
            <div className="flex flex-col gap-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wide">Ideas to consider</p>
              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                {debateFollowUp.argument_hints.map((hint) => (
                  <li key={hint}>{hint}</li>
                ))}
              </ul>
            </div>
          )}

          <Textarea
            placeholder="Type your main argument here…"
            className="min-h-24 resize-none"
            value={userArgument}
            onChange={(e) => onArgumentChange(e.target.value)}
            disabled={isLoading}
          />

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button
            onClick={onGeneratePlan}
            disabled={!userArgument.trim() || isLoading}
          >
            {isLoading ? 'Building plan…' : 'Generate my essay plan →'}
          </Button>
        </div>
      )}
    </div>
  )
}
