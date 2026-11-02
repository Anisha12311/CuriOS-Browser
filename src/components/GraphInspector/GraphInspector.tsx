import { hostOf } from '../../data/sites';
import { useBrowser } from '../../state/BrowserContext';
import type { Graph, GraphNode } from '../../state/types';
import { ActionButton, BareInput, SectionLabel, ToolButton } from '../../styled/MUI/Common.styles';
import { Inspector } from '../../styled/MUI/Graph.styles';
import { LinkButton } from '../../styled/MUI/Panel.styles';
import { timeAgo } from '../../utils/time';
import Icon from '../Icon/Icon';

interface GraphInspectorProps {
  graph: Graph;
  node: GraphNode;
  onSelect(id: string | null): void;
}

function nodeTitle(node: GraphNode) {
  return node.type === 'page' ? (node.title ?? '') : node.text || `Empty ${node.type}`;
}

export default function GraphInspector({ graph, node, onSelect }: GraphInspectorProps) {
  const browser = useBrowser();
  const nodeById = new Map(graph.nodes.map(item => [item.id, item]));
  const connections = graph.edges.filter(edge => edge.a === node.id || edge.b === node.id);
  const kindLabel = { page: 'Page', note: 'Note', question: 'Question' }[node.type];

  function handleDelete() {
    browser.removeNode(node.id);
    onSelect(null);
  }

  return (
    <Inspector aria-label={`${kindLabel} details`}>
      <div className="inspector-head">
        <SectionLabel>{kindLabel}</SectionLabel>
        <ToolButton $size={32} aria-label="Close inspector" onClick={() => onSelect(null)}>
          <Icon name="x" size={15} />
        </ToolButton>
      </div>
      <div className="inspector-body">
        {node.type === 'page' ? (
          <>
            <h3>{node.title}</h3>
            <span className="inspector-url">{(node.url ?? '').replace(/^https?:\/\//, '')}</span>
            <span>
              Visited {node.visits ?? 1} time{(node.visits ?? 1) === 1 ? '' : 's'}. Last {timeAgo(node.ts)}.
            </span>
            <ActionButton $variant="primary" onClick={() => browser.openTab(node.url ?? '')}>
              <Icon name="open" size={15} />
              Open page
            </ActionButton>
            <ActionButton aria-pressed={!!node.star} onClick={() => browser.updateNode(node.id, { star: !node.star })}>
              <Icon name={node.star ? 'starFilled' : 'star'} size={16} />
              {node.star ? 'Key source (click to remove)' : 'Mark as key source'}
            </ActionButton>
          </>
        ) : (
          <BareInput
            className="inspector-text"
            multiline
            minRows={4}
            autoFocus={!node.text}
            placeholder={node.type === 'note' ? 'Write a note' : 'What do you want to find out?'}
            value={node.text ?? ''}
            inputProps={{ 'aria-label': `${kindLabel} text` }}
            onChange={event => browser.updateNode(node.id, { text: event.target.value })}
          />
        )}
        <SectionLabel sx={{ mt: 1 }}>Connections · {connections.length}</SectionLabel>
        {connections.map(edge => {
          const other = nodeById.get(edge.a === node.id ? edge.b : edge.a);
          return other ? (
            <div className="connection" key={edge.id}>
              <span>{edge.label}</span>
              <LinkButton onClick={() => onSelect(other.id)}>
                {other.type === 'page' ? hostOf(other.url ?? '') + ' · ' : ''}
                {nodeTitle(other)}
              </LinkButton>
            </div>
          ) : null;
        })}
        <ActionButton $variant="danger" onClick={handleDelete}>
          <Icon name="trash" size={15} />
          {node.type === 'page' ? 'Remove from graph' : 'Delete'}
        </ActionButton>
      </div>
    </Inspector>
  );
}
