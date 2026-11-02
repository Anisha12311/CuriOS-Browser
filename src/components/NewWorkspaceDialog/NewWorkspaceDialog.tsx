import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import { useState, type FormEvent } from 'react';
import { useBrowser } from '../../state/BrowserContext';
import { ActionButton, BareInput, ToolButton } from '../../styled/MUI/Common.styles';
import { FormDialog, Swatch } from '../../styled/MUI/Workspaces.styles';
import Icon from '../Icon/Icon';

interface NewWorkspaceDialogProps {
  isOpen: boolean;
  onClose(): void;
}

export default function NewWorkspaceDialog({ isOpen, onClose }: NewWorkspaceDialogProps) {
  const browser = useBrowser();
  const workspaceColors = useTheme().browser.workspaceColors;
  const workspaceCount = browser.state.workspaces.length;
  const [name, setName] = useState('');
  const [color, setColor] = useState(workspaceColors[workspaceCount % workspaceColors.length]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    browser.createWorkspace(name.trim() || `Workspace ${workspaceCount + 1}`, color);
    setName('');
    onClose();
  }

  return (
    <FormDialog open={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <header className="dialog-head">
          <h3>New workspace</h3>
          <ToolButton $size={32} aria-label="Close" onClick={onClose}>
            <Icon name="x" size={16} />
          </ToolButton>
        </header>
        <div className="dialog-body">
          <label className="dialog-label" htmlFor="workspace-name">
            Name
          </label>
          <BareInput
            id="workspace-name"
            className="dialog-field"
            autoFocus
            placeholder={`Workspace ${workspaceCount + 1}`}
            value={name}
            inputProps={{ maxLength: 32 }}
            onChange={event => setName(event.target.value)}
          />
          <span className="dialog-label">Colour</span>
          <Stack direction="row" spacing={1.5}>
            {workspaceColors.map(option => (
              <Swatch
                key={option}
                type="button"
                aria-label={`Colour ${option}`}
                aria-pressed={option === color}
                $color={option}
                $isOn={option === color}
                onClick={() => setColor(option)}
              >
                {option === color && <Icon name="check" size={16} />}
              </Swatch>
            ))}
          </Stack>
        </div>
        <div className="dialog-foot">
          <ActionButton type="button" onClick={onClose}>
            Cancel
          </ActionButton>
          <ActionButton $variant="primary" type="submit">
            Create workspace
          </ActionButton>
        </div>
      </form>
    </FormDialog>
  );
}
