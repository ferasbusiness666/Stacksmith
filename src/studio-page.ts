export const studioHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Stacksmith Studio</title>
    <style>
      :root {
        color-scheme: dark;
        --app-bg: #101214;
        --sidebar-bg: #0c0e10;
        --sidebar-rail: #111417;
        --main-bg: #14171a;
        --surface: #181c20;
        --surface-2: #1f2429;
        --surface-3: #242a30;
        --text: #f2f4f7;
        --muted: #9da7b3;
        --muted-strong: #c4ccd5;
        --line: #2a3037;
        --line-soft: #20262d;
        --accent: #3b82f6;
        --accent-strong: #2563eb;
        --accent-soft: #17263f;
        --button-text: #ffffff;
        --danger: #f87171;
      }

      body[data-theme="light"] {
        color-scheme: light;
        --app-bg: #eef1f4;
        --sidebar-bg: #e4e8ed;
        --sidebar-rail: #f3f5f7;
        --main-bg: #f8fafc;
        --surface: #ffffff;
        --surface-2: #f1f4f7;
        --surface-3: #e8edf2;
        --text: #161a20;
        --muted: #66717f;
        --muted-strong: #364152;
        --line: #d1d8e0;
        --line-soft: #e1e6ec;
        --accent-soft: #e7f0ff;
      }

      body[data-accent="blue"] {
        --accent: #3b82f6;
        --accent-strong: #2563eb;
        --accent-soft: #17263f;
      }

      body[data-accent="green"] {
        --accent: #2f9e72;
        --accent-strong: #25845f;
        --accent-soft: #123027;
      }

      body[data-accent="slate"] {
        --accent: #64748b;
        --accent-strong: #475569;
        --accent-soft: #202733;
      }

      body[data-theme="light"][data-accent="blue"] {
        --accent-soft: #e7f0ff;
      }

      body[data-theme="light"][data-accent="green"] {
        --accent-soft: #e5f5ee;
      }

      body[data-theme="light"][data-accent="slate"] {
        --accent-soft: #edf0f4;
      }

      * {
        box-sizing: border-box;
      }

      html,
      body {
        min-width: 320px;
      }

      body {
        margin: 0;
        background: var(--app-bg);
        color: var(--text);
        font-family:
          Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        line-height: 1.5;
      }

      button,
      textarea {
        font: inherit;
      }

      button {
        border: 0;
      }

      .app {
        background: var(--app-bg);
        display: grid;
        grid-template-columns: 292px minmax(0, 1fr);
        min-height: 100vh;
      }

      .sidebar {
        background: var(--sidebar-bg);
        border-right: 1px solid var(--line);
        color: var(--text);
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        padding: 14px 8px;
      }

      .brand {
        align-items: center;
        display: flex;
        gap: 10px;
        padding: 4px 12px 16px;
      }

      .brand-mark {
        align-items: center;
        background: var(--surface-2);
        border: 1px solid var(--line);
        border-radius: 7px;
        display: inline-flex;
        font-size: 13px;
        font-weight: 800;
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
        color: var(--muted);
        display: block;
        font-size: 12px;
        margin-top: 2px;
      }

      .icon {
        flex: 0 0 auto;
        height: 16px;
        width: 16px;
      }

      .nav-stack,
      .history-list,
      .settings-menu {
        display: grid;
        gap: 4px;
      }

      .nav-button,
      .history-button,
      .settings-menu button,
      .back-button,
      .sidebar-settings-button {
        align-items: center;
        background: transparent;
        border-radius: 8px;
        color: var(--text);
        cursor: pointer;
        display: flex;
        font-size: 14px;
        gap: 9px;
        padding: 9px 12px;
        text-align: left;
        width: 100%;
      }

      .nav-button:hover,
      .history-button:hover,
      .settings-menu button:hover,
      .back-button:hover,
      .sidebar-settings-button:hover,
      .history-button.active,
      .settings-menu button.active {
        background: var(--surface-2);
      }

      .nav-button.primary {
        color: var(--text);
        font-weight: 700;
      }

      .nav-button.secondary {
        color: var(--muted-strong);
      }

      .section-label {
        color: var(--muted);
        font-size: 12px;
        margin: 18px 12px 8px;
      }

      .history {
        background: var(--sidebar-rail);
        border: 1px solid var(--line-soft);
        border-radius: 11px;
        flex: 1;
        margin-top: 12px;
        min-height: 180px;
        padding: 2px 0 8px;
      }

      .history-note {
        color: var(--muted);
        font-size: 12px;
        margin: 0 12px 8px;
      }

      .history-button {
        align-items: flex-start;
        display: block;
      }

      .history-button small {
        color: var(--muted);
        display: block;
        font-size: 12px;
        margin-top: 1px;
      }

      .sidebar-bottom {
        display: grid;
        gap: 10px;
        margin-top: 12px;
      }

      .local-label {
        border: 1px solid var(--line);
        border-radius: 999px;
        color: var(--muted-strong);
        display: inline-flex;
        font-size: 12px;
        font-weight: 700;
        padding: 5px 8px;
        width: fit-content;
      }

      .main {
        background: var(--main-bg);
        min-width: 0;
      }

      .view {
        display: none;
        min-height: 100vh;
      }

      .view.active {
        display: grid;
      }

      .chat-view {
        grid-template-rows: auto minmax(0, 1fr) auto;
      }

      .topbar {
        align-items: center;
        background: var(--surface);
        border-bottom: 1px solid var(--line);
        display: flex;
        gap: 14px;
        justify-content: space-between;
        padding: 14px 22px;
      }

      .topbar h1 {
        font-size: 15px;
        margin: 0;
      }

      .topbar p {
        color: var(--muted);
        font-size: 12px;
        margin: 2px 0 0;
      }

      .status-row {
        display: flex;
        flex-wrap: wrap;
        gap: 7px;
        justify-content: flex-end;
      }

      .pill {
        align-items: center;
        background: var(--surface-2);
        border: 1px solid var(--line);
        border-radius: 999px;
        color: var(--muted-strong);
        display: inline-flex;
        font-size: 12px;
        font-weight: 700;
        min-height: 26px;
        padding: 6px 9px;
      }

      .thread {
        margin: 0 auto;
        max-width: 900px;
        overflow-y: auto;
        padding: 30px 22px;
        scroll-behavior: smooth;
        width: 100%;
      }

      .empty-state {
        margin: 14vh auto 0;
        max-width: 650px;
      }

      .empty-state h2 {
        font-size: clamp(26px, 4vw, 40px);
        letter-spacing: 0;
        line-height: 1.1;
        margin: 0;
      }

      .empty-state p {
        color: var(--muted);
        font-size: 15px;
        margin: 14px 0 0;
      }

      .message {
        display: grid;
        gap: 7px;
        margin-bottom: 18px;
      }

      .message-meta {
        color: var(--muted);
        font-size: 12px;
        font-weight: 700;
      }

      .bubble {
        background: var(--surface);
        border: 1px solid var(--line);
        border-radius: 12px;
        color: var(--text);
        padding: 14px 15px;
        white-space: pre-wrap;
      }

      .message.user .bubble {
        background: var(--surface-2);
        border-color: var(--line);
      }

      .bubble p {
        margin: 0;
      }

      .composer-wrap {
        background: var(--surface);
        border-top: 1px solid var(--line);
        padding: 14px 22px 18px;
      }

      .composer {
        align-items: flex-end;
        background: var(--main-bg);
        border: 1px solid var(--line);
        border-radius: 14px;
        display: grid;
        gap: 10px;
        grid-template-columns: minmax(0, 1fr) auto;
        margin: 0 auto;
        max-width: 900px;
        padding: 10px;
      }

      textarea {
        background: transparent;
        border: 0;
        color: var(--text);
        display: block;
        max-height: 220px;
        min-height: 54px;
        outline: none;
        padding: 5px 4px;
        resize: vertical;
        width: 100%;
      }

      textarea::placeholder {
        color: var(--muted);
      }

      .send-button {
        align-items: center;
        background: var(--accent);
        border-radius: 10px;
        color: var(--button-text);
        cursor: pointer;
        display: inline-flex;
        font-size: 13px;
        font-weight: 800;
        gap: 8px;
        justify-content: center;
        min-height: 40px;
        padding: 10px 13px;
      }

      .send-button:hover {
        background: var(--accent-strong);
      }

      .send-button:focus-visible,
      .nav-button:focus-visible,
      .history-button:focus-visible,
      .sidebar-settings-button:focus-visible,
      .settings-menu button:focus-visible,
      .back-button:focus-visible,
      .option-button:focus-visible,
      .swatch:focus-visible {
        outline: 2px solid var(--accent);
        outline-offset: 2px;
      }

      .settings-view {
        grid-template-columns: 232px minmax(0, 1fr);
      }

      .settings-sidebar {
        background: var(--sidebar-bg);
        border-right: 1px solid var(--line);
        padding: 14px 8px;
      }

      .settings-content {
        background: var(--main-bg);
        margin: 0 auto;
        max-width: 760px;
        padding: 78px 34px;
        width: 100%;
      }

      .settings-panel {
        display: none;
      }

      .settings-panel.active {
        display: block;
      }

      .settings-panel h2 {
        font-size: 22px;
        margin: 0 0 34px;
      }

      .settings-group {
        margin-bottom: 34px;
      }

      .settings-group h3 {
        font-size: 14px;
        margin: 0 0 10px;
      }

      .setting-row {
        align-items: center;
        background: var(--surface);
        border: 1px solid var(--line);
        border-bottom: 0;
        display: grid;
        gap: 18px;
        grid-template-columns: minmax(0, 1fr) 240px;
        padding: 14px 13px;
      }

      .setting-row:first-of-type {
        border-radius: 9px 9px 0 0;
      }

      .setting-row:last-of-type {
        border-bottom: 1px solid var(--line);
        border-radius: 0 0 9px 9px;
      }

      .setting-row:only-of-type {
        border-radius: 9px;
      }

      .setting-row strong {
        display: block;
        font-size: 13px;
      }

      .setting-row span {
        color: var(--muted);
        display: block;
        font-size: 12px;
        margin-top: 3px;
      }

      .setting-value {
        color: var(--muted-strong);
        font-size: 13px;
        text-align: right;
      }

      .segmented,
      .swatches {
        display: flex;
        gap: 8px;
        justify-content: flex-end;
      }

      .option-button,
      .swatch {
        background: var(--surface-2);
        border: 1px solid var(--line);
        border-radius: 8px;
        color: var(--text);
        cursor: pointer;
        font-size: 13px;
        min-height: 38px;
        padding: 8px 11px;
      }

      .option-button.active,
      .swatch.active {
        background: var(--accent-soft);
        border-color: var(--accent);
        color: var(--text);
      }

      .swatch {
        min-width: 78px;
        text-align: center;
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
        background: #3b82f6;
      }

      .swatch[data-accent-choice="green"]::before {
        background: #2f9e72;
      }

      .swatch[data-accent-choice="slate"]::before {
        background: #64748b;
      }

      @media (max-width: 900px) {
        .app {
          grid-template-columns: 1fr;
        }

        .sidebar {
          min-height: auto;
        }

        .history {
          flex: none;
        }

        .settings-view {
          grid-template-columns: 1fr;
        }

        .settings-content {
          padding: 28px 18px;
        }
      }

      @media (max-width: 620px) {
        .topbar {
          align-items: flex-start;
          flex-direction: column;
        }

        .thread {
          padding: 22px 14px;
        }

        .composer-wrap {
          padding: 12px 14px 16px;
        }

        .composer {
          grid-template-columns: 1fr;
        }

        .send-button {
          justify-self: end;
        }

        .setting-row {
          align-items: stretch;
          grid-template-columns: 1fr;
        }

        .setting-value,
        .segmented,
        .swatches {
          justify-content: flex-start;
          text-align: left;
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

        <nav class="nav-stack" aria-label="Primary">
          <button class="nav-button primary" id="new-chat" type="button">
            <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
            </svg>
            <span>New Chat</span>
          </button>
          <button class="nav-button secondary" id="new-project" type="button">
            <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 7h6l2 2h8v9a2 2 0 0 1-2 2H4z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
            </svg>
            <span>New Project</span>
          </button>
        </nav>

        <div class="history" aria-label="Sample chat history">
          <p class="section-label">Sample chats</p>
          <p class="history-note">Local placeholders only. Nothing is saved.</p>
          <div class="history-list">
            <button class="history-button" type="button" data-sample="invoice">Invoice dashboard idea <small>Sample placeholder</small></button>
            <button class="history-button" type="button" data-sample="portfolio">Portfolio website <small>Sample placeholder</small></button>
            <button class="history-button" type="button" data-sample="crm">Local CRM tool <small>Sample placeholder</small></button>
            <button class="history-button" type="button" data-sample="habit">Mobile habit tracker <small>Sample placeholder</small></button>
          </div>
        </div>

        <div class="sidebar-bottom">
          <button class="sidebar-settings-button" id="open-settings" type="button">
            <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" fill="none" stroke="currentColor" stroke-width="2" />
              <path d="M19.4 15a1.8 1.8 0 0 0 .36 1.98l.04.04a2 2 0 0 1-2.83 2.83l-.04-.04A1.8 1.8 0 0 0 15 19.4a1.8 1.8 0 0 0-1 .6 1.8 1.8 0 0 0-.4 1.1V21a2 2 0 0 1-4 0v-.1A1.8 1.8 0 0 0 8.5 19.3a1.8 1.8 0 0 0-1.98.36l-.04.04a2 2 0 1 1-2.83-2.83l.04-.04A1.8 1.8 0 0 0 4.6 15a1.8 1.8 0 0 0-.6-1 1.8 1.8 0 0 0-1.1-.4H3a2 2 0 0 1 0-4h.1A1.8 1.8 0 0 0 4.7 8.5a1.8 1.8 0 0 0-.36-1.98l-.04-.04a2 2 0 1 1 2.83-2.83l.04.04A1.8 1.8 0 0 0 9 4.6a1.8 1.8 0 0 0 1-.6 1.8 1.8 0 0 0 .4-1.1V3a2 2 0 0 1 4 0v.1A1.8 1.8 0 0 0 15.5 4.7a1.8 1.8 0 0 0 1.98-.36l.04-.04a2 2 0 1 1 2.83 2.83l-.04.04A1.8 1.8 0 0 0 19.4 9c.2.4.4.7.6 1 .3.3.7.4 1.1.4h.1a2 2 0 0 1 0 4h-.1c-.4 0-.8.1-1.1.4-.3.2-.5.5-.6.2Z" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span>Settings</span>
          </button>
          <span class="local-label">Local only</span>
        </div>
      </aside>

      <main class="main">
        <section class="view chat-view active" id="chat-view" aria-label="Chat workspace">
          <header class="topbar">
            <div>
              <h1>Chat</h1>
              <p>Local shell only. No AI provider is connected.</p>
            </div>
            <div class="status-row" aria-label="Status labels">
              <span class="pill">Phase 2 mock</span>
              <span class="pill">No AI call</span>
              <span class="pill">Local only</span>
            </div>
          </header>

          <section class="thread" id="thread" aria-live="polite"></section>

          <section class="composer-wrap" aria-label="App prompt composer">
            <form class="composer" id="prompt-form">
              <textarea id="prompt" name="prompt" placeholder="Message Stacksmith..."></textarea>
              <button class="send-button" type="submit" aria-label="Send message">
                <span>Send</span>
                <svg class="icon" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="m5 12 14-7-7 14-2-5z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" />
                </svg>
              </button>
            </form>
          </section>
        </section>

        <section class="view settings-view" id="settings-view" aria-label="Settings">
          <aside class="settings-sidebar" aria-label="Settings navigation">
            <button class="back-button" id="back-to-chat" type="button">Back to chat</button>
            <p class="section-label">Settings</p>
            <nav class="settings-menu">
              <button class="active" type="button" data-settings="general">General</button>
              <button type="button" data-settings="appearance">Appearance</button>
              <button type="button" data-settings="mcp">MCP</button>
              <button type="button" data-settings="skills">Skills</button>
              <button type="button" data-settings="providers">Providers</button>
              <button type="button" data-settings="database">Database</button>
              <button type="button" data-settings="safety">Safety</button>
              <button type="button" data-settings="local-server">Local Server</button>
            </nav>
          </aside>

          <div class="settings-content">
            <section class="settings-panel active" data-panel="general">
              <h2>General</h2>
              <div class="settings-group">
                <h3>Workspace</h3>
                <div class="setting-row">
                  <div><strong>Default workspace</strong><span>Future generated projects stay separate from Stacksmith core.</span></div>
                  <div class="setting-value">Not selected</div>
                </div>
                <div class="setting-row">
                  <div><strong>Chat history</strong><span>Sample chats are placeholders and are not saved.</span></div>
                  <div class="setting-value">Session only</div>
                </div>
              </div>
            </section>

            <section class="settings-panel" data-panel="appearance">
              <h2>Appearance</h2>
              <div class="settings-group">
                <h3>Theme</h3>
                <div class="setting-row">
                  <div><strong>Color mode</strong><span>Changes only the current browser session.</span></div>
                  <div class="segmented">
                    <button class="option-button" type="button" data-theme-choice="light">Light</button>
                    <button class="option-button active" type="button" data-theme-choice="dark">Dark</button>
                  </div>
                </div>
                <div class="setting-row">
                  <div><strong>Accent color</strong><span>Applies to selected controls and primary actions for this session.</span></div>
                  <div class="swatches">
                    <button class="swatch active" type="button" data-accent-choice="blue">Blue</button>
                    <button class="swatch" type="button" data-accent-choice="green">Green</button>
                    <button class="swatch" type="button" data-accent-choice="slate">Slate</button>
                  </div>
                </div>
              </div>
            </section>

            <section class="settings-panel" data-panel="mcp">
              <h2>MCP</h2>
              <div class="settings-group">
                <h3>Servers</h3>
                <div class="setting-row">
                  <div><strong>MCP servers</strong><span>Future local integrations can appear here.</span></div>
                  <div class="setting-value">Not connected</div>
                </div>
              </div>
            </section>

            <section class="settings-panel" data-panel="skills">
              <h2>Skills</h2>
              <div class="settings-group">
                <h3>Skill library</h3>
                <div class="setting-row">
                  <div><strong>Installed skills</strong><span>Future workflow skills and templates can be managed here.</span></div>
                  <div class="setting-value">Not implemented yet</div>
                </div>
              </div>
            </section>

            <section class="settings-panel" data-panel="providers">
              <h2>Providers</h2>
              <div class="settings-group">
                <h3>Model providers</h3>
                <div class="setting-row">
                  <div><strong>AI provider</strong><span>No provider is connected and no network calls are made.</span></div>
                  <div class="setting-value">Not connected</div>
                </div>
                <div class="setting-row">
                  <div><strong>Model selection</strong><span>Provider adapter work comes later.</span></div>
                  <div class="setting-value">Not implemented yet</div>
                </div>
              </div>
            </section>

            <section class="settings-panel" data-panel="database">
              <h2>Database</h2>
              <div class="settings-group">
                <h3>Data layer</h3>
                <div class="setting-row">
                  <div><strong>Database mode</strong><span>No database, SQLite, and cloud options are future settings.</span></div>
                  <div class="setting-value">Placeholder</div>
                </div>
                <div class="setting-row">
                  <div><strong>Supabase</strong><span>Future option only. Nothing is connected.</span></div>
                  <div class="setting-value">Not connected</div>
                </div>
              </div>
            </section>

            <section class="settings-panel" data-panel="safety">
              <h2>Safety</h2>
              <div class="settings-group">
                <h3>Approval</h3>
                <div class="setting-row">
                  <div><strong>File changes</strong><span>Future writes should require a clear approval step.</span></div>
                  <div class="setting-value">Placeholder</div>
                </div>
                <div class="setting-row">
                  <div><strong>Command execution</strong><span>Future commands should be visible before running.</span></div>
                  <div class="setting-value">Placeholder</div>
                </div>
              </div>
            </section>

            <section class="settings-panel" data-panel="local-server">
              <h2>Local Server</h2>
              <div class="settings-group">
                <h3>Runtime</h3>
                <div class="setting-row">
                  <div><strong>Server scope</strong><span>Runs only when started from the CLI on localhost.</span></div>
                  <div class="setting-value">127.0.0.1:4317</div>
                </div>
                <div class="setting-row">
                  <div><strong>Health route</strong><span>Local readiness endpoint for development checks.</span></div>
                  <div class="setting-value">/health</div>
                </div>
              </div>
            </section>
          </div>
        </section>
      </main>
    </div>

    <script>
      const samples = {
        invoice: {
          title: "Invoice dashboard idea",
          prompt: "Build an invoice dashboard for tracking paid, overdue, and draft invoices.",
        },
        portfolio: {
          title: "Portfolio website",
          prompt: "Create a clean portfolio website with projects, writing, and a contact page.",
        },
        crm: {
          title: "Local CRM tool",
          prompt: "Make a local CRM for contacts, notes, reminders, and simple pipeline tracking.",
        },
        habit: {
          title: "Mobile habit tracker",
          prompt: "Plan a mobile habit tracker with streaks, reminders, and weekly progress.",
        },
      };

      const body = document.body;
      const chatView = document.getElementById("chat-view");
      const settingsView = document.getElementById("settings-view");
      const thread = document.getElementById("thread");
      const promptForm = document.getElementById("prompt-form");
      const promptInput = document.getElementById("prompt");
      const historyButtons = Array.from(document.querySelectorAll("[data-sample]"));
      const settingsButtons = Array.from(document.querySelectorAll("[data-settings]"));
      const settingsPanels = Array.from(document.querySelectorAll("[data-panel]"));
      const themeButtons = Array.from(document.querySelectorAll("[data-theme-choice]"));
      const accentButtons = Array.from(document.querySelectorAll("[data-accent-choice]"));

      let messages = [];
      let activeSample = null;

      function escapeHtml(value) {
        return value
          .replaceAll("&", "&amp;")
          .replaceAll("<", "&lt;")
          .replaceAll(">", "&gt;")
          .replaceAll('"', "&quot;")
          .replaceAll("'", "&#039;");
      }

      function scrollThreadToBottom() {
        requestAnimationFrame(() => {
          thread.scrollTop = thread.scrollHeight;
        });
      }

      function showChat() {
        chatView.classList.add("active");
        settingsView.classList.remove("active");
        location.hash = "chat";
        scrollThreadToBottom();
      }

      function showSettings(panel) {
        chatView.classList.remove("active");
        settingsView.classList.add("active");
        showSettingsPanel(panel || "general");
        location.hash = "settings";
      }

      function showSettingsPanel(panel) {
        settingsButtons.forEach((button) => {
          button.classList.toggle("active", button.getAttribute("data-settings") === panel);
        });

        settingsPanels.forEach((section) => {
          section.classList.toggle("active", section.getAttribute("data-panel") === panel);
        });
      }

      function assistantReply() {
        return (
          "I can help shape that locally, but no AI provider is connected yet and nothing was sent anywhere. " +
          "What should be the first screen, who is it for, and does it need saved data?"
        );
      }

      function renderThread() {
        historyButtons.forEach((button) => {
          button.classList.toggle("active", button.getAttribute("data-sample") === activeSample);
        });

        if (!messages.length) {
          thread.innerHTML =
            '<div class="empty-state">' +
            '<h2>What do you want to build?</h2>' +
            '<p>Describe a website, app, dashboard, tool, or SaaS idea. This is a local chat shell: no AI call, no saved chat, no files written.</p>' +
            '</div>';
          return;
        }

        thread.innerHTML = messages
          .map((message) => {
            const label = message.role === "user" ? "You" : "Stacksmith";
            return (
              '<article class="message ' + message.role + '">' +
              '<div class="message-meta">' + label + '</div>' +
              '<div class="bubble"><p>' + escapeHtml(message.text) + '</p></div>' +
              '</article>'
            );
          })
          .join("");

        scrollThreadToBottom();
      }

      function addPrompt(prompt) {
        const trimmed = prompt.trim();
        if (!trimmed) return;

        messages.push({ role: "user", text: trimmed });
        messages.push({ role: "assistant", text: assistantReply() });
        renderThread();
      }

      function newChat() {
        activeSample = null;
        messages = [];
        promptInput.value = "";
        showChat();
        renderThread();
        promptInput.focus();
      }

      function loadSample(key) {
        const sample = samples[key];
        if (!sample) return;

        activeSample = key;
        messages = [
          { role: "assistant", text: sample.title + " is a sample placeholder. It is not a saved chat." },
          { role: "user", text: sample.prompt },
          { role: "assistant", text: assistantReply() },
        ];
        showChat();
        renderThread();
      }

      function applyTheme(theme) {
        body.setAttribute("data-theme", theme);
        themeButtons.forEach((button) => {
          button.classList.toggle("active", button.getAttribute("data-theme-choice") === theme);
        });
      }

      function applyAccent(accent) {
        body.setAttribute("data-accent", accent);
        accentButtons.forEach((button) => {
          button.classList.toggle("active", button.getAttribute("data-accent-choice") === accent);
        });
      }

      document.getElementById("new-chat").addEventListener("click", newChat);
      document.getElementById("new-project").addEventListener("click", newChat);
      document.getElementById("open-settings").addEventListener("click", () => showSettings("general"));
      document.getElementById("back-to-chat").addEventListener("click", showChat);

      historyButtons.forEach((button) => {
        button.addEventListener("click", () => loadSample(button.getAttribute("data-sample")));
      });

      settingsButtons.forEach((button) => {
        button.addEventListener("click", () => showSettingsPanel(button.getAttribute("data-settings")));
      });

      themeButtons.forEach((button) => {
        button.addEventListener("click", () => applyTheme(button.getAttribute("data-theme-choice")));
      });

      accentButtons.forEach((button) => {
        button.addEventListener("click", () => applyAccent(button.getAttribute("data-accent-choice")));
      });

      promptInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault();
          promptForm.requestSubmit();
        }
      });

      promptForm.addEventListener("submit", (event) => {
        event.preventDefault();
        activeSample = null;
        addPrompt(promptInput.value);
        promptInput.value = "";
        promptInput.focus();
      });

      if (location.hash === "#settings") {
        showSettings("general");
      } else {
        showChat();
      }

      renderThread();
    </script>
  </body>
</html>`;
