import { ThemeProvider } from '@mui/material/styles';
import BrowserShell from './components/BrowserShell/BrowserShell';
import { BrowserProvider } from './state/BrowserContext';
import { lightTheme } from './styled/theme/theme';

export default function App() {
  return (
    <ThemeProvider theme={lightTheme}>
      <BrowserProvider>
        <BrowserShell />
      </BrowserProvider>
    </ThemeProvider>
  );
}
