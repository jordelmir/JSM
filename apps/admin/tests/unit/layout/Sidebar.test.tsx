import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { Sidebar } from '../../../src/components/layout/Sidebar';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';

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

// Mock next/link as it's a client component and might cause issues in tests
vi.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe('Sidebar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (usePathname as any).mockReturnValue('/dashboard'); // Default pathname
  });

  it('should render all navigation links', () => {
    render(<Sidebar />);
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('should apply active styling to the current dashboard link', () => {
    (usePathname as any).mockReturnValue('/dashboard');
    render(<Sidebar />);
    const dashboardLink = screen.getByText('Dashboard').closest('a');
    expect(dashboardLink).toHaveClass('bg-muted');
    expect(dashboardLink).toHaveClass('text-primary');
  });

  it('should apply active styling to the users link', () => {
    (usePathname as any).mockReturnValue('/dashboard/users');
    render(<Sidebar />);
    const usersLink = screen.getByText('Users').closest('a');
    expect(usersLink).toHaveClass('bg-muted');
    expect(usersLink).toHaveClass('text-primary');
  });

  it('should apply active styling to the settings link', () => {
    (usePathname as any).mockReturnValue('/dashboard/settings');
    render(<Sidebar />);
    const settingsLink = screen.getByText('Settings').closest('a');
    expect(settingsLink).toHaveClass('bg-muted');
    expect(settingsLink).toHaveClass('text-primary');
  });

  it('should render translated labels', () => {
    (useTranslation as any).mockReturnValue({ t: (key: string) => `Translated ${key}` });
    render(<Sidebar />);
    expect(screen.getByText('Translated Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Translated Users')).toBeInTheDocument();
    expect(screen.getByText('Translated Settings')).toBeInTheDocument();
    expect(screen.getByText('Translated Admin Dashboard')).toBeInTheDocument();
  });

  it('should render icons for each navigation link', () => {
    render(<Sidebar />);
    // Check for the presence of SVG elements within the links
    const links = screen.getAllByRole('link');
    links.forEach(link => {
      // Assuming icons are SVGs, check if an SVG is a child of the link
      expect(link.querySelector('svg')).toBeInTheDocument();
    });
  });
});
