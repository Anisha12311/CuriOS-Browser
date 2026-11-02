import { useState, type FormEvent, type KeyboardEvent } from 'react';
import { useSearchSuggestions } from '../../hooks/useSearchSuggestions';
import { searchLabel, searchPlaceholder } from '../../services/searchSuggestions';
import { useBrowser } from '../../state/BrowserContext';
import { ActionButton, BareInput } from '../../styled/MUI/Common.styles';
import { HeroSearch, HeroSuggestions } from '../../styled/MUI/NewTab.styles';
import { SuggestionRow } from '../../styled/MUI/Toolbar.styles';
import Icon from '../Icon/Icon';

const MAX_ROWS = 8;

/** The New tab search box, with the search engine's live suggestions as you type. */
export default function HeroSearchBox({ onSearch }: { onSearch(value: string): void }) {
  const { state } = useBrowser();
  const { engine, searchSuggestions: isSuggestEnabled } = state.settings;
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const webSuggestions = useSearchSuggestions(query, engine, isSuggestEnabled);
  const trimmed = query.trim();
  const rows = trimmed ? [trimmed, ...webSuggestions].slice(0, MAX_ROWS) : [];
  const isOpen = isFocused && rows.length > 0;

  function submit(value: string) {
    if (!value.trim()) return;
    setQuery('');
    setHighlightIndex(-1);
    onSearch(value);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    submit(highlightIndex >= 0 ? (rows[highlightIndex] ?? query) : query);
  }

  function handleKeyDown(event: KeyboardEvent) {
    if (!isOpen || (event.key !== 'ArrowDown' && event.key !== 'ArrowUp')) {
      if (event.key === 'Escape') setIsFocused(false);
      return;
    }
    event.preventDefault();
    // -1 means no row is highlighted and Enter searches the typed text.
    const next = highlightIndex + (event.key === 'ArrowDown' ? 1 : -1);
    setHighlightIndex(next < -1 ? rows.length - 1 : next >= rows.length ? -1 : next);
  }

  return (
    <HeroSearch onSubmit={handleSubmit} role="search">
      <Icon name="search" size={20} />
      <BareInput
        placeholder={searchPlaceholder(engine)}
        value={query}
        inputProps={{ 'aria-label': searchPlaceholder(engine), autoComplete: 'off', spellCheck: false }}
        onChange={event => {
          setQuery(event.target.value);
          setHighlightIndex(-1);
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onKeyDown={handleKeyDown}
      />
      <ActionButton $variant="primary" className="search-go" type="submit">
        Search
      </ActionButton>
      {isOpen && (
        <HeroSuggestions role="listbox">
          {rows.map((row, index) => (
            <SuggestionRow
              key={row}
              role="option"
              aria-selected={index === highlightIndex}
              $isOn={index === highlightIndex}
              onMouseDown={event => {
                event.preventDefault();
                submit(row);
              }}
            >
              <Icon name="search" size={16} />
              <span className="label">{row}</span>
              {index === 0 && <span className="sub">{searchLabel(engine)}</span>}
            </SuggestionRow>
          ))}
        </HeroSuggestions>
      )}
    </HeroSearch>
  );
}
