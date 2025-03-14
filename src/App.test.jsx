// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import * as unsplashService from './services/unsplash';

// Mock the unsplash service
vi.mock('./services/unsplash', () => ({
  getRandomMinimalistImage: vi.fn(),
  getMultipleMinimalistImages: vi.fn()
}));

describe('App Component', () => {
  beforeEach(() => {
    // Clear mocks
    vi.clearAllMocks();
    
    // Mock localStorage
    const localStorageMock = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn()
    };
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    
    // Mock successful responses
    unsplashService.getRandomMinimalistImage.mockResolvedValue('https://example.com/image.jpg');
    unsplashService.getMultipleMinimalistImages.mockResolvedValue([
      'https://example.com/image1.jpg',
      'https://example.com/image2.jpg',
      'https://example.com/image3.jpg'
    ]);
  });

  it('should render loading state initially', () => {
    render(<App />);
    expect(screen.getByText('Loading your unique background...')).toBeInTheDocument();
  });

  it('should render background image after loading', async () => {
    render(<App />);
    
    await waitFor(() => {
      // Check that loading is no longer visible
      expect(screen.queryByText('Loading your unique background...')).not.toBeInTheDocument();
    });
    
    // Verify that a background image was rendered
    const backgroundElement = screen.getByTestId('background-image');
    expect(backgroundElement).toBeInTheDocument();
    expect(backgroundElement.style.backgroundImage).toContain('url(');
  });

  it('should fetch images from Unsplash on first load', async () => {
    // Mock empty localStorage
    window.localStorage.getItem.mockReturnValue(null);
    
    render(<App />);
    
    // Should call getMultipleMinimalistImages for initial load
    expect(unsplashService.getMultipleMinimalistImages).toHaveBeenCalledWith(3);
    
    await waitFor(() => {
      expect(window.localStorage.setItem).toHaveBeenCalled();
    });
  });

  it('should use cached images if available', async () => {
    // Mock localStorage with existing images
    const mockCache = {
      images: ['https://example.com/cached.jpg'],
      usageCount: 0,
      totalLoads: 1
    };
    window.localStorage.getItem.mockReturnValue(JSON.stringify(mockCache));
    
    render(<App />);
    
    // Should not call getMultipleMinimalistImages for cached images
    expect(unsplashService.getMultipleMinimalistImages).not.toHaveBeenCalled();
    
    await waitFor(() => {
      expect(window.localStorage.setItem).toHaveBeenCalled();
    });
  });

  it('should render the Clear Cache button', async () => {
    render(<App />);
    
    await waitFor(() => {
      const button = screen.getByTestId('clear-cache-button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveTextContent('Clear Cache & Refresh');
    });
  });
  
  it('should clear cache when button is clicked', async () => {
    const user = userEvent.setup();
    
    render(<App />);
    
    await waitFor(() => {
      expect(screen.getByTestId('clear-cache-button')).toBeInTheDocument();
    });
    
    // Click the clear cache button
    await user.click(screen.getByTestId('clear-cache-button'));
    
    // Verify localStorage.removeItem was called
    expect(window.localStorage.removeItem).toHaveBeenCalledWith('backgroundImageData');
  });
  
  it('should handle errors gracefully', async () => {
    // Mock a service error
    unsplashService.getMultipleMinimalistImages.mockRejectedValue(new Error('API error'));
    
    render(<App />);
    
    // Even with an error, we should still see a background image (fallback)
    await waitFor(() => {
      expect(screen.getByTestId('background-image')).toBeInTheDocument();
    });
  });
});
