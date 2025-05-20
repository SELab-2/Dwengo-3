import { render, screen, fireEvent } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import AnnouncementCard from '../../client/src/components/AnnouncementCard';
import '@testing-library/jest-dom';
import { setUseNavigateOutput } from '../setUpMocks';

// Dummy props
const dummyProps = {
  id: 'abc123',
  title: 'Test Aankondiging',
  date: '2023-12-31T23:59:59.000Z',
  teacher: {
    id: '456',
    user: {
      name: 'Voornaam',
      surname: 'Familienaam',
    },
  },
  content: 'Dit is een test aankondiging.',
};

describe('AnnouncementCard', () => {
  const mockNavigate = vi.fn();

  beforeEach(() => {
    setUseNavigateOutput(mockNavigate);
    mockNavigate.mockClear();
  });

  it('toont titel, leerkracht en inhoud', () => {
    render(<AnnouncementCard {...dummyProps} />);

    expect(screen.getByText(dummyProps.title)).toBeInTheDocument();
    expect(screen.getByText(dummyProps.teacher.user.name)).toBeInTheDocument();
    expect(screen.getByText(dummyProps.content)).toBeInTheDocument();
  });

  it('navigeert naar detailpagina bij klikken op titel', () => {
    render(<AnnouncementCard {...dummyProps} />);

    const titleElement = screen.getByText(dummyProps.title);
    fireEvent.click(titleElement);

    expect(mockNavigate).toHaveBeenCalledWith(`/announcement/${dummyProps.id}`);
  });
});
