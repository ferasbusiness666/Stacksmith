export const studioHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Stacksmith Studio</title>
    <style>
      :root {
        color-scheme: dark;
        --bg-app: #0d0d0d;
        --bg-sidebar: #0b0b0b;
        --bg-panel: #171717;
        --bg-panel-hover: #1d1d1d;
        --bg-panel-quiet: #111111;
        --border-soft: #242424;
        --border-subtle: #1a1a1a;
        --text-primary: #e6e6e6;
        --text-secondary: #a3a3a3;
        --text-muted: #707070;
        --text-faint: #4d4d4d;
        --accent: #4b8df7;
        --accent-soft: rgba(75, 141, 247, 0.16);
        --accent-border: rgba(75, 141, 247, 0.48);
        --button-light: var(--accent);
        --button-icon-dark: #1c1c1c;
        --blue: #4b8df7;
        --green: #3f9f73;
        --debug: #c95f4a;
        --slate: #8b95a1;
        --danger: #e06f6f;
        --success: #55b88a;
      }

      body[data-theme="light"] {
        color-scheme: light;
        --bg-app: #f3f4f6;
        --bg-sidebar: #ebeef2;
        --bg-panel: #ffffff;
        --bg-panel-hover: #eef1f5;
        --bg-panel-quiet: #f7f8fa;
        --border-soft: #d7dde5;
        --border-subtle: #e5e9ef;
        --text-primary: #171a20;
        --text-secondary: #5f6874;
        --text-muted: #7c8794;
        --text-faint: #a3acb7;
        --button-light: #171a20;
        --button-icon-dark: #ffffff;
      }

      body[data-accent="blue"] {
        --accent: #4b8df7;
        --accent-soft: rgba(75, 141, 247, 0.16);
        --accent-border: rgba(75, 141, 247, 0.48);
        --button-light: #4b8df7;
      }

      body[data-accent="green"] {
        --accent: #59b883;
        --accent-soft: rgba(89, 184, 131, 0.16);
        --accent-border: rgba(89, 184, 131, 0.48);
        --button-light: #59b883;
      }

      body[data-accent="slate"] {
        --accent: #9aa4af;
        --accent-soft: rgba(154, 164, 175, 0.16);
        --accent-border: rgba(154, 164, 175, 0.48);
        --button-light: #9aa4af;
      }

      * {
        box-sizing: border-box;
      }

      html,
      body {
        height: 100%;
        min-width: 320px;
      }

      body {
        margin: 0;
        background: var(--bg-app);
        color: var(--text-primary);
        font-family:
          Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        line-height: 1.5;
        letter-spacing: 0;
      }

      button,
      textarea,
      input,
      select {
        font: inherit;
      }

      button {
        border: 0;
      }

      .app {
        display: grid;
        grid-template-columns: 300px minmax(0, 1fr);
        height: 100vh;
        overflow: hidden;
      }

      .sidebar {
        background: var(--bg-sidebar);
        border-right: 1px solid var(--border-subtle);
        display: flex;
        flex-direction: column;
        min-width: 0;
        padding: 14px 16px 12px;
      }

      .brand {
        align-items: center;
        display: flex;
        gap: 10px;
        min-height: 36px;
        margin-bottom: 20px;
      }

      .brand-mark {
        align-items: center;
        background: var(--bg-panel);
        border: 1px solid var(--border-soft);
        border-radius: 7px;
        display: inline-flex;
        font-size: 13px;
        font-weight: 700;
        height: 30px;
        justify-content: center;
        width: 30px;
      }

      .brand strong {
        display: block;
        font-size: 14px;
        line-height: 1.1;
      }

      .brand span {
        color: var(--text-secondary);
        display: block;
        font-size: 13px;
      }

      .icon {
        height: 16px;
        width: 16px;
        stroke-width: 1.75;
      }

      .nav-button,
      .history-row,
      .settings-button,
      .settings-nav button,
      .back-button {
        align-items: center;
        background: transparent;
        border-radius: 8px;
        color: var(--text-primary);
        cursor: pointer;
        display: flex;
        gap: 10px;
        min-height: 32px;
        padding: 0 2px;
        text-align: left;
        transition: background-color 120ms ease, color 120ms ease, border-color 120ms ease;
        width: 100%;
      }

      .nav-button:hover,
      .history-row:hover,
      .settings-button:hover,
      .settings-nav button:hover,
      .back-button:hover,
      .history-row.active,
      .settings-nav button.active {
        background: var(--bg-panel);
      }

      .nav-button {
        font-size: 14px;
        font-weight: 600;
      }

      .history {
        flex: 1;
        min-height: 0;
        overflow-y: auto;
        padding: 18px 0 10px;
      }

      .history::-webkit-scrollbar,
      .thread::-webkit-scrollbar,
      .modal-scroll::-webkit-scrollbar {
        width: 8px;
      }

      .history::-webkit-scrollbar-thumb,
      .thread::-webkit-scrollbar-thumb,
      .modal-scroll::-webkit-scrollbar-thumb {
        background: var(--border-soft);
        border-radius: 999px;
      }

      .section-label {
        color: var(--text-faint);
        font-size: 14px;
        font-weight: 400;
        margin: 0 0 10px;
      }

      .history-empty {
        color: var(--text-muted);
        font-size: 14px;
        margin: 0;
      }

      .history-list {
        display: grid;
        gap: 2px;
      }

      .history-item {
        align-items: center;
        border-radius: 8px;
        display: grid;
        grid-template-columns: minmax(0, 1fr) 32px;
        padding: 0 4px;
        position: relative;
        width: 100%;
      }

      .history-item:hover,
      .history-item.active,
      .history-item.menu-open {
        background: var(--bg-panel);
      }

      .history-item.drag-over {
        outline: 1px solid var(--accent-border);
      }

      .history-row {
        background: transparent;
        gap: 10px;
        min-height: 44px;
        padding: 4px 4px 4px 8px;
      }

      .history-row:hover,
      .history-row.active {
        background: transparent;
      }

      .history-row .icon {
        flex: 0 0 auto;
        margin-left: 2px;
      }

      .history-main {
        flex: 1;
        min-width: 0;
      }

      .history-title {
        color: var(--text-secondary);
        display: block;
        font-size: 14px;
        font-weight: 500;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .history-meta {
        color: var(--text-muted);
        display: block;
        font-size: 12px;
        margin-top: 1px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .history-row.active .history-title {
        color: var(--text-primary);
      }

      .history-menu-button {
        align-items: center;
        background: transparent;
        border: 1px solid transparent;
        border-radius: 7px;
        color: var(--text-muted);
        cursor: pointer;
        display: inline-flex;
        height: 28px;
        justify-content: center;
        justify-self: end;
        opacity: 0;
        place-self: center;
        width: 28px;
      }

      .history-item:hover .history-menu-button,
      .history-item.menu-open .history-menu-button {
        opacity: 1;
      }

      .history-menu-button:hover {
        background: var(--bg-panel-hover);
        border-color: var(--border-soft);
        color: var(--text-primary);
      }

      .history-menu {
        background: var(--bg-panel);
        border: 1px solid var(--border-soft);
        border-radius: 9px;
        display: none;
        min-width: 132px;
        padding: 5px;
        position: absolute;
        right: 4px;
        top: 38px;
        z-index: 60;
      }

      .history-item.menu-open .history-menu {
        display: block;
      }

      .history-menu button {
        background: transparent;
        border-radius: 7px;
        color: var(--danger);
        cursor: pointer;
        font-size: 13px;
        min-height: 30px;
        padding: 0 8px;
        text-align: left;
        width: 100%;
      }

      .history-menu button:hover {
        background: rgba(224, 111, 111, 0.12);
      }

      .sidebar-bottom {
        margin-top: auto;
        padding-top: 12px;
      }

      .settings-button {
        font-size: 14px;
        font-weight: 500;
        min-height: 36px;
      }

      .main {
        background: var(--bg-app);
        min-width: 0;
        position: relative;
      }

      .view {
        display: none;
        height: 100vh;
        min-width: 0;
      }

      .view.active {
        display: grid;
      }

      .chat-view {
        grid-template-rows: minmax(0, 1fr) auto;
        position: relative;
      }

      .thread {
        min-height: 0;
        overflow-y: auto;
        padding: 40px 32px 156px;
        scroll-padding-bottom: 196px;
      }

      .thread-inner {
        margin: 0 auto;
        max-width: 820px;
      }

      .empty-state {
        align-items: center;
        display: flex;
        min-height: calc(100vh - 240px);
        justify-content: center;
        text-align: center;
      }

      .empty-state h1 {
        color: var(--text-primary);
        font-size: 28px;
        font-weight: 600;
        letter-spacing: -0.02em;
        line-height: 1.2;
        margin: 0;
      }

      .message {
        align-items: flex-start;
        display: flex;
        flex-direction: column;
        gap: 7px;
        margin-bottom: 18px;
      }

      .message.user {
        align-items: flex-end;
      }

      .message-meta {
        color: var(--text-muted);
        font-size: 12px;
        font-weight: 600;
      }

      .bubble,
      .blueprint-panel,
      .generated-panel {
        background: var(--bg-panel);
        border: 1px solid var(--border-soft);
        border-radius: 12px;
        color: var(--text-primary);
        padding: 13px 14px;
      }

      .bubble {
        max-width: min(78%, 680px);
        width: fit-content;
      }

      .message.user .bubble {
        background: var(--bg-panel-hover);
      }

      .message.error .bubble {
        border-color: rgba(224, 111, 111, 0.6);
        color: var(--danger);
      }

      .bubble p,
      .blueprint-panel p,
      .generated-panel p {
        margin: 0;
        overflow-wrap: anywhere;
        white-space: pre-wrap;
      }

      .message.pending .bubble p {
        animation: pending-sheen 1.45s linear infinite;
        background: linear-gradient(90deg, var(--text-secondary), var(--text-primary), var(--text-secondary));
        background-size: 220% 100%;
        color: transparent;
        -webkit-background-clip: text;
        background-clip: text;
      }

      @keyframes pending-sheen {
        from {
          background-position: 220% 0;
        }

        to {
          background-position: -220% 0;
        }
      }

      .blueprint-panel h2,
      .generated-panel h2 {
        font-size: 18px;
        margin: 0 0 8px;
      }

      .blueprint-panel {
        margin: 0 auto 18px;
        max-width: 1040px;
        padding: 18px;
        width: 100%;
      }

      .blueprint-header {
        align-items: start;
        display: grid;
        gap: 16px;
        grid-template-columns: minmax(0, 1fr) auto;
        margin-bottom: 16px;
      }

      .blueprint-title {
        display: grid;
        gap: 6px;
      }

      .blueprint-title h2 {
        font-size: 22px;
        margin: 0;
      }

      .blueprint-chips {
        display: flex;
        flex-wrap: wrap;
        gap: 7px;
        justify-content: flex-end;
      }

      .blueprint-chip {
        background: var(--bg-panel-quiet);
        border: 1px solid var(--border-soft);
        border-radius: 999px;
        color: var(--text-secondary);
        font-size: 12px;
        padding: 5px 8px;
      }

      .blueprint-summary {
        color: var(--text-secondary);
        margin: 0;
        max-width: 760px;
      }

      .generated-grid {
        display: grid;
        gap: 16px;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        margin-top: 14px;
      }

      .generated-section {
        border-top: 1px solid var(--border-soft);
        min-width: 0;
        padding-top: 10px;
      }

      .generated-section h3 {
        font-size: 13px;
        margin: 0 0 8px;
      }

      .command-list,
      .file-list {
        color: var(--text-secondary);
        display: grid;
        gap: 8px;
        list-style: none;
        margin: 0;
        padding: 0;
      }

      .command-list li {
        display: grid;
        gap: 3px;
        min-width: 0;
      }

      .command-list code,
      .file-list code,
      .generated-panel code {
        overflow-wrap: anywhere;
        white-space: normal;
      }

      .command-list span {
        color: var(--text-muted);
        font-size: 12px;
        overflow-wrap: anywhere;
      }

      .blueprint-grid {
        display: grid;
        gap: 12px;
        grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
        margin-top: 14px;
      }

      .blueprint-section {
        border-top: 1px solid var(--border-soft);
        padding-top: 10px;
      }

      .blueprint-section h3 {
        font-size: 13px;
        margin: 0 0 6px;
      }

      .blueprint-section ul {
        color: var(--text-secondary);
        margin: 0;
        padding-left: 18px;
      }

      .panel-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        justify-content: flex-end;
        margin-top: 14px;
      }

      .composer-dock {
        padding: 0 32px 28px;
        position: relative;
        z-index: 20;
      }

      .composer-dock.hidden {
        display: none;
      }

      .composer-group {
        isolation: isolate;
        margin: 0 auto;
        max-width: 728px;
        --mode-accent: var(--blue);
        padding-top: 14px;
        position: relative;
        width: min(728px, 100%);
      }

      .composer-group::before {
        background: var(--mode-accent);
        border-radius: 999px;
        content: "";
        filter: blur(18px);
        height: 16px;
        left: 0;
        opacity: 0.28;
        pointer-events: none;
        position: absolute;
        right: 0;
        top: 0;
      }

      .composer-group::after {
        background: radial-gradient(ellipse at top, color-mix(in srgb, var(--mode-accent) 32%, transparent), transparent 66%);
        content: "";
        filter: blur(24px);
        height: 74px;
        left: -8px;
        opacity: 0.12;
        pointer-events: none;
        position: absolute;
        right: -8px;
        top: 2px;
        z-index: -1;
      }

      .composer-group[data-mode="build"] {
        --mode-accent: var(--green);
      }

      .composer-group[data-mode="debug"] {
        --mode-accent: var(--debug);
      }

      .composer-group[data-mode="chat"] {
        --mode-accent: var(--slate);
      }

      .composer {
        background: var(--bg-panel);
        border: 1px solid color-mix(in srgb, var(--mode-accent) 42%, var(--border-soft));
        border-bottom: 0;
        border-radius: 16px 16px 0 0;
        box-shadow: 0 -1px 18px color-mix(in srgb, var(--mode-accent) 18%, transparent);
        overflow: visible;
        position: relative;
      }

      .composer.hidden {
        display: none;
      }

      .composer-input-area {
        min-height: 92px;
        padding: 14px 10px 10px;
      }

      textarea {
        background: transparent;
        border: 0;
        color: var(--text-primary);
        display: block;
        font-size: 15px;
        line-height: 1.45;
        min-height: 68px;
        outline: none;
        resize: none;
        width: 100%;
      }

      textarea::placeholder,
      input::placeholder {
        color: var(--text-muted);
      }

      .composer-bottom {
        align-items: center;
        border-top: 1px solid var(--border-soft);
        display: flex;
        gap: 10px;
        justify-content: space-between;
        min-height: 44px;
        padding: 7px 8px 7px 14px;
      }

      .composer-left,
      .composer-right {
        align-items: center;
        display: flex;
        gap: 8px;
        min-width: 0;
      }

      .ghost-button,
      .model-button,
      .mode-button,
      .icon-button {
        align-items: center;
        background: transparent;
        border: 1px solid var(--border-soft);
        border-radius: 7px;
        color: var(--text-secondary);
        cursor: pointer;
        display: inline-flex;
        gap: 6px;
        min-height: 28px;
        padding: 0 7px;
        transition: background-color 120ms ease, color 120ms ease;
      }

      .ghost-button:hover,
      .model-button:hover,
      .mode-button:hover,
      .icon-button:hover {
        background: var(--bg-panel-hover);
        color: var(--text-primary);
      }

      .model-button {
        font-size: 13px;
        max-width: 260px;
      }

      .command-mode-select {
        background: transparent;
        border: 1px solid var(--border-soft);
        border-radius: 7px;
        color: var(--text-secondary);
        cursor: pointer;
        font-size: 12px;
        min-height: 28px;
        padding: 0 6px;
        width: auto;
      }

      .command-mode-select:hover {
        background: var(--bg-panel-hover);
        border-color: var(--accent-border);
        color: var(--text-primary);
      }

      .model-button strong,
      .mode-button strong {
        color: var(--text-primary);
        font-weight: 600;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .model-button span {
        color: var(--text-muted);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .mode-control {
        position: relative;
      }

      .mode-button {
        font-size: 13px;
        font-weight: 600;
      }

      .mode-button.mode-blueprint {
        color: var(--blue);
      }

      .mode-button.mode-build {
        color: var(--green);
      }

      .mode-button.mode-debug {
        color: var(--debug);
      }

      .mode-button.mode-chat {
        color: var(--slate);
      }

      .mode-menu {
        background: var(--bg-panel);
        border: 1px solid var(--border-soft);
        border-radius: 10px;
        bottom: 36px;
        display: none;
        min-width: 180px;
        padding: 6px;
        position: absolute;
        right: 0;
        z-index: 100;
      }

      .mode-menu.active {
        display: grid;
      }

      .mode-option {
        align-items: center;
        background: transparent;
        border-radius: 7px;
        color: var(--text-secondary);
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        min-height: 32px;
        padding: 0 8px;
        text-align: left;
      }

      .mode-option:hover,
      .mode-option.active {
        background: var(--bg-panel-hover);
        color: var(--text-primary);
      }

      .mode-option.active {
        outline: 1px solid var(--mode-accent, var(--accent-border));
      }

      .mode-dot {
        border-radius: 999px;
        display: inline-block;
        height: 8px;
        width: 8px;
      }

      .send-button {
        align-items: center;
        background: var(--button-light);
        border: 1px solid var(--accent-border);
        border-radius: 999px;
        color: var(--button-icon-dark);
        cursor: pointer;
        display: inline-flex;
        height: 30px;
        justify-content: center;
        width: 30px;
      }

      .send-button:hover {
        filter: brightness(1.12);
      }

      .send-button:disabled {
        cursor: default;
        filter: none;
        opacity: 0.55;
      }

      .primary-button:disabled,
      .secondary-button:disabled,
      .workdir-button:disabled,
      .project-settings-inline:disabled {
        cursor: default;
        opacity: 0.55;
      }

      .project-row {
        align-items: center;
        background: var(--bg-panel-quiet);
        border: 1px solid var(--border-soft);
        border-top: 0;
        border-radius: 0 0 16px 16px;
        color: var(--text-secondary);
        display: flex;
        gap: 8px;
        justify-content: space-between;
        min-height: 42px;
        padding: 0 8px 0 14px;
        width: 100%;
      }

      .blueprint-actions-composer {
        background: var(--bg-panel);
        border: 1px solid var(--border-soft);
        border-bottom: 0;
        border-radius: 16px 16px 0 0;
        display: none;
        gap: 8px;
        padding: 12px;
      }

      .blueprint-actions-composer.active {
        display: grid;
      }

      .blueprint-actions-composer .primary-button,
      .blueprint-actions-composer .secondary-button {
        justify-content: center;
        width: 100%;
      }

      .workdir-button,
      .project-settings-inline {
        align-items: center;
        background: transparent;
        border: 1px solid var(--border-soft);
        border-radius: 7px;
        color: var(--text-secondary);
        cursor: pointer;
        display: inline-flex;
        gap: 8px;
        min-height: 28px;
        min-width: 0;
        padding: 0 7px;
      }

      .workdir-button {
        flex: 1;
      }

      .workdir-button:hover,
      .project-settings-inline:hover {
        background: var(--bg-panel-hover);
        border-color: var(--border-soft);
        color: var(--text-primary);
      }

      .workdir-button span {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .composer-status {
        align-items: center;
        color: var(--text-muted);
        display: flex;
        font-size: 12px;
        justify-content: space-between;
        margin-top: 9px;
        min-height: 18px;
        padding: 0 4px;
      }

      .composer-status strong {
        color: var(--text-secondary);
        font-weight: 500;
      }

      .settings-view {
        grid-template-columns: 224px minmax(0, 1fr);
      }

      .settings-sidebar {
        background: var(--bg-sidebar);
        border-right: 1px solid var(--border-subtle);
        padding: 14px 8px;
      }

      .back-button {
        color: var(--text-secondary);
        margin-bottom: 24px;
        padding: 0 8px;
      }

      .settings-nav {
        display: grid;
        gap: 4px;
      }

      .settings-nav button {
        color: var(--text-primary);
        font-size: 14px;
        font-weight: 500;
        min-height: 32px;
        padding: 0 10px;
      }

      .settings-content {
        margin: 0 auto;
        max-width: 820px;
        overflow-y: auto;
        padding: 72px 34px;
        width: 100%;
      }

      .settings-panel {
        display: none;
      }

      .settings-panel.active {
        display: block;
      }

      .settings-heading {
        align-items: center;
        display: flex;
        gap: 16px;
        justify-content: space-between;
        margin-bottom: 30px;
      }

      .settings-heading h2,
      .settings-panel h2 {
        font-size: 22px;
        line-height: 1.2;
        margin: 0 0 28px;
      }

      .settings-heading h2 {
        margin: 0;
      }

      .settings-group {
        margin-bottom: 30px;
      }

      .settings-group h3 {
        font-size: 14px;
        margin: 0 0 10px;
      }

      .setting-row,
      .provider-row {
        align-items: center;
        background: var(--bg-panel);
        border: 1px solid var(--border-soft);
        border-bottom: 0;
        display: grid;
        gap: 18px;
        grid-template-columns: minmax(0, 1fr) minmax(220px, 320px);
        padding: 14px 13px;
      }

      .setting-row:first-of-type,
      .provider-row:first-of-type {
        border-radius: 9px 9px 0 0;
      }

      .setting-row:last-of-type,
      .provider-row:last-of-type {
        border-bottom: 1px solid var(--border-soft);
        border-radius: 0 0 9px 9px;
      }

      .setting-row:only-of-type,
      .provider-row:only-of-type {
        border-radius: 9px;
      }

      .setting-row strong,
      .provider-row strong {
        display: block;
        font-size: 13px;
      }

      .setting-row span,
      .provider-row span {
        color: var(--text-secondary);
        display: block;
        font-size: 12px;
        margin-top: 3px;
      }

      .setting-value {
        color: var(--text-secondary);
        font-size: 13px;
        text-align: right;
      }

      input,
      select {
        background: var(--bg-app);
        border: 1px solid var(--border-soft);
        border-radius: 8px;
        color: var(--text-primary);
        outline: none;
        padding: 9px 10px;
        width: 100%;
      }

      input:focus,
      select:focus,
      textarea:focus {
        outline: 1px solid var(--accent-border);
        outline-offset: 1px;
      }

      .primary-button,
      .secondary-button {
        align-items: center;
        border-radius: 9px;
        cursor: pointer;
        display: inline-flex;
        font-size: 13px;
        font-weight: 700;
        gap: 8px;
        justify-content: center;
        min-height: 38px;
        padding: 8px 12px;
      }

      .primary-button {
        border: 1px solid var(--accent-border);
        background: var(--button-light);
        color: var(--button-icon-dark);
      }

      .secondary-button {
        background: var(--bg-panel-hover);
        border: 1px solid var(--border-soft);
        color: var(--text-primary);
      }

      .primary-button:hover {
        filter: brightness(1.08);
      }

      .secondary-button:hover,
      .option-button:hover,
      .swatch:hover {
        border-color: var(--accent-border);
      }

      .row-actions,
      .panel-actions {
        align-items: center;
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        justify-content: flex-end;
      }

      .settings-panel > .primary-button {
        display: flex;
        margin-left: auto;
        width: fit-content;
      }

      .segmented,
      .swatches {
        display: flex;
        gap: 8px;
        justify-content: flex-end;
      }

      .option-button,
      .swatch {
        background: var(--bg-panel-hover);
        border: 1px solid var(--border-soft);
        border-radius: 8px;
        color: var(--text-primary);
        cursor: pointer;
        font-size: 13px;
        min-height: 36px;
        padding: 7px 10px;
      }

      .option-button.active,
      .swatch.active {
        border-color: var(--button-light);
        color: var(--accent);
      }

      .swatch::before {
        border-radius: 999px;
        content: "";
        display: inline-block;
        height: 10px;
        margin-right: 7px;
        width: 10px;
      }

      .swatch[data-accent-choice="blue"]::before {
        background: var(--blue);
      }

      .swatch[data-accent-choice="green"]::before {
        background: var(--green);
      }

      .swatch[data-accent-choice="slate"]::before {
        background: var(--slate);
      }

      .notice {
        color: var(--text-secondary);
        font-size: 13px;
        margin: 12px 0 0;
      }

      .notice.error {
        color: var(--danger);
      }

      .notice.success {
        color: var(--success);
      }

      code {
        background: var(--bg-panel-hover);
        border: 1px solid var(--border-soft);
        border-radius: 6px;
        color: var(--text-secondary);
        display: inline-block;
        font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
        font-size: 12px;
        padding: 3px 6px;
      }

      .modal-backdrop {
        align-items: center;
        background: rgba(0, 0, 0, 0.52);
        display: none;
        inset: 0;
        justify-content: center;
        padding: 24px;
        position: fixed;
        z-index: 50;
      }

      .modal-backdrop.active {
        display: flex;
      }

      .modal {
        background: var(--bg-panel);
        border: 1px solid var(--border-soft);
        border-radius: 14px;
        max-height: min(720px, calc(100vh - 48px));
        max-width: 560px;
        overflow: hidden;
        width: min(560px, 100%);
      }

      .modal.large {
        max-width: 760px;
        width: min(760px, 100%);
      }

      .modal.danger-modal {
        border-color: rgba(224, 111, 111, 0.55);
      }

      .danger-button {
        background: #9f3838;
        border: 1px solid rgba(224, 111, 111, 0.7);
        color: #fff;
      }

      .danger-button:hover {
        filter: brightness(1.08);
      }

      .modal-header {
        align-items: center;
        border-bottom: 1px solid var(--border-soft);
        display: flex;
        justify-content: space-between;
        padding: 14px 16px;
      }

      .modal-header h2 {
        font-size: 15px;
        margin: 0;
      }

      .modal-scroll {
        max-height: calc(100vh - 150px);
        overflow-y: auto;
        padding: 16px;
      }

      .modal-grid {
        display: grid;
        gap: 12px;
      }

      .modal-grid label {
        display: grid;
        gap: 6px;
      }

      .modal-grid label span {
        color: var(--text-secondary);
        font-size: 12px;
      }

      .provider-fields {
        display: none;
      }

      .provider-fields.active {
        display: grid;
      }

      .model-search {
        margin-bottom: 12px;
      }

      .model-list {
        border: 1px solid var(--border-soft);
        border-radius: 10px;
        display: grid;
        max-height: 360px;
        overflow-y: auto;
      }

      .model-row {
        align-items: center;
        background: transparent;
        border-bottom: 1px solid var(--border-soft);
        color: var(--text-primary);
        cursor: pointer;
        display: grid;
        gap: 12px;
        grid-template-columns: minmax(0, 1fr) auto;
        min-height: 42px;
        padding: 9px 11px;
        text-align: left;
        width: 100%;
      }

      .model-row:last-child {
        border-bottom: 0;
      }

      .model-row:hover,
      .model-row.active {
        background: var(--bg-panel-hover);
      }

      .model-name {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .model-provider {
        color: var(--text-muted);
        font-size: 12px;
      }

      .custom-model {
        border-top: 1px solid var(--border-soft);
        display: grid;
        gap: 10px;
        grid-template-columns: 160px minmax(0, 1fr) auto;
        margin-top: 14px;
        padding-top: 14px;
      }

      @media (max-width: 980px) {
        .app,
        .settings-view {
          grid-template-columns: 260px minmax(0, 1fr);
        }

        .composer-right {
          gap: 4px;
        }

        .model-button {
          max-width: 190px;
        }
      }

      @media (max-width: 760px) {
        .app,
        .settings-view {
          grid-template-columns: 1fr;
        }

        .sidebar {
          display: none;
        }

        .setting-row,
        .provider-row,
        .custom-model {
          grid-template-columns: 1fr;
        }

        .composer-bottom {
          align-items: stretch;
          flex-direction: column;
        }

        .composer-left,
        .composer-right {
          justify-content: space-between;
          width: 100%;
        }
      }
    </style>
  </head>
  <body data-theme="dark" data-accent="blue">
    <div class="app">
      <aside class="sidebar" aria-label="Stacksmith navigation">
        <div class="brand">
          <div class="brand-mark" aria-hidden="true">S</div>
          <div>
            <strong>Stacksmith</strong>
            <span>Local studio</span>
          </div>
        </div>

        <button class="nav-button" id="new-chat" type="button">
          <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-linecap="round" />
          </svg>
          <span>New Chat</span>
        </button>

        <div class="history" aria-label="Chat history">
          <p class="section-label">Chats</p>
          <div class="history-list" id="session-list"></div>
        </div>

        <div class="sidebar-bottom">
          <button class="settings-button" id="open-settings" type="button">
            <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" fill="none" stroke="currentColor" />
              <path d="M19.4 15a1.8 1.8 0 0 0 .36 1.98l.04.04a2 2 0 0 1-2.83 2.83l-.04-.04A1.8 1.8 0 0 0 15 19.4a1.8 1.8 0 0 0-1 .6 1.8 1.8 0 0 0-.4 1.1V21a2 2 0 0 1-4 0v-.1A1.8 1.8 0 0 0 8.5 19.3a1.8 1.8 0 0 0-1.98.36l-.04.04a2 2 0 1 1-2.83-2.83l.04-.04A1.8 1.8 0 0 0 4.6 15a1.8 1.8 0 0 0-.6-1 1.8 1.8 0 0 0-1.1-.4H3a2 2 0 0 1 0-4h.1A1.8 1.8 0 0 0 4.7 8.5a1.8 1.8 0 0 0-.36-1.98l-.04-.04a2 2 0 1 1 2.83-2.83l.04.04A1.8 1.8 0 0 0 9 4.6a1.8 1.8 0 0 0 1-.6 1.8 1.8 0 0 0 .4-1.1V3a2 2 0 0 1 4 0v.1A1.8 1.8 0 0 0 15.5 4.7a1.8 1.8 0 0 0 1.98-.36l.04-.04a2 2 0 1 1 2.83 2.83l-.04.04A1.8 1.8 0 0 0 19.4 9c.2.4.4.7.6 1 .3.3.7.4 1.1.4h.1a2 2 0 0 1 0 4h-.1c-.4 0-.8.1-1.1.4-.3.2-.5.5-.6.2Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span>Settings</span>
          </button>
        </div>
      </aside>

      <main class="main">
        <section class="view chat-view active" id="chat-view" aria-label="Chat workspace">
          <section class="thread" id="thread" aria-live="polite"></section>

          <section class="composer-dock" aria-label="Composer">
            <div class="composer-group" id="composer-group" data-mode="blueprint">
              <form class="composer" id="prompt-form">
                <div class="composer-input-area">
                  <textarea id="prompt" name="prompt" placeholder="Ask Stacksmith what to build, debug, or change..."></textarea>
                </div>
                <div class="composer-bottom">
                  <div class="composer-left">
                    <button class="model-button" id="open-model-picker" type="button">
                      <strong id="model-label">llama3.1</strong>
                      <span id="model-provider-label">Ollama</span>
                    </button>
                    <select class="command-mode-select" id="composer-command-mode" aria-label="Command mode">
                      <option value="never">Don't run</option>
                      <option value="manual">Ask first</option>
                      <option value="auto-safe">Auto-approve</option>
                    </select>
                  </div>
                  <div class="composer-right">
                    <div class="mode-control">
                      <button class="mode-button mode-blueprint" id="mode-button" type="button">
                        <strong id="mode-label">Blueprint</strong>
                        <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                      </button>
                      <div class="mode-menu" id="mode-menu" role="menu">
                        <button class="mode-option active" type="button" data-mode-option="blueprint"><span>Blueprint</span><span class="mode-dot" style="background: var(--blue)"></span></button>
                        <button class="mode-option" type="button" data-mode-option="build"><span>Build</span><span class="mode-dot" style="background: var(--green)"></span></button>
                        <button class="mode-option" type="button" data-mode-option="debug"><span>Debug</span><span class="mode-dot" style="background: var(--debug)"></span></button>
                        <button class="mode-option" type="button" data-mode-option="chat"><span>Chat</span><span class="mode-dot" style="background: var(--slate)"></span></button>
                      </div>
                    </div>
                    <button class="send-button" id="send-button" type="submit" aria-label="Send">
                      <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M12 19V5m0 0-6 6m6-6 6 6" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
                    </button>
                  </div>
                </div>
              </form>
              <div class="blueprint-actions-composer" id="blueprint-actions">
                <button class="primary-button" id="approve-blueprint-build" type="button">Approve the blueprint and build</button>
                <button class="secondary-button" id="revise-blueprint" type="button">No, tell me what to change</button>
              </div>
              <div class="project-row">
                <button class="workdir-button" id="workdir-button" type="button">
                  <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4 7.5h6l2 2h8v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-10Z" fill="none" stroke="currentColor" stroke-linejoin="round" />
                  </svg>
                  <span id="project-row-label">Choose work directory</span>
                </button>
                <button class="project-settings-inline" type="button" id="project-settings-button" aria-label="Project settings">
                  <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" fill="none" stroke="currentColor" />
                    <path d="M19.4 15a1.8 1.8 0 0 0 .36 1.98l.04.04a2 2 0 0 1-2.83 2.83l-.04-.04A1.8 1.8 0 0 0 15 19.4a1.8 1.8 0 0 0-1 .6 1.8 1.8 0 0 0-.4 1.1V21a2 2 0 0 1-4 0v-.1A1.8 1.8 0 0 0 8.5 19.3a1.8 1.8 0 0 0-1.98.36l-.04.04a2 2 0 1 1-2.83-2.83l.04-.04A1.8 1.8 0 0 0 4.6 15a1.8 1.8 0 0 0-.6-1 1.8 1.8 0 0 0-1.1-.4H3a2 2 0 0 1 0-4h.1A1.8 1.8 0 0 0 4.7 8.5a1.8 1.8 0 0 0-.36-1.98l-.04-.04a2 2 0 1 1 2.83-2.83l.04.04A1.8 1.8 0 0 0 9 4.6a1.8 1.8 0 0 0 1-.6 1.8 1.8 0 0 0 .4-1.1V3a2 2 0 0 1 4 0v.1A1.8 1.8 0 0 0 15.5 4.7a1.8 1.8 0 0 0 1.98-.36l.04-.04a2 2 0 1 1 2.83 2.83l-.04.04A1.8 1.8 0 0 0 19.4 9c.2.4.4.7.6 1 .3.3.7.4 1.1.4h.1a2 2 0 0 1 0 4h-.1c-.4 0-.8.1-1.1.4-.3.2-.5.5-.6.2Z" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </button>
              </div>
              <div class="composer-status">
                <span id="token-usage"><strong>Tokens</strong> ~0</span>
                <span id="context-usage"><strong>Context</strong> ~0 / 128k (0%)</span>
              </div>
            </div>
          </section>
        </section>

        <section class="view settings-view" id="settings-view" aria-label="Settings">
          <aside class="settings-sidebar" aria-label="Settings navigation">
            <button class="back-button" id="back-to-chat" type="button">
              <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M15 18 9 12l6-6" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              <span>Back to chat</span>
            </button>
            <p class="section-label">Settings</p>
            <nav class="settings-nav">
              <button class="active" type="button" data-settings="general">General</button>
              <button type="button" data-settings="appearance">Appearance</button>
              <button type="button" data-settings="providers">Providers</button>
              <button type="button" data-settings="database">Database</button>
              <button type="button" data-settings="safety">Safety</button>
              <button type="button" data-settings="mcp">MCP</button>
              <button type="button" data-settings="skills">Skills</button>
              <button type="button" data-settings="local-server">Local Server</button>
            </nav>
          </aside>

          <div class="settings-content">
            <section class="settings-panel active" data-panel="general">
              <h2>General</h2>
              <div class="settings-group">
                <h3>Workspace</h3>
                <div class="setting-row">
                  <div><strong>Generated projects folder</strong><span>Generated apps stay outside Stacksmith core.</span></div>
                  <input id="workspace-path" />
                </div>
                <div class="setting-row">
                  <div><strong>Chat history</strong><span>Current chats live in this browser session only.</span></div>
                  <div class="setting-value">Session only</div>
                </div>
              </div>
              <button class="primary-button" type="button" id="save-general">Save General</button>
              <p class="notice" id="general-status"></p>
            </section>

            <section class="settings-panel" data-panel="appearance">
              <h2>Appearance</h2>
              <div class="settings-group">
                <h3>Theme</h3>
                <div class="setting-row">
                  <div><strong>Color mode</strong><span>Stored as local non-secret settings.</span></div>
                  <div class="segmented">
                    <button class="option-button" type="button" data-theme-choice="light">Light</button>
                    <button class="option-button active" type="button" data-theme-choice="dark">Dark</button>
                  </div>
                </div>
                <div class="setting-row">
                  <div><strong>Accent color</strong><span>Changes selected controls and primary actions.</span></div>
                  <div class="swatches">
                    <button class="swatch active" type="button" data-accent-choice="blue">Blue</button>
                    <button class="swatch" type="button" data-accent-choice="green">Green</button>
                    <button class="swatch" type="button" data-accent-choice="slate">Slate</button>
                  </div>
                </div>
              </div>
            </section>

            <section class="settings-panel" data-panel="providers">
              <div class="settings-heading">
                <h2>Providers</h2>
                <button class="primary-button" type="button" id="add-provider">Add provider</button>
              </div>
              <div class="settings-group">
                <h3>Connected providers</h3>
                <div class="provider-row">
                  <div><strong>Ollama</strong><span id="ollama-provider-summary">Local provider at http://127.0.0.1:11434</span></div>
                  <div class="row-actions">
                    <button class="secondary-button" type="button" data-test-provider="ollama">Test</button>
                    <button class="secondary-button" type="button" data-configure-provider="ollama">Configure</button>
                  </div>
                </div>
                <div class="provider-row">
                  <div><strong>OpenRouter</strong><span id="openrouter-provider-summary">API key not saved</span></div>
                  <div class="row-actions">
                    <button class="secondary-button" type="button" data-test-provider="openrouter">Test</button>
                    <button class="secondary-button" type="button" data-configure-provider="openrouter">Replace key</button>
                  </div>
                </div>
              </div>
              <p class="notice" id="provider-status"></p>
            </section>

            <section class="settings-panel" data-panel="database">
              <h2>Database</h2>
              <div class="settings-group">
                <h3>Data mode</h3>
                <div class="setting-row">
                  <div><strong>Database mode</strong><span>No database and SQLite-ready generation are available.</span></div>
                  <select id="database-mode">
                    <option value="none">No database</option>
                    <option value="sqlite">SQLite-ready</option>
                  </select>
                </div>
                <div class="setting-row">
                  <div><strong>Supabase</strong><span>Planned later. Nothing is connected in this MVP.</span></div>
                  <div class="setting-value">Not implemented yet</div>
                </div>
              </div>
              <button class="primary-button" type="button" id="save-database">Save Database</button>
            </section>

            <section class="settings-panel" data-panel="safety">
              <h2>Safety</h2>
              <div class="settings-group">
                <h3>Command execution</h3>
                <div class="setting-row">
                  <div><strong>Command mode</strong><span>Auto-safe still requires checker AI review before any future command execution.</span></div>
                  <select id="command-mode">
                    <option value="never">Never run commands</option>
                    <option value="manual">Manual approval</option>
                    <option value="auto-safe">Auto-approve safe commands</option>
                  </select>
                </div>
                <div class="setting-row">
                  <div><strong>Review a command</strong><span>Local policy review only. Stacksmith does not run the command here.</span></div>
                  <input id="command-review-input" placeholder="npm install" />
                </div>
              </div>
              <div class="panel-actions">
                <button class="primary-button" type="button" id="save-safety">Save Safety</button>
                <button class="secondary-button" type="button" id="review-command">Review command</button>
              </div>
              <p class="notice" id="command-review-result"></p>
            </section>

            <section class="settings-panel" data-panel="mcp">
              <h2>MCP</h2>
              <div class="settings-group">
                <h3>Servers</h3>
                <div class="setting-row">
                  <div><strong>MCP server connections</strong><span>Future extension point for tools and services.</span></div>
                  <div class="setting-value">Not implemented yet</div>
                </div>
              </div>
            </section>

            <section class="settings-panel" data-panel="skills">
              <h2>Skills</h2>
              <div class="settings-group">
                <h3>Skill packs</h3>
                <div class="setting-row">
                  <div><strong>Local skills</strong><span>Future extension point for reusable build behaviors.</span></div>
                  <div class="setting-value">Not implemented yet</div>
                </div>
              </div>
            </section>

            <section class="settings-panel" data-panel="local-server">
              <h2>Local Server</h2>
              <div class="settings-group">
                <h3>Runtime</h3>
                <div class="setting-row">
                  <div><strong>Server scope</strong><span>Runs only when manually started from the CLI.</span></div>
                  <div class="setting-value">127.0.0.1:4317</div>
                </div>
                <div class="setting-row">
                  <div><strong>Health route</strong><span>Local readiness endpoint.</span></div>
                  <div class="setting-value">/health</div>
                </div>
              </div>
            </section>
          </div>
        </section>
      </main>
    </div>

    <div class="modal-backdrop" id="project-modal" role="dialog" aria-modal="true" aria-labelledby="project-modal-title">
      <div class="modal">
        <div class="modal-header">
          <h2 id="project-modal-title">Project settings</h2>
          <button class="icon-button" type="button" data-close-modal="project-modal" aria-label="Close">Close</button>
        </div>
        <div class="modal-scroll">
            <div class="modal-grid">
              <label><span>Project name</span><input id="project-name" placeholder="Invoice dashboard" /></label>
              <label><span>Database mode</span><select id="project-database"><option value="none">No database</option><option value="sqlite">SQLite-ready</option></select></label>
              <label><span>Work directory</span><input id="project-workdir" placeholder="C:\\Users\\You\\Projects" /></label>
              <div class="panel-actions">
                <button class="secondary-button" type="button" id="copy-project-workdir">Copy path</button>
                <button class="secondary-button" type="button" id="browse-project-workdir">Browse</button>
                <button class="secondary-button" type="button" data-close-modal="project-modal">Cancel</button>
                <button class="primary-button" type="button" id="save-project-settings">Save project settings</button>
              </div>
            <p class="notice" id="project-modal-status"></p>
          </div>
        </div>
      </div>
    </div>

    <div class="modal-backdrop" id="workdir-modal" role="dialog" aria-modal="true" aria-labelledby="workdir-modal-title">
      <div class="modal">
        <div class="modal-header">
          <h2 id="workdir-modal-title">Work directory</h2>
          <button class="icon-button" type="button" data-close-modal="workdir-modal" aria-label="Close">Close</button>
        </div>
        <div class="modal-scroll">
          <div class="modal-grid">
            <label><span>Folder path</span><input id="workdir-path" placeholder="C:\\Users\\You\\Stacksmith\\projects" /></label>
            <div class="panel-actions">
              <button class="secondary-button" type="button" id="copy-workdir">Copy</button>
              <button class="secondary-button" type="button" id="browse-workdir">Browse</button>
              <button class="secondary-button" type="button" data-close-modal="workdir-modal">Cancel</button>
              <button class="primary-button" type="button" id="save-workdir">Save work directory</button>
            </div>
            <p class="notice" id="workdir-modal-status"></p>
          </div>
        </div>
      </div>
    </div>

    <div class="modal-backdrop" id="delete-chat-modal" role="dialog" aria-modal="true" aria-labelledby="delete-chat-title">
      <div class="modal danger-modal">
        <div class="modal-header">
          <h2 id="delete-chat-title">Delete chat?</h2>
        </div>
        <div class="modal-scroll">
          <p class="notice">Are you sure you want to delete this chat? This only removes it from the current Stacksmith session.</p>
          <div class="panel-actions">
            <button class="secondary-button" type="button" data-close-modal="delete-chat-modal">Cancel</button>
            <button class="primary-button danger-button" type="button" id="confirm-delete-chat">Delete chat</button>
          </div>
          <p class="notice error" id="delete-chat-status"></p>
        </div>
      </div>
    </div>

    <div class="modal-backdrop" id="provider-modal" role="dialog" aria-modal="true" aria-labelledby="provider-modal-title">
      <div class="modal">
        <div class="modal-header">
          <h2 id="provider-modal-title">Add provider</h2>
          <button class="icon-button" type="button" data-close-modal="provider-modal" aria-label="Close">Close</button>
        </div>
        <div class="modal-scroll">
          <div class="modal-grid">
            <label><span>Provider</span><select id="provider-modal-type"><option value="ollama">Ollama</option><option value="openrouter">OpenRouter</option></select></label>
            <div class="provider-fields active" id="provider-fields-ollama">
              <label><span>Ollama URL</span><input id="provider-ollama-url" placeholder="http://127.0.0.1:11434" /></label>
            </div>
            <div class="provider-fields" id="provider-fields-openrouter">
              <label><span>OpenRouter API key</span><input id="provider-openrouter-key" type="password" placeholder="Paste a new key" /></label>
            </div>
            <div class="panel-actions">
              <button class="secondary-button" type="button" data-close-modal="provider-modal">Cancel</button>
              <button class="secondary-button" type="button" id="test-provider-config">Test</button>
              <button class="primary-button" type="button" id="save-provider-config">Save provider</button>
            </div>
            <p class="notice" id="provider-modal-status"></p>
          </div>
        </div>
      </div>
    </div>

    <div class="modal-backdrop" id="model-modal" role="dialog" aria-modal="true" aria-labelledby="model-modal-title">
      <div class="modal large">
        <div class="modal-header">
          <h2 id="model-modal-title">Select model</h2>
          <button class="icon-button" type="button" data-close-modal="model-modal" aria-label="Close">Close</button>
        </div>
        <div class="modal-scroll">
          <input class="model-search" id="model-search" placeholder="Search models..." />
          <div class="model-list" id="model-list"></div>
          <div class="custom-model">
            <select id="custom-model-provider"><option value="ollama">Ollama</option><option value="openrouter">OpenRouter</option></select>
            <input id="custom-model-id" placeholder="Custom model id" />
            <button class="secondary-button" id="use-custom-model" type="button">Use custom</button>
          </div>
          <p class="notice" id="model-status"></p>
        </div>
      </div>
    </div>

    <script>
      const modeConfig = {
        blueprint: { label: "Blueprint", className: "mode-blueprint", help: "Plan first before writing files." },
        build: { label: "Build", className: "mode-build", help: "Build now without showing a blueprint review." },
        debug: { label: "Debug", className: "mode-debug", help: "Diagnose errors without writing files." },
        chat: { label: "Chat", className: "mode-chat", help: "Ask questions without generating files." },
      };

      const body = document.body;
      const chatView = document.getElementById("chat-view");
      const settingsView = document.getElementById("settings-view");
      const thread = document.getElementById("thread");
      const composerDock = document.querySelector(".composer-dock");
      const promptForm = document.getElementById("prompt-form");
      const promptInput = document.getElementById("prompt");
      const sendButton = document.getElementById("send-button");
      const blueprintActions = document.getElementById("blueprint-actions");
      const composerCommandMode = document.getElementById("composer-command-mode");
      const composerGroup = document.getElementById("composer-group");
      const modeButton = document.getElementById("mode-button");
      const modeMenu = document.getElementById("mode-menu");
      const modeLabel = document.getElementById("mode-label");
      const sessionList = document.getElementById("session-list");
      const modelLabel = document.getElementById("model-label");
      const modelProviderLabel = document.getElementById("model-provider-label");
      const projectRowLabel = document.getElementById("project-row-label");
      const tokenUsage = document.getElementById("token-usage");
      const contextUsage = document.getElementById("context-usage");
      const settingsButtons = Array.from(document.querySelectorAll("[data-settings]"));
      const settingsPanels = Array.from(document.querySelectorAll("[data-panel]"));
      const themeButtons = Array.from(document.querySelectorAll("[data-theme-choice]"));
      const accentButtons = Array.from(document.querySelectorAll("[data-accent-choice]"));

      let settings = null;
      let sessions = [];
      let activeSessionId = null;
      let activeMode = "blueprint";
      let activeProvider = "ollama";
      let activeModel = "llama3.1";
      let availableModels = [];
      let chatCounter = 1;
      let draggedSessionId = null;
      let pendingDeleteSessionId = null;
      let projectModalMode = "edit";
      let historyLoaded = false;
      const contextLimit = 128000;

      function escapeHtml(value) {
        return String(value)
          .replaceAll("&", "&amp;")
          .replaceAll("<", "&lt;")
          .replaceAll(">", "&gt;")
          .replaceAll('"', "&quot;")
          .replaceAll("'", "&#039;");
      }

      function formatText(value) {
        return escapeHtml(value).replace(/\\n/g, "<br>");
      }

      function friendlyError(error) {
        return error instanceof Error ? error.message : String(error);
      }

      async function api(path, options) {
        const response = await fetch(path, {
          ...options,
          headers: {
            "Content-Type": "application/json",
            ...(options && options.headers ? options.headers : {}),
          },
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Request failed.");
        }
        return data;
      }

      function activeSession() {
        return sessions.find((session) => session.id === activeSessionId) || null;
      }

      function nowIso() {
        return new Date().toISOString();
      }

      function touchSession(session) {
        if (session) {
          session.updatedAt = nowIso();
        }
      }

      function syncActiveModelToSession(session) {
        if (!session) return;
        session.provider = activeProvider;
        session.model = activeModel;
        touchSession(session);
      }

      function applySessionModel(session) {
        if (!session) return;
        activeProvider = session.provider || activeProvider;
        activeModel = session.model || (activeProvider === "openrouter" ? settings.openRouterModel : settings.ollamaModel);
        renderModelLabel();
      }

      function serializeHistory() {
        return {
          version: 1,
          activeSessionId,
          sessions: sessions.map((session) => ({
            ...session,
            messages: session.messages.filter((message) => !message.pending),
          })),
        };
      }

      async function persistHistory() {
        if (!historyLoaded) return;
        try {
          await api("/api/history", { method: "POST", body: JSON.stringify(serializeHistory()) });
        } catch (error) {
          console.warn("Stacksmith history could not be saved:", friendlyError(error));
        }
      }

      function hydrateSession(session) {
        return {
          id: session.id,
          title: session.title || "New chat",
          createdAt: session.createdAt || nowIso(),
          updatedAt: session.updatedAt || nowIso(),
          workDirectory: session.workDirectory || (settings ? settings.workspacePath : ""),
          workDirectoryLocked: session.workDirectoryLocked === true,
          generatedProjectPath: session.generatedProjectPath || "",
          databaseMode: session.databaseMode === "sqlite" ? "sqlite" : "none",
          provider: session.provider === "openrouter" ? "openrouter" : "ollama",
          model: session.model || (session.provider === "openrouter" ? "openai/gpt-4o-mini" : "llama3.1"),
          mode: modeConfig[session.mode] ? session.mode : "blueprint",
          messages: Array.isArray(session.messages) ? session.messages : [],
          blueprint: session.blueprint || null,
          awaitingBlueprintDecision: session.awaitingBlueprintDecision === true,
          refiningBlueprint: session.refiningBlueprint === true,
          generatedProject: session.generatedProject || null,
        };
      }

      async function loadHistoryState() {
        const history = await api("/api/history", { method: "GET" });
        sessions = Array.isArray(history.sessions) ? history.sessions.map(hydrateSession) : [];
        activeSessionId = sessions.some((session) => session.id === history.activeSessionId)
          ? history.activeSessionId
          : sessions[0]?.id || null;
        chatCounter = sessions.length + 1;
        const session = activeSession();
        if (session) {
          applySessionModel(session);
          setMode(session.mode);
        } else {
          setMode("blueprint");
        }
        historyLoaded = true;
        showChat();
        renderSessionList();
        renderThread();
      }

      function showChat() {
        chatView.classList.add("active");
        settingsView.classList.remove("active");
        scrollThreadToBottom();
      }

      function showSettings(panel) {
        chatView.classList.remove("active");
        settingsView.classList.add("active");
        showSettingsPanel(panel || "general");
      }

      function showSettingsPanel(panel) {
        settingsButtons.forEach((button) => button.classList.toggle("active", button.getAttribute("data-settings") === panel));
        settingsPanels.forEach((section) => section.classList.toggle("active", section.getAttribute("data-panel") === panel));
      }

      function openModal(id) {
        document.getElementById(id).classList.add("active");
      }

      function closeModal(id) {
        document.getElementById(id).classList.remove("active");
        if (id === "project-modal") {
          projectModalMode = "edit";
        }
      }

      function scrollThreadToBottom() {
        requestAnimationFrame(() => {
          thread.scrollTop = thread.scrollHeight;
        });
      }

      function setMode(mode) {
        activeMode = modeConfig[mode] ? mode : "blueprint";
        const config = modeConfig[activeMode];
        modeLabel.textContent = config.label;
        composerGroup.setAttribute("data-mode", activeMode);
        modeButton.className = "mode-button " + config.className;
        document.querySelectorAll("[data-mode-option]").forEach((button) => {
          button.classList.toggle("active", button.getAttribute("data-mode-option") === activeMode);
        });
        const session = activeSession();
        if (session) {
          session.mode = activeMode;
          touchSession(session);
          renderSessionList();
          renderProjectRow();
          persistHistory();
        }
      }

      function renderSessionList() {
        if (!sessions.length) {
          sessionList.innerHTML = '<p class="history-empty">No chats yet</p>';
          return;
        }

        sessionList.innerHTML = sessions
          .map((session) => {
            const active = session.id === activeSessionId ? " active" : "";
            return (
              '<div class="history-item' + active + '" draggable="true" data-session-item="' + escapeHtml(session.id) + '">' +
              '<button class="history-row' + active + '" type="button" data-session-id="' + escapeHtml(session.id) + '">' +
              '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5h14v10H8l-3 3V5Z" fill="none" stroke="currentColor" stroke-linejoin="round" /></svg>' +
              '<span class="history-main"><span class="history-title">' + escapeHtml(session.title) + '</span>' +
              '<span class="history-meta">' + escapeHtml(session.databaseMode) + " / " + escapeHtml(modeConfig[session.mode].label) + '</span></span>' +
              '</button>' +
              '<button class="history-menu-button" type="button" data-chat-menu="' + escapeHtml(session.id) + '" aria-label="Chat options">' +
              '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5.5v.01M12 12v.01M12 18.5v.01" fill="none" stroke="currentColor" stroke-linecap="round" /></svg>' +
              '</button>' +
              '<div class="history-menu"><button type="button" data-delete-session="' + escapeHtml(session.id) + '">Delete chat</button></div>' +
              '</div>'
            );
          })
          .join("");

        document.querySelectorAll(".history-row[data-session-id]").forEach((button) => {
          button.addEventListener("click", () => selectSession(button.getAttribute("data-session-id")));
        });
        document.querySelectorAll("[data-chat-menu]").forEach((button) => {
          button.addEventListener("click", (event) => {
            event.stopPropagation();
            toggleHistoryMenu(button.getAttribute("data-chat-menu"));
          });
        });
        document.querySelectorAll("[data-delete-session]").forEach((button) => {
          button.addEventListener("click", (event) => {
            event.stopPropagation();
            openDeleteChatModal(button.getAttribute("data-delete-session"));
          });
        });
        document.querySelectorAll("[data-session-item]").forEach((item) => {
          item.addEventListener("dragstart", (event) => {
            draggedSessionId = item.getAttribute("data-session-item");
            event.dataTransfer.effectAllowed = "move";
          });
          item.addEventListener("dragover", (event) => {
            event.preventDefault();
            item.classList.add("drag-over");
          });
          item.addEventListener("dragleave", () => item.classList.remove("drag-over"));
          item.addEventListener("drop", (event) => {
            event.preventDefault();
            item.classList.remove("drag-over");
            reorderSession(draggedSessionId, item.getAttribute("data-session-item"));
            draggedSessionId = null;
          });
        });
      }

      function toggleHistoryMenu(sessionId) {
        document.querySelectorAll(".history-item").forEach((item) => {
          item.classList.toggle("menu-open", item.getAttribute("data-session-item") === sessionId && !item.classList.contains("menu-open"));
        });
      }

      function closeHistoryMenus() {
        document.querySelectorAll(".history-item.menu-open").forEach((item) => item.classList.remove("menu-open"));
      }

      function reorderSession(sourceId, targetId) {
        if (!sourceId || !targetId || sourceId === targetId) return;
        const fromIndex = sessions.findIndex((session) => session.id === sourceId);
        const toIndex = sessions.findIndex((session) => session.id === targetId);
        if (fromIndex === -1 || toIndex === -1) return;
        const next = [...sessions];
        const moved = next.splice(fromIndex, 1)[0];
        next.splice(toIndex, 0, moved);
        sessions = next;
        renderSessionList();
        persistHistory();
      }

      function selectSession(id) {
        activeSessionId = id;
        const session = activeSession();
        if (session) {
          applySessionModel(session);
          setMode(session.mode);
        }
        showChat();
        renderSessionList();
        renderThread();
        renderProjectRow();
        persistHistory();
      }

      function renderProjectRow() {
        const session = activeSession();
        if (!session) {
          projectRowLabel.textContent = "Choose work directory";
          renderUsage();
          return;
        }
        const label = session.workDirectory || (settings ? settings.workspacePath : "Choose work directory");
        projectRowLabel.textContent = (session.workDirectoryLocked ? "Locked: " : "Work in: ") + label;
        renderUsage();
      }

      function estimateTokens(text) {
        const trimmed = String(text || "").trim();
        return trimmed ? Math.max(1, Math.ceil(trimmed.length / 4)) : 0;
      }

      function estimateSessionUsage(session) {
        const tokens = session
          ? session.messages.reduce((total, message) => total + estimateTokens(message.text), 0)
          : 0;
        const percent = Math.min(100, Math.round((tokens / contextLimit) * 100));
        return { tokens, percent };
      }

      function formatCompactNumber(value) {
        if (value >= 1000) {
          return (value / 1000).toFixed(value >= 10000 ? 0 : 1).replace(/\\.0$/, "") + "k";
        }
        return String(value);
      }

      function renderUsage() {
        const usage = estimateSessionUsage(activeSession());
        tokenUsage.innerHTML = "<strong>Tokens</strong> ~" + formatCompactNumber(usage.tokens);
        contextUsage.innerHTML =
          "<strong>Context</strong> ~" + formatCompactNumber(usage.tokens) + " / " + formatCompactNumber(contextLimit) + " (" + usage.percent + "%)";
      }

      function renderComposerState() {
        const session = activeSession();
        composerDock.classList.toggle("hidden", !session);
        if (!session) {
          promptForm.classList.add("hidden");
          blueprintActions.classList.remove("active");
          promptInput.disabled = true;
          renderUsage();
          return;
        }
        const waitingForBlueprintDecision = !!(session && session.blueprint && session.awaitingBlueprintDecision && !session.generatedProject);
        promptForm.classList.toggle("hidden", waitingForBlueprintDecision);
        blueprintActions.classList.toggle("active", waitingForBlueprintDecision);
        promptInput.disabled = waitingForBlueprintDecision;
        promptInput.placeholder =
          session && session.refiningBlueprint
            ? "Tell Stacksmith what to change in the blueprint..."
            : "Ask Stacksmith what to build, debug, or change...";
      }

      function renderThread() {
        const session = activeSession();
        if (!session) {
          thread.innerHTML = '<div class="thread-inner"><div class="empty-state no-chat-state"></div></div>';
          chatView.classList.add("empty");
          renderProjectRow();
          renderComposerState();
          return;
        }

        if (!session.messages.length && !session.blueprint && !session.generatedProject) {
          thread.innerHTML = '<div class="thread-inner"><div class="empty-state"><h1>What should we work on?</h1></div></div>';
          chatView.classList.add("empty");
          renderProjectRow();
          renderComposerState();
          return;
        }

        chatView.classList.remove("empty");
        let html = session.messages
          .map((message) => {
            const label = message.role === "user" ? "You" : "Stacksmith";
            const tone = message.error ? " error" : "";
            const pending = message.pending ? " pending" : "";
            return (
              '<article class="message ' + message.role + tone + pending + '">' +
              '<div class="message-meta">' + label + '</div>' +
              '<div class="bubble"><p>' + formatText(message.text) + '</p></div>' +
              '</article>'
            );
          })
          .join("");

        if (session.blueprint) {
          html += renderBlueprint(session.blueprint);
        }
        if (session.generatedProject) {
          html += renderGeneratedProject(session.generatedProject);
        }

        thread.innerHTML = '<div class="thread-inner">' + html + '</div>';
        renderProjectRow();
        renderComposerState();
        scrollThreadToBottom();
      }

      function renderBlueprint(blueprint) {
        return (
          '<article class="blueprint-panel">' +
          '<div class="blueprint-header">' +
          '<div class="blueprint-title">' +
          '<p class="message-meta">Blueprint ready</p>' +
          '<h2>' + escapeHtml(blueprint.projectName) + '</h2>' +
          '<p class="blueprint-summary">' + escapeHtml(blueprint.summary) + '</p>' +
          '</div>' +
          '<div class="blueprint-chips">' +
          '<span class="blueprint-chip">' + escapeHtml(blueprint.databaseMode) + '</span>' +
          '<span class="blueprint-chip">' + escapeHtml((blueprint.generatedStack || []).slice(0, 3).join(" / ") || "React / Vite / TypeScript") + '</span>' +
          '</div>' +
          '</div>' +
          '<div class="blueprint-grid">' +
          renderList("Stack", blueprint.generatedStack) +
          renderList("Screens", blueprint.screens) +
          renderList("Components", blueprint.components) +
          renderList("Data model", blueprint.dataModels) +
          renderList("API routes", blueprint.apiRoutes) +
          renderList("File plan", blueprint.fileStructure) +
          renderList("Environment", blueprint.envVars && blueprint.envVars.length ? blueprint.envVars : ["No environment variables planned yet"]) +
          renderList("Risks / unknowns", (blueprint.risks || []).concat(blueprint.unclearRequirements || [])) +
          renderList("Not generated yet", blueprint.notGeneratedYet) +
          '</div>' +
          '</article>'
        );
      }

      function renderList(title, items) {
        const safeItems = Array.isArray(items) && items.length ? items : ["Not specified"];
        return (
          '<section class="blueprint-section"><h3>' + escapeHtml(title) + '</h3><ul>' +
          safeItems.map((item) => '<li>' + escapeHtml(item) + '</li>').join("") +
          '</ul></section>'
        );
      }

      function renderGeneratedProject(project) {
        const commands = Array.isArray(project.runCommands) ? project.runCommands : [];
        const files = Array.isArray(project.files) ? project.files : [];
        return (
          '<article class="generated-panel">' +
          '<p class="message-meta">Generated locally</p>' +
          '<h2>Project generated</h2>' +
          '<p><code>' + escapeHtml(project.projectPath) + '</code></p>' +
          '<div class="generated-grid">' +
          '<section class="generated-section"><h3>Run manually</h3><ul class="command-list">' +
          commands.map((item) => '<li><code>' + escapeHtml(item.command) + '</code><span>' + escapeHtml(item.cwd) + '</span></li>').join("") +
          '</ul></section>' +
          '<section class="generated-section"><h3>Files written</h3><ul class="file-list">' +
          files.slice(0, 16).map((file) => '<li><code>' + escapeHtml(file) + '</code></li>').join("") +
          '</ul></section>' +
          '</div>' +
          '</article>'
        );
      }

      async function loadSettings() {
        settings = await api("/api/settings", { method: "GET" });
        applySettingsToUi();
      }

      function applySettingsToUi() {
        if (!settings) return;
        body.setAttribute("data-theme", settings.theme);
        body.setAttribute("data-accent", settings.accent);
        document.getElementById("workspace-path").value = settings.workspacePath;
        document.getElementById("project-database").value = settings.databaseMode;
        document.getElementById("database-mode").value = settings.databaseMode;
        document.getElementById("command-mode").value = settings.commandMode;
        composerCommandMode.value = settings.commandMode;
        document.getElementById("provider-ollama-url").value = settings.ollamaUrl;
        document.getElementById("ollama-provider-summary").textContent = "Local provider at " + settings.ollamaUrl;
        document.getElementById("openrouter-provider-summary").textContent = settings.openRouterKeySaved
          ? "API key saved. Key value is hidden."
          : "API key not saved.";
        activeProvider = settings.provider;
        activeModel = activeProvider === "openrouter" ? settings.openRouterModel : settings.ollamaModel;
        renderModelLabel();
        themeButtons.forEach((button) => button.classList.toggle("active", button.getAttribute("data-theme-choice") === settings.theme));
        accentButtons.forEach((button) => button.classList.toggle("active", button.getAttribute("data-accent-choice") === settings.accent));
      }

      function renderModelLabel() {
        modelLabel.textContent = activeModel || "Select model";
        modelProviderLabel.textContent = activeProvider === "openrouter" ? "OpenRouter" : "Ollama";
      }

      async function saveSettings(patch) {
        settings = await api("/api/settings", { method: "POST", body: JSON.stringify({ settings: patch }) });
        applySettingsToUi();
        return settings;
      }

      async function saveActiveModel() {
        const patch = { provider: activeProvider };
        if (activeProvider === "openrouter") {
          patch.openRouterModel = activeModel;
        } else {
          patch.ollamaModel = activeModel;
        }
        await saveSettings(patch);
      }

      function providerHistoryForSession(session) {
        return session.messages
          .filter((message) => {
            return (
              (message.role === "user" || message.role === "assistant") &&
              message.memory !== false &&
              !message.pending &&
              !message.error &&
              typeof message.text === "string" &&
              message.text.trim()
            );
          })
          .map((message) => ({ role: message.role, text: message.text.trim() }));
      }

      function lockWorkDirectoryForSession(session) {
        if (!session || session.workDirectoryLocked) return;
        session.workDirectory = session.workDirectory || (settings ? settings.workspacePath : "");
        session.workDirectoryLocked = true;
      }

      async function submitPrompt(prompt) {
        const trimmed = prompt.trim();
        if (!trimmed) return;
        const session = activeSession();
        if (!session) return;

        const history = providerHistoryForSession(session);
        lockWorkDirectoryForSession(session);
        syncActiveModelToSession(session);
        session.messages.push({ role: "user", text: trimmed, memory: true });
        session.messages.push({ role: "assistant", text: loadingMessageForMode(activeMode), pending: true, memory: false });
        session.blueprint = null;
        session.awaitingBlueprintDecision = false;
        session.refiningBlueprint = false;
        session.generatedProject = null;
        touchSession(session);
        renderThread();
        persistHistory();
        sendButton.disabled = true;

        try {
          await saveActiveModel();
          if (activeMode === "chat" || activeMode === "debug") {
            const data = await api("/api/chat", {
              method: "POST",
              body: JSON.stringify({ prompt: trimmed, mode: activeMode, provider: activeProvider, model: activeModel, history }),
            });
            session.messages[session.messages.length - 1] = { role: "assistant", text: data.message, memory: true };
          } else {
            const data = await api("/api/blueprints", {
              method: "POST",
              body: JSON.stringify({
                prompt: trimmed,
                databaseMode: session.databaseMode,
                provider: activeProvider,
                model: activeModel,
                history,
              }),
            });
            if (activeMode === "build") {
              const generated = await api("/api/projects/generate", {
                method: "POST",
                body: JSON.stringify({ blueprint: data.blueprint, workDirectory: session.workDirectory }),
              });
              session.blueprint = null;
              session.awaitingBlueprintDecision = false;
              session.generatedProject = generated;
              session.generatedProjectPath = generated.projectPath;
              lockWorkDirectoryForSession(session);
              touchSession(session);
              session.messages[session.messages.length - 1] = {
                role: "assistant",
                text: "Project generated. Run the displayed commands manually when ready.",
                memory: false,
              };
            } else {
              session.blueprint = data.blueprint;
              session.awaitingBlueprintDecision = true;
              touchSession(session);
              session.messages[session.messages.length - 1] = {
                role: "assistant",
                text: "Blueprint generated. Review it before generating a project.",
                memory: true,
              };
            }
          }
        } catch (error) {
          session.messages[session.messages.length - 1] = {
            role: "assistant",
            text: friendlyError(error),
            error: true,
          };
          touchSession(session);
        } finally {
          sendButton.disabled = false;
          renderThread();
          persistHistory();
        }
      }

      function loadingMessageForMode(mode) {
        if (mode === "debug") return "Checking...";
        if (mode === "chat") return "Thinking...";
        if (mode === "build") return "Building project...";
        return "Generating blueprint...";
      }

      async function approveBlueprint() {
        const session = activeSession();
        if (!session || !session.blueprint) return;
        const blueprint = session.blueprint;
        session.awaitingBlueprintDecision = false;
        session.blueprint = null;
        session.messages.push({ role: "assistant", text: "Building project...", pending: true, memory: false });
        touchSession(session);
        renderThread();
        persistHistory();

        try {
          const data = await api("/api/projects/generate", {
            method: "POST",
            body: JSON.stringify({ blueprint, workDirectory: session.workDirectory }),
          });
          session.generatedProject = data;
          session.generatedProjectPath = data.projectPath;
          lockWorkDirectoryForSession(session);
          touchSession(session);
          session.messages[session.messages.length - 1] = {
            role: "assistant",
            text: "Project generated. Run the displayed commands manually when ready.",
            memory: false,
          };
        } catch (error) {
          session.messages[session.messages.length - 1] = {
            role: "assistant",
            text: friendlyError(error),
            error: true,
            memory: false,
          };
          touchSession(session);
        }

        renderThread();
        persistHistory();
      }

      function requestBlueprintChanges() {
        const session = activeSession();
        if (!session) return;
        session.awaitingBlueprintDecision = false;
        session.refiningBlueprint = true;
        touchSession(session);
        setMode("blueprint");
        renderComposerState();
        promptInput.disabled = false;
        promptInput.focus();
        persistHistory();
      }

      function openProjectModal(mode = "edit") {
        projectModalMode = mode;
        const session = activeSession();
        const creating = mode === "create";
        document.getElementById("project-modal-title").textContent = creating ? "Create chat" : "Project settings";
        document.getElementById("save-project-settings").textContent = creating ? "Create chat" : "Save project settings";
        document.getElementById("project-name").value = creating ? (chatCounter === 1 ? "New chat" : "New chat " + chatCounter) : session ? session.title : "";
        document.getElementById("project-database").value = creating ? settings ? settings.databaseMode : "none" : session ? session.databaseMode : settings ? settings.databaseMode : "none";
        const projectWorkdir = document.getElementById("project-workdir");
        const locked = !!(!creating && session && session.workDirectoryLocked);
        projectWorkdir.value = creating ? settings ? settings.workspacePath : "" : session ? session.workDirectory || (settings ? settings.workspacePath : "") : settings ? settings.workspacePath : "";
        projectWorkdir.disabled = locked;
        document.getElementById("browse-project-workdir").disabled = locked;
        document.getElementById("copy-project-workdir").disabled = !projectWorkdir.value;
        document.getElementById("project-modal-status").textContent = locked ? "Work directory is locked for this chat because a message has already been sent." : "";
        document.getElementById("project-modal-status").className = "notice";
        openModal("project-modal");
        requestAnimationFrame(() => document.getElementById("project-name").focus());
      }

      async function saveProjectSettings() {
        let session = activeSession();

        const title = document.getElementById("project-name").value.trim() || "New chat";
        const databaseMode = document.getElementById("project-database").value;
        const workDirectory = document.getElementById("project-workdir").value.trim();

        try {
          if (projectModalMode === "create") {
            await saveSettings(workDirectory ? { databaseMode, workspacePath: workDirectory } : { databaseMode });
            const created = makeSession({ title, databaseMode, workDirectory: workDirectory || (settings ? settings.workspacePath : "") });
            sessions.unshift(created);
            activeSessionId = created.id;
            chatCounter += 1;
            closeModal("project-modal");
            setMode("blueprint");
            showChat();
            renderSessionList();
            renderThread();
            persistHistory();
            promptInput.focus();
            return;
          }
          if (!session) return;

          const settingsPatch = session.workDirectoryLocked || !workDirectory ? { databaseMode } : { databaseMode, workspacePath: workDirectory };
          await saveSettings(settingsPatch);
          session.title = title;
          session.databaseMode = databaseMode;
          if (!session.workDirectoryLocked && workDirectory) {
            session.workDirectory = workDirectory;
          }
          touchSession(session);
          closeModal("project-modal");
          showChat();
          renderSessionList();
          renderThread();
          persistHistory();
          promptInput.focus();
        } catch (error) {
          const status = document.getElementById("project-modal-status");
          status.textContent = friendlyError(error);
          status.className = "notice error";
        }
      }

      async function browseProjectWorkdir() {
        const status = document.getElementById("project-modal-status");
        status.textContent = "Opening folder picker...";
        status.className = "notice";
        try {
          const data = await api("/api/workdirs/pick", { method: "POST", body: JSON.stringify({}) });
          if (data.selectedPath) {
            document.getElementById("project-workdir").value = data.selectedPath;
            document.getElementById("copy-project-workdir").disabled = false;
            status.textContent = "Folder selected.";
            status.className = "notice success";
          } else {
            status.textContent = data.supported ? "No folder selected." : "Folder picker is unavailable. Paste a folder path manually.";
            status.className = "notice";
          }
        } catch (error) {
          status.textContent = friendlyError(error);
          status.className = "notice error";
        }
      }

      async function copyProjectWorkdir() {
        const value = document.getElementById("project-workdir").value;
        const status = document.getElementById("project-modal-status");
        try {
          await navigator.clipboard.writeText(value);
          status.textContent = "Copied.";
          status.className = "notice success";
        } catch {
          status.textContent = value;
          status.className = "notice";
        }
      }

      function makeSession(overrides = {}) {
        const id = "session-" + Date.now() + "-" + Math.random().toString(16).slice(2);
        return {
          id,
          title: overrides.title || (chatCounter === 1 ? "New chat" : "New chat " + chatCounter),
          createdAt: nowIso(),
          updatedAt: nowIso(),
          workDirectory: overrides.workDirectory !== undefined ? overrides.workDirectory : settings ? settings.workspacePath : "",
          workDirectoryLocked: false,
          generatedProjectPath: "",
          databaseMode: overrides.databaseMode || (settings ? settings.databaseMode : "none"),
          provider: activeProvider,
          model: activeModel,
          mode: "blueprint",
          messages: [],
          blueprint: null,
          awaitingBlueprintDecision: false,
          refiningBlueprint: false,
          generatedProject: null,
        };
      }

      function openWorkdirModal() {
        const session = activeSession();
        const workdirInput = document.getElementById("workdir-path");
        const status = document.getElementById("workdir-modal-status");
        workdirInput.value = session ? session.workDirectory || (settings ? settings.workspacePath : "") : settings ? settings.workspacePath : "";
        workdirInput.disabled = !!(session && session.workDirectoryLocked);
        document.getElementById("save-workdir").disabled = !!(session && session.workDirectoryLocked);
        document.getElementById("browse-workdir").disabled = !!(session && session.workDirectoryLocked);
        status.textContent = session && session.workDirectoryLocked ? "This work directory is locked for this chat because a message has already been sent." : "";
        status.className = "notice";
        openModal("workdir-modal");
      }

      async function saveWorkdir() {
        const session = activeSession();
        if (!session) return;
        if (session.workDirectoryLocked) {
          const status = document.getElementById("workdir-modal-status");
          status.textContent = "This work directory is locked for this chat because a message has already been sent.";
          status.className = "notice error";
          return;
        }

        const workDirectory = document.getElementById("workdir-path").value.trim();
        if (!workDirectory) return;
        session.workDirectory = workDirectory;
        touchSession(session);
        await saveSettings({ workspacePath: workDirectory });
        closeModal("workdir-modal");
        renderProjectRow();
        persistHistory();
      }

      async function browseWorkdir() {
        const status = document.getElementById("workdir-modal-status");
        status.textContent = "Opening folder picker...";
        status.className = "notice";
        try {
          const data = await api("/api/workdirs/pick", {
            method: "POST",
            body: JSON.stringify({}),
          });
          if (data.selectedPath) {
            document.getElementById("workdir-path").value = data.selectedPath;
            status.textContent = "Folder selected.";
            status.className = "notice success";
          } else {
            status.textContent = data.supported ? "No folder selected." : "Folder picker is unavailable. Paste a folder path manually.";
            status.className = "notice";
          }
        } catch (error) {
          status.textContent = friendlyError(error);
          status.className = "notice error";
        }
      }

      async function copyWorkdir() {
        const value = document.getElementById("workdir-path").value;
        const status = document.getElementById("workdir-modal-status");
        try {
          await navigator.clipboard.writeText(value);
          status.textContent = "Copied.";
          status.className = "notice success";
        } catch {
          status.textContent = value;
          status.className = "notice";
        }
      }

      function openDeleteChatModal(sessionId) {
        pendingDeleteSessionId = sessionId;
        document.getElementById("delete-chat-status").textContent = "";
        closeHistoryMenus();
        openModal("delete-chat-modal");
      }

      function deletePendingChat() {
        if (!pendingDeleteSessionId) return;
        const removedActiveChat = pendingDeleteSessionId === activeSessionId;
        sessions = sessions.filter((session) => session.id !== pendingDeleteSessionId);
        pendingDeleteSessionId = null;
        closeModal("delete-chat-modal");

        if (!sessions.length) {
          activeSessionId = null;
          setMode("blueprint");
          showChat();
          renderSessionList();
          renderThread();
          persistHistory();
          return;
        }

        if (removedActiveChat) {
          activeSessionId = sessions[0].id;
          const session = activeSession();
          if (session) {
            setMode(session.mode);
          }
        }

        renderSessionList();
        renderThread();
        persistHistory();
      }

      function openProviderModal(provider) {
        document.getElementById("provider-modal-title").textContent = provider === "openrouter" ? "Add OpenRouter" : "Add Ollama";
        document.getElementById("provider-modal-type").value = provider || "ollama";
        document.getElementById("provider-openrouter-key").value = "";
        document.getElementById("provider-modal-status").textContent = "";
        renderProviderFields();
        openModal("provider-modal");
      }

      function renderProviderFields() {
        const provider = document.getElementById("provider-modal-type").value;
        document.getElementById("provider-fields-ollama").classList.toggle("active", provider === "ollama");
        document.getElementById("provider-fields-openrouter").classList.toggle("active", provider === "openrouter");
      }

      function providerPayloadFromModal() {
        const provider = document.getElementById("provider-modal-type").value;
        return {
          provider,
          ollamaUrl: document.getElementById("provider-ollama-url").value,
          openRouterApiKey: document.getElementById("provider-openrouter-key").value,
        };
      }

      async function testProviderFromModal() {
        const status = document.getElementById("provider-modal-status");
        status.textContent = "Testing provider...";
        status.className = "notice";
        try {
          const data = await api("/api/providers/test", { method: "POST", body: JSON.stringify(providerPayloadFromModal()) });
          status.textContent = data.message;
          status.className = data.ok ? "notice success" : "notice error";
        } catch (error) {
          status.textContent = friendlyError(error);
          status.className = "notice error";
        }
      }

      async function saveProviderFromModal() {
        const payload = providerPayloadFromModal();
        const status = document.getElementById("provider-modal-status");
        if (payload.provider === "openrouter" && !payload.openRouterApiKey.trim() && !(settings && settings.openRouterKeySaved)) {
          status.textContent = "Paste an OpenRouter API key before saving.";
          status.className = "notice error";
          return;
        }

        try {
          settings = await api("/api/providers", { method: "POST", body: JSON.stringify(payload) });
          applySettingsToUi();
          closeModal("provider-modal");
          document.getElementById("provider-status").textContent = payload.provider === "openrouter" ? "OpenRouter saved." : "Ollama saved.";
          document.getElementById("provider-status").className = "notice success";
          loadModels();
        } catch (error) {
          status.textContent = friendlyError(error);
          status.className = "notice error";
        }
      }

      async function testSavedProvider(provider) {
        const status = document.getElementById("provider-status");
        status.textContent = "Testing " + provider + "...";
        status.className = "notice";
        try {
          const data = await api("/api/providers/test", { method: "POST", body: JSON.stringify({ provider }) });
          status.textContent = data.message;
          status.className = data.ok ? "notice success" : "notice error";
        } catch (error) {
          status.textContent = friendlyError(error);
          status.className = "notice error";
        }
      }

      async function loadModels() {
        const status = document.getElementById("model-status");
        status.textContent = "Loading models...";
        status.className = "notice";
        try {
          const data = await api("/api/models", { method: "GET" });
          availableModels = data.models || [];
          const errorMessages = data.errors ? Object.values(data.errors).filter(Boolean) : [];
          status.textContent = errorMessages.length ? "Some providers could not be reached. Fallback and custom models are still available." : "";
          status.className = errorMessages.length ? "notice" : "notice success";
        } catch (error) {
          availableModels = [
            { id: "llama3.1", name: "llama3.1", provider: "ollama", source: "fallback" },
            { id: "openai/gpt-4o-mini", name: "openai/gpt-4o-mini", provider: "openrouter", source: "fallback" },
          ];
          status.textContent = friendlyError(error);
          status.className = "notice error";
        }
        renderModelList();
      }

      function openModelPicker() {
        document.getElementById("model-search").value = "";
        openModal("model-modal");
        loadModels();
      }

      function renderModelList() {
        const query = document.getElementById("model-search").value.trim().toLowerCase();
        const list = document.getElementById("model-list");
        const models = availableModels.filter((model) => {
          const haystack = (model.name + " " + model.id + " " + model.provider).toLowerCase();
          return !query || haystack.includes(query);
        });

        if (!models.length) {
          list.innerHTML = '<div class="model-row"><span class="model-name">No models found</span><span class="model-provider">Use custom</span></div>';
          return;
        }

        list.innerHTML = models
          .map((model) => {
            const active = model.provider === activeProvider && model.id === activeModel ? " active" : "";
            return (
              '<button class="model-row' + active + '" type="button" data-model-id="' + escapeHtml(model.id) + '" data-model-provider="' + escapeHtml(model.provider) + '">' +
              '<span class="model-name">' + escapeHtml(model.name || model.id) + '</span>' +
              '<span class="model-provider">' + escapeHtml(model.provider) + '</span>' +
              '</button>'
            );
          })
          .join("");

        document.querySelectorAll("[data-model-id]").forEach((button) => {
          button.addEventListener("click", async () => {
            activeProvider = button.getAttribute("data-model-provider");
            activeModel = button.getAttribute("data-model-id");
            renderModelLabel();
            syncActiveModelToSession(activeSession());
            await saveActiveModel();
            persistHistory();
            closeModal("model-modal");
          });
        });
      }

      async function useCustomModel() {
        const provider = document.getElementById("custom-model-provider").value;
        const model = document.getElementById("custom-model-id").value.trim();
        if (!model) return;
        activeProvider = provider;
        activeModel = model;
        renderModelLabel();
        syncActiveModelToSession(activeSession());
        await saveActiveModel();
        persistHistory();
        closeModal("model-modal");
      }

      document.getElementById("new-chat").addEventListener("click", () => openProjectModal("create"));
      document.getElementById("project-settings-button").addEventListener("click", () => openProjectModal("edit"));
      document.getElementById("workdir-button").addEventListener("click", openWorkdirModal);
      document.getElementById("save-project-settings").addEventListener("click", saveProjectSettings);
      document.getElementById("browse-project-workdir").addEventListener("click", browseProjectWorkdir);
      document.getElementById("copy-project-workdir").addEventListener("click", copyProjectWorkdir);
      document.getElementById("project-workdir").addEventListener("input", () => {
        document.getElementById("copy-project-workdir").disabled = !document.getElementById("project-workdir").value.trim();
      });
      document.getElementById("save-workdir").addEventListener("click", saveWorkdir);
      document.getElementById("browse-workdir").addEventListener("click", browseWorkdir);
      document.getElementById("copy-workdir").addEventListener("click", copyWorkdir);
      document.getElementById("confirm-delete-chat").addEventListener("click", deletePendingChat);
      document.getElementById("approve-blueprint-build").addEventListener("click", approveBlueprint);
      document.getElementById("revise-blueprint").addEventListener("click", requestBlueprintChanges);
      document.getElementById("open-settings").addEventListener("click", () => showSettings("general"));
      document.getElementById("back-to-chat").addEventListener("click", showChat);
      document.getElementById("open-model-picker").addEventListener("click", openModelPicker);
      document.getElementById("model-search").addEventListener("input", renderModelList);
      document.getElementById("use-custom-model").addEventListener("click", useCustomModel);
      composerCommandMode.addEventListener("change", async () => {
        await saveSettings({ commandMode: composerCommandMode.value });
      });
      document.getElementById("mode-button").addEventListener("click", (event) => {
        event.stopPropagation();
        modeMenu.classList.toggle("active");
      });

      document.querySelectorAll("[data-mode-option]").forEach((button) => {
        button.addEventListener("click", () => {
          setMode(button.getAttribute("data-mode-option"));
          modeMenu.classList.remove("active");
        });
      });

      settingsButtons.forEach((button) => {
        button.addEventListener("click", () => showSettingsPanel(button.getAttribute("data-settings")));
      });

      themeButtons.forEach((button) => {
        button.addEventListener("click", async () => {
          await saveSettings({ theme: button.getAttribute("data-theme-choice") });
        });
      });

      accentButtons.forEach((button) => {
        button.addEventListener("click", async () => {
          await saveSettings({ accent: button.getAttribute("data-accent-choice") });
        });
      });

      document.getElementById("save-general").addEventListener("click", async () => {
        await saveSettings({ workspacePath: document.getElementById("workspace-path").value });
        document.getElementById("general-status").textContent = "General settings saved.";
      });

      document.getElementById("save-database").addEventListener("click", async () => {
        await saveSettings({ databaseMode: document.getElementById("database-mode").value });
      });

      document.getElementById("save-safety").addEventListener("click", async () => {
        await saveSettings({ commandMode: document.getElementById("command-mode").value });
        document.getElementById("command-review-result").textContent = "Safety settings saved.";
      });

      document.getElementById("review-command").addEventListener("click", async () => {
        const result = document.getElementById("command-review-result");
        result.textContent = "Reviewing command...";
        try {
          const data = await api("/api/commands/review", {
            method: "POST",
            body: JSON.stringify({
              command: document.getElementById("command-review-input").value || "npm install",
              cwd: settings.workspacePath,
              purpose: "Manual command safety check from Settings",
            }),
          });
          result.textContent = data.review.decision + ": " + data.review.reason;
        } catch (error) {
          result.textContent = friendlyError(error);
        }
      });

      document.getElementById("add-provider").addEventListener("click", () => openProviderModal("ollama"));
      document.getElementById("provider-modal-type").addEventListener("change", renderProviderFields);
      document.getElementById("test-provider-config").addEventListener("click", testProviderFromModal);
      document.getElementById("save-provider-config").addEventListener("click", saveProviderFromModal);

      document.querySelectorAll("[data-configure-provider]").forEach((button) => {
        button.addEventListener("click", () => openProviderModal(button.getAttribute("data-configure-provider")));
      });

      document.querySelectorAll("[data-test-provider]").forEach((button) => {
        button.addEventListener("click", () => testSavedProvider(button.getAttribute("data-test-provider")));
      });

      document.querySelectorAll("[data-close-modal]").forEach((button) => {
        button.addEventListener("click", () => closeModal(button.getAttribute("data-close-modal")));
      });

      document.querySelectorAll(".modal-backdrop").forEach((backdrop) => {
        backdrop.addEventListener("click", (event) => {
          if (event.target === backdrop) {
            closeModal(backdrop.id);
          }
        });
      });

      document.addEventListener("click", () => {
        modeMenu.classList.remove("active");
        closeHistoryMenus();
      });

      document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          document.querySelectorAll(".modal-backdrop.active").forEach((modal) => closeModal(modal.id));
          modeMenu.classList.remove("active");
        }
      });

      promptInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          promptForm.requestSubmit();
        }
      });

      promptForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const value = promptInput.value;
        promptInput.value = "";
        submitPrompt(value);
      });

      loadSettings()
        .then(() => {
          return loadHistoryState();
        })
        .catch((error) => {
          const timestamp = nowIso();
          sessions = [
            {
              id: "error",
              title: "Startup error",
              createdAt: timestamp,
              updatedAt: timestamp,
              workDirectory: "",
              workDirectoryLocked: false,
              generatedProjectPath: "",
              databaseMode: "none",
              provider: activeProvider,
              model: activeModel,
              mode: "chat",
              messages: [{ role: "assistant", text: friendlyError(error), error: true, memory: false }],
              blueprint: null,
              awaitingBlueprintDecision: false,
              refiningBlueprint: false,
              generatedProject: null,
            },
          ];
          activeSessionId = "error";
          renderSessionList();
          renderThread();
        });
    </script>
  </body>
</html>`;
