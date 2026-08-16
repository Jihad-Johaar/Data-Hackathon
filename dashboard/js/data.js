/**
 * SYN BANK — SHARE OF WALLET INTELLIGENCE ENGINE
 * ------------------------------------------------
 * REAL-DATA INTEGRATION LAYER (Phase 1)
 *
 * This file replaces the previous hard-coded SYNBANK_DATA mock object.
 * It now builds SYNBANK_DATA at runtime from two source-of-truth files:
 *
 *   - results.json            → per-entity wallet sizing, capture, and
 *                                gap figures already computed by the
 *                                Syn Bank wallet-sizing model
 *                                (client_rankings_and_data), plus
 *                                portfolio-level totals and run metadata.
 *   - external_financial.json → raw, reported external financial
 *                                statement data per entity (revenue,
 *                                cost of sales, net worth, debt,
 *                                liquidity). Treated as the source of
 *                                truth for external financial data.
 *
 * All rendering code (app.js, charts.js) is untouched below the
 * accessor functions at the bottom of this file — it never reads
 * SYNBANK_DATA directly, exactly as the original file's header comment
 * intended, which is what makes this swap possible without touching
 * any page templates.
 *
 * WHAT WAS REMOVED: the previous file hard-coded 8 fictional clients
 * ("Mining Corp", "Retail Holdings", ...) with invented wallet values,
 * evidence text, AI briefings, and Q&A answers. None of that remains —
 * every number and every generated sentence below is derived from the
 * two JSON files loaded at runtime. Nothing is hard-coded per entity.
 *
 * WHAT WAS PRESERVED FROM results.json: the model's own computed
 * wallet sizing (Est_*_Wallet_ZARbn), capture figures, competitor
 * leakage, and opportunity_rank are treated as authoritative and are
 * NOT recalculated here — this phase reads them, converts units, and
 * maps them into the shapes the existing UI already knows how to
 * render. The only new "calculation" introduced here is a linear
 * rescaling of the model's own opportunity_rank into a 0–100 score for
 * the existing score-badge / priority-pill UI, since results.json
 * exposes a rank rather than a 0–100 score (see deriveOpportunityScore
 * below).
 *
 * PRODUCT PILLARS: results.json's own visualization manifest
 * (opportunity_heatmap.html) tracks exactly three product-level gap
 * dimensions — Transactional, SWIFT (cross-border), and Trade. This
 * file mirrors that same three-pillar breakdown rather than inventing
 * additional product categories the source model doesn't compute.
 * (The mock data's FX/Payments/Liquidity/Guarantees breakdown had no
 * equivalent in the real model and has been dropped — see the
 * accompanying integration notes for detail.) Total portfolio/client
 * wallet figures still include the full modelled wallet — including a
 * lending/guarantees component (Est_Lending_Wallet_ZARbn) that the
 * source model doesn't break out at the product-gap level — so the sum
 * of the three product bars will legitimately be smaller than the
 * client's total wallet gap. This is called out explicitly in each
 * client's evidence list rather than silently folded into a pillar.
 *
 * NULL HANDLING: external_financial.json contains null for
 * cost_of_sales (some entities) and foreign_costs_imports (all
 * entities). Nulls are never coerced to 0 or invented — they are
 * displayed as "—" (see formatZAROrDash in charts.js) and skipped in
 * any generated commentary that would otherwise depend on them.
 */

/* ---------------------------------------------------------------------
 * Data source paths
 * Fetched relative to index.html. Adjust these two constants if your
 * deployment serves the JSON files from a different location (e.g. an
 * /data/ folder) — nothing else in this file needs to change.
 * ------------------------------------------------------------------- */

const RESULTS_JSON_PATH = "../pipeline/results.json";
const EXTERNAL_FINANCIAL_JSON_PATH = "../pipeline/analysis/external_financial.json";

/* ---------------------------------------------------------------------
 * Product pillars tracked at the individual-client level.
 * Mirrors the three columns of the source model's own
 * opportunity_heatmap.html (Transactional Gap / SWIFT Gap / Trade Gap).
 * ------------------------------------------------------------------- */

const PRODUCT_DEFS = [
  { key: "transactional", label: "Transactional Banking" },
  { key: "swift", label: "Cross-Border Payments (SWIFT)" },
  { key: "trade", label: "Trade Finance" },
];

/* ---------------------------------------------------------------------
 * Small helpers
 * ------------------------------------------------------------------- */

function normalizeEntityName(name) {
  return (name || "").trim().toLowerCase().replace(/\s+/g, " ");
}

