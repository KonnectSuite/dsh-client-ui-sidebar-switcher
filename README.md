---
description: "Open Changes, Browser, Terminal or Files from conversation-header buttons. Buttons follow the panels currently registered by other plugins. Removing a panel also removes its button."
kind: "package-bundle"
---

# @deepseek-ai/dsh-client-ui-sidebar-switcher

English | [中文](README.zh.md)

<a id="summary"></a>
## Summary

Open Changes, Browser, Terminal or Files from conversation-header buttons. Buttons follow the panels currently registered by other plugins. Removing a panel also removes its button.

<a id="table-of-contents"></a>
## Table of Contents

- [Use this package](#use-this-package)
- [Understand the implementation](#understand-the-implementation)
- [Model Experience](#model-experience)
- [Known Limitations and Deferred Work](#known-limitations-and-deferred-work)
- [Dev Note](#dev-note)

<a id="use-this-package"></a>
## Use this package

Enable the `ui-sidebar-switcher` profile row alongside the right-sidebar panels you want to expose.

<a id="understand-the-implementation"></a>
## Understand the implementation

The client observes panel registrations and contributes header utilities. Changes opens the latest loaded edit review; other buttons focus or open the matching sidebar tab.

See [Host](src/index.ts) and [Client](src/client/index.ts).

<a id="model-experience"></a>
## Model Experience

### Panel selection

#### What the model sees

Buttons update `sidebarRight` presentation only. They register no model-visible prompt, tool schema or tool result.

#### Token effect

Panel selection adds no model input.

#### KV Cache effect

Panel selection does not change the provider request prefix.

## Known Limitations and Deferred Work

<a id="known-limitations-and-deferred-work"></a>

- Changes needs loaded edit history; unavailable panel kinds have no button.

<a id="dev-note"></a>
### Dev Note

<details>
<summary>Maintainer context</summary>

None.

</details>
