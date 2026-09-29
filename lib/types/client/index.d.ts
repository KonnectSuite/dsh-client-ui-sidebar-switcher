/**
 * Right-sidebar switcher, browser half. Puts Changes, Browser, Terminal,
 * and Files in the conversation header. Pressing one opens the right sidebar
 * on that panel. Pressing the panel that is already showing collapses it.
 * Changes opens the latest turn that recorded file edits.
 * Unplug this plugin by removing its patch row, or setting that row disabled.
 */
import type { Context } from '@deepseek-ai/cordis';
import { zh } from './locales.ts';
declare module '@deepseek-ai/dsh-client-ui-slots' {
    interface LocaleNamespaceMap {
        /** Header buttons that open the right sidebar. */
        sidebarSwitcher: keyof typeof zh;
    }
}
/** Services this plugin waits for. The buttons need the slot registry, copy, and the right sidebar. */
export declare const inject: string[];
/**
 * Register the header buttons and drop them when this plugin disposes.
 * @param ctx - client root context.
 */
export declare function apply(ctx: Context): void;
//# sourceMappingURL=index.d.ts.map