---
description: "通过对话标题栏按钮打开 Changes、Browser、Terminal 或 Files。按钮跟随其他插件当前注册的面板。移除面板也会移除其按钮。"
kind: "package-reference"
---

# @deepseek-ai/dsh-client-ui-sidebar-switcher

[English](README.md) | 中文

<a id="summary"></a>
## 概述

通过对话标题栏按钮打开 Changes、Browser、Terminal 或 Files。按钮跟随其他插件当前注册的面板。移除面板也会移除其按钮。

<a id="table-of-contents"></a>
## 目录

- [Use this package](#use-this-package)
- [Understand the implementation](#understand-the-implementation)
- [Model Experience](#model-experience)
- [Known Limitations and Deferred Work](#known-limitations-and-deferred-work)
- [Dev Note](#dev-note)

<a id="use-this-package"></a>
## 使用本包

将 `ui-sidebar-switcher` 配置条目与需要展示的右侧边栏面板一起启用。

<a id="understand-the-implementation"></a>
## 理解实现

客户端观察面板注册并贡献标题栏工具。Changes 打开最近已加载的编辑审查；其他按钮聚焦或打开对应侧边栏标签。

参见 [Host](src/index.ts) 和 [Client](src/client/index.ts).

<a id="model-experience"></a>
## 模型体验

### Panel selection

#### What the model sees

按钮仅更新 `sidebarRight` 展示状态，不注册模型可见的提示词、工具 schema 或工具结果。

#### Token effect

面板选择不增加模型输入。

#### KV Cache effect

面板选择不改变提供商请求前缀。

## 已知限制与延期工作

<a id="known-limitations-and-deferred-work"></a>

- Changes 需要已加载的编辑历史；不可用的面板类型没有按钮。

<a id="dev-note"></a>
### 开发备注

<details>
<summary>维护者上下文</summary>

无。

</details>
