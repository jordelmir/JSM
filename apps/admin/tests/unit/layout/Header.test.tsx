import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { Header } from '../../../src/components/layout/Header';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@gasolinera-jsm/shared/store/authStore';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
}));

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key, // Simple mock: returns the key itself
  }),
}));

// Mock next/link
vi.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

// Mock useAuthStore
vi.mock('@gasolinera-jsm/shared/store/authStore', () => ({
  useAuthStore: vi.fn(),
}));

describe('Header', () => {
  const mockLogout = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (usePathname as any).mockReturnValue('/dashboard'); // Default pathname
    (useAuthStore as any).mockReturnValue({ logout: mockLogout });
  });

  it('should render the main header elements', () => {
    render(<Header />);
    expect(screen.getByRole('banner')).toBeInTheDocument(); // header tag
    expect(screen.getByPlaceholderText('Search products...')).toBeInTheDocument();
    expect(screen.getByLabelText('Toggle user menu')).toBeInTheDocument();
  });

  it('should render mobile navigation links and apply active styling', () => {
    (usePathname as any).mockReturnValue('/dashboard/users');
    render(<Header />);

    // Open the mobile sheet
    fireEvent.click(screen.getByLabelText('Toggle navigation menu'));

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    const usersLink = screen.getByText('Users').closest('a');
    expect(usersLink).toHaveClass('bg-muted');
    expect(usersLink).toHaveClass('text-foreground');
  });

  it('should render translated labels', () => {
    (useTranslation as any).mockReturnValue({ t: (key: string) => `Translated ${key}` });
    render(<Header />);
    expect(screen.getByText('Translated Toggle navigation menu')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Translated Search products...')).toBeInTheDocument();
    expect(screen.getByText('Translated My Account')).toBeInTheDocument();
  });

  it('should call logout when the logout menu item is clicked', () => {
    render(<Header />);

    // Open the user dropdown menu
    fireEvent.click(screen.getByLabelText('Toggle user menu'));

    // Click the logout item
    fireEvent.click(screen.getByText('Logout'));

    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
