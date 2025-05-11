import { vi } from 'vitest';
import { useParams } from '../../client/node_modules/react-router-dom';
import { useAuth } from '../../client/src/hooks/useAuth';

// Mocks
vi.mock('../../client/node_modules/react-router-dom', async () => {
  return {
    useParams: vi.fn(),
  };
});

vi.mock('../../client/src/components/ClassNavigationBar.tsx', () => ({
  default: () => <div data-testid="class-navigation-bar" />,
}));

vi.mock('../../client/src/components/BackButton.tsx', () => ({
  default: ({ link }: { link: string }) => <div data-testid="back-button">{link}</div>,
}));

vi.mock('../../client/node_modules/react-i18next', async () => {
  return {
    useTranslation: () => ({
      t: (key: string) => key,
    }),
  };
});

vi.mock('../../client/node_modules/@mui/material', async () => {
  const actual = await import('@mui/material');
  return {
    ...actual,
    useTheme: vi.fn(),
    useDefaultProps: vi.fn(),
  };
});

vi.mock('../../client/src/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

export function setUseParamsOutput(output: any) {
  (useParams as any).mockReturnValue(output);
}

export function setUseAuthOutput(output: any) {
  (useAuth as any).mockReturnValue(output);
}
