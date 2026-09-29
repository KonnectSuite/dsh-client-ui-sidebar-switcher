/** Latest turn review the Changes button can open. */

/** One turn's review in the right sidebar. */
export interface ChangesReviewTarget {
  readonly sessionId: string
  readonly seq: number
  readonly turn: number
}

/**
 * Address of one turn's review. Matches the address the deliverables plugin claims.
 * @param target - the session, the announcing event, and the turn.
 * @returns a `dsh-resource://changes-review/session/…` address.
 */
export function changesReviewAddress(target: ChangesReviewTarget): string {
  return `dsh-resource://changes-review/session/${encodeURIComponent(target.sessionId)}/${target.seq}/${target.turn}`
}

/**
 * The newest `workspace/changes` event in the session window the client has loaded.
 * @param sessionId - the session on screen.
 * @param entries - that session's loaded event window, oldest first.
 * @returns the review to open, or undefined when this window recorded no changes.
 */
export function latestChangesReview(
  sessionId: string,
  entries: readonly {
    readonly type: string
    readonly event?: {
      readonly type: string
      readonly seq: number
      readonly data?: unknown
    }
  }[],
): ChangesReviewTarget | undefined {
  for (let index = entries.length - 1; index >= 0; index -= 1) {
    const entry = entries[index]
    if (entry?.type !== 'event') continue
    const event = entry.event
    if (event?.type !== 'workspace/changes') continue
    const data = event.data
    const turn = typeof data === 'object' && data !== null && 'turn' in data ? data.turn : undefined
    if (typeof turn !== 'number' || !Number.isSafeInteger(turn) || turn < 1) continue
    return { sessionId, seq: event.seq, turn }
  }
  return undefined
}
