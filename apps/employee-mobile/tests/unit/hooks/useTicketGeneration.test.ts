import { renderHook, act } from '@testing-library/react-native';
import { vi } from 'vitest';
import { useTicketGeneration } from '../../../hooks/useTicketGeneration'; // Adjust path
import { createTicket } from '../../../src/api/employee'; // Adjust path
import { useTranslation } from 'react-i18next';
import { Alert } from 'react-native';

// Mock dependencies
vi.mock('../../../src/api/employee');
vi.mock('react-i18next');
vi.mock('react-native', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-native')>();
  return {
    ...actual,
    Alert: { alert: vi.fn() },
  };
});

describe('useTicketGeneration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (useTranslation as any).mockReturnValue({ t: (key: string) => key });
  });

  it('should initialize with isLoadingTicket as false', () => {
    const { result } = renderHook(() => useTicketGeneration());
    expect(result.current.isLoadingTicket).toBe(false);
  });

  it('generateTicket should set loading state and call createTicket on success', async () => {
    const mockTicket = { id: 'mock-ticket-123', amount: 100, type: 'fuel' };
    (createTicket as any).mockResolvedValue(mockTicket);

    const { result } = renderHook(() => useTicketGeneration());

    await act(async () => {
      await result.current.generateTicket();
    });

    expect(result.current.isLoadingTicket).toBe(false);
    expect(createTicket).toHaveBeenCalledWith({ amount: 100, type: 'fuel' });
    expect(Alert.alert).toHaveBeenCalledWith('Success', `Ticket #${mockTicket.id} generated`);
  });

  it('generateTicket should handle error during ticket creation', async () => {
    const errorMessage = 'Failed to create ticket';
    (createTicket as any).mockRejectedValue(new Error(errorMessage));

    const { result } = renderHook(() => useTicketGeneration());

    await act(async () => {
      await result.current.generateTicket();
    });

    expect(result.current.isLoadingTicket).toBe(false);
    expect(createTicket).toHaveBeenCalledTimes(1);
    expect(Alert.alert).toHaveBeenCalledWith('Error', errorMessage);
  });

  it('generateTicket should handle generic error during ticket creation', async () => {
    (createTicket as any).mockRejectedValue(new Error()); // Generic error

    const { result } = renderHook(() => useTicketGeneration());

    await act(async () => {
      await result.current.generateTicket();
    });

    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Could not generate ticket');
  });
});
