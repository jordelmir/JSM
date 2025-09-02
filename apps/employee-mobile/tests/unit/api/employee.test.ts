import { vi } from 'vitest';
import { createTicket, validateQRCode } from '../../../src/api/employee'; // Adjust path
import { apiCall } from '../../../src/api/apiClient'; // Adjust path

// Mock apiCall
vi.mock('../../../src/api/apiClient');

describe('employee API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('createTicket should call apiCall with correct parameters', async () => {
    const mockTicketData = { type: 'fuel', amount: 50 };
    (apiCall as any).mockResolvedValueOnce({ id: 'ticket-123', ...mockTicketData });

    const result = await createTicket(mockTicketData);

    expect(apiCall).toHaveBeenCalledTimes(1);
    expect(apiCall).toHaveBeenCalledWith(
      '/tickets',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify(mockTicketData),
      })
    );
    expect(result).toEqual({ id: 'ticket-123', ...mockTicketData });
  });

  it('validateQRCode should call apiCall with correct parameters', async () => {
    const mockQrCode = 'qr-code-data';
    const mockValidationResult = { isValid: true, data: mockQrCode };
    (apiCall as any).mockResolvedValueOnce(mockValidationResult);

    const result = await validateQRCode(mockQrCode);

    expect(apiCall).toHaveBeenCalledTimes(1);
    expect(apiCall).toHaveBeenCalledWith(
      '/qr/validate',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ qrCode: mockQrCode }),
      })
    );
    expect(result).toEqual(mockValidationResult);
  });
});
