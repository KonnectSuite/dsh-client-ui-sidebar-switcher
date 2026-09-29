/** Header buttons that open Files, Browser, and Terminal in the right sidebar. */
import { useEffect, useState, type ComponentType } from 'react'
import type { ObservableSnapshot } from '@deepseek-ai/dsh-client-store'
import type { InjectFace, PropsLocale, PropsRuntime } from '@deepseek-ai/dsh-client-ui-slots'
import type {} from '@deepseek-ai/dsh-client-ui-conversation/client'
import {
  IconCompareSplitOutlineRegular, IconFolderOpenOutlineRegular, IconGlobeOutlineRegular, Tooltip,
} from '@deepseek-ai/dsh-client-ui-primitives'
import type { IconProps } from '@deepseek-ai/dsh-client-ui-primitives'
import { PANEL_KINDS, type SidebarPanelKind } from './choose.ts'
import { NS, type SidebarSwitcherKey } from './locales.ts'
import css from './SidebarSwitcher.module.css'

/** Browser operations and state injected into the session-header contribution. */
export interface SidebarSwitcherInjected {
  hooks: {
    kinds: ObservableSnapshot<readonly string[]>
    openTabs: ObservableSnapshot<readonly { readonly sessionId: string; readonly kind: string }[]>
    mounted: ObservableSnapshot<string | undefined>
  }
  show: (kind: SidebarPanelKind) => void
  panelOpen: () => boolean
  activeKind: () => string | undefined
}

/** Full props for the session-header sidebar switcher. */
export type SidebarSwitcherProps =
  PropsRuntime<'conversation.session.header.utilities'>
  & PropsLocale<typeof NS>
  & InjectFace<SidebarSwitcherInjected>

const LABEL: Record<SidebarPanelKind, SidebarSwitcherKey> = {
  'changes-review': 'panel.changes',
  browser: 'panel.browser',
  terminal: 'panel.terminal',
  files: 'panel.files',
}

/**
 * Prompt glyph for the terminal button. The shared icon set has no 16px terminal.
 * @param props - square edge in px.
 * @returns a currentColor prompt mark.
 */
function IconTerminal({ size = 16 }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3.2 4.6 6.5 8 3.2 11.4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 11.4h4.8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

const ICON: Record<SidebarPanelKind, ComponentType<IconProps>> = {
  'changes-review': IconCompareSplitOutlineRegular,
  browser: IconGlobeOutlineRegular,
  terminal: IconTerminal,
  files: IconFolderOpenOutlineRegular,
}

/**
 * Changes, Browser, Terminal, and Files buttons for the conversation header.
 * A kind is omitted while its page type is not registered, so unplugging
 * that panel removes its button.
 * @param props - registered kinds, the live column, and the open action.
 * @returns the button row, or null when no panel is available.
 */
export function SidebarSwitcher(props: SidebarSwitcherProps) {
  const kinds = props.useKinds(list => list)
  void props.useOpenTabs(list => list)
  void props.useMounted(id => id)
  const [revision, setRevision] = useState(0)
  useEffect(() => {
    const bump = (): void => { setRevision(value => value + 1) }
    const observer = new MutationObserver(bump)
    observer.observe(document.body, {
      subtree: true,
      attributes: true,
      attributeFilter: ['data-sidebar-right-open', 'aria-selected'],
    })
    return () => { observer.disconnect() }
  }, [])
  void revision
  const expanded = props.panelOpen()
  const active = props.activeKind()
  const visible = PANEL_KINDS.filter(kind => kinds.includes(kind))
  if (visible.length === 0) return null
  return (
    <div className={css.switcher} role="group" aria-label={props.t('switcher.label')} data-sidebar-switcher="">
      {visible.map((kind) => {
        const Icon = ICON[kind]
        const label = props.t(LABEL[kind])
        const pressed = expanded && active === kind
        return (
          <Tooltip key={kind} label={label} side="bottom" delayMs={500}>
            <button
              type="button"
              className={css.button}
              aria-label={label}
              aria-pressed={pressed}
              data-sidebar-switcher={kind}
              onClick={() => { props.show(kind) }}
            >
              <Icon size={16} />
            </button>
          </Tooltip>
        )
      })}
    </div>
  )
}
