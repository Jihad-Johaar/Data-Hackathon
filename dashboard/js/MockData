/**
 * SYN BANK — SHARE OF WALLET INTELLIGENCE ENGINE
 * ------------------------------------------------
 * Mock data layer.
 *
 * This file exists so the analytics team can later replace SYNBANK_DATA
 * with a fetch() to a real API / Python model output without touching
 * any rendering code. Every screen reads exclusively from the shape
 * below via the accessor functions at the bottom of the file.
 */

const SYNBANK_DATA = {
  meta: {
    bankName: "Syn Bank",
    portfolioName: "Corporate & Investment Banking — SA Portfolio",
    asOf: "2026-08-11",
    clientCount: 8,
    currency: "ZAR",
  },

  products: [
    { key: "transactional", label: "Transactional Banking" },
    { key: "payments", label: "Payments" },
    { key: "crossBorder", label: "Cross-Border Payments" },
    { key: "fx", label: "FX" },
    { key: "tradeFinance", label: "Trade Finance" },
    { key: "liquidity", label: "Liquidity Management" },
    { key: "guarantees", label: "Guarantees" },
  ],

  clients: [
    {
      id: "mining-corp",
      name: "Mining Corp",
      sector: "Mining",
      hq: "Johannesburg, ZA",
      relationshipManager: "T. Ndlovu",
      estimatedWallet: 8_200_000_000,
      synBankWallet: 1_700_000_000,
      shareOfWallet: 0.21,
      walletGap: 6_500_000_000,
      opportunityScore: 94,
      priority: "high",
      products: {
        transactional: { level: "medium", value: 0.55 },
        payments: { level: "medium", value: 0.5 },
        crossBorder: { level: "high", value: 0.85 },
        fx: { level: "high", value: 0.92 },
        tradeFinance: { level: "high", value: 0.88 },
        liquidity: { level: "low", value: 0.3 },
        guarantees: { level: "medium", value: 0.48 },
      },
      evidence: [
        { text: "Significant cross-border payment activity across three African jurisdictions", type: "observed" },
        { text: "High foreign-currency revenue exposure typical of export-driven miners", type: "inferred" },
        { text: "Existing trade-finance facility utilisation trending upward over 4 quarters", type: "observed" },
        { text: "Current Syn Bank FX penetration is low relative to sector peers", type: "observed" },
        { text: "Transaction cadence indicates recurring commodity hedging demand", type: "inferred" },
      ],
      briefing:
        "Mining Corp is the highest-priority growth opportunity in the portfolio. The client's estimated banking wallet is R8.2B, of which Syn Bank currently captures roughly R1.7B — a 21% share. The largest gaps sit in FX and Trade Finance, both consistent with the client's cross-border and export profile. Observed transaction behaviour shows meaningful cross-border flow already touching Syn Bank rails, but currency-risk and trade instruments are largely held elsewhere.",
      nextStep:
        "Engage the treasury team on FX risk-management and cross-border trade-finance solutions ahead of the next commodity cycle review.",
      questions: {
        "why should i prioritise this client?":
          "Mining Corp scores 94/100 on opportunity — the highest in the portfolio — driven by a R6.5B wallet gap and strong evidence of unmet FX and trade-finance demand.",
        "what are the biggest opportunities?":
          "FX and Trade Finance are the two largest gaps, both flagged HIGH priority. Payments is a secondary, medium-priority opportunity.",
        "why is fx an opportunity?":
          "The client shows high cross-border exposure and foreign-currency revenue, but Syn Bank's current FX penetration is low relative to sector peers — a strong signal of wallet held elsewhere.",
        "explain the wallet estimate.":
          "The R8.2B estimate combines observed Syn Bank transaction volume with inferred wallet size based on sector benchmarks, company scale, and cross-border activity patterns.",
        "what evidence supports this recommendation?":
          "Observed cross-border payment activity, rising trade-finance facility utilisation, and comparatively low FX penetration versus peers in the mining sector.",
        "prepare me for my client meeting.":
          "Lead with the trade-finance relationship, which is active and growing. Pivot to FX hedging given rising commodity-price volatility. Avoid opening on liquidity — current engagement there is minimal.",
        "what products should i discuss?":
          "FX risk management and cross-border trade finance first; payments as a secondary discussion point.",
        "what risks should i consider?":
          "Commodity-price volatility could shift FX hedging needs quickly — timing the conversation around the client's hedging cycle matters more than volume alone.",
      },
    },
    {
      id: "retail-holdings",
      name: "Retail Holdings",
      sector: "Retail",
      hq: "Cape Town, ZA",
      relationshipManager: "M. van der Merwe",
      estimatedWallet: 6_900_000_000,
      synBankWallet: 1_656_000_000,
      shareOfWallet: 0.24,
      walletGap: 4_800_000_000,
      opportunityScore: 91,
      priority: "high",
      products: {
        transactional: { level: "high", value: 0.9 },
        payments: { level: "high", value: 0.78 },
        crossBorder: { level: "low", value: 0.25 },
        fx: { level: "medium", value: 0.52 },
        tradeFinance: { level: "medium", value: 0.55 },
        liquidity: { level: "high", value: 0.82 },
        guarantees: { level: "low", value: 0.2 },
      },
      evidence: [
        { text: "Very high daily transactional and card-acquiring volume through Syn Bank", type: "observed" },
        { text: "Seasonal working-capital drawdown pattern consistent with inventory cycles", type: "observed" },
        { text: "Liquidity management penetration well below transactional footprint", type: "inferred" },
        { text: "Store network expansion signalled in recent public filings", type: "observed" },
      ],
      briefing:
        "Retail Holdings shows the classic 'deep but narrow' profile: Syn Bank owns the day-to-day transactional relationship, but liquidity management and working-capital instruments are underrepresented relative to that footprint. Estimated wallet is R6.9B against a captured R1.66B, a 24% share, leaving a R4.8B gap concentrated in liquidity and guarantees.",
      nextStep:
        "Propose a liquidity and cash-sweep structure aligned to the client's seasonal inventory cycle, using the existing transactional relationship as the entry point.",
      questions: {
        "why should i prioritise this client?":
          "Retail Holdings scores 91/100 — the transactional relationship is strong, which lowers execution risk on cross-selling liquidity and guarantee products.",
        "what are the biggest opportunities?":
          "Liquidity Management is the largest gap by value, with Guarantees as a secondary opportunity.",
        "why is fx an opportunity?":
          "FX is only a medium opportunity here — cross-border exposure is comparatively low, so this is not the lead conversation.",
        "explain the wallet estimate.":
          "Estimated from observed transactional and card-acquiring volume scaled against retail-sector wallet benchmarks and store-count growth.",
        "what evidence supports this recommendation?":
          "High existing transactional share paired with disproportionately low liquidity-product penetration, plus a seasonal working-capital pattern that liquidity products are built for.",
        "prepare me for my client meeting.":
          "Open with the strength of the existing transactional relationship, then introduce a cash-sweep and working-capital structure timed to their inventory cycle.",
        "what products should i discuss?":
          "Liquidity management first, guarantees as a follow-on.",
        "what risks should i consider?":
          "Retail margins are cyclical; frame liquidity solutions around resilience during low season rather than growth alone.",
      },
    },
    {
      id: "energy-group",
      name: "Energy Group",
      sector: "Energy",
      hq: "Sandton, ZA",
      relationshipManager: "K. Botha",
      estimatedWallet: 12_600_000_000,
      synBankWallet: 3_906_000_000,
      shareOfWallet: 0.31,
      walletGap: 3_900_000_000,
      opportunityScore: 87,
      priority: "high",
      products: {
        transactional: { level: "medium", value: 0.5 },
        payments: { level: "medium", value: 0.45 },
        crossBorder: { level: "high", value: 0.8 },
        fx: { level: "high", value: 0.75 },
        tradeFinance: { level: "high", value: 0.83 },
        liquidity: { level: "medium", value: 0.5 },
        guarantees: { level: "high", value: 0.7 },
      },
      evidence: [
        { text: "Large-scale infrastructure project financing activity observed", type: "observed" },
        { text: "Guarantee facility usage significantly below project pipeline size", type: "inferred" },
        { text: "Multi-currency project cash flows across regional operations", type: "observed" },
      ],
      briefing:
        "Energy Group carries the largest absolute wallet in the portfolio at an estimated R12.6B, with Syn Bank holding a 31% share. The gap is concentrated in Guarantees and Trade Finance, both linked to an active infrastructure project pipeline that appears larger than the bank's current facility exposure would suggest.",
      nextStep:
        "Bring project finance and guarantees specialists into the next relationship review to size facility requirements against the disclosed project pipeline.",
      questions: {
        "why should i prioritise this client?":
          "Energy Group has the largest wallet in the portfolio; even a modest share gain here outweighs larger percentage gains at smaller clients.",
        "what are the biggest opportunities?":
          "Guarantees and Trade Finance, both tied to infrastructure project activity.",
        "why is fx an opportunity?":
          "Multi-currency project cash flows across regional operations point to FX hedging needs not fully captured today.",
        "explain the wallet estimate.":
          "Estimated using observed project-finance activity and regional operating scale, benchmarked against comparable energy-sector infrastructure players.",
        "what evidence supports this recommendation?":
          "Guarantee facility usage is well below what the disclosed project pipeline would imply, suggesting the balance is held with another bank.",
        "prepare me for my client meeting.":
          "Lead with the infrastructure pipeline and guarantee capacity — this is a specialist, high-value conversation, not a transactional one.",
        "what products should i discuss?":
          "Guarantees and trade finance, with FX hedging as a supporting topic.",
        "what risks should i consider?":
          "Project financing decisions often sit with a syndicate; confirm Syn Bank's position before committing new capacity.",
      },
    },
    {
      id: "manufacturing-co",
      name: "Manufacturing Co",
      sector: "Manufacturing",
      hq: "Durban, ZA",
      relationshipManager: "N. Pillay",
      estimatedWallet: 5_100_000_000,
      synBankWallet: 1_887_000_000,
      shareOfWallet: 0.37,
      walletGap: 2_100_000_000,
      opportunityScore: 76,
      priority: "medium",
      products: {
        transactional: { level: "high", value: 0.85 },
        payments: { level: "medium", value: 0.55 },
        crossBorder: { level: "medium", value: 0.5 },
        fx: { level: "low", value: 0.3 },
        tradeFinance: { level: "high", value: 0.72 },
        liquidity: { level: "medium", value: 0.5 },
        guarantees: { level: "medium", value: 0.45 },
      },
      evidence: [
        { text: "Import-heavy input costs suggest recurring FX conversion need", type: "inferred" },
        { text: "Trade-finance activity concentrated with a single competitor bank", type: "observed" },
      ],
      briefing:
        "Manufacturing Co already reflects a healthy 37% share, the strongest ratio among top-tier clients. The remaining R2.1B gap is smaller in absolute terms but concentrated in Trade Finance, where a competitor bank appears to hold a dominant position.",
      nextStep:
        "Position a competitive trade-finance offer around the client's import cycle, using the strong existing transactional relationship as leverage.",
      questions: {
        "why should i prioritise this client?":
          "Lower absolute gap than the top three, but high win-probability given the already-strong 37% share and active transactional relationship.",
        "what are the biggest opportunities?":
          "Trade Finance is the clearest gap, currently concentrated with a competitor.",
        "why is fx an opportunity?":
          "Import-heavy input costs imply recurring FX conversion, though this is inferred rather than directly observed.",
        "explain the wallet estimate.":
          "Estimated from transactional footprint and sector-typical import/export ratios for manufacturing peers of comparable scale.",
        "what evidence supports this recommendation?":
          "Observed trade-finance concentration with a named competitor bank is the strongest single signal here.",
        "prepare me for my client meeting.":
          "Frame the conversation as a competitive trade-finance proposal, not a first-time introduction — this client already uses the product elsewhere.",
        "what products should i discuss?":
          "Trade finance first; FX as a supporting offer tied to import cycles.",
        "what risks should i consider?":
          "Displacing an incumbent trade-finance provider typically requires a pricing or tenor advantage — confirm terms before the meeting.",
      },
    },
    {
      id: "telecom-national",
      name: "Telecom National",
      sector: "Telecommunications",
      hq: "Pretoria, ZA",
      relationshipManager: "T. Ndlovu",
      estimatedWallet: 9_400_000_000,
      synBankWallet: 5_264_000_000,
      shareOfWallet: 0.56,
      walletGap: 1_400_000_000,
      opportunityScore: 58,
      priority: "medium",
      products: {
        transactional: { level: "high", value: 0.88 },
        payments: { level: "high", value: 0.9 },
        crossBorder: { level: "medium", value: 0.5 },
        fx: { level: "low", value: 0.35 },
        tradeFinance: { level: "low", value: 0.3 },
        liquidity: { level: "medium", value: 0.55 },
        guarantees: { level: "low", value: 0.25 },
      },
      evidence: [
        { text: "Already the client's primary transactional and payments bank", type: "observed" },
        { text: "Regional expansion into two neighbouring markets announced", type: "observed" },
      ],
      briefing:
        "Telecom National is a well-penetrated relationship at 56% share. Remaining opportunity is modest in relative terms but the client's announced regional expansion creates a timely opening in cross-border payments and FX.",
      nextStep:
        "Position cross-border payments capability ahead of the client's announced expansion into neighbouring markets.",
      questions: {
        "why should i prioritise this client?":
          "Lower urgency than top-tier opportunities, but the announced regional expansion is a time-sensitive trigger worth acting on early.",
        "what are the biggest opportunities?":
          "Cross-border payments, tied directly to the client's expansion announcement.",
        "why is fx an opportunity?":
          "New market entry typically brings new currency exposure; current FX penetration is low relative to the transactional relationship.",
        "explain the wallet estimate.":
          "Estimated from strong observed transactional and payments volume plus projected wallet growth from announced regional expansion.",
        "what evidence supports this recommendation?":
          "Public announcement of expansion into two neighbouring markets is the primary trigger event.",
        "prepare me for my client meeting.":
          "Congratulate on the expansion news and pivot directly to cross-border payments infrastructure needs.",
        "what products should i discuss?":
          "Cross-border payments and FX, framed around the expansion.",
        "what risks should i consider?":
          "Competitor banks with existing presence in the target markets may already be in conversation — move quickly.",
      },
    },
    {
      id: "agri-partners",
      name: "Agri Partners",
      sector: "Agriculture",
      hq: "Stellenbosch, ZA",
      relationshipManager: "M. van der Merwe",
      estimatedWallet: 3_300_000_000,
      synBankWallet: 858_000_000,
      shareOfWallet: 0.26,
      walletGap: 2_400_000_000,
      opportunityScore: 71,
      priority: "medium",
      products: {
        transactional: { level: "medium", value: 0.5 },
        payments: { level: "medium", value: 0.45 },
        crossBorder: { level: "high", value: 0.78 },
        fx: { level: "high", value: 0.8 },
        tradeFinance: { level: "medium", value: 0.5 },
        liquidity: { level: "low", value: 0.28 },
        guarantees: { level: "low", value: 0.22 },
      },
      evidence: [
        { text: "Export-linked revenue with seasonal harvest cycles", type: "observed" },
        { text: "Currency-hedging need implied by export destination mix", type: "inferred" },
      ],
      briefing:
        "Agri Partners' wallet is smaller in absolute terms but the export-driven revenue base creates a concentrated FX and cross-border opportunity, mirroring patterns seen in the mining book.",
      nextStep:
        "Introduce seasonal FX hedging structures timed to the harvest and export cycle.",
      questions: {
        "why should i prioritise this client?":
          "Smaller wallet overall, but a high concentration of gap in FX makes this an efficient, focused conversation.",
        "what are the biggest opportunities?":
          "FX, driven by export revenue and seasonal harvest cycles.",
        "why is fx an opportunity?":
          "Export destination mix implies currency exposure that current FX penetration does not fully reflect.",
        "explain the wallet estimate.":
          "Estimated using export revenue proxies and typical agri-sector wallet composition.",
        "what evidence supports this recommendation?":
          "Observed export-linked revenue and seasonal transaction patterns around harvest timing.",
        "prepare me for my client meeting.":
          "Time the conversation to the pre-harvest window when hedging decisions are typically made.",
        "what products should i discuss?":
          "FX hedging structures, with trade finance as a secondary topic.",
        "what risks should i consider?":
          "Commodity and weather volatility can shift hedging appetite quickly year to year.",
      },
    },
    {
      id: "logiflow",
      name: "LogiFlow Freight",
      sector: "Logistics",
      hq: "Port Elizabeth, ZA",
      relationshipManager: "K. Botha",
      estimatedWallet: 2_450_000_000,
      synBankWallet: 931_000_000,
      shareOfWallet: 0.38,
      walletGap: 950_000_000,
      opportunityScore: 54,
      priority: "low",
      products: {
        transactional: { level: "high", value: 0.8 },
        payments: { level: "medium", value: 0.55 },
        crossBorder: { level: "medium", value: 0.45 },
        fx: { level: "medium", value: 0.42 },
        tradeFinance: { level: "low", value: 0.3 },
        liquidity: { level: "medium", value: 0.4 },
        guarantees: { level: "low", value: 0.2 },
      },
      evidence: [
        { text: "Fleet financing activity observed with a competitor lender", type: "observed" },
      ],
      briefing:
        "LogiFlow Freight is a smaller, moderately-penetrated relationship. The most concrete signal is fleet financing activity held elsewhere, but the overall opportunity size does not warrant top-tier prioritisation this quarter.",
      nextStep:
        "Monitor for fleet renewal cycles before initiating a financing conversation.",
      questions: {
        "why should i prioritise this client?":
          "Lower priority this quarter — opportunity size is modest relative to top-tier clients.",
        "what are the biggest opportunities?":
          "Fleet-related financing, currently held with a competitor lender.",
        "why is fx an opportunity?":
          "FX is only a medium opportunity here; not the primary gap.",
        "explain the wallet estimate.":
          "Estimated from observed transactional volume and fleet-size proxies typical of mid-sized logistics operators.",
        "what evidence supports this recommendation?":
          "Observed fleet-financing relationship with a named competitor lender.",
        "prepare me for my client meeting.":
          "Keep this a light-touch relationship check-in rather than a full product pitch this quarter.",
        "what products should i discuss?":
          "Fleet and asset financing, when a renewal cycle approaches.",
        "what risks should i consider?":
          "Limited near-term upside; avoid over-investing relationship time relative to opportunity size.",
      },
    },
    {
      id: "coastal-properties",
      name: "Coastal Properties",
      sector: "Real Estate",
      hq: "Cape Town, ZA",
      relationshipManager: "N. Pillay",
      estimatedWallet: 4_050_000_000,
      synBankWallet: 2_308_500_000,
      shareOfWallet: 0.57,
      walletGap: 620_000_000,
      opportunityScore: 39,
      priority: "low",
      products: {
        transactional: { level: "high", value: 0.82 },
        payments: { level: "medium", value: 0.5 },
        crossBorder: { level: "low", value: 0.2 },
        fx: { level: "low", value: 0.22 },
        tradeFinance: { level: "low", value: 0.18 },
        liquidity: { level: "high", value: 0.75 },
        guarantees: { level: "medium", value: 0.45 },
      },
      evidence: [
        { text: "Well-diversified product usage already in place", type: "observed" },
      ],
      briefing:
        "Coastal Properties is a mature, well-penetrated relationship at 57% share with no single dominant gap. Retention and service quality matter more here than new-product prioritisation.",
      nextStep:
        "Maintain relationship cadence; revisit guarantees pricing at annual review.",
      questions: {
        "why should i prioritise this client?":
          "This client is a retention priority rather than a growth priority — the wallet is already well captured.",
        "what are the biggest opportunities?":
          "No large single gap; guarantees pricing is the closest thing to an open opportunity.",
        "why is fx an opportunity?":
          "It isn't a meaningful opportunity here — cross-border exposure is minimal.",
        "explain the wallet estimate.":
          "Estimated from a diversified, already well-observed product footprint across the relationship.",
        "what evidence supports this recommendation?":
          "Broad, balanced product usage across nearly every category is itself the evidence — this is a retention case, not a gap case.",
        "prepare me for my client meeting.":
          "Focus on service quality and relationship health rather than a product pitch.",
        "what products should i discuss?":
          "Guarantees pricing at the next annual review, if anything.",
        "what risks should i consider?":
          "The main risk is attrition through complacency, not a competitor gap.",
      },
    },
  ],
};

/* ---------------------------------------------------------------------
 * Accessors — all rendering code should go through these, not the
 * SYNBANK_DATA object directly, so the data source can be swapped later.
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
