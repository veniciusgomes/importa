// Path helpers para barras com cantos arredondados só no topo (barra vertical)
// ou só na ponta direita (barra horizontal) — mesmo desenho usado no mockup,
// já que SVG <rect> não tem raio por-canto isolado.

export function roundedTopPath(x: number, y: number, w: number, h: number, r: number): string {
  return `M${x},${y + h} L${x},${y + r} Q${x},${y} ${x + r},${y} L${x + w - r},${y} Q${x + w},${y} ${x + w},${y + r} L${x + w},${y + h} Z`;
}

export function roundedRightPath(x: number, y: number, w: number, h: number, r: number): string {
  return `M${x},${y} L${x + w - r},${y} Q${x + w},${y} ${x + w},${y + r} L${x + w},${y + h - r} Q${x + w},${y + h} ${x + w - r},${y + h} L${x},${y + h} Z`;
}
