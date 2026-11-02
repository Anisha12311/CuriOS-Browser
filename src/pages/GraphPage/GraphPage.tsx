import { useLayoutEffect, useRef, useState, type PointerEvent, type WheelEvent } from 'react';
import { hostOf } from '../../data/urls';
import { useConfirm } from '../../components/ConfirmDialog/ConfirmProvider';
import Favicon from '../../components/Favicon/Favicon';
import GraphInspector from '../../components/GraphInspector/GraphInspector';
import Icon, { type IconName } from '../../components/Icon/Icon';
import { useBrowser } from '../../state/BrowserContext';
import { SIZE } from '../../state/model';
import type { GraphNode, NodeType } from '../../state/types';
import { ActionButton, EmptyState, Grow, ToolButton } from '../../styled/MUI/Common.styles';
import {
  Canvas,
  CanvasHint,
  EdgeLabel,
  EdgeLayer,
  FilterPill,
  FloatingTools,
  GraphBar,
  GraphMain,
  GraphRoot,
  NodeCard,
  World,
  ZoomBox,
} from '../../styled/MUI/Graph.styles';
import { edgeCurve, fitView } from '../../utils/graphGeometry';

type Tool = 'select' | 'note' | 'question';
type Drag =
  | { kind: 'pan'; startX: number; startY: number; viewX: number; viewY: number }
  | { kind: 'node'; id: string; offsetX: number; offsetY: number; x: number; y: number; hasMoved: boolean };

const FILTERS: { type: NodeType; label: string }[] = [
  { type: 'page', label: 'Pages' },
  { type: 'note', label: 'Notes' },
  { type: 'question', label: 'Questions' },
];
const TOOLS: { tool: Tool; icon: IconName; label: string }[] = [
  { tool: 'select', icon: 'grid', label: 'Select and move' },
  { tool: 'note', icon: 'note', label: 'Add a note' },
  { tool: 'question', icon: 'question', label: 'Add a question' },
];
const KIND_ICON: Record<NodeType, IconName> = { page: 'globe', note: 'note', question: 'question' };
const [MIN_ZOOM, MAX_ZOOM] = [0.25, 2.2];

