/** Right-sidebar page kinds this switcher opens, in header order. */
export const PANEL_KINDS = ['changes-review', 'browser', 'terminal', 'files'] as const

/** One page kind the header buttons know how to open. */
export type SidebarPanelKind = (typeof PANEL_KINDS)[number]

/** What the mounted right sidebar is showing when a button is pressed. */
export interface SidebarPanelView {
  /** Whether the column is expanded. */
  readonly expanded: boolean
  /** Kind of the active tab, when a tab is active. */
  readonly activeKind: string | undefined
  /** Open tabs of the mounted session. */
  readonly tabs: readonly { readonly kind: string; readonly tabId: string }[]
}

/** The one layout change a button press should make. */
export type SidebarPanelChoice =
  | { readonly type: 'collapse' }
  | { readonly type: 'open' }
  | { readonly type: 'focus'; readonly tabId: string; readonly expand: boolean }

/**
 * Decide how a header button opens its panel.
 * A press on the panel already showing collapses it. A press on a kind that
 * already has a tab focuses that tab, expanding the column when it is hidden.
 * Otherwise the kind is opened, which reveals the column.
 * @param kind - the page kind the button owns.
 * @param view - the mounted column.
 * @returns the layout change to apply.
 */
export function chooseSidebarPanel(kind: string, view: SidebarPanelView): SidebarPanelChoice {
  if (view.expanded && view.activeKind === kind) return { type: 'collapse' }
  let existing: string | undefined
  for (const tab of view.tabs) {
    if (tab.kind === kind) existing = tab.tabId
  }
  if (existing !== undefined) return { type: 'focus', tabId: existing, expand: !view.expanded }
  return { type: 'open' }
}
