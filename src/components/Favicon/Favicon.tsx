import { internalName, kindOf, siteColor } from '../../data/sites';
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
  iconUrl?: string | null;
  size?: number;
  isLoading?: boolean;
}

export default function Favicon({ url, iconUrl, size = 20, isLoading = false }: FaviconProps) {
  if (isLoading) return <Spinner $size={Math.round(size * 0.75)} aria-label="Loading" />;
  if (iconUrl) return <FaviconImage src={iconUrl} alt="" $size={size} />;
  if (kindOf(url) === 'internal') {
    return (
      <FaviconBox $size={size}>
        <Icon name={ICON_BY_PAGE[internalName(url)] ?? 'globe'} size={Math.round(size * 0.6)} />
      </FaviconBox>
    );
  }
  return <FaviconBox $size={size} $color={siteColor(url)} />;
}