export default function GraphPage() {
  const browser = useBrowser();
  const confirm = useConfirm();
  const { state, ws } = browser;
  const graph = state.graph[ws.id] ?? { nodes: [], edges: [] };
  const canvasRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState({ x: 30, y: 30, zoom: 1 });
  const [drag, setDrag] = useState<Drag | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [tool, setTool] = useState<Tool>('select');
  const [visibleTypes, setVisibleTypes] = useState<Record<NodeType, boolean>>({ page: true, note: true, question: true });
  const nodes = graph.nodes
    .filter(node => visibleTypes[node.type])
    .map(node => (drag?.kind === 'node' && drag.id === node.id ? { ...node, x: drag.x, y: drag.y } : node));
  const nodeById = new Map(nodes.map(node => [node.id, node]));
  const selectedNode = graph.nodes.find(node => node.id === selectedId) ?? null;

  function fit() {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) setView(fitView(nodes, rect.width, rect.height));
  }

  // Runs once on mount: frame the graph to the canvas size.
  useLayoutEffect(fit, []);

  function worldPoint(event: PointerEvent) {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: (event.clientX - rect.left - view.x) / view.zoom, y: (event.clientY - rect.top - view.y) / view.zoom };
  }

  function zoomAt(factor: number, originX: number, originY: number) {
    const zoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, view.zoom * factor));
    setView({ zoom, x: originX - (originX - view.x) * (zoom / view.zoom), y: originY - (originY - view.y) * (zoom / view.zoom) });
  }

  function handleCanvasDown(event: PointerEvent<HTMLDivElement>) {
    if (event.button > 0 || event.target !== event.currentTarget) return;
    if (tool !== 'select') {
      const point = worldPoint(event);
      const size = SIZE[tool];
      setSelectedId(browser.addGraphNode(tool, Math.round(point.x - size.w / 2), Math.round(point.y - size.h / 2)));
      setTool('select');
      return;
    }
    setSelectedId(null);
    event.currentTarget.setPointerCapture(event.pointerId);
    setDrag({ kind: 'pan', startX: event.clientX, startY: event.clientY, viewX: view.x, viewY: view.y });
  }

  function handleNodeDown(event: PointerEvent<HTMLDivElement>, node: GraphNode) {
    event.stopPropagation();
    const point = worldPoint(event);
    setSelectedId(node.id);
    canvasRef.current?.setPointerCapture(event.pointerId);
    setDrag({ kind: 'node', id: node.id, offsetX: point.x - node.x, offsetY: point.y - node.y, x: node.x, y: node.y, hasMoved: false });
  }

  function handleMove(event: PointerEvent) {
    if (drag?.kind === 'pan') {
      setView({ ...view, x: drag.viewX + event.clientX - drag.startX, y: drag.viewY + event.clientY - drag.startY });
    } else if (drag?.kind === 'node') {
      const point = worldPoint(event);
      setDrag({ ...drag, x: Math.round(point.x - drag.offsetX), y: Math.round(point.y - drag.offsetY), hasMoved: true });
    }
  }

  function handleUp() {
    if (drag?.kind === 'node' && drag.hasMoved) browser.moveNode(drag.id, drag.x, drag.y);
    setDrag(null);
  }

  function handleWheel(event: WheelEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    zoomAt(event.deltaY < 0 ? 1.1 : 1 / 1.1, event.clientX - rect.left, event.clientY - rect.top);
  }

  async function handleClear() {
    const isConfirmed = await confirm({
      title: `Clear the ${ws.name} graph?`,
      message: 'Every page, note, question and link in this graph will be deleted. Your clips are kept. This cannot be undone.',
      confirmLabel: 'Clear graph',
    });
    if (!isConfirmed) return;
    setSelectedId(null);
    browser.clearGraph();
  }

  function handleZoomButton(factor: number) {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) zoomAt(factor, rect.width / 2, rect.height / 2);
  }

  if (!ws.graph) {
    return (
      <EmptyState sx={{ m: 6 }}>
        The research graph is off for {ws.name}.{' '}
        <ActionButton $variant="primary" $small onClick={() => browser.updateWorkspace(ws.id, { graph: true })}>
          Turn it on
        </ActionButton>
      </EmptyState>
    );
  }

  return (
    <GraphRoot>
      <GraphBar>
        <div className="bar-title">
          <b>Research graph</b>
          <span>
            {ws.name} · {graph.nodes.length} nodes · {graph.edges.length} links
          </span>
        </div>
        <Grow />
        {FILTERS.map(filter => (
          <FilterPill
            key={filter.type}
            aria-pressed={visibleTypes[filter.type]}
            $isOn={visibleTypes[filter.type]}
            onClick={() => setVisibleTypes({ ...visibleTypes, [filter.type]: !visibleTypes[filter.type] })}
          >
            {visibleTypes[filter.type] && <Icon name="check" size={13} />}
            {filter.label}
          </FilterPill>
        ))}
        {graph.nodes.length > 0 && (
          <ActionButton $small onClick={handleClear}>
            <Icon name="trash" size={14} />
            Clear graph
          </ActionButton>
        )}
      </GraphBar>
      <GraphMain>
        <Canvas
          ref={canvasRef}
          style={{ backgroundPosition: `${view.x}px ${view.y}px`, backgroundSize: `${22 * view.zoom}px ${22 * view.zoom}px` }}
          onPointerDown={handleCanvasDown}
          onPointerMove={handleMove}
          onPointerUp={handleUp}
          onPointerCancel={handleUp}
          onWheel={handleWheel}
        >
          <World style={{ transform: `translate(${view.x}px, ${view.y}px) scale(${view.zoom})` }}>
            <EdgeLayer width={1} height={1} aria-hidden="true">
              {graph.edges.map(edge => {
                const from = nodeById.get(edge.a);
                const to = nodeById.get(edge.b);
                if (!from || !to) return null;
                const isBad = edge.label === 'contradicts';
                const isSoft = edge.label === 'note' || edge.label === 'answers';
                const isHighlighted = selectedId === edge.a || selectedId === edge.b;
                const className = isHighlighted ? 'highlight' : isBad ? 'bad' : isSoft ? 'soft' : '';
                return <path key={edge.id} d={edgeCurve(from, to).path} className={className} />;
              })}
            </EdgeLayer>
            {graph.edges.map(edge => {
              const from = nodeById.get(edge.a);
              const to = nodeById.get(edge.b);
              if (!from || !to) return null;
              const { label } = edgeCurve(from, to);
              return (
                <EdgeLabel key={edge.id} $isBad={edge.label === 'contradicts'} style={{ left: label.x, top: label.y }}>
                  {edge.label}
                </EdgeLabel>
              );
            })}
            {nodes.map(node => (
              <NodeCard
                key={node.id}
                role="button"
                tabIndex={0}
                aria-label={node.title ?? node.text}
                $type={node.type}
                $isSelected={node.id === selectedId}
                style={{ left: node.x, top: node.y }}
                onPointerDown={event => handleNodeDown(event, node)}
                onDoubleClick={() => node.type === 'page' && browser.openTab(node.url ?? '')}
              >
                {node.star && (
                  <span className="node-star">
                    <Icon name="starFilled" size={14} />
                  </span>
                )}
                {node.type === 'page' && <Favicon url={node.url ?? ''} size={36} />}
                <span className="node-body">
                  <span className="node-kind">
                    {node.type !== 'page' && <Icon name={KIND_ICON[node.type]} size={13} />}
                    {node.type === 'page' ? `Visited page${(node.visits ?? 1) > 1 ? ` · ${node.visits}x` : ''}` : node.type}
                  </span>
                  <span className="node-title">{node.type === 'page' ? node.title : node.text || `Empty ${node.type}`}</span>
                  {node.type === 'page' && <span className="node-host">{hostOf(node.url ?? '')}</span>}
                </span>
              </NodeCard>
            ))}
          </World>
          {!graph.nodes.length && (
            <CanvasHint>
              <b>Your research graph is empty</b>
              <span>Pages you visit in {ws.name} appear here. Use the tools on the left to add notes and questions.</span>
            </CanvasHint>
          )}
          <FloatingTools>
            {TOOLS.map(item => (
              <ToolButton
                key={item.tool}
                $active={tool === item.tool}
                aria-label={item.label}
                aria-pressed={tool === item.tool}
                title={item.label}
                onClick={() => setTool(item.tool)}
              >
                <Icon name={item.icon} size={17} />
              </ToolButton>
            ))}
          </FloatingTools>
          <ZoomBox>
            <ToolButton $size={32} aria-label="Zoom out" onClick={() => handleZoomButton(1 / 1.2)}>
              <Icon name="minus" size={15} />
            </ToolButton>
            <span className="zoom-value">{Math.round(view.zoom * 100)}%</span>
            <ToolButton $size={32} aria-label="Zoom in" onClick={() => handleZoomButton(1.2)}>
              <Icon name="plus" size={15} />
            </ToolButton>
            <ActionButton $small onClick={fit}>
              Fit
            </ActionButton>
          </ZoomBox>
        </Canvas>
        {selectedNode && <GraphInspector graph={graph} node={selectedNode} onSelect={setSelectedId} />}
      </GraphMain>
    </GraphRoot>
  );
}
