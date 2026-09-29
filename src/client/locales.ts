/** `sidebarSwitcher` namespace dictionaries. */

/** Dictionary namespace owned by this plugin. */
export const NS = 'sidebarSwitcher'

/** Simplified Chinese dictionary (the key-set source of truth). */
export const zh = {
  'switcher.label': '侧栏',
  'panel.changes': '改动',
  'panel.browser': '浏览器',
  'panel.terminal': '终端',
  'panel.files': '文件',
} satisfies Record<string, string>

/** The switcher namespace key union. */
export type SidebarSwitcherKey = keyof typeof zh

/** English dictionary, checked complete against the zh key set. */
export const en = {
  'switcher.label': 'Sidebar',
  'panel.changes': 'Changes',
  'panel.browser': 'Browser',
  'panel.terminal': 'Terminal',
  'panel.files': 'Files',
} satisfies Record<SidebarSwitcherKey, string>
