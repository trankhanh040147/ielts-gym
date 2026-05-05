'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MOCK_FEEDBACK } from '@/lib/mock-data'

interface Props {
  onStartOver: () => void
}

export default function FeedbackStep({ onStartOver }: Props) {
  const feedback = MOCK_FEEDBACK

  return (
    <div className="flex flex-col gap-6 max-w-2xl mx-auto">
      <div>
        <div className="flex items-center gap-3">
          <h2 className="text-xl font-semibold">Feedback Preview</h2>
          <Badge variant="secondary">Demo — real AI feedback coming soon</Badge>
        </div>
        <p className="text-muted-foreground mt-1 text-sm">
          This is a preview of what structured feedback will look like.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <p className="text-sm font-medium">Estimated band</p>
        <Badge className="text-base px-3 py-1">{feedback.band_estimate}</Badge>
      </div>

      <div className="flex flex-col gap-3">
        <p className="text-sm font-medium">Top issues</p>
        {feedback.top_issues.map((issue) => (
          <Card key={issue.title}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm">{issue.title}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-1 text-sm">
              <p className="text-muted-foreground">{issue.why_it_matters}</p>
              <p><span className="font-medium">Fix: </span>{issue.fix}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Rewrite sample</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm italic text-muted-foreground">"{feedback.rewrite_sample}"</p>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Next actions</p>
        <ul className="list-disc list-inside text-sm space-y-1">
          {feedback.next_actions.map((action, i) => (
            <li key={i}>{action}</li>
          ))}
        </ul>
      </div>

      <Button variant="outline" onClick={onStartOver} className="self-start">
        ← Start over
      </Button>
    </div>
  )
}
