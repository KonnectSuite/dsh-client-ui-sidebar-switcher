import type { ObservableSnapshot } from '@deepseek-ai/dsh-client-store';
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots';
import { type SidebarPanelKind } from './choose.ts';
import { NS } from './locales.ts';
/** Browser operations and state injected into the session-header contribution. */
export interface SidebarSwitcherInjected {
    hooks: {
        kinds: ObservableSnapshot<readonly string[]>;
        openTabs: ObservableSnapshot<readonly {
            readonly sessionId: string;
            readonly kind: string;
        }[]>;
        mounted: ObservableSnapshot<string | undefined>;
    };
    show: (kind: SidebarPanelKind) => void;
    panelOpen: () => boolean;
    activeKind: () => string | undefined;
}
/** Full props for the session-header sidebar switcher. */
export type SidebarSwitcherProps = PropsRuntime<'conversation.session.header.utilities'> & PropsLocale<typeof NS> & InjectFace<SidebarSwitcherInjected>;
/**
 * Changes, Browser, Terminal, and Files buttons for the conversation header.
 * A kind is omitted while its page type is not registered, so unplugging
 * that panel removes its button.
 * @param props - registered kinds, the live column, and the open action.
 * @returns the button row, or null when no panel is available.
 */
export declare function SidebarSwitcher(props: SidebarSwitcherProps): import("react").JSX.Element | null;
//# sourceMappingURL=SidebarSwitcher.d.ts.map