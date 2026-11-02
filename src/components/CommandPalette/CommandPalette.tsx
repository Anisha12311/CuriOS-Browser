import { useState, type KeyboardEvent } from 'react';
import { useNativeOverlay } from '../../hooks/useNativeOverlay';
import { useBrowser } from '../../state/BrowserContext';
import { BareInput, ColorDot, Grow, Kbd } from '../../styled/MUI/Common.styles';
import {
  PaletteBody,
  PaletteChip,
  PaletteChips,
  PaletteDialog,
  PaletteEmpty,
  PaletteFoot,
  PaletteRow,
  PaletteSection,
  PaletteTop,
} from '../../styled/MUI/Overlay.styles';
import { buildPaletteSections, type PaletteFilter, type PaletteItem } from '../../utils/paletteItems';
import Favicon from '../Favicon/Favicon';
import Icon, { type IconName } from '../Icon/Icon';

const FILTERS: { key: PaletteFilter; label: string; icon: IconName }[] = [
  { key: 'all', label: 'All', icon: 'grid' },
  { key: 'tabs', label: 'Tabs', icon: 'tabs' },
  { key: 'actions', label: 'Actions', icon: 'spark' },
  { key: 'workspaces', label: 'Workspaces', icon: 'folder' },
];

interface CommandPaletteProps {
  isOpen: boolean;
  onClose(): void;
}

function ItemIcon({ item }: { item: PaletteItem }) {
  if (item.faviconUrl) return <Favicon url={item.faviconUrl} size={22} />;
  if (item.swatch) return <ColorDot $color={item.swatch} $size={14} />;
  return <Icon name={item.icon ?? 'globe'} size={17} />;
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  useNativeOverlay(isOpen);
  const browser = useBrowser();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<PaletteFilter>('all');
  const [highlightIndex, setHighlightIndex] = useState(0);
  const sections = buildPaletteSections(browser, query, filter);
  const items = sections.flatMap(section => section.items);

  function handleRun(item: PaletteItem) {
    onClose();
    item.onRun();
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (!items.length) return;
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const step = event.key === 'ArrowDown' ? 1 : -1;
      setHighlightIndex(Math.max(0, Math.min(items.length - 1, highlightIndex + step)));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      handleRun(items[Math.min(highlightIndex, items.length - 1)]);
    }
  }

  function handleFilter(key: PaletteFilter) {
    setFilter(key);
    setHighlightIndex(0);
  }

  return (
    <PaletteDialog open={isOpen} onClose={onClose} aria-label="Search tabs, pages and actions">
      <PaletteTop>
        <Icon name="search" size={20} />
        <BareInput
          autoFocus
          placeholder="Search tabs, pages, workspaces or actions…"
          value={query}
          inputProps={{ 'aria-label': 'Search', autoComplete: 'off' }}
          onChange={event => {
            setQuery(event.target.value);
            setHighlightIndex(0);
          }}
          onKeyDown={handleKeyDown}
        />
        <Kbd>Esc</Kbd>
      </PaletteTop>
      <PaletteChips>
        {FILTERS.map(chip => (
          <PaletteChip
            key={chip.key}
            aria-pressed={filter === chip.key}
            $isOn={filter === chip.key}
            onClick={() => handleFilter(chip.key)}
          >
            <Icon name={chip.icon} size={14} />
            {chip.label}
          </PaletteChip>
        ))}
      </PaletteChips>
      <PaletteBody>
        {sections.map(section => (
          <div key={section.title}>
            <PaletteSection>{section.title}</PaletteSection>
            {section.items.map(item => {
              const index = items.indexOf(item);
              return (
                <PaletteRow
                  key={item.id}
                  $tone={item.tone}
                  $isOn={index === highlightIndex}
                  onMouseEnter={() => setHighlightIndex(index)}
                  onClick={() => handleRun(item)}
                >
                  <span className="row-icon">
                    <ItemIcon item={item} />
                  </span>
                  <span className="row-text">
                    <span className="row-title">{item.title}</span>
                    {item.sub && <span className="row-sub">{item.sub}</span>}
                  </span>
                  {item.shortcut && <kbd className="row-key">{item.shortcut}</kbd>}
                  {item.actionLabel ? (
                    <span className="row-action">
                      {item.actionLabel}
                      <Icon name="chevr" size={13} />
                    </span>
                  ) : (
                    <span className="row-go">
                      <Icon name="chevr" size={15} />
                    </span>
                  )}
                </PaletteRow>
              );
            })}
          </div>
        ))}
        {!items.length && (
          <PaletteEmpty>
            <Icon name="search" size={22} />
            <b>No matches</b>
            <span>Try another word, or switch the filter to All.</span>
          </PaletteEmpty>
        )}
      </PaletteBody>
      <PaletteFoot>
        <span>
          <Kbd>↑</Kbd>
          <Kbd>↓</Kbd> move
        </span>
        <span>
          <Kbd>↵</Kbd> open
        </span>
        <span>
          <Kbd>Esc</Kbd> close
        </span>
        <Grow />
        <span className="foot-tip">
          <Icon name="spark" size={13} />
          Tip: type to filter, or press Enter to search
        </span>
      </PaletteFoot>
    </PaletteDialog>
  );
}
