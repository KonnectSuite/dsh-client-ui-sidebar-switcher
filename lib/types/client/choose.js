/** Right-sidebar page kinds this switcher opens, in header order. */
export const PANEL_KINDS = ['changes-review', 'browser', 'terminal', 'files'];
/**
 * Decide how a header button opens its panel.
 * A press on the panel already showing collapses it. A press on a kind that
 * already has a tab focuses that tab, expanding the column when it is hidden.
 * Otherwise the kind is opened, which reveals the column.
 * @param kind - the page kind the button owns.
 * @param view - the mounted column.
 * @returns the layout change to apply.
 */
export function chooseSidebarPanel(kind, view) {
    if (view.expanded && view.activeKind === kind)
        return { type: 'collapse' };
    let existing;
    for (const tab of view.tabs) {
        if (tab.kind === kind)
            existing = tab.tabId;
    }
    if (existing !== undefined)
        return { type: 'focus', tabId: existing, expand: !view.expanded };
    return { type: 'open' };
}
//# sourceMappingURL=choose.js.map