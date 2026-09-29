import { describe, expect, it } from 'vitest'
import { chooseSidebarPanel, type SidebarPanelView } from '../src/client/choose.ts'

function view(patch: Partial<SidebarPanelView> = {}): SidebarPanelView {
  return { expanded: false, activeKind: undefined, tabs: [], ...patch }
}

describe('chooseSidebarPanel', () => {
  it('opens a kind that has no tab', () => {
    expect(chooseSidebarPanel('files', view())).toEqual({ type: 'open' })
  })

  it('focuses an existing tab and expands a collapsed column', () => {
    expect(chooseSidebarPanel('terminal', view({
      tabs: [{ kind: 'terminal', tabId: 'term-1' }],
    }))).toEqual({ type: 'focus', tabId: 'term-1', expand: true })
  })

  it('focuses an existing tab without collapsing an open column on another kind', () => {
    expect(chooseSidebarPanel('files', view({
      expanded: true,
      activeKind: 'browser',
      tabs: [{ kind: 'files', tabId: 'files-1' }, { kind: 'browser', tabId: 'browser-1' }],
    }))).toEqual({ type: 'focus', tabId: 'files-1', expand: false })
  })

  it('collapses the column when that kind is already showing', () => {
    expect(chooseSidebarPanel('browser', view({
      expanded: true,
      activeKind: 'browser',
      tabs: [{ kind: 'browser', tabId: 'browser-1' }],
    }))).toEqual({ type: 'collapse' })
  })

  it('keeps the latest tab when a kind is open more than once', () => {
    expect(chooseSidebarPanel('terminal', view({
      expanded: true,
      activeKind: 'files',
      tabs: [
        { kind: 'terminal', tabId: 'term-1' },
        { kind: 'terminal', tabId: 'term-2' },
      ],
    }))).toEqual({ type: 'focus', tabId: 'term-2', expand: false })
  })
})
