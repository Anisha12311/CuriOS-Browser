import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import { useNativeOverlay } from '../../hooks/useNativeOverlay';
import { ActionButton } from '../../styled/MUI/Common.styles';
import { ConfirmIcon, ConfirmRoot, DangerButton, type ConfirmTone } from '../../styled/MUI/Confirm.styles';
import Icon, { type IconName } from '../Icon/Icon';

export interface ConfirmOptions {
  title: string;
  message?: string;
  confirmLabel?: string;
  tone?: ConfirmTone;
  icon?: IconName;
}

type Confirm = (options: ConfirmOptions) => Promise<boolean>;

const ConfirmContext = createContext<Confirm | null>(null);

/** Asks the user to confirm in a dialog; resolves true when they confirm. */
export function useConfirm(): Confirm {
  const confirm = useContext(ConfirmContext);
  if (!confirm) throw new Error('useConfirm must be used inside ConfirmProvider');
  return confirm;
}

export default function ConfirmProvider({ children }: { children: ReactNode }) {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);
  const resolveRef = useRef<((isConfirmed: boolean) => void) | null>(null);
  useNativeOverlay(!!options);

  const confirm = useCallback<Confirm>(nextOptions => {
    resolveRef.current?.(false);
    setOptions(nextOptions);
    return new Promise(resolve => {
      resolveRef.current = resolve;
    });
  }, []);

  function close(isConfirmed: boolean) {
    resolveRef.current?.(isConfirmed);
    resolveRef.current = null;
    setOptions(null);
  }

  const tone = options?.tone ?? 'danger';
  const ConfirmButton = tone === 'danger' ? DangerButton : ActionButton;

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}
      <ConfirmRoot open={!!options} onClose={() => close(false)} aria-labelledby="confirm-title">
        {options && (
          <>
            <div className="confirm-body">
              <ConfirmIcon $tone={tone}>
                <Icon name={options.icon ?? (tone === 'danger' ? 'trash' : 'check')} size={20} />
              </ConfirmIcon>
              <div className="confirm-text">
                <h3 id="confirm-title">{options.title}</h3>
                {options.message && <p>{options.message}</p>}
              </div>
            </div>
            <div className="confirm-foot">
              <ActionButton onClick={() => close(false)}>Cancel</ActionButton>
              <ConfirmButton $variant="primary" autoFocus onClick={() => close(true)}>
                {options.confirmLabel ?? 'Confirm'}
              </ConfirmButton>
            </div>
          </>
        )}
      </ConfirmRoot>
    </ConfirmContext.Provider>
  );
}
