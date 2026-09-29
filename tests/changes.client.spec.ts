import { describe, expect, it } from 'vitest'
import { changesReviewAddress, latestChangesReview } from '../src/client/changes.ts'

describe('latestChangesReview', () => {
  it('uses the newest recorded turn', () => {
    const review = latestChangesReview('session', [
      { type: 'event', event: { type: 'workspace/changes', seq: 3, data: { turn: 1 } } },
      { type: 'transient', event: { type: 'assistant/live-chunk', seq: 4, data: {} } },
      { type: 'event', event: { type: 'workspace/changes', seq: 7, data: { turn: 2 } } },
    ])
    expect(review).toEqual({ sessionId: 'session', seq: 7, turn: 2 })
    expect(changesReviewAddress(review!)).toBe('dsh-resource://changes-review/session/session/7/2')
  })

  it('ignores a changes event that does not name a turn', () => {
    expect(latestChangesReview('session', [
      { type: 'event', event: { type: 'workspace/changes', seq: 3, data: { turn: 'later' } } },
    ])).toBeUndefined()
  })
})
