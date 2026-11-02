import { SIZE } from '../state/model';
import type { GraphNode } from '../state/types';

interface Point {
  x: number;
  y: number;
}

function centreOf(node: GraphNode): Point {
  const size = SIZE[node.type];
  return { x: node.x + size.w / 2, y: node.y + size.h / 2 };
}

function borderPoint(centre: Point, node: GraphNode, toward: Point): Point {
  const size = SIZE[node.type];
  const dx = toward.x - centre.x;
  const dy = toward.y - centre.y;
  if (!dx && !dy) return centre;
  const k = Math.min((size.w / 2 + 3) / Math.abs(dx || 1e-6), (size.h / 2 + 3) / Math.abs(dy || 1e-6));
  return { x: centre.x + dx * k, y: centre.y + dy * k };
}

/** A curved SVG path between the borders of two nodes, plus the point where its label sits. */
export function edgeCurve(from: GraphNode, to: GraphNode) {
  const fromCentre = centreOf(from);
  const toCentre = centreOf(to);
  const p = borderPoint(fromCentre, from, toCentre);
  const q = borderPoint(toCentre, to, fromCentre);
  const isHorizontal = Math.abs(q.x - p.x) >= Math.abs(q.y - p.y);
  const bend = 0.45;
  const c1 = isHorizontal ? { x: p.x + (q.x - p.x) * bend, y: p.y } : { x: p.x, y: p.y + (q.y - p.y) * bend };
  const c2 = isHorizontal ? { x: q.x - (q.x - p.x) * bend, y: q.y } : { x: q.x, y: q.y - (q.y - p.y) * bend };
  return {
    path: `M${p.x} ${p.y} C${c1.x} ${c1.y} ${c2.x} ${c2.y} ${q.x} ${q.y}`,
    label: { x: (p.x + 3 * c1.x + 3 * c2.x + q.x) / 8, y: (p.y + 3 * c1.y + 3 * c2.y + q.y) / 8 },
  };
}

/** Pan and zoom that fit every node into a viewport of the given size. */
export function fitView(nodes: GraphNode[], width: number, height: number) {
  if (!nodes.length) return { x: 30, y: 30, zoom: 1 };
  const minX = Math.min(...nodes.map(node => node.x));
  const minY = Math.min(...nodes.map(node => node.y));
  const maxX = Math.max(...nodes.map(node => node.x + SIZE[node.type].w));
  const maxY = Math.max(...nodes.map(node => node.y + SIZE[node.type].h));
  const padding = 70;
  const zoom = Math.min(1.2, Math.max(0.3, Math.min((width - padding * 2) / (maxX - minX), (height - padding * 2) / (maxY - minY))));
  return {
    zoom,
    x: (width - (maxX - minX) * zoom) / 2 - minX * zoom,
    y: (height - (maxY - minY) * zoom) / 2 - minY * zoom,
  };
}
