import { useBrowser, type ToastTone } from '../../state/BrowserContext';
import { ToastCard, ToastDismiss, ToastStack } from '../../styled/MUI/Overlay.styles';
import Icon, { type IconName } from '../Icon/Icon';

const ICON_BY_TONE: Record<ToastTone, IconName> = { ok: 'check', warn: 'info', err: 'x' };

export default function Toasts() {
  const { toasts, dismissToast } = useBrowser();

  return (
    <ToastStack aria-live="polite">
      {toasts.map(toast => (
        <ToastCard key={toast.id} role="status" $tone={toast.tone}>
          <span className="toast-icon">
            <Icon name={ICON_BY_TONE[toast.tone]} size={14} />
          </span>
          <span className="toast-message">{toast.msg}</span>
          <ToastDismiss aria-label="Dismiss" onClick={() => dismissToast(toast.id)}>
            <Icon name="x" size={13} />
          </ToastDismiss>
        </ToastCard>
      ))}
    </ToastStack>
  );
}
