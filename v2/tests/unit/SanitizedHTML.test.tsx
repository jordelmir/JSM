import { render, screen, cleanup, rerender } from '@testing-library/react';
import { vi } from 'vitest';
import SanitizedHTML from '../../src/components/SanitizedHTML';
import DOMPurify from 'dompurify';

// Mock DOMPurify.sanitize
vi.mock('dompurify', () => ({
  sanitize: vi.fn((html) => html.replace(/<script.*?>.*?<\/script>/gis, '').replace(/on\w+=["'].*?["']/gis, '')),
}));

describe('SanitizedHTML', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('should render sanitized HTML correctly', () => {
    const safeHtml = '<div>Hello, <strong>World!</strong></div>';
    render(<SanitizedHTML html={safeHtml} />);
    expect(DOMPurify.sanitize).toHaveBeenCalledTimes(1);
    expect(screen.getByText('Hello, World!')).toBeInTheDocument();
    expect(screen.getByText('Hello, World!').innerHTML).toBe('Hello, <strong>World!</strong>');
  });

  it('should sanitize unsafe HTML (XSS attempt)', () => {
    const unsafeHtml = '<img src=x onerror=alert("XSS")><script>alert("evil")<\/script><div>Safe content</div>';
    render(<SanitizedHTML html={unsafeHtml} />);
    expect(DOMPurify.sanitize).toHaveBeenCalledTimes(1);
    // The mock sanitize function removes script tags and onerror attributes
    expect(screen.getByText('Safe content')).toBeInTheDocument();
    expect(screen.getByText('Safe content').innerHTML).not.toContain('<script>');
    expect(screen.getByText('Safe content').innerHTML).not.toContain('onerror');
  });

  it('should memoize sanitization and not call DOMPurify.sanitize if html prop does not change', () => {
    const htmlContent = '<span>Memoized content</span>';
    const { rerender } = render(<SanitizedHTML html={htmlContent} />);
    expect(DOMPurify.sanitize).toHaveBeenCalledTimes(1);

    // Rerender with the same prop
    rerender(<SanitizedHTML html={htmlContent} />);
    expect(DOMPurify.sanitize).toHaveBeenCalledTimes(1); // Should still be 1

    // Rerender with a different prop
    rerender(<SanitizedHTML html='<span>New content</span>' />);
    expect(DOMPurify.sanitize).toHaveBeenCalledTimes(2); // Should be 2 now
  });
});
