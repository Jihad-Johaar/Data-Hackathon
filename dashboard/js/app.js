/**
 * SYN BANK — app shell, router, and page renderers.
 * All data comes from data.js via accessor functions.
 */

const ICONS = {
  overview: `<svg class="nav-icon" viewBox="0 0 20 20" fill="none"><rect x="2.5" y="2.5" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.4"/><rect x="11.5" y="2.5" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.4"/><rect x="2.5" y="11.5" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.4"/><rect x="11.5" y="11.5" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.4"/></svg>`,
  clients: `<svg class="nav-icon" viewBox="0 0 20 20" fill="none"><circle cx="7" cy="6.5" r="2.5" stroke="currentColor" stroke-width="1.4"/><path d="M2.5 16c0-2.8 2-4.5 4.5-4.5s4.5 1.7 4.5 4.5" stroke="currentColor" stroke-width="1.4"/><circle cx="14.5" cy="6.5" r="2" stroke="currentColor" stroke-width="1.3"/><path d="M12.7 11.7c1.9.2 3.3 1.7 3.3 4.3" stroke="currentColor" stroke-width="1.3"/></svg>`,
  opportunities: `<svg class="nav-icon" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="1.4"/><circle cx="10" cy="10" r="3.6" stroke="currentColor" stroke-width="1.4"/><circle cx="10" cy="10" r="0.9" fill="currentColor"/></svg>`,
  intelligence: `<svg class="nav-icon" viewBox="0 0 20 20" fill="none"><circle cx="9" cy="9" r="5.5" stroke="currentColor" stroke-width="1.4"/><path d="M13 13L17 17" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>`,
  ai: `<svg class="nav-icon" viewBox="0 0 20 20" fill="none"><path d="M10 2.5L11.4 7.6L16.5 9L11.4 10.4L10 15.5L8.6 10.4L3.5 9L8.6 7.6L10 2.5Z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/></svg>`,
  bell: `<svg width="15" height="15" viewBox="0 0 20 20" fill="none"><path d="M5 8a5 5 0 0110 0c0 4 1.5 5 1.5 5h-13S5 12 5 8z" stroke="currentColor" stroke-width="1.4" stroke-linejoin="round"/><path d="M8 15.5a2 2 0 004 0" stroke="currentColor" stroke-width="1.4"/></svg>`,
  search: `<svg width="14" height="14" viewBox="0 0 20 20" fill="none"><circle cx="9" cy="9" r="5.5" stroke="currentColor" stroke-width="1.5"/><path d="M13 13L17 17" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>`,
};

const NAV_ITEMS = [
  { route: "overview", label: "Overview", icon: ICONS.overview, question: "Where is the portfolio opportunity?" },
  { route: "clients", label: "Clients", icon: ICONS.clients, question: "Which clients should I focus on?" },
  { route: "opportunities", label: "Opportunities", icon: ICONS.opportunities, question: "Which products represent the biggest opportunities?" },
  { route: "intelligence", label: "Intelligence", icon: ICONS.intelligence, question: "What evidence supports the findings?" },
  { route: "ai-briefings", label: "AI Briefings", icon: ICONS.ai, question: "What should I do with this information?" },
];

/* ---------------------------------------------------------------------
 * Router
 * ------------------------------------------------------------------- */

