'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import type { EssayPlan } from '@/lib/schemas'

interface Props {
  plan: EssayPlan
  onStartWriting: (plan: EssayPlan) => void
}

export default function PlanStep({ plan, onStartWriting }: Props) {
  const [edited, setEdited] = useState<EssayPlan>(plan)

  const updateBody = (index: number, field: keyof EssayPlan['body'][number], value: string) => {
    setEdited((prev) => ({
      ...prev,
      body: prev.body.map((para, i) => (i === index ? { ...para, [field]: value } : para)),
    }))
  }

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <div>
        <h2 className="text-xl font-semibold">Your Essay Plan</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Edit any section to make it yours, then start writing.
        </p>
      </div>

      <Card>
        <CardContent className="pt-4 flex flex-col gap-3">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Your position</p>
            <Textarea
              className="resize-none min-h-16 text-sm font-medium"
              value={edited.position}
              onChange={(e) => setEdited((p) => ({ ...p, position: e.target.value }))}
            />
          </div>
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Thesis</p>
            <Textarea
              className="resize-none min-h-16 text-sm italic"
              value={edited.thesis}
              onChange={(e) => setEdited((p) => ({ ...p, thesis: e.target.value }))}
            />
          </div>
        </CardContent>
      </Card>

      {edited.body.map((para, i) => (
        <Card key={para.label}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">{para.label}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-3 text-sm">
            <div>
              <p className="font-medium mb-1">Argument</p>
              <Textarea
                className="resize-none min-h-14"
                value={para.argument}
                onChange={(e) => updateBody(i, 'argument', e.target.value)}
              />
            </div>
            <div>
              <p className="font-medium mb-1">Support</p>
              <Textarea
                className="resize-none min-h-14"
                value={para.support}
                onChange={(e) => updateBody(i, 'support', e.target.value)}
              />
            </div>
            <div>
              <p className="font-medium mb-1">Example</p>
              <Textarea
                className="resize-none min-h-14"
                value={para.example}
                onChange={(e) => updateBody(i, 'example', e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      ))}

      {edited.concession !== undefined && (
        <Card>
          <CardContent className="pt-4 text-sm">
            <p className="font-medium mb-1">Concession</p>
            <Textarea
              className="resize-none min-h-14"
              value={edited.concession ?? ''}
              onChange={(e) => setEdited((p) => ({ ...p, concession: e.target.value }))}
            />
          </CardContent>
        </Card>
      )}

      {edited.writing_tips.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Writing tips</p>
          <ul className="list-disc list-inside text-sm space-y-1">
            {edited.writing_tips.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </div>
      )}

      <Button onClick={() => onStartWriting(edited)} className="self-start">
        Start writing →
      </Button>
    </div>
  )
}
