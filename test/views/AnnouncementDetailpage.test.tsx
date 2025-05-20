import { beforeAll, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import AnnouncementDetailpage from '../../client/src/views/AnnouncementDetailpage';
import { useAnnouncementById } from '../../client/src/hooks/useAnnouncement';
import '@testing-library/jest-dom';
import { setUseAuthOutput, setUseParamsOutput } from '../setUpMocks';

vi.mock('../../client/src/hooks/useAnnouncement', () => ({
  useAnnouncementById: vi.fn(),
}));

vi.mock('../../client/src/components/AnnouncementCard', () => ({
  default: (props: any) => <div data-testid="announcement-card">{props.title}</div>,
}));

describe('AnnouncementDetailpage', () => {
  beforeAll(() => {
    setUseAuthOutput({});
    setUseParamsOutput({ announcementId: '123' });
  });

  it('toont loading state als de aankondiging nog laadt', () => {
    (useAnnouncementById as any).mockReturnValue({ isLoading: true });
    render(<AnnouncementDetailpage />);
    expect(screen.getByText('loading')).toBeInTheDocument();
  });

  it('toont de announcement content als data geladen is', () => {
    (useAnnouncementById as any).mockReturnValue({
      isLoading: false,
      data: {
        id: '123',
        title: 'Test Announcement',
        class: { id: '1', name: 'Klas A' },
      },
    });
    render(<AnnouncementDetailpage />);
    expect(screen.getByTestId('class-navigation-bar')).toBeInTheDocument();
    expect(screen.getByTestId('announcement-card')).toHaveTextContent('Test Announcement');
    expect(screen.getByTestId('back-button')).toHaveTextContent('/class/1/announcements');
  });
});
