import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/** Header buttons that open Files, Browser, and Terminal in the right sidebar. */
import { useEffect, useState } from 'react';
import { IconCompareSplitOutlineRegular, IconFolderOpenOutlineRegular, IconGlobeOutlineRegular, Tooltip, } from '@deepseek-ai/dsh-client-ui-primitives';
import { PANEL_KINDS } from "./choose.js";
import css from './SidebarSwitcher.module.css';
const LABEL = {
    'changes-review': 'panel.changes',
    browser: 'panel.browser',
    terminal: 'panel.terminal',
    files: 'panel.files',
};
/**
 * Prompt glyph for the terminal button. The shared icon set has no 16px terminal.
 * @param props - square edge in px.
 * @returns a currentColor prompt mark.
 */
function IconTerminal({ size = 16 }) {
    return (_jsxs("svg", { width: size, height: size, viewBox: "0 0 16 16", fill: "none", "aria-hidden": "true", children: [_jsx("path", { d: "M3.2 4.6 6.5 8 3.2 11.4", stroke: "currentColor", strokeWidth: "1.2", strokeLinecap: "round", strokeLinejoin: "round" }), _jsx("path", { d: "M8 11.4h4.8", stroke: "currentColor", strokeWidth: "1.2", strokeLinecap: "round" })] }));
}
const ICON = {
    'changes-review': IconCompareSplitOutlineRegular,
    browser: IconGlobeOutlineRegular,
    terminal: IconTerminal,
    files: IconFolderOpenOutlineRegular,
};
/**
 * Changes, Browser, Terminal, and Files buttons for the conversation header.
 * A kind is omitted while its page type is not registered, so unplugging
 * that panel removes its button.
 * @param props - registered kinds, the live column, and the open action.
 * @returns the button row, or null when no panel is available.
 */
export function SidebarSwitcher(props) {
    const kinds = props.useKinds(list => list);
    void props.useOpenTabs(list => list);
    void props.useMounted(id => id);
    const [revision, setRevision] = useState(0);
    useEffect(() => {
        const bump = () => { setRevision(value => value + 1); };
        const observer = new MutationObserver(bump);
        observer.observe(document.body, {
            subtree: true,
            attributes: true,
            attributeFilter: ['data-sidebar-right-open', 'aria-selected'],
        });
        return () => { observer.disconnect(); };
    }, []);
    void revision;
    const expanded = props.panelOpen();
    const active = props.activeKind();
    const visible = PANEL_KINDS.filter(kind => kinds.includes(kind));
    if (visible.length === 0)
        return null;
    return (_jsx("div", { className: css.switcher, role: "group", "aria-label": props.t('switcher.label'), "data-sidebar-switcher": "", children: visible.map((kind) => {
            const Icon = ICON[kind];
            const label = props.t(LABEL[kind]);
            const pressed = expanded && active === kind;
            return (_jsx(Tooltip, { label: label, side: "bottom", delayMs: 500, children: _jsx("button", { type: "button", className: css.button, "aria-label": label, "aria-pressed": pressed, "data-sidebar-switcher": kind, onClick: () => { props.show(kind); }, children: _jsx(Icon, { size: 16 }) }) }, kind));
        }) }));
}
//# sourceMappingURL=SidebarSwitcher.js.map