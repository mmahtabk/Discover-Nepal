/**
 * Honest, self-contained placeholder for destinations we could NOT confidently
 * match to a specific real photo on Wikimedia Commons.
 *
 * Renders a plain colored SVG card (white-on-green, matching the site palette)
 * with the destination name — deliberately NOT a random/unrelated stock photo,
 * and no dependency on any live image service.
 */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function placeholderImageUrl(name: string): string {
  const label = escapeXml(name);
  const svg = [
    '<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="960" viewBox="0 0 1280 960">',
    '  <defs>',
    '    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">',
    '      <stop offset="0" stop-color="#1f3d2e"/>',
    '      <stop offset="1" stop-color="#2f6b4f"/>',
    '    </linearGradient>',
    '  </defs>',
    '  <rect width="1280" height="960" fill="url(#g)"/>',
    '  <path d="M0 720 L300 420 L520 640 L720 460 L1280 760 L1280 960 L0 960 Z" fill="#ffffff" opacity="0.08"/>',
    '  <path d="M0 780 L280 540 L460 720 L640 580 L900 770 L1280 640 L1280 960 L0 960 Z" fill="#ffffff" opacity="0.06"/>',
    '  <text x="640" y="500" text-anchor="middle" font-family="Georgia, serif" font-size="76" fill="#ffffff">',
    `    ${label}`,
    '  </text>',
    '  <text x="640" y="590" text-anchor="middle" font-family="sans-serif" font-size="34" letter-spacing="4" fill="#eaf3ee" opacity="0.9">',
    '    PHOTO COMING SOON',
    '  </text>',
    '</svg>',
  ].join('\n');
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}