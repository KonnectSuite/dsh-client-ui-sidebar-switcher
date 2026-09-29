/** Registration, kind list, and the header button's open path. */
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Context } from '@deepseek-ai/cordis'
import { createSnapshotStore } from '@deepseek-ai/dsh-client-store'
import { apply, inject } from '../src/client/index.ts'
import type { SidebarSwitcherInjected } from '../src/client/SidebarSwitcher.tsx'

const contexts: Context[] = []

afterEach(async () => {
  await Promise.all(contexts.splice(0).map(ctx => ctx.fiber.dispose()))
})

interface Recorded {
  name: string
  id: string
  order: number
  locale?: string
  inject?: () => SidebarSwitcherInjected
}

async function boot(registeredKinds: readonly string[] = ['files', 'terminal']) {
  const ctx = new Context()
  contexts.push(ctx)
  const recorded: Recorded[] = []
  const slots = {
    inject: vi.fn((_name: string, register: () => () => void) => register()),
    register: vi.fn((options: Omit<Recorded, 'inject'> & { inject?: () => SidebarSwitcherInjected }) => {
      recorded.push(options)
      return () => { recorded.splice(recorded.indexOf(options), 1) }
    }),
  }
  const dictionaries = new Map<string, unknown>()
  const locale = {
    register: vi.fn((namespace: string, value: unknown) => {
      dictionaries.set(namespace, value)
      return () => { dictionaries.delete(namespace) }
    }),
  }
  const kinds = new Set(registeredKinds)
  const listeners = new Set<() => void>()
  const tabs = {
    get: (kind: string) => kinds.has(kind) ? { kind } : undefined,
    subscribe: (listener: () => void) => {
      listeners.add(listener)
      return () => { listeners.delete(listener) }
    },
  }
  const openTabs = createSnapshotStore<readonly { sessionId: string; kind: string; tabId: string }[]>([])
  const mounted = createSnapshotStore<string | undefined>(undefined)
  const sidebar = {
    openTabs,
    mounted,
    isExpanded: vi.fn(() => false),
    active: vi.fn(() => undefined as { kind: string } | undefined),
    openTab: vi.fn(),
    openResource: vi.fn(),
    focus: vi.fn(),
    toggleExpanded: vi.fn(),
  }
  const sessions = { binding: vi.fn(() => undefined as {
    eventSource: {
      getSnapshot: () => {
        entries: readonly { type: string; event?: { type: string; seq: number; data?: { turn?: unknown } } }[]
      }
    }
  } | undefined) }
  ctx.provide('slots', slots as never)
  ctx.provide('locale', locale as never)
  ctx.provide('sessions', sessions as never)
  ctx.provide('sidebarRight', sidebar as never)
  ctx.provide('sidebarRightTabs', tabs as never)
  const fiber = ctx.plugin({ inject: [...inject], apply })
  await fiber.await()
  const entry = recorded[0]
  if (entry?.inject === undefined) throw new Error('switcher did not register')
  return { recorded, dictionaries, fiber, sidebar, sessions, openTabs, mounted, kinds, listeners, face: entry.inject() }
}

describe('ui-sidebar-switcher apply', () => {
  it('registers the header buttons and drops the dictionary on dispose', async () => {
    const harness = await boot()
    expect(harness.recorded.map(entry => entry.id)).toEqual(['sidebar-switcher'])
    expect(harness.recorded[0]).toMatchObject({
      name: 'conversation.session.header.utilities',
      order: 40,
      locale: 'sidebarSwitcher',
    })
    expect(harness.dictionaries.has('sidebarSwitcher')).toBe(true)
    expect(harness.face.hooks.kinds.getSnapshot()).toEqual(['terminal', 'files'])
    await harness.fiber.dispose()
    expect(harness.dictionaries.has('sidebarSwitcher')).toBe(false)
  })

  it('adds a button when its page type registers later', async () => {
    const harness = await boot()
    harness.kinds.add('browser')
    for (const listener of harness.listeners) listener()
    expect(harness.face.hooks.kinds.getSnapshot()).toEqual(['browser', 'terminal', 'files'])
  })

  it('opens a missing page, focuses an existing one, and collapses the one already showing', async () => {
    const harness = await boot(['files', 'browser', 'terminal'])
    harness.face.show('files')
    expect(harness.sidebar.openTab).not.toHaveBeenCalled()

    harness.mounted.set('session')
    harness.face.show('files')
    expect(harness.sidebar.openTab).toHaveBeenCalledWith('files')

    harness.openTabs.set([{ sessionId: 'session', kind: 'terminal', tabId: 'term-1' }])
    harness.face.show('terminal')
    expect(harness.sidebar.focus).toHaveBeenCalledWith('term-1')
    expect(harness.sidebar.toggleExpanded).toHaveBeenCalledTimes(1)

    harness.sidebar.isExpanded.mockReturnValue(true)
    harness.sidebar.active.mockReturnValue({ kind: 'terminal' })
    harness.face.show('terminal')
    expect(harness.sidebar.toggleExpanded).toHaveBeenCalledTimes(2)
    expect(harness.sidebar.openTab).toHaveBeenCalledTimes(1)
  })

  it('opens the latest changes review and skips a session with none', async () => {
    const harness = await boot(['changes-review'])
    harness.mounted.set('session')
    harness.face.show('changes-review')
    expect(harness.sidebar.openResource).not.toHaveBeenCalled()

    harness.sessions.binding.mockReturnValue({
      eventSource: { getSnapshot: () => ({ entries: [
        { type: 'event', event: { type: 'workspace/changes', seq: 4, data: { turn: 1 } } },
        { type: 'event', event: { type: 'turn/end', seq: 8, data: {} } },
        { type: 'event', event: { type: 'workspace/changes', seq: 9, data: { turn: 2 } } },
      ] }) },
    })
    harness.face.show('changes-review')
    expect(harness.sidebar.openResource).toHaveBeenCalledWith('dsh-resource://changes-review/session/session/9/2')
    expect(harness.sidebar.openTab).not.toHaveBeenCalled()
  })

  it('ignores a kind whose page type is not registered', async () => {
    const harness = await boot(['files'])
    harness.mounted.set('session')
    harness.face.show('browser')
    expect(harness.sidebar.openTab).not.toHaveBeenCalled()
    expect(harness.sidebar.focus).not.toHaveBeenCalled()
  })
})
