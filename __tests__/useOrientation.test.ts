import { renderHook, act } from '@testing-library/react';
import { useOrientation, useIsLandscape } from '../src/hooks/useOrientation';

describe('useOrientation', () => {
  beforeEach(() => {
    // Setup default window dimensions
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 768,
    });
  });

  describe('useOrientation hook', () => {
    it('should return "landscape" when width > height', () => {
      window.innerWidth = 800;
      window.innerHeight = 600;
      const { result } = renderHook(() => useOrientation());
      expect(result.current).toBe('landscape');
    });

    it('should return "portrait" when height > width', () => {
      window.innerWidth = 600;
      window.innerHeight = 800;
      const { result } = renderHook(() => useOrientation());
      expect(result.current).toBe('portrait');
    });

    it('should return "portrait" when width === height', () => {
      window.innerWidth = 600;
      window.innerHeight = 600;
      const { result } = renderHook(() => useOrientation());
      expect(result.current).toBe('portrait');
    });

    it('should update on window resize', () => {
      window.innerWidth = 800;
      window.innerHeight = 600;
      const { result } = renderHook(() => useOrientation());
      expect(result.current).toBe('landscape');

      act(() => {
        window.innerWidth = 600;
        window.innerHeight = 800;
        window.dispatchEvent(new Event('resize'));
      });

      expect(result.current).toBe('portrait');
    });

    it('should cleanup listeners on unmount', () => {
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
      const { unmount } = renderHook(() => useOrientation());
      unmount();
      expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
      removeEventListenerSpy.mockRestore();
    });
  });

  describe('useIsLandscape hook', () => {
    it('should return true when width > height', () => {
      window.innerWidth = 800;
      window.innerHeight = 600;
      const { result } = renderHook(() => useIsLandscape());
      expect(result.current).toBe(true);
    });

    it('should return false when height > width', () => {
      window.innerWidth = 600;
      window.innerHeight = 800;
      const { result } = renderHook(() => useIsLandscape());
      expect(result.current).toBe(false);
    });

    it('should return false when width === height', () => {
      window.innerWidth = 600;
      window.innerHeight = 600;
      const { result } = renderHook(() => useIsLandscape());
      expect(result.current).toBe(false);
    });
  });
});
