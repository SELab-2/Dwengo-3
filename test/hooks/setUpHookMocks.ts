import { useQuery } from '../../client/node_modules/@tanstack/react-query';
import { vi } from 'vitest';

vi.mock('../../client/node_modules/@tanstack/react-query', async () => {
  const actual = await import('../../client/node_modules/@tanstack/react-query');
  return {
    ...actual,
    useQuery: vi.fn(),
  };
});

export function mockUseQuery() {
  (useQuery as any).mockImplementation(async ({ queryFn }: { queryFn: () => Promise<any> }) => {
    try {
      const data = await queryFn();
      return {
        data,
        isLoading: false,
        error: null,
        isSuccess: true,
      };
    } catch (error) {
      return {
        data: null,
        isLoading: false,
        error,
        isSuccess: false,
      };
    }
  });
}
