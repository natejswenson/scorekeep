import { renderHook } from '@testing-library/react-native';
import { useOrientation, useIsLandscape } from '../src/hooks/useOrientation';

// Mock useWindowDimensions
jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
  default: jest.fn(),
}));

const useWindowDimensions = require('react-native/Libraries/Utilities/useWindowDimensions').default;

describe('useOrientation', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('useOrientation hook', () => {
    it('should return "landscape" when width > height', () => {
      useWindowDimensions.mockReturnValue({ width: 800, height: 600 });
      const { result } = renderHook(() => useOrientation());
      expect(result.current).toBe('landscape');
    });

    it('should return "portrait" when height > width', () => {
      useWindowDimensions.mockReturnValue({ width: 600, height: 800 });
      const { result } = renderHook(() => useOrientation());
      expect(result.current).toBe('portrait');
    });

    it('should return "portrait" when width === height', () => {
      useWindowDimensions.mockReturnValue({ width: 600, height: 600 });
      const { result } = renderHook(() => useOrientation());
      expect(result.current).toBe('portrait');
    });
  });

  describe('useIsLandscape hook', () => {
    it('should return true when width > height', () => {
      useWindowDimensions.mockReturnValue({ width: 800, height: 600 });
      const { result } = renderHook(() => useIsLandscape());
      expect(result.current).toBe(true);
    });

    it('should return false when height > width', () => {
      useWindowDimensions.mockReturnValue({ width: 600, height: 800 });
      const { result } = renderHook(() => useIsLandscape());
      expect(result.current).toBe(false);
    });

    it('should return false when width === height', () => {
      useWindowDimensions.mockReturnValue({ width: 600, height: 600 });
      const { result } = renderHook(() => useIsLandscape());
      expect(result.current).toBe(false);
    });
  });
});
