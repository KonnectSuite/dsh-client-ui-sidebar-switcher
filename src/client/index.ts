/**
 * Right-sidebar switcher, browser half. Puts Changes, Browser, Terminal,
 * and Files in the conversation header. Pressing one opens the right sidebar
 * on that panel. Pressing the panel that is already showing collapses it.
 * Changes opens the latest turn that recorded file edits.
 * Unplug this plugin by removing its patch row, or setting that row disabled.
 */
import type { Context } from '@deepseek-ai/cordis'
import type {} from '@deepseek-ai/dsh-client-locale/client'
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
import type {} from '@deepseek-ai/dsh-client-ui-renderer/client'
import type {} from '@deepseek-ai/dsh-api-session-controller/client'
import type { TabId } from '@deepseek-ai/dsh-client-ui-sidebar-right/client'
import type {} from '@deepseek-ai/dsh-client-ui-sidebar-right/client'
import { createSnapshotStore } from '@deepseek-ai/dsh-client-store'
import { changesReviewAddress, latestChangesReview } from './changes.ts'
import { chooseSidebarPanel, PANEL_KINDS, type SidebarPanelKind } from './choose.ts'
import { en, NS, zh } from './locales.ts'
import { SidebarSwitcher, type SidebarSwitcherInjected } from './SidebarSwitcher.tsx'

declare module '@deepseek-ai/dsh-client-ui-slots' {
  interface LocaleNamespaceMap {
    /** Header buttons that open the right sidebar. */
    sidebarSwitcher: keyof typeof zh
  }
}

/** Services this plugin waits for. The buttons need the slot registry, copy, and the right sidebar. */
export const inject = ['slots', 'locale', 'sessions', 'sidebarRight', 'sidebarRightTabs']

/** Empty kind list shared by every snapshot that has nothing registered. */
const NO_KINDS: readonly SidebarPanelKind[] = []

/**
 * Open or collapse one right-sidebar page from a header button.
 * A kind that is not registered, or a press while no session is on screen, does nothing.
 * @param ctx - client root context.
 * @param kind - the page kind the button owns.
 */
function showPanel(ctx: Context, kind: SidebarPanelKind): void {
  if (ctx.sidebarRightTabs.get(kind) === undefined) return
  const sidebar = ctx.sidebarRight
  const sessionId = sidebar.mounted.getSnapshot()
  if (sessionId === undefined) return
  const choice = chooseSidebarPanel(kind, {
    expanded: sidebar.isExpanded(),
    activeKind: sidebar.active()?.kind,
    tabs: sidebar.openTabs.getSnapshot()
      .filter(tab => tab.sessionId === sessionId)
      .map(tab => ({ kind: tab.kind, tabId: tab.tabId })),
  })
  if (choice.type === 'collapse') {
    sidebar.toggleExpanded()
    return
  }
  if (choice.type === 'open') {
    if (kind === 'changes-review') {
      openLatestChanges(ctx, sessionId)
      return
    }
    sidebar.openTab(kind)
    return
  }
  sidebar.focus(choice.tabId as TabId)
  if (choice.expand) sidebar.toggleExpanded()
}

/**
 * Open the newest loaded changes review for one session.
 * A session with no recorded edits, or one whose history is not open, is left alone.
 * @param ctx - client root context.
 * @param sessionId - the session on screen.
 */
function openLatestChanges(ctx: Context, sessionId: string): void {
  const binding = ctx.sessions.binding(sessionId as never)
  const review = latestChangesReview(sessionId, binding?.eventSource.getSnapshot().entries ?? [])
  if (review === undefined) return
  ctx.sidebarRight.openResource(changesReviewAddress(review))
}

/**
 * Register the header buttons and drop them when this plugin disposes.
 * @param ctx - client root context.
 */
export function apply(ctx: Context): void {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'ui-sidebar-switcher: dictionaries')
  const kinds = createSnapshotStore<readonly SidebarPanelKind[]>(NO_KINDS)
  const publish = (): void => {
    const next = PANEL_KINDS.filter(kind => ctx.sidebarRightTabs.get(kind) !== undefined)
    const current = kinds.getSnapshot()
    if (next.length === current.length && next.every((kind, index) => kind === current[index])) return
    kinds.set(next.length === 0 ? NO_KINDS : next)
  }
  ctx.effect(() => {
    publish()
    return ctx.sidebarRightTabs.subscribe(publish)
  }, 'ui-sidebar-switcher: kinds')
  ctx.slots.inject('conversation.session.header.utilities', () => ctx.slots.register({
    name: 'conversation.session.header.utilities',
    id: 'sidebar-switcher',
    order: 40,
    locale: NS,
    inject: (): SidebarSwitcherInjected => ({
      hooks: {
        kinds,
        openTabs: ctx.sidebarRight.openTabs,
        mounted: ctx.sidebarRight.mounted,
      },
      show: (kind) => { showPanel(ctx, kind) },
      panelOpen: () => ctx.sidebarRight.isExpanded(),
      activeKind: () => ctx.sidebarRight.active()?.kind,
    }),
  }, SidebarSwitcher))
}
