import { WindowActions, WindowButton } from '../../styled/MUI/TabStrip.styles';
import Icon from '../Icon/Icon';

export default function WindowControls() {
  return (
    <WindowActions>
      <WindowButton aria-label="Minimize" onClick={() => window.desktop?.minimize()}>
        <Icon name="minus" size={18} />
      </WindowButton>
      <WindowButton aria-label="Maximize or restore" onClick={() => window.desktop?.maximize()}>
        <Icon name="square" size={16} />
      </WindowButton>
      <WindowButton $isClose aria-label="Close" onClick={() => window.desktop?.close()}>
        <Icon name="x" size={18} />
      </WindowButton>
    </WindowActions>
  );
}
