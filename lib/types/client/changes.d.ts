/** Latest turn review the Changes button can open. */
/** One turn's review in the right sidebar. */
export interface ChangesReviewTarget {
    readonly sessionId: string;
    readonly seq: number;
    readonly turn: number;
}
/**
 * Address of one turn's review. Matches the address the deliverables plugin claims.
 * @param target - the session, the announcing event, and the turn.
 * @returns a `dsh-resource://changes-review/session/…` address.
 */
export declare function changesReviewAddress(target: ChangesReviewTarget): string;
/**
 * The newest `workspace/changes` event in the session window the client has loaded.
 * @param sessionId - the session on screen.
 * @param entries - that session's loaded event window, oldest first.
 * @returns the review to open, or undefined when this window recorded no changes.
 */
export declare function latestChangesReview(sessionId: string, entries: readonly {
    readonly type: string;
    readonly event?: {
        readonly type: string;
        readonly seq: number;
        readonly data?: unknown;
    };
}[]): ChangesReviewTarget | undefined;
//# sourceMappingURL=changes.d.ts.map