function parseHash() {
  const raw = (location.hash || "#overview").replace(/^#\/?/, "");
  const [route, param] = raw.split("/");
  return { route: route || "overview", param };
}

function goTo(route, param) {
  location.hash = param ? `${route}/${param}` : route;
}

window.addEventListener("hashchange", render);
window.addEventListener("DOMContentLoaded", boot);

/**
 * Loads real data from results.json / external_financial.json (see
 * data.js) before the first render. Mock data rendered synchronously
 * on load is no longer possible now that the app reads from JSON files
 * on disk rather than a hard-coded object.
 */
async function boot() {
  document.getElementById("app").innerHTML = loadingTemplate();
  try {
    await loadSynBankData();
    render();
  } catch (err) {
    document.getElementById("app").innerHTML = errorTemplate(err);
    console.error("Syn Bank data load failed:", err);
  }
}

function loadingTemplate() {
  return `
    <div style="display:flex; align-items:center; justify-content:center; height:100vh; flex-direction:column; gap:10px; font-family:var(--font-mono); color:var(--text-muted); background:var(--surface-0);">
      <div class="eyebrow">SYN BANK</div>
      <div>Loading portfolio data…</div>
    </div>
  `;
}

function errorTemplate(err) {
  return `
    <div style="max-width:560px; margin:80px auto; padding:24px; border:1px solid var(--gap-high); border-radius:var(--radius); background:var(--gap-high-wash); font-family:var(--font-body); color:var(--text-primary);">
      <div class="eyebrow" style="color:var(--gap-high); margin-bottom:8px;">DATA LOAD FAILED</div>
      <p style="margin:0 0 8px;">${err.message}</p>
      <p style="margin:0; font-size:12.5px; color:var(--text-secondary);">
        Make sure results.json and external_financial.json are served from the same
        directory as index.html, and that the app is opened via a local/dev server
        (fetch of local JSON files is blocked when opening index.html directly as a file://).
      </p>
    </div>
  `;
}

function render() {
  // Guards against a stray hashchange event firing before boot() finishes loading data.
  if (!SYNBANK_DATA) return;
  const { route, param } = parseHash();
  document.getElementById("app").innerHTML = shellTemplate(route);
  const pageEl = document.getElementById("page-outlet");

  switch (route) {
    case "clients":
      pageEl.innerHTML = renderClientsPage();
      wireClientsFilters();
      break;
    case "client":
          pageEl.innerHTML = renderClientDetailPage(param);
          wireSuggestedQuestions();
          break;
    case "opportunities":
      pageEl.innerHTML = renderOpportunitiesPage();
      break;
    case "intelligence":
      pageEl.innerHTML = renderIntelligencePage();
      break;
    case "ai-briefings":
      pageEl.innerHTML = renderAIBriefingsPage();
      break;
    default:
      pageEl.innerHTML = renderOverviewPage();
  }
  window.scrollTo(0, 0);
}

/* ---------------------------------------------------------------------
 * Shell (sidebar + topbar)
 * ------------------------------------------------------------------- */

function shellTemplate(activeRoute) {
  const activeNav = NAV_ITEMS.find((n) => n.route === activeRoute) || NAV_ITEMS[0];
  const isClientDetail = activeRoute === "client";

  return `
    <div class="app-shell">
      <aside class="sidebar">
        <div class="brand">
          <div class="brand-mark">S</div>
          <div class="brand-text">
            <div class="brand-name">Syn Bank</div>
            <div class="brand-sub">Wallet Intelligence</div>
          </div>
        </div>
        <div class="nav-section-label">Platform</div>
        <ul class="nav-list">
          ${NAV_ITEMS.map(
            (n) => `
            <li>
              <a class="nav-link ${n.route === activeRoute ? "active" : ""}" href="#${n.route}">
                ${n.icon}<span>${n.label}</span>
              </a>
            </li>`
          ).join("")}
        </ul>
        <div class="sidebar-footer">
          <div>SYN BANK CIB</div>
          <div>Portfolio as of ${getMeta().asOf}</div>
        </div>
      </aside>

      <div class="main-col">
        <header class="topbar">
          <div>
            <div class="topbar-title">${isClientDetail ? "Client Intelligence" : activeNav.label}</div>
            <div class="topbar-crumb">SYN BANK / ${isClientDetail ? "CLIENTS / DETAIL" : activeNav.label.toUpperCase()}</div>
          </div>
          <div class="topbar-right">
            <div class="search-box">${ICONS.search}<input type="text" placeholder="Search clients, sectors, products..." /></div>
            <button class="topbar-icon-btn" aria-label="Notifications">${ICONS.bell}<span class="dot"></span></button>
            <div class="avatar">TN</div>
          </div>
        </header>
        <main class="page" id="page-outlet"></main>
      </div>
    </div>
  `;
}

/* ---------------------------------------------------------------------
 * Shared bits
 * ------------------------------------------------------------------- */

function pageIntro(questionLabel, heading, sub) {
  return `
    <div class="page-intro">
      <div class="page-question">${questionLabel}</div>
      <h1 class="page-heading">${heading}</h1>
      <p class="page-sub">${sub}</p>
    </div>
  `;
}

function priorityPill(priority) {
  const label = priority === "high" ? "High priority" : priority === "medium" ? "Medium priority" : "Low priority";
  return `<span class="pill priority-${priority}">${label}</span>`;
}

function scoreBadge(score) {
  const p = priorityFromScore(score);
  return `<div class="score-badge ${p}">${score}</div>`;
}

/* ---------------------------------------------------------------------
 * OVERVIEW PAGE
 * ------------------------------------------------------------------- */

function renderOverviewPage() {
  const totals = getPortfolioTotals();
  const top = getTopOpportunities(5);

  return `
    ${pageIntro("WHERE IS THE PORTFOLIO OPPORTUNITY?", "Executive Overview", `Portfolio-wide wallet position across ${totals.clientCount} corporate and investment banking clients, as of ${getMeta().asOf}.`)}

    <div class="grid-4">
      <div class="kpi-card">
        <div class="kpi-label">Estimated Total Wallet <span class="kpi-tag estimated">Estimated</span></div>
        <div class="kpi-value display-num">${formatZAR(totals.estimatedWallet)}</div>
        <div class="kpi-foot">Estimated across ${totals.clientCount} corporate clients</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Current Syn Bank Wallet <span class="kpi-tag observed">Observed</span></div>
        <div class="kpi-value display-num">${formatZAR(totals.synBankWallet)}</div>
        <div class="kpi-foot">Captured across active facilities and accounts</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Portfolio Share of Wallet <span class="kpi-tag estimated">Derived</span></div>
        <div class="kpi-value display-num">${formatPct(totals.shareOfWallet)}</div>
        <div class="kpi-foot">Of estimated total wallet currently captured</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Potential Opportunity <span class="kpi-tag estimated">Estimated</span></div>
        <div class="kpi-value display-num">${formatZAR(totals.walletGap)}</div>
        <div class="kpi-foot">Unowned wallet across the portfolio</div>
      </div>
    </div>

    <div class="grid-12 mt-22" style="align-items: start;">
      <div style="grid-column: span 7;" class="card card-pad">
        <div class="section-label">Top Growth Opportunities<span class="rule"></span></div>
        ${renderOpportunityTable(top, true)}
      </div>
      <div style="grid-column: span 5;" class="card card-pad">
        <div class="section-label">Opportunity Matrix<span class="rule"></span></div>
        <div class="matrix-wrap">${buildOpportunityMatrixSVG(getClients())}</div>
        <p class="text-sm text-muted mt-8">Bubble size reflects opportunity score. The shaded quadrant marks clients with high potential wallet and low current share — the priority zone.</p>
      </div>
    </div>

    <div class="card card-pad mt-22">
      <div class="section-label">Opportunity Heatmap — Product Penetration by Client<span class="rule"></span></div>
      ${renderHeatmap()}
    </div>
  `;
}

function renderOpportunityTable(clients, clickable) {
  return `
    <table class="data-table">
      <thead>
        <tr>
          <th>Client</th>
          <th>Wallet Gap</th>
          <th>Share</th>
          <th>Score</th>
          <th>Priority</th>
        </tr>
      </thead>
      <tbody>
        ${clients
          .map(
            (c) => `
          <tr ${clickable ? `onclick="goTo('client','${c.id}')"` : ""}>
            <td>
              <div class="client-name-cell">
                <span class="name">${c.name}</span>
                <span class="sector">${c.sector}</span>
              </div>
            </td>
            <td class="mono">${formatZAR(c.walletGap)}</td>
            <td class="mono">${formatPct(c.shareOfWallet)}</td>
            <td>${scoreBadge(c.opportunityScore)}</td>
            <td>${priorityPill(c.priority)}</td>
          </tr>`
          )
          .join("")}
      </tbody>
    </table>
  `;
}

function renderHeatmap() {
  const products = getProductDefs();
  const clients = getClients();
  const symbolFor = (level) => (level === "high" ? "●●●" : level === "medium" ? "●●" : "●");

  return `
    <div class="heatmap-wrap">
      <table class="heatmap">
        <thead>
          <tr>
            <th style="text-align:left;">Client</th>
            ${products.map((p) => `<th>${p.label}</th>`).join("")}
          </tr>
        </thead>
        <tbody>
          ${clients
            .map(
              (c) => `
            <tr>
              <th onclick="goTo('client','${c.id}')" style="cursor:pointer;">${c.name}</th>
              ${products
                .map((p) => {
                  const level = c.products[p.key].level;
                  return `<td class="heat-cell ${level}" title="${c.name} — ${p.label}: ${level.toUpperCase()} opportunity">${symbolFor(level)}</td>`;
                })
                .join("")}
            </tr>`
            )
            .join("")}
        </tbody>
      </table>
    </div>
    <div class="flex gap-16 mt-16 text-sm text-muted">
      <span><span class="level-tag high">high</span> underpenetrated — largest opportunity</span>
      <span><span class="level-tag medium">medium</span> partial penetration</span>
      <span><span class="level-tag low">low</span> well penetrated</span>
    </div>
  `;
}

/* ---------------------------------------------------------------------
 * CLIENTS PAGE
 * ------------------------------------------------------------------- */

function renderClientsPage() {
  const sectors = [...new Set(getClients().map((c) => c.sector))].sort();
  return `
    ${pageIntro("WHICH CLIENTS SHOULD I FOCUS ON?", "Client Intelligence", "Search and filter the full portfolio to find where Syn Bank's wallet share is lowest relative to potential.")}

    <div class="filter-bar">
      <input type="text" class="search-input" id="client-search" placeholder="Search clients..." />
      <select class="filter-select" id="filter-sector">
        <option value="">All sectors</option>
        ${sectors.map((s) => `<option value="${s}">${s}</option>`).join("")}
      </select>
      <select class="filter-select" id="filter-priority">
        <option value="">All priorities</option>
        <option value="high">High priority</option>
        <option value="medium">Medium priority</option>
        <option value="low">Low priority</option>
      </select>
    </div>

    <div class="card card-pad">
      <table class="data-table">
        <thead>
          <tr>
            <th>Client</th>
            <th>Estimated Wallet</th>
            <th>Syn Bank Wallet</th>
            <th>Share</th>
            <th>Wallet Gap</th>
            <th>Score</th>
            <th>Priority</th>
            <th>Main Opportunity</th>
          </tr>
        </thead>
        <tbody id="clients-tbody">
          ${getClients().map(clientRow).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function mainOpportunityFor(client) {
  const entries = Object.entries(client.products);
  entries.sort((a, b) => b[1].value - a[1].value);
  const key = entries[0][0];
  const def = getProductDefs().find((p) => p.key === key);
  return def ? def.label : key;
}

function clientRow(c) {
  return `
    <tr data-sector="${c.sector}" data-priority="${c.priority}" data-name="${c.name.toLowerCase()}" onclick="goTo('client','${c.id}')">
      <td>
        <div class="client-name-cell">
          <span class="name">${c.name}</span>
          <span class="sector">${c.sector}</span>
        </div>
      </td>
      <td class="mono">${formatZAR(c.estimatedWallet)}</td>
      <td class="mono">${formatZAR(c.synBankWallet)}</td>
      <td class="mono">${formatPct(c.shareOfWallet)}</td>
      <td class="mono">${formatZAR(c.walletGap)}</td>
      <td>${scoreBadge(c.opportunityScore)}</td>
      <td>${priorityPill(c.priority)}</td>
      <td class="text-sm">${mainOpportunityFor(c)}</td>
    </tr>
  `;
}

function wireClientsFilters() {
  const search = document.getElementById("client-search");
  const sectorSel = document.getElementById("filter-sector");
  const prioritySel = document.getElementById("filter-priority");
  if (!search) return;

  function apply() {
    const term = search.value.trim().toLowerCase();
    const sector = sectorSel.value;
    const priority = prioritySel.value;
    document.querySelectorAll("#clients-tbody tr").forEach((row) => {
      const matchesTerm = !term || row.dataset.name.includes(term);
      const matchesSector = !sector || row.dataset.sector === sector;
      const matchesPriority = !priority || row.dataset.priority === priority;
      row.style.display = matchesTerm && matchesSector && matchesPriority ? "" : "none";
    });
  }

  search.addEventListener("input", apply);
  sectorSel.addEventListener("change", apply);
  prioritySel.addEventListener("change", apply);
}

/* ---------------------------------------------------------------------
 * CLIENT DETAIL PAGE
 * ------------------------------------------------------------------- */

function renderClientDetailPage(id) {
  const c = getClientById(id);
  if (!c) {
    return `<p>Client not found. <a href="#clients">Return to Clients</a></p>`;
  }
  const initials = c.name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("");

  return `
    <a class="back-link" href="#clients">← Back to Clients</a>

    <div class="client-hero">
      <div class="client-id-block">
        <div class="client-logo">${initials}</div>
        <div>
          <h1>${c.name}</h1>
          <div class="client-meta-row">
            <span>${c.sector}</span><span class="sep">/</span>
            <span>${c.hq}</span><span class="sep">/</span>
            <span>RM: ${c.relationshipManager}</span>
          </div>
        </div>
      </div>
      <div class="flex-col" style="align-items: flex-end; gap: 8px;">
        ${priorityPill(c.priority)}
        <div class="text-sm text-muted">Opportunity Score <strong class="mono" style="color:var(--text-primary)">${c.opportunityScore}</strong>/100</div>
      </div>
    </div>

    <div class="wallet-summary-grid">
      <div class="wallet-summary-cell">
        <div class="kpi-label">Estimated Total Wallet <span class="kpi-tag estimated">Estimated</span></div>
        <div class="kpi-value display-num">${formatZAR(c.estimatedWallet)}</div>
      </div>
      <div class="wallet-summary-cell">
        <div class="kpi-label">Syn Bank Wallet <span class="kpi-tag observed">Observed</span></div>
        <div class="kpi-value display-num">${formatZAR(c.synBankWallet)}</div>
      </div>
      <div class="wallet-summary-cell">
        <div class="kpi-label">Share of Wallet <span class="kpi-tag estimated">Derived</span></div>
        <div class="kpi-value display-num">${formatPct(c.shareOfWallet)}</div>
      </div>
      <div class="wallet-summary-cell">
        <div class="kpi-label">Potential Wallet Gap <span class="kpi-tag estimated">Estimated</span></div>
        <div class="kpi-value display-num">${formatZAR(c.walletGap)}</div>
      </div>
    </div>

    ${renderExternalFinancialsCard(c)}

    <div class="grid-12 mt-22">
      <div style="grid-column: span 7;" class="card card-pad">
        <div class="section-label">Product Opportunities<span class="rule"></span></div>
        ${renderProductBars(c)}
      </div>
      <div style="grid-column: span 5;" class="card card-pad">
        <div class="section-label">Why Is This an Opportunity?<span class="rule"></span></div>
        <ul class="evidence-list">
          ${c.evidence
            .map(
              (e) => `
            <li class="evidence-item">
              <span class="evidence-check">✓</span>
              <span>${e.text}</span>
              <span class="evidence-tag ${e.type}" style="margin-left:auto;">${e.type}</span>
            </li>`
            )
            .join("")}
        </ul>
      </div>
    </div>

    <div class="mt-22">
      ${renderAIBriefingPanel(c)}
    </div>
  `;
}

function renderProductBars(client) {
  const products = getProductDefs();
  const rows = products
    .map((p) => ({ ...p, ...client.products[p.key] }))
    .sort((a, b) => b.value - a.value);

  return `
    <div>
      ${rows
        .map(
          (r) => `
        <div class="opp-bar-row">
          <div class="opp-bar-label">${r.label}</div>
          <div class="opp-bar-track"><div class="opp-bar-fill ${r.level}" style="width:${Math.round(r.value * 100)}%"></div></div>
          <div style="text-align:right;"><span class="level-tag ${r.level}">${r.level}</span></div>
        </div>`
        )
        .join("")}
    </div>
  `;
}

/**
 * External Financial Snapshot — raw data straight from
 * external_financial.json for this entity (matched on entity_name).
 * Null fields (e.g. cost_of_sales, foreign_costs_imports) are shown as
 * "—", never invented or coerced to zero.
 */
function renderExternalFinancialsCard(client) {
  const ext = client.externalFinancials;

  if (!ext) {
    return `
      <div class="card card-pad mt-22">
        <div class="section-label">External Financial Snapshot <span class="evidence-tag" style="margin-left:6px;">external_financial.json</span><span class="rule"></span></div>
        <p class="text-sm text-muted" style="margin:0;">No matching record was found for this entity in external_financial.json.</p>
      </div>
    `;
  }

  const fields = [
    { label: "Revenue", value: ext.revenue },
    { label: "Cost of Sales", value: ext.cost_of_sales },
    { label: "Foreign Costs / Imports", value: ext.foreign_costs_imports },
    { label: "Net Worth", value: ext.net_worth },
    { label: "Total Debt", value: ext.total_debt },
    { label: "Total Liquidity", value: ext.total_liquidity },
  ];

  return `
    <div class="card card-pad mt-22">
      <div class="section-label">External Financial Snapshot <span class="evidence-tag observed" style="margin-left:6px;">external_financial.json</span><span class="rule"></span></div>
      <div class="grid-4">
        ${fields
          .map(
            (f) => `
          <div class="kpi-card">
            <div class="kpi-label">${f.label}</div>
            <div class="kpi-value display-num" style="font-size:20px;">${formatZAROrDash(f.value)}</div>
          </div>`
          )
          .join("")}
      </div>
      <p class="text-sm text-muted mt-12" style="margin-bottom:0;">"—" indicates the field was not disclosed in the source data, not that the value is zero.</p>
    </div>
  `;
}

/* ---------------------------------------------------------------------
 * AI BRIEFING PANEL (used on client detail page)
 * ------------------------------------------------------------------- */

const SUGGESTED_QUESTIONS = [
  "Why should I prioritise this client?",
  "What are the biggest opportunities?",
  "Why is FX an opportunity?",
  "Explain the wallet estimate.",
  "What evidence supports this recommendation?",
  "Prepare me for my client meeting.",
  "What products should I discuss?",
  "What risks should I consider?",
];

function renderAIBriefingPanel(client) {
  return `
    <div class="ai-panel">
      <div class="ai-badge"><span class="spark">✦</span> SYN AI — CLIENT BRIEFING</div>
      <div class="ai-briefing-title">${client.name}</div>
      <p class="ai-briefing-body">${client.briefing}</p>
      <div class="ai-next-step">
        <div class="label">Recommended Next Step</div>
        <div class="text">${client.nextStep}</div>
      </div>

      <div class="ai-chat-log" id="ai-chat-log"></div>

      <div class="ai-ask-box">
        <input type="text" id="ai-ask-input" placeholder="Ask Syn AI about this client..." onkeydown="if(event.key==='Enter') askSynAI('${client.id}')" />
        <button class="btn btn-brass" onclick="askSynAI('${client.id}')">Ask</button>
      </div>
      <div class="suggested-q">
        ${SUGGESTED_QUESTIONS
            .map(
                (q) => `
                    <button
                        type="button"
                        class="suggested-question"
                        data-client-id="${client.id}"
                        data-question="${q.replace(/&/g, "&amp;").replace(/"/g, "&quot;")}"
                    >
                        ${q}
                    </button>
                `
            )
            .join("")}
      </div>
    </div>
  `;
}

async function askSynAI(clientId, presetQuestion) {

    const client = getClientById(clientId);

    const input =
        document.getElementById("ai-ask-input");

    const question =
        presetQuestion ||
        (input ? input.value.trim() : "");

    if (!question) {
        return;
    }

    const log =
        document.getElementById("ai-chat-log");

    /*
     * Display the user's question.
     */
    const userMsg =
        document.createElement("div");

    userMsg.className =
        "ai-chat-msg user";

    userMsg.textContent =
        question;

    log.appendChild(userMsg);

    /*
     * Temporary AI message.
     */
    const aiMsg =
        document.createElement("div");

    aiMsg.className =
        "ai-chat-msg ai";

    aiMsg.textContent =
        "Thinking…";

    log.appendChild(aiMsg);

    log.scrollTop =
        log.scrollHeight;

    if (input) {
        input.value = "";
    }

    try {

        const answer =
            await window.askAI(
                client,
                question
            );

        aiMsg.textContent =
            answer;

    } catch (error) {

        console.error(
            "Syn AI request failed:",
            error
        );

        aiMsg.textContent =
            "Sorry, I couldn't get an answer right now.";
    }

    log.scrollTop =
        log.scrollHeight;
}

function wireSuggestedQuestions() {
    document
        .querySelectorAll(".suggested-question")
        .forEach((button) => {
            button.addEventListener("click", () => {
                const clientId =
                    button.dataset.clientId;

                const question =
                    button.dataset.question;

                askSynAI(
                    clientId,
                    question
                );
            });
        });
}

function findAnswer(client, question) {
  const norm = question.trim().toLowerCase().replace(/\s+/g, " ");
  if (client.questions[norm]) return client.questions[norm];
  // fuzzy: match on shared keywords
  const qWords = norm.replace(/[^a-z0-9 ]/g, "").split(" ").filter((w) => w.length > 3);
  let best = null;
  let bestScore = 0;
  Object.entries(client.questions).forEach(([key, answer]) => {
    const score = qWords.filter((w) => key.includes(w)).length;
    if (score > bestScore) {
      bestScore = score;
      best = answer;
    }
  });
  if (best) return best;
  return `${client.briefing} Recommended next step: ${client.nextStep}`;
}

/* ---------------------------------------------------------------------
 * OPPORTUNITIES PAGE
 * ------------------------------------------------------------------- */

function renderOpportunitiesPage() {
  const productSummary = getProductLevelSummary().sort((a, b) => b.highCount - a.highCount);
  const topByGap = [...getClients()].sort((a, b) => b.walletGap - a.walletGap);

  return `
    ${pageIntro("WHICH PRODUCTS REPRESENT THE BIGGEST OPPORTUNITIES?", "Opportunities", "Product-level view of where Syn Bank is most underpenetrated across the portfolio, and which clients carry the largest absolute wallet gaps.")}

    <div class="grid-12">
      <div style="grid-column: span 6;" class="card card-pad">
        <div class="section-label">Portfolio-Wide Product Gaps<span class="rule"></span></div>
        <div>
          ${productSummary
            .map((p) => {
              const level = p.avgValue >= 0.65 ? "high" : p.avgValue >= 0.4 ? "medium" : "low";
              return `
              <div class="opp-bar-row">
                <div class="opp-bar-label">${p.label}</div>
                <div class="opp-bar-track"><div class="opp-bar-fill ${level}" style="width:${Math.round(p.avgValue * 100)}%"></div></div>
                <div class="text-sm text-muted" style="text-align:right;">${p.highCount}/8 clients</div>
              </div>`;
            })
            .join("")}
        </div>
        <p class="text-sm text-muted mt-12">Bar length reflects average opportunity intensity across the portfolio. The count shows how many clients flag that product as a HIGH-priority gap.</p>
      </div>

      <div style="grid-column: span 6;" class="card card-pad">
        <div class="section-label">Opportunity Matrix<span class="rule"></span></div>
        <div class="matrix-wrap">${buildOpportunityMatrixSVG(getClients())}</div>
      </div>
    </div>

    <div class="card card-pad mt-22">
      <div class="section-label">Clients Ranked by Wallet Gap<span class="rule"></span></div>
      ${renderOpportunityTable(topByGap, true)}
    </div>
  `;
}

/* ---------------------------------------------------------------------
 * INTELLIGENCE PAGE
 * ------------------------------------------------------------------- */

function renderIntelligencePage() {
  const clients = getClients();
  return `
    ${pageIntro("WHAT EVIDENCE SUPPORTS THE FINDINGS?", "Intelligence", "Every opportunity score is backed by evidence. This view separates what has been directly observed in transaction data from what the model infers from company and sector context.")}

    <div class="grid-4 mt-8" style="margin-bottom: 22px;">
      <div class="kpi-card">
        <div class="kpi-label">Observed Signals</div>
        <div class="kpi-value display-num">${clients.reduce((s, c) => s + c.evidence.filter((e) => e.type === "observed").length, 0)}</div>
        <div class="kpi-foot">Directly present in transaction &amp; account data</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Model-Based Inferences</div>
        <div class="kpi-value display-num">${clients.reduce((s, c) => s + c.evidence.filter((e) => e.type === "inferred").length, 0)}</div>
        <div class="kpi-foot">Derived from sector benchmarks &amp; company context</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">High-Priority Clients</div>
        <div class="kpi-value display-num">${clients.filter((c) => c.priority === "high").length}</div>
        <div class="kpi-foot">Score ≥ 80 — recommended for immediate engagement</div>
      </div>
      <div class="kpi-card">
        <div class="kpi-label">Avg. Opportunity Score</div>
        <div class="kpi-value display-num">${Math.round(clients.reduce((s, c) => s + c.opportunityScore, 0) / clients.length)}</div>
        <div class="kpi-foot">Across the full portfolio</div>
      </div>
    </div>

    <div class="flex-col gap-16">
      ${clients
        .map(
          (c) => `
        <div class="card card-pad">
          <div class="flex justify-between items-center mb-14">
            <div class="flex items-center gap-10">
              <strong style="font-family:var(--font-display); font-size:16px;">${c.name}</strong>
              <span class="text-sm text-muted">${c.sector}</span>
            </div>
            <div class="flex items-center gap-10">
              ${priorityPill(c.priority)}
              <button class="btn btn-sm" onclick="goTo('client','${c.id}')">View client →</button>
            </div>
          </div>
          <ul class="evidence-list">
            ${c.evidence
              .map(
                (e) => `
              <li class="evidence-item">
                <span class="evidence-check">✓</span>
                <span>${e.text}</span>
                <span class="evidence-tag ${e.type}" style="margin-left:auto;">${e.type}</span>
              </li>`
              )
              .join("")}
          </ul>
        </div>`
        )
        .join("")}
    </div>
  `;
}

/* ---------------------------------------------------------------------
 * AI BRIEFINGS PAGE
 * ------------------------------------------------------------------- */

function renderAIBriefingsPage() {
  const clients = [...getClients()].sort((a, b) => b.opportunityScore - a.opportunityScore);
  return `
    ${pageIntro("WHAT SHOULD I DO WITH THIS INFORMATION?", "AI Client Briefings", "Syn AI turns each client's analytical profile into a short, commercially-relevant briefing and a recommended next step — ready before any client meeting.")}

    <div class="grid-2">
      ${clients
        .map(
          (c) => `
        <div class="briefing-card">
          <div class="briefing-card-head">
            <div>
              <div class="eyebrow" style="margin-bottom:4px;">${c.sector}</div>
              <h3>${c.name}</h3>
            </div>
            ${priorityPill(c.priority)}
          </div>
          <p class="briefing-snippet">${c.briefing}</p>
          <div class="briefing-card-foot">
            <span class="text-sm text-muted">Score <strong class="mono" style="color:var(--text-primary)">${c.opportunityScore}</strong>/100</span>
            <button class="btn btn-sm btn-primary" onclick="goTo('client','${c.id}')">View brief →</button>
          </div>
        </div>`
        )
        .join("")}
    </div>
  `;
}
