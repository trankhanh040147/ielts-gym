'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { EssayPlan } from '@/lib/schemas'

interface Props {
  plan: EssayPlan
  onStartWriting: () => void
}

export default function PlanStep({ plan, onStartWriting }: Props) {
  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <div>
        <h2 className="text-xl font-semibold">Your Essay Plan</h2>
        <p className="text-muted-foreground mt-1 text-sm">
          Use this as your guide while you write.
        </p>
      </div>

      <Card>
        <CardContent className="pt-4 flex flex-col gap-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Your position</p>
          <p className="font-medium">{plan.position}</p>
          <p className="text-xs text-muted-foreground uppercase tracking-wide mt-2">Thesis</p>
          <p className="text-sm italic text-muted-foreground">"{plan.thesis}"</p>
        </CardContent>
      </Card>

      {plan.body.map((para) => (
        <Card key={para.label}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold">{para.label}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-2 text-sm">
            <div>
              <span className="font-medium">Argument: </span>{para.argument}
            </div>
            <div>
              <span className="font-medium">Support: </span>{para.support}
            </div>
            <div>
              <span className="font-medium">Example: </span>{para.example}
            </div>
          </CardContent>
        </Card>
      ))}

      {plan.concession && (
        <Card>
          <CardContent className="pt-4 text-sm">
            <span className="font-medium">Concession: </span>{plan.concession}
          </CardContent>
        </Card>
      )}

      {plan.writing_tips.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">Writing tips</p>
          <ul className="list-disc list-inside text-sm space-y-1">
            {plan.writing_tips.map((tip, i) => (
              <li key={i}>{tip}</li>
            ))}
          </ul>
        </div>
      )}

      <Button onClick={onStartWriting} className="self-start">
        Start writing →
      </Button>
    </div>
  )
}
