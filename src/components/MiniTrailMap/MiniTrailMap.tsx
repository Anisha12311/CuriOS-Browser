import type { Graph } from '../../state/types';
import { MiniTrail } from '../../styled/MUI/Panel.styles';

const MAX_NODES = 9;

function scale(value: number, min: number, max: number, offset: number, span: number) {
  return offset + (max === min ? 0.5 : (value - min) / (max - min)) * span;
}

export default function MiniTrailMap({ graph, currentNodeId }: { graph: Graph; currentNodeId: string | null }) {
  const nodes = [...graph.nodes].sort((a, b) => b.ts - a.ts).slice(0, MAX_NODES);
  if (!nodes.length) return null;
  const xs = nodes.map(node => node.x);
  const ys = nodes.map(node => node.y);
  const [minX, maxX, minY, maxY] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
  const pointById = new Map(
    nodes.map(node => [
      node.id,
      { x: scale(node.x, minX, maxX, 14, 244), y: scale(node.y, minY, maxY, 14, 72) },
    ]),
  );

  return (
    <MiniTrail viewBox="0 0 272 100" role="img" aria-label="Mini research trail">
      {graph.edges.map(edge => {
        const from = pointById.get(edge.a);
        const to = pointById.get(edge.b);
        return from && to ? <line key={edge.id} x1={from.x} y1={from.y} x2={to.x} y2={to.y} /> : null;
      })}
      {nodes.map(node => {
        const point = pointById.get(node.id)!;
        const isCurrent = node.id === currentNodeId;
        return (
          <circle
            key={node.id}
            className={isCurrent ? 'current' : node.type}
            cx={point.x}
            cy={point.y}
            r={isCurrent ? 8 : 5.5}
          />
        );
      })}
    </MiniTrail>
  );
}
