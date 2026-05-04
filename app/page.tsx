'use client'

import { useReducer, useCallback } from 'react'
import type { DebateOpener, DebateFollowUp, EssayPlan } from '@/lib/schemas'
import PromptStep from '@/components/steps/PromptStep'
import DebateStep from '@/components/steps/DebateStep'
import PlanStep from '@/components/steps/PlanStep'
import WritingStep from '@/components/steps/WritingStep'
import FeedbackStep from '@/components/steps/FeedbackStep'

type AppStep = 'prompt' | 'debate' | 'plan' | 'writing' | 'feedback'

interface AppState {
  step: AppStep
  prompt: string
  debateRound: 1 | 2
  debateOpener: DebateOpener | null
  userPosition: string
  debateFollowUp: DebateFollowUp | null
  userArgument: string
  plan: EssayPlan | null
  essay: string
  isLoading: boolean
  error: string | null
}

type AppAction =
  | { type: 'SET_PROMPT'; prompt: string }
  | { type: 'START_LOADING' }
  | { type: 'DEBATE_OPENED'; opener: DebateOpener }
  | { type: 'SET_POSITION'; position: string }
  | { type: 'DEBATE_FOLLOWED_UP'; followUp: DebateFollowUp }
  | { type: 'SET_ARGUMENT'; argument: string }
  | { type: 'PLAN_GENERATED'; plan: EssayPlan }
  | { type: 'SET_ESSAY'; essay: string }
  | { type: 'GO_TO_WRITING' }
  | { type: 'GO_TO_FEEDBACK' }
  | { type: 'SET_ERROR'; error: string }
  | { type: 'RESET' }

const initialState: AppState = {
  step: 'prompt',
  prompt: '',
  debateRound: 1,
  debateOpener: null,
  userPosition: '',
  debateFollowUp: null,
  userArgument: '',
  plan: null,
  essay: '',
  isLoading: false,
  error: null,
}

function reducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'SET_PROMPT':
      return { ...state, prompt: action.prompt }
    case 'START_LOADING':
      return { ...state, isLoading: true, error: null }
    case 'DEBATE_OPENED':
      return { ...state, isLoading: false, step: 'debate', debateRound: 1, debateOpener: action.opener }
    case 'SET_POSITION':
      return { ...state, userPosition: action.position }
    case 'DEBATE_FOLLOWED_UP':
      return { ...state, isLoading: false, debateRound: 2, debateFollowUp: action.followUp }
    case 'SET_ARGUMENT':
      return { ...state, userArgument: action.argument }
    case 'PLAN_GENERATED':
      return { ...state, isLoading: false, step: 'plan', plan: action.plan }
    case 'SET_ESSAY':
      return { ...state, essay: action.essay }
    case 'GO_TO_WRITING':
      return { ...state, step: 'writing' }
    case 'GO_TO_FEEDBACK':
      return { ...state, step: 'feedback' }
    case 'SET_ERROR':
      return { ...state, isLoading: false, error: action.error }
    case 'RESET':
      return initialState
    default:
      return state
  }
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? ''

const STEP_LABELS: Record<AppStep, string> = {
  prompt: 'Prompt',
  debate: 'Debate',
  plan: 'Plan',
  writing: 'Write',
  feedback: 'Feedback',
}
const STEPS: AppStep[] = ['prompt', 'debate', 'plan', 'writing', 'feedback']

export default function Home() {
  const [state, dispatch] = useReducer(reducer, initialState)

  const openDebate = useCallback(async () => {
    dispatch({ type: 'START_LOADING' })
    try {
      const res = await fetch(`${API_BASE}/api/debate/open`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: state.prompt }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const opener: DebateOpener = await res.json()
      dispatch({ type: 'DEBATE_OPENED', opener })
    } catch {
      dispatch({ type: 'SET_ERROR', error: 'Could not start debate. Please try again.' })
    }
  }, [state.prompt])

  const confirmPosition = useCallback(async () => {
    dispatch({ type: 'START_LOADING' })
    try {
      const res = await fetch(`${API_BASE}/api/debate/respond`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: state.prompt, position: state.userPosition }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const followUp: DebateFollowUp = await res.json()
      dispatch({ type: 'DEBATE_FOLLOWED_UP', followUp })
    } catch {
      dispatch({ type: 'SET_ERROR', error: 'Could not continue debate. Please try again.' })
    }
  }, [state.prompt, state.userPosition])

  const generatePlan = useCallback(async () => {
    dispatch({ type: 'START_LOADING' })
    try {
      const res = await fetch(`${API_BASE}/api/plan/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: state.prompt,
          position: state.userPosition,
          argument: state.userArgument,
        }),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const plan: EssayPlan = await res.json()
      dispatch({ type: 'PLAN_GENERATED', plan })
    } catch {
      dispatch({ type: 'SET_ERROR', error: 'Could not generate plan. Please try again.' })
    }
  }, [state.prompt, state.userPosition, state.userArgument])

  const currentIndex = STEPS.indexOf(state.step)

  return (
    <main className="min-h-screen p-6 md:p-12">
      <div className="max-w-4xl mx-auto">
        <nav className="flex gap-2 mb-10 text-sm">
          {STEPS.map((s, i) => (
            <span
              key={s}
              className={`${
                i === currentIndex
                  ? 'text-foreground font-medium'
                  : i < currentIndex
                  ? 'text-muted-foreground'
                  : 'text-muted-foreground/40'
              }`}
            >
              {STEP_LABELS[s]}{i < STEPS.length - 1 && <span className="ml-2 mr-2">→</span>}
            </span>
          ))}
        </nav>

        {state.step === 'prompt' && (
          <PromptStep
            prompt={state.prompt}
            isLoading={state.isLoading}
            error={state.error}
            onPromptChange={(p) => dispatch({ type: 'SET_PROMPT', prompt: p })}
            onSubmit={openDebate}
          />
        )}

        {state.step === 'debate' && state.debateOpener && (
          <DebateStep
            debateOpener={state.debateOpener}
            debateFollowUp={state.debateFollowUp}
            debateRound={state.debateRound}
            userPosition={state.userPosition}
            userArgument={state.userArgument}
            isLoading={state.isLoading}
            error={state.error}
            onSelectPosition={(p) => dispatch({ type: 'SET_POSITION', position: p })}
            onConfirmPosition={confirmPosition}
            onArgumentChange={(a) => dispatch({ type: 'SET_ARGUMENT', argument: a })}
            onGeneratePlan={generatePlan}
          />
        )}

        {state.step === 'plan' && state.plan && (
          <PlanStep
            plan={state.plan}
            onStartWriting={() => dispatch({ type: 'GO_TO_WRITING' })}
          />
        )}

        {state.step === 'writing' && state.plan && (
          <WritingStep
            plan={state.plan}
            essay={state.essay}
            onEssayChange={(e) => dispatch({ type: 'SET_ESSAY', essay: e })}
            onGetFeedback={() => dispatch({ type: 'GO_TO_FEEDBACK' })}
          />
        )}

        {state.step === 'feedback' && state.essay.length > 0 && (
          <FeedbackStep
            onStartOver={() => dispatch({ type: 'RESET' })}
          />
        )}
      </div>
    </main>
  )
}
