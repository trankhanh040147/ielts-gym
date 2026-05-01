'use client'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { SAMPLE_PROMPT } from '@/lib/mock-data'

interface Props {
  prompt: string
  isLoading: boolean
  error: string | null
  onPromptChange: (v: string) => void
  onSubmit: () => void
}

export default function PromptStep({ prompt, isLoading, error, onPromptChange, onSubmit }: Props) {
  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">IELTS Writing Task 2 Practice</h1>
        <p className="text-muted-foreground mt-1">
          Enter a Task 2 question and get AI help to build your ideas, outline, and essay.
        </p>
      </div>

      <Textarea
        placeholder="Enter an IELTS Writing Task 2 question here…"
        className="min-h-32 resize-none"
        value={prompt}
        onChange={(e) => onPromptChange(e.target.value)}
        disabled={isLoading}
      />

      {error && <p className="text-sm text-destructive">{error}</p>}

      <div className="flex gap-3">
        <Button
          variant="outline"
          onClick={() => onPromptChange(SAMPLE_PROMPT)}
          disabled={isLoading}
        >
          Load sample prompt
        </Button>
        <Button onClick={onSubmit} disabled={!prompt.trim() || isLoading}>
          {isLoading ? 'Generating…' : 'Start debate →'}
        </Button>
      </div>
    </div>
  )
}
