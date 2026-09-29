/** Right-sidebar page kinds this switcher opens, in header order. */
export declare const PANEL_KINDS: readonly ["changes-review", "browser", "terminal", "files"];
/** One page kind the header buttons know how to open. */
export type SidebarPanelKind = (typeof PANEL_KINDS)[number];
/** What the mounted right sidebar is showing when a button is pressed. */
export interface SidebarPanelView {
    /** Whether the column is expanded. */
    readonly expanded: boolean;
    /** Kind of the active tab, when a tab is active. */
    readonly activeKind: string | undefined;
    /** Open tabs of the mounted session. */
    readonly tabs: readonly {
        readonly kind: string;
        readonly tabId: string;
    }[];
}
/** The one layout change a button press should make. */
export type SidebarPanelChoice = {
    readonly type: 'collapse';
} | {
    readonly type: 'open';
} | {
    readonly type: 'focus';
    readonly tabId: string;
    readonly expand: boolean;
};
/**
 * Decide how a header button opens its panel.
 * A press on the panel already showing collapses it. A press on a kind that
 * already has a tab focuses that tab, expanding the column when it is hidden.
 * Otherwise the kind is opened, which reveals the column.
 * @param kind - the page kind the button owns.
 * @param view - the mounted column.
 * @returns the layout change to apply.
 */
export declare function chooseSidebarPanel(kind: string, view: SidebarPanelView): SidebarPanelChoice;
//# sourceMappingURL=choose.d.ts.map