function slugify(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Fraction of a product's estimated wallet NOT captured by Syn Bank, clamped to [0,1]. */
function pillarGapFraction(captureBn, estBn) {
  if (!estBn || estBn <= 0) return 0;
  const ratio = captureBn / estBn;
  return Math.min(1, Math.max(0, 1 - ratio));
}

function levelFromValue(v) {
  if (v >= 0.65) return "high";
  if (v >= 0.4) return "medium";
  return "low";
}

/**
 * Rescales the wallet-sizing model's own opportunity_rank (1 = biggest
 * opportunity) onto a 0–100 scale purely so the existing score-badge /
 * priority-pill UI components (unchanged) have a value to render.
 * Rank 1 → 100, rank N → 35. This does not change or re-derive the
 * ranking itself, which comes straight from results.json.
 */
function deriveOpportunityScore(rank, n) {
  if (!n || n <= 1) return 100;
  const t = (rank - 1) / (n - 1);
  return Math.round(100 - t * 65);
}

/* ---------------------------------------------------------------------
 * Evidence / briefing / next-step / Q&A generation
 * Every sentence below is built from real fields on `e` (a row from
 * results.json) and `ext` (the matched row from external_financial.json,
 * or null if no match exists). Nothing here is per-entity hard-coded.
 * ------------------------------------------------------------------- */

function buildEvidence(e, ext, topPillar) {
  const items = [];
  const sharePct = Math.round(e["Share_of_Wallet_%"]);

  items.push({
    text: `Syn Bank currently captures ${sharePct}% of ${e.entity_name}'s estimated total banking wallet (${formatZAR(
      e.Total_Estimated_Wallet_ZARbn * 1e9
    )}), leaving ${formatZAR(e.Competitor_Leakage_ZARbn * 1e9)} held with competitor banks.`,
    type: "observed",
  });

  items.push({
    text: `${topPillar.label} is the widest product-level gap: Syn Bank holds only ${Math.round(
      (1 - topPillar.gapFraction) * 100
    )}% of the estimated ${formatZAR(topPillar.est * 1e9)} ${topPillar.label.toLowerCase()} wallet.`,
    type: "observed",
  });

  if (e.Est_Lending_Wallet_ZARbn > 0) {
    items.push({
      text: `An estimated ${formatZAR(
        e.Est_Lending_Wallet_ZARbn * 1e9
      )} lending/guarantees wallet is implied by the client's balance-sheet scale. This is not broken out as a fourth product pillar (the source model tracks it only at the total-wallet level), and none of it is reflected in Syn Bank's transactional, SWIFT, or trade-finance capture.`,
      type: "inferred",
    });
  }

  if (ext) {
    if (ext.cost_of_sales != null && ext.revenue) {
      const cogsPct = Math.round((ext.cost_of_sales / ext.revenue) * 100);
      items.push({
        text: `Reported cost of sales equals ${cogsPct}% of revenue, consistent with sector-typical working-capital and trade-finance financing needs.`,
        type: "inferred",
      });
    } else {
      items.push({
        text: `Cost of sales is not disclosed for this entity in external_financial.json, so cost-structure-based signals are not available for it.`,
        type: "inferred",
      });
    }
    if (ext.total_debt != null && ext.total_liquidity != null) {
      items.push({
        text: `Reported total debt of ${formatZAR(ext.total_debt)} against liquidity of ${formatZAR(
          ext.total_liquidity
        )} points to potential lending and cash-management opportunity beyond the client's current transactional footprint.`,
        type: "inferred",
      });
    }
  } else {
    items.push({
      text: `No matching record was found for this entity in external_financial.json, so external balance-sheet signals are unavailable for it.`,
      type: "inferred",
    });
  }

  return items;
}

function buildBriefing(e, topPillar, n) {
  const sharePct = Math.round(e["Share_of_Wallet_%"]);
  return `${e.entity_name} ranks #${e.opportunity_rank} of ${n} in the portfolio by modelled opportunity size. Syn Bank currently captures ${sharePct}% of an estimated ${formatZAR(
    e.Total_Estimated_Wallet_ZARbn * 1e9
  )} total wallet. The largest product-level gap sits in ${topPillar.label}, where Syn Bank holds only ${Math.round(
    (1 - topPillar.gapFraction) * 100
  )}% of the estimated wallet. The remaining ${formatZAR(
    e.Competitor_Leakage_ZARbn * 1e9
  )} gap represents this client's clearest cross-sell opportunity.`;
}

function buildNextStep(e, topPillar) {
  return `Prioritise a ${topPillar.label} conversation, using the ${formatZAR(
    e.Competitor_Leakage_ZARbn * 1e9
  )} estimated wallet gap to frame the opportunity at the next relationship review.`;
}

function buildQuestions(e, ext, topPillar, opportunityScore, n, otherPillarLabels) {
  const sharePct = Math.round(e["Share_of_Wallet_%"]);
  const riskAnswer =
    ext && ext.total_debt != null && ext.total_liquidity != null
      ? `Reported total debt of ${formatZAR(ext.total_debt)} against ${formatZAR(
          ext.total_liquidity
        )} of liquidity should be weighed before proposing new facilities.`
      : `Limited external financial data is available for this entity — validate balance-sheet assumptions before proposing new facilities.`;

  return {
    "why should i prioritise this client?": `${e.entity_name} is ranked #${e.opportunity_rank} of ${n} by estimated competitor leakage (${formatZAR(
      e.Competitor_Leakage_ZARbn * 1e9
    )}), giving it a derived opportunity score of ${opportunityScore}/100.`,
    "what are the biggest opportunities?": `${topPillar.label} is the largest gap: only ${Math.round(
      (1 - topPillar.gapFraction) * 100
    )}% of its estimated wallet is currently captured by Syn Bank.`,
    "why is fx an opportunity?": `This phase tracks three product pillars — Transactional, Cross-Border Payments (SWIFT), and Trade Finance — rather than a standalone FX line. Cross-border and foreign-currency exposure is reflected within the Cross-Border Payments (SWIFT) pillar; see "What are the biggest opportunities?" for whether that's the leading gap here.`,
    "explain the wallet estimate.": `The ${formatZAR(
      e.Total_Estimated_Wallet_ZARbn * 1e9
    )} total estimated wallet comes directly from Syn Bank's wallet-sizing model output in results.json, which combines external_financial.json inputs (revenue, cost of sales, net worth, debt) with sector multipliers. It is a modelled estimate, not an observed figure.`,
    "what evidence supports this recommendation?": `Observed: ${sharePct}% share of wallet from Syn Bank's own transactional, SWIFT, and trade-finance capture data. Inferred: sector-benchmarked wallet sizing and, where available, external balance-sheet signals from external_financial.json.`,
    "prepare me for my client meeting.": `Lead with ${topPillar.label}, the client's largest gap, and reference the ${formatZAR(
      e.Competitor_Leakage_ZARbn * 1e9
    )} wallet currently held elsewhere.`,
    "what products should i discuss?": `${topPillar.label} first; ${otherPillarLabels} as secondary talking points.`,
    "what risks should i consider?": riskAnswer,
  };
}

/* ---------------------------------------------------------------------
 * Client record construction
 * ------------------------------------------------------------------- */

function buildClient(e, ext, n) {
  const id = slugify(e.entity_name);

  const estimatedWallet = (e.Total_Estimated_Wallet_ZARbn || 0) * 1e9;
  const synBankWallet = (e["Total Capture (ZARbn)"] || 0) * 1e9;
  const walletGap = (e.Competitor_Leakage_ZARbn || 0) * 1e9;
  const shareOfWallet = (e["Share_of_Wallet_%"] || 0) / 100;

  const opportunityScore = deriveOpportunityScore(e.opportunity_rank, n);
  const priority = priorityFromScore(opportunityScore); // reuses existing charts.js formula, unchanged

  const pillarSource = [
    { key: "transactional", label: "Transactional Banking", capture: e["Transactional (ZARbn)"], est: e.Est_Trans_Wallet_ZARbn },
    { key: "swift", label: "Cross-Border Payments (SWIFT)", capture: e["SWIFT (ZARbn)"], est: e.Est_SWIFT_Wallet_ZARbn },
    { key: "trade", label: "Trade Finance", capture: e["Trade (ZARbn)"], est: e.Est_Trade_Wallet_ZARbn },
  ];

  const products = {};
  const pillarsWithGap = pillarSource.map((p) => {
    const gapFraction = pillarGapFraction(p.capture, p.est);
    products[p.key] = { level: levelFromValue(gapFraction), value: gapFraction };
    return { ...p, gapFraction };
  });

  const topPillar = [...pillarsWithGap].sort((a, b) => b.gapFraction - a.gapFraction)[0];
  const otherPillarLabels = pillarsWithGap
    .filter((p) => p.key !== topPillar.key)
    .map((p) => p.label)
    .join(" and ");

  const evidence = buildEvidence(e, ext, topPillar);
  const briefing = buildBriefing(e, topPillar, n);
  const nextStep = buildNextStep(e, topPillar);
  const questions = buildQuestions(e, ext, topPillar, opportunityScore, n, otherPillarLabels);

  return {
    id,
    name: e.entity_name,
    sector: e.sector || "—",
    hq: "JSE-listed, South Africa",
    relationshipManager: "Unassigned — Coverage Team",
    estimatedWallet,
    synBankWallet,
    shareOfWallet,
    walletGap,
    opportunityScore,
    priority,
    products,
    evidence,
    briefing,
    nextStep,
    questions,
    // Raw external financial-statement record for this entity (or null if
    // no match was found in external_financial.json). Rendered directly
    // on the client detail page — see renderExternalFinancialsCard in app.js.
    externalFinancials: ext,
  };
}

/* ---------------------------------------------------------------------
 * Loader
 * ------------------------------------------------------------------- */

let SYNBANK_DATA = null;

async function loadSynBankData() {
  const [resultsResp, extResp] = await Promise.all([
    fetch(RESULTS_JSON_PATH),
    fetch(EXTERNAL_FINANCIAL_JSON_PATH),
  ]);

  if (!resultsResp.ok) {
    throw new Error(`Could not load ${RESULTS_JSON_PATH} (HTTP ${resultsResp.status})`);
  }
  if (!extResp.ok) {
    throw new Error(`Could not load ${EXTERNAL_FINANCIAL_JSON_PATH} (HTTP ${extResp.status})`);
  }

  const results = await resultsResp.json();
  const externalList = await extResp.json();

  const extMap = new Map();
  externalList.forEach((row) => extMap.set(normalizeEntityName(row.entity_name), row));

  const rows = results.client_rankings_and_data || [];
  const n = rows.length;

  const clients = rows.map((e) => buildClient(e, extMap.get(normalizeEntityName(e.entity_name)) || null, n));

  SYNBANK_DATA = {
    meta: {
      bankName: "Syn Bank",
      portfolioName: "Corporate & Investment Banking — SA Portfolio",
      asOf: ((results.metadata && results.metadata.generated_timestamp) || "").split(" ")[0] || "—",
      clientCount: clients.length,
      currency: "ZAR",
    },
    products: PRODUCT_DEFS,
    clients,
  };

  // Integrity check only (not shown in UI): confirms our unit conversion
  // and per-client sums reconcile with the model's own reported portfolio
  // totals. Logs a warning rather than failing the app if they drift.
  if (results.portfolio_summary) {
    const computedEstBn = clients.reduce((s, c) => s + c.estimatedWallet, 0) / 1e9;
    const reportedEstBn = results.portfolio_summary.total_portfolio_estimated_wallet_zar_bn;
    if (Math.abs(computedEstBn - reportedEstBn) > 1) {
      console.warn(
        "Syn Bank data: computed portfolio estimated wallet differs from results.json portfolio_summary.",
        { computedEstBn, reportedEstBn }
      );
    }
  }

  return SYNBANK_DATA;
}

/* ---------------------------------------------------------------------
 * Accessors — unchanged from the original file. All rendering code
 * goes through these, not SYNBANK_DATA directly, which is what makes
 * this a data-source swap rather than a UI rewrite.
 * ------------------------------------------------------------------- */

function getMeta() {
  return SYNBANK_DATA.meta;
}

function getProductDefs() {
  return SYNBANK_DATA.products;
}

function getClients() {
  return SYNBANK_DATA.clients;
}

function getClientById(id) {
  return SYNBANK_DATA.clients.find((c) => c.id === id);
}

function getPortfolioTotals() {
  const clients = getClients();
  const estimatedWallet = clients.reduce((s, c) => s + c.estimatedWallet, 0);
  const synBankWallet = clients.reduce((s, c) => s + c.synBankWallet, 0);
  const walletGap = clients.reduce((s, c) => s + c.walletGap, 0);
  const shareOfWallet = synBankWallet / estimatedWallet;
  return { estimatedWallet, synBankWallet, walletGap, shareOfWallet, clientCount: clients.length };
}

function getTopOpportunities(n = 5) {
  return [...getClients()].sort((a, b) => b.opportunityScore - a.opportunityScore).slice(0, n);
}

function getProductLevelSummary() {
  const defs = getProductDefs();
  const clients = getClients();
  return defs.map((p) => {
    const levels = clients.map((c) => c.products[p.key].level);
    const highCount = levels.filter((l) => l === "high").length;
    const avgValue = clients.reduce((s, c) => s + c.products[p.key].value, 0) / clients.length;
    return { ...p, highCount, avgValue };
  });
}
