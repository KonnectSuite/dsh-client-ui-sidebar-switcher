window.__ModuleLoader__.load({
	id: "@deepseek-ai/dsh-client-ui-sidebar-switcher",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let _deepseek_ai_dsh_client_store = require("@deepseek-ai/dsh-client-store");
		let react_jsx_runtime = require("react/jsx-runtime");
		let react = require("react");
		let _deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
		//#region lib/types/client/changes.js
		/** Latest turn review the Changes button can open. */
		/**
		* Address of one turn's review. Matches the address the deliverables plugin claims.
		* @param target - the session, the announcing event, and the turn.
		* @returns a `dsh-resource://changes-review/session/…` address.
		*/
		function changesReviewAddress(target) {
			return `dsh-resource://changes-review/session/${encodeURIComponent(target.sessionId)}/${target.seq}/${target.turn}`;
		}
		/**
		* The newest `workspace/changes` event in the session window the client has loaded.
		* @param sessionId - the session on screen.
		* @param entries - that session's loaded event window, oldest first.
		* @returns the review to open, or undefined when this window recorded no changes.
		*/
		function latestChangesReview(sessionId, entries) {
			for (let index = entries.length - 1; index >= 0; index -= 1) {
				const entry = entries[index];
				if (entry?.type !== "event") continue;
				const event = entry.event;
				if (event?.type !== "workspace/changes") continue;
				const data = event.data;
				const turn = typeof data === "object" && data !== null && "turn" in data ? data.turn : void 0;
				if (typeof turn !== "number" || !Number.isSafeInteger(turn) || turn < 1) continue;
				return {
					sessionId,
					seq: event.seq,
					turn
				};
			}
		}
		//#endregion
		//#region lib/types/client/choose.js
		/** Right-sidebar page kinds this switcher opens, in header order. */
		const PANEL_KINDS = [
			"changes-review",
			"browser",
			"terminal",
			"files"
		];
		/**
		* Decide how a header button opens its panel.
		* A press on the panel already showing collapses it. A press on a kind that
		* already has a tab focuses that tab, expanding the column when it is hidden.
		* Otherwise the kind is opened, which reveals the column.
		* @param kind - the page kind the button owns.
		* @param view - the mounted column.
		* @returns the layout change to apply.
		*/
		function chooseSidebarPanel(kind, view) {
			if (view.expanded && view.activeKind === kind) return { type: "collapse" };
			let existing;
			for (const tab of view.tabs) if (tab.kind === kind) existing = tab.tabId;
			if (existing !== void 0) return {
				type: "focus",
				tabId: existing,
				expand: !view.expanded
			};
			return { type: "open" };
		}
		//#endregion
		//#region lib/types/client/locales.js
		/** `sidebarSwitcher` namespace dictionaries. */
		/** Dictionary namespace owned by this plugin. */
		const NS = "sidebarSwitcher";
		/** Simplified Chinese dictionary (the key-set source of truth). */
		const zh = {
			"switcher.label": "侧栏",
			"panel.changes": "改动",
			"panel.browser": "浏览器",
			"panel.terminal": "终端",
			"panel.files": "文件"
		};
		/** English dictionary, checked complete against the zh key set. */
		const en = {
			"switcher.label": "Sidebar",
			"panel.changes": "Changes",
			"panel.browser": "Browser",
			"panel.terminal": "Terminal",
			"panel.files": "Files"
		};
		//#endregion
		//#region \0dsh-css:C:\Users\KNPhu\.arya\github\KonnectSuite\AryaAI\packages\client\ui-sidebar-switcher\src\client\SidebarSwitcher.module.css.mjs
		const css = "._5UC4Nq_switcher{align-items:center;gap:2px;display:flex}._5UC4Nq_button{border-radius:var(--dsw-radius-sm);width:28px;height:28px;color:var(--dsw-alias-label-secondary);cursor:pointer;background:0 0;border:none;flex:none;justify-content:center;align-items:center;padding:0;display:inline-flex}._5UC4Nq_button:hover,._5UC4Nq_button[aria-pressed=true]{background:var(--dsw-alias-interactive-bg-hover)}._5UC4Nq_button[aria-pressed=true]{color:var(--dsw-alias-label-primary)}";
		const tagId = "@deepseek-ai/dsh-client-ui-sidebar-switcher/SidebarSwitcher.module.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = "@deepseek-ai/dsh-client-ui-sidebar-switcher";
			tag.dataset.pluginCss = tagId;
			tag.textContent = css;
			document.head.appendChild(tag);
		}
		var SidebarSwitcher_module_css_default = {
			"button": "_5UC4Nq_button",
			"switcher": "_5UC4Nq_switcher"
		};
		//#endregion
		//#region lib/types/client/SidebarSwitcher.js
		/** Header buttons that open Files, Browser, and Terminal in the right sidebar. */
		const LABEL = {
			"changes-review": "panel.changes",
			browser: "panel.browser",
			terminal: "panel.terminal",
			files: "panel.files"
		};
		/**
		* Prompt glyph for the terminal button. The shared icon set has no 16px terminal.
		* @param props - square edge in px.
		* @returns a currentColor prompt mark.
		*/
		function IconTerminal({ size = 16 }) {
			return (0, react_jsx_runtime.jsxs)("svg", {
				width: size,
				height: size,
				viewBox: "0 0 16 16",
				fill: "none",
				"aria-hidden": "true",
				children: [(0, react_jsx_runtime.jsx)("path", {
					d: "M3.2 4.6 6.5 8 3.2 11.4",
					stroke: "currentColor",
					strokeWidth: "1.2",
					strokeLinecap: "round",
					strokeLinejoin: "round"
				}), (0, react_jsx_runtime.jsx)("path", {
					d: "M8 11.4h4.8",
					stroke: "currentColor",
					strokeWidth: "1.2",
					strokeLinecap: "round"
				})]
			});
		}
		const ICON = {
			"changes-review": _deepseek_ai_dsh_client_ui_primitives.IconCompareSplitOutlineRegular,
			browser: _deepseek_ai_dsh_client_ui_primitives.IconGlobeOutlineRegular,
			terminal: IconTerminal,
			files: _deepseek_ai_dsh_client_ui_primitives.IconFolderOpenOutlineRegular
		};
		/**
		* Changes, Browser, Terminal, and Files buttons for the conversation header.
		* A kind is omitted while its page type is not registered, so unplugging
		* that panel removes its button.
		* @param props - registered kinds, the live column, and the open action.
		* @returns the button row, or null when no panel is available.
		*/
		function SidebarSwitcher(props) {
			const kinds = props.useKinds((list) => list);
			props.useOpenTabs((list) => list);
			props.useMounted((id) => id);
			const [revision, setRevision] = (0, react.useState)(0);
			(0, react.useEffect)(() => {
				const bump = () => {
					setRevision((value) => value + 1);
				};
				const observer = new MutationObserver(bump);
				observer.observe(document.body, {
					subtree: true,
					attributes: true,
					attributeFilter: ["data-sidebar-right-open", "aria-selected"]
				});
				return () => {
					observer.disconnect();
				};
			}, []);
			const expanded = props.panelOpen();
			const active = props.activeKind();
			const visible = PANEL_KINDS.filter((kind) => kinds.includes(kind));
			if (visible.length === 0) return null;
			return (0, react_jsx_runtime.jsx)("div", {
				className: SidebarSwitcher_module_css_default.switcher,
				role: "group",
				"aria-label": props.t("switcher.label"),
				"data-sidebar-switcher": "",
				children: visible.map((kind) => {
					const Icon = ICON[kind];
					const label = props.t(LABEL[kind]);
					const pressed = expanded && active === kind;
					return (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Tooltip, {
						label,
						side: "bottom",
						delayMs: 500,
						children: (0, react_jsx_runtime.jsx)("button", {
							type: "button",
							className: SidebarSwitcher_module_css_default.button,
							"aria-label": label,
							"aria-pressed": pressed,
							"data-sidebar-switcher": kind,
							onClick: () => {
								props.show(kind);
							},
							children: (0, react_jsx_runtime.jsx)(Icon, { size: 16 })
						})
					}, kind);
				})
			});
		}
		//#endregion
		//#region lib/types/client/index.js
		/** Services this plugin waits for. The buttons need the slot registry, copy, and the right sidebar. */
		const inject = [
			"slots",
			"locale",
			"sessions",
			"sidebarRight",
			"sidebarRightTabs"
		];
		/** Empty kind list shared by every snapshot that has nothing registered. */
		const NO_KINDS = [];
		/**
		* Open or collapse one right-sidebar page from a header button.
		* A kind that is not registered, or a press while no session is on screen, does nothing.
		* @param ctx - client root context.
		* @param kind - the page kind the button owns.
		*/
		function showPanel(ctx, kind) {
			if (ctx.sidebarRightTabs.get(kind) === void 0) return;
			const sidebar = ctx.sidebarRight;
			const sessionId = sidebar.mounted.getSnapshot();
			if (sessionId === void 0) return;
			const choice = chooseSidebarPanel(kind, {
				expanded: sidebar.isExpanded(),
				activeKind: sidebar.active()?.kind,
				tabs: sidebar.openTabs.getSnapshot().filter((tab) => tab.sessionId === sessionId).map((tab) => ({
					kind: tab.kind,
					tabId: tab.tabId
				}))
			});
			if (choice.type === "collapse") {
				sidebar.toggleExpanded();
				return;
			}
			if (choice.type === "open") {
				if (kind === "changes-review") {
					openLatestChanges(ctx, sessionId);
					return;
				}
				sidebar.openTab(kind);
				return;
			}
			sidebar.focus(choice.tabId);
			if (choice.expand) sidebar.toggleExpanded();
		}
		/**
		* Open the newest loaded changes review for one session.
		* A session with no recorded edits, or one whose history is not open, is left alone.
		* @param ctx - client root context.
		* @param sessionId - the session on screen.
		*/
		function openLatestChanges(ctx, sessionId) {
			const review = latestChangesReview(sessionId, ctx.sessions.binding(sessionId)?.eventSource.getSnapshot().entries ?? []);
			if (review === void 0) return;
			ctx.sidebarRight.openResource(changesReviewAddress(review));
		}
		/**
		* Register the header buttons and drop them when this plugin disposes.
		* @param ctx - client root context.
		*/
		function apply(ctx) {
			ctx.effect(() => ctx.locale.register(NS, {
				zh,
				en
			}), "ui-sidebar-switcher: dictionaries");
			const kinds = (0, _deepseek_ai_dsh_client_store.createSnapshotStore)(NO_KINDS);
			const publish = () => {
				const next = PANEL_KINDS.filter((kind) => ctx.sidebarRightTabs.get(kind) !== void 0);
				const current = kinds.getSnapshot();
				if (next.length === current.length && next.every((kind, index) => kind === current[index])) return;
				kinds.set(next.length === 0 ? NO_KINDS : next);
			};
			ctx.effect(() => {
				publish();
				return ctx.sidebarRightTabs.subscribe(publish);
			}, "ui-sidebar-switcher: kinds");
			ctx.slots.inject("conversation.session.header.utilities", () => ctx.slots.register({
				name: "conversation.session.header.utilities",
				id: "sidebar-switcher",
				order: 40,
				locale: NS,
				inject: () => ({
					hooks: {
						kinds,
						openTabs: ctx.sidebarRight.openTabs,
						mounted: ctx.sidebarRight.mounted
					},
					show: (kind) => {
						showPanel(ctx, kind);
					},
					panelOpen: () => ctx.sidebarRight.isExpanded(),
					activeKind: () => ctx.sidebarRight.active()?.kind
				})
			}, SidebarSwitcher));
		}
		//#endregion
		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});

//# sourceMappingURL=client.js.map