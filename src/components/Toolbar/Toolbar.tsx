import { useState, type KeyboardEvent } from 'react';
import { internalName, kindOf, queryOf } from '../../data/urls';
import { useNativeOverlay } from '../../hooks/useNativeOverlay';
import { useSearchSuggestions } from '../../hooks/useSearchSuggestions';
import { searchLabel, searchPlaceholder } from '../../services/searchSuggestions';
import { useBrowser } from '../../state/BrowserContext';
import type { BrowserTab } from '../../state/types';
import { BareInput, ToolButton } from '../../styled/MUI/Common.styles';
import {
  AddressPill,
  AddressWrap,
  LoadBar,
  PillButton,
  SuggestionRow,
  Suggestions,
  ToolbarRoot,
} from '../../styled/MUI/Toolbar.styles';
import { buildAddressSuggestions, type AddressSuggestion } from '../../utils/addressSuggestions';
import Icon from '../Icon/Icon';
import MainMenu from '../MainMenu/MainMenu';
import WindowControls from '../WindowControls/WindowControls';

function displayValue(tab: BrowserTab | null): string {
  if (!tab) return '';
  if (kindOf(tab.url) !== 'internal') return tab.url;
  const name = internalName(tab.url);
  if (name === 'newtab') return '';
  return name === 'search' ? queryOf(tab.url) : tab.url;
}

export default function Toolbar() {
  const browser = useBrowser();
  const { state, ws, tab, loading } = browser;
  const [draft, setDraft] = useState<string | null>(null);
  const [highlightIndex, setHighlightIndex] = useState(0);
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const { engine, searchSuggestions: isSuggestEnabled } = state.settings;
  const webSuggestions = useSearchSuggestions(draft ?? '', engine, isSuggestEnabled);
  const suggestions =
    draft === null
      ? []
      : buildAddressSuggestions(state, ws.id, draft, { webSuggestions, searchLabel: searchLabel(engine) });
  useNativeOverlay(suggestions.length > 0);
  const isInternal = !tab || kindOf(tab.url) === 'internal';
  const isSecure = isInternal || /^https:/i.test(tab.url);
  const isBookmarked = !isInternal && browser.isBookmarked(tab.url);

  function handlePick(suggestion: AddressSuggestion) {
    if (suggestion.kind === 'tab') browser.activate(suggestion.value);
    else if (tab) browser.navigate(tab.id, suggestion.value);
    setDraft(null);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      if (!suggestions.length) return;
      event.preventDefault();
      const step = event.key === 'ArrowDown' ? 1 : -1;
      setHighlightIndex((highlightIndex + step + suggestions.length) % suggestions.length);
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const picked = suggestions[highlightIndex];
      if (picked) handlePick(picked);
      event.currentTarget.blur();
    } else if (event.key === 'Escape') {
      setDraft(null);
      event.currentTarget.blur();
    }
  }

  return (
    <ToolbarRoot>
      <ToolButton aria-label="Switch tab layout" title="Switch tab layout" onClick={browser.toggleVtabs}>
        <Icon name="menu" size={18} />
      </ToolButton>
      <ToolButton aria-label="Back" title="Back (Alt+Left)" disabled={!browser.canGoBack} onClick={browser.back}>
        <Icon name="back" size={18} />
      </ToolButton>
      <ToolButton
        aria-label="Forward"
        title="Forward (Alt+Right)"
        disabled={!browser.canGoForward}
        onClick={browser.forward}
      >
        <Icon name="fwd" size={18} />
      </ToolButton>
      <ToolButton aria-label="Reload" title="Reload" onClick={browser.reload}>
        <Icon name="reload" size={18} />
      </ToolButton>
      <AddressWrap>
        <AddressPill>
          <PillButton
            $tone={isSecure ? 'default' : 'warn'}
            aria-label="Site information"
            onClick={() => browser.openInternal('privacy')}
          >
            <Icon name={isInternal ? 'shield' : isSecure ? 'lock' : 'unlock'} size={15} />
          </PillButton>
          <BareInput
            placeholder={searchPlaceholder(engine)}
            value={draft ?? displayValue(tab)}
            inputProps={{ 'aria-label': 'Address or search', spellCheck: false, autoComplete: 'off' }}
            onFocus={event => {
              setDraft(displayValue(tab));
              event.target.select();
            }}
            onBlur={() => setDraft(null)}
            onChange={event => {
              setDraft(event.target.value);
              setHighlightIndex(0);
            }}
            onKeyDown={handleKeyDown}
          />
          <PillButton
            $tone={isBookmarked ? 'on' : 'default'}
            aria-label="Bookmark this page"
            title="Bookmark (Ctrl+D)"
            disabled={isInternal}
            onClick={browser.toggleBookmark}
          >
            <Icon name={isBookmarked ? 'starFilled' : 'star'} size={17} />
          </PillButton>
        </AddressPill>
        {suggestions.length > 0 && (
          <Suggestions role="listbox">
            {suggestions.map((suggestion, index) => (
              <SuggestionRow
                key={suggestion.id}
                role="option"
                aria-selected={index === highlightIndex}
                $isOn={index === highlightIndex}
                onMouseDown={event => {
                  event.preventDefault();
                  handlePick(suggestion);
                }}
              >
                <Icon name={suggestion.icon} size={16} />
                <span className="label">{suggestion.label}</span>
                {suggestion.sub && <span className="sub">{suggestion.sub}</span>}
              </SuggestionRow>
            ))}
          </Suggestions>
        )}
      </AddressWrap>
      <ToolButton
        $active={state.panel.open}
        aria-label="Research panel"
        title="Research panel"
        onClick={browser.togglePanel}
      >
        <Icon name="graph" size={18} />
      </ToolButton>
      <ToolButton aria-label="Menu" aria-haspopup="menu" onClick={event => setMenuAnchor(event.currentTarget)}>
        <Icon name="more" size={18} />
      </ToolButton>
      {state.settings.vtabs && <WindowControls />}
      <MainMenu anchorElement={menuAnchor} onClose={() => setMenuAnchor(null)} />
      <LoadBar key={tab?.id} $isLoading={!!(tab && loading[tab.id])} />
    </ToolbarRoot>
  );
}
