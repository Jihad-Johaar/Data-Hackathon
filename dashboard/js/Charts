/**
 * Formatting helpers + the SVG "Opportunity Matrix" chart.
 * Kept separate from app.js so the charting logic can be swapped
 * for a library later without touching page templates.
 */

function formatZAR(value) {
  const abs = Math.abs(value);
  if (abs >= 1_000_000_000) return `R${(value / 1_000_000_000).toFixed(1)}B`;
  if (abs >= 1_000_000) return `R${(value / 1_000_000).toFixed(0)}M`;
  return `R${value.toLocaleString()}`;
}

function formatPct(value) {
  return `${Math.round(value * 100)}%`;
}

function priorityFromScore(score) {
  if (score >= 80) return "high";
  if (score >= 55) return "medium";
  return "low";
}

/**
 * Builds the Opportunity Matrix — an SVG scatter of clients positioned by
 * current share of wallet (x) against potential wallet size (y). The
 * top-left quadrant (high potential, low share) is the priority zone.
 */
function buildOpportunityMatrixSVG(clients) {
  const W = 720;
  const H = 380;
  const M = { top: 20, right: 30, bottom: 46, left: 64 };
  const plotW = W - M.left - M.right;
  const plotH = H - M.top - M.bottom;

  const maxWallet = Math.max(...clients.map((c) => c.estimatedWallet)) * 1.12;
  const maxShare = 1;

  const x = (share) => M.left + share * plotW;
  const y = (wallet) => M.top + plotH - (wallet / maxWallet) * plotH;

  const medianShare =
    clients.map((c) => c.shareOfWallet).sort((a, b) => a - b)[Math.floor(clients.length / 2)] || 0.35;

  let svg = `<svg viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="Opportunity matrix: potential wallet versus current share of wallet">`;

  // quadrant shading — priority zone (low share, high potential)
  svg += `<rect x="${M.left}" y="${M.top}" width="${x(medianShare) - M.left}" height="${plotH / 2}" fill="var(--brass-wash)" opacity="0.55" />`;

  // gridlines
  for (let i = 0; i <= 4; i++) {
    const gy = M.top + (plotH / 4) * i;
    svg += `<line x1="${M.left}" y1="${gy}" x2="${W - M.right}" y2="${gy}" stroke="var(--line)" stroke-width="1" />`;
  }
  for (let i = 0; i <= 4; i++) {
    const gx = M.left + (plotW / 4) * i;
    svg += `<line x1="${gx}" y1="${M.top}" x2="${gx}" y2="${H - M.bottom}" stroke="var(--line)" stroke-width="1" />`;
  }

  // axes
  svg += `<line x1="${M.left}" y1="${H - M.bottom}" x2="${W - M.right}" y2="${H - M.bottom}" stroke="var(--line-strong)" stroke-width="1.2" />`;
  svg += `<line x1="${M.left}" y1="${M.top}" x2="${M.left}" y2="${H - M.bottom}" stroke="var(--line-strong)" stroke-width="1.2" />`;

  // axis labels
  svg += `<text x="${M.left + plotW / 2}" y="${H - 12}" text-anchor="middle" class="matrix-axis-label">Current Share of Wallet →</text>`;
  svg += `<text x="18" y="${M.top + plotH / 2}" text-anchor="middle" class="matrix-axis-label" transform="rotate(-90 18 ${M.top + plotH / 2})">Potential Wallet →</text>`;

  // x tick labels
  [0, 0.25, 0.5, 0.75, 1].forEach((t) => {
    svg += `<text x="${x(t)}" y="${H - M.bottom + 16}" text-anchor="middle" class="matrix-label">${Math.round(t * 100)}%</text>`;
  });

  // priority zone label
  svg += `<text x="${M.left + 10}" y="${M.top + 16}" class="matrix-label" fill="var(--brass-deep)" font-weight="600">PRIORITY ZONE</text>`;

  const colorFor = (p) => (p === "high" ? "var(--gap-high)" : p === "medium" ? "var(--gap-medium)" : "var(--gap-low)");

  clients.forEach((c) => {
    const cx = x(c.shareOfWallet);
    const cy = y(c.estimatedWallet);
    const r = 5 + (c.opportunityScore / 100) * 6;
    svg += `<g class="matrix-dot" onclick="goTo('client', '${c.id}')">
      <circle cx="${cx}" cy="${cy}" r="${r}" fill="${colorFor(c.priority)}" fill-opacity="0.85" stroke="#fff" stroke-width="1.5" />
      <text x="${cx}" y="${cy - r - 6}" text-anchor="middle" class="matrix-label" font-weight="600">${c.name}</text>
    </g>`;
  });

  svg += `</svg>`;
  return svg;
}
