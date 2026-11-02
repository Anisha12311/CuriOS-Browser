import { domainOf, internalName, kindOf } from '../../data/urls';
import { useBrowser } from '../../state/BrowserContext';
import { FaviconBox, FaviconImage, Spinner } from '../../styled/MUI/Common.styles';
import Icon, { type IconName } from '../Icon/Icon';

const ICON_BY_PAGE: Record<string, IconName> = {
  graph: 'graph',
  library: 'bookmark',
  settings: 'gear',
  privacy: 'shield',
  restore: 'undo',
  workspaces: 'grid',
  search: 'search',
  newtab: 'plus',
};

interface FaviconProps {
  url: string;
  /** The live favicon of an open tab; otherwise the last one seen for the site is used. */
  iconUrl?: string | null;
  size?: number;
  isLoading?: boolean;
}

export default function Favicon({ url, iconUrl, size = 20, isLoading = false }: FaviconProps) {
  const { state } = useBrowser();
  if (isLoading) return <Spinner $size={Math.round(size * 0.75)} aria-label="Loading" />;
  const isInternal = kindOf(url) === 'internal';
  const siteIcon = iconUrl ?? (isInternal ? undefined : state.favicons[domainOf(url)]);
  if (siteIcon) return <FaviconImage src={siteIcon} alt="" $size={size} />;
  return (
    <FaviconBox $size={size}>
      <Icon name={isInternal ? (ICON_BY_PAGE[internalName(url)] ?? 'globe') : 'globe'} size={Math.round(size * 0.6)} />
    </FaviconBox>
  );
}
