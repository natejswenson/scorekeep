import { useWindowDimensions } from 'react-native';

/**
 * Custom hook to detect device orientation
 * @returns 'landscape' if width > height, otherwise 'portrait'
 */
export const useOrientation = (): 'landscape' | 'portrait' => {
  const dimensions = useWindowDimensions();
  return dimensions.width > dimensions.height ? 'landscape' : 'portrait';
};

/**
 * Custom hook to check if device is in landscape mode
 * @returns true if landscape, false if portrait
 */
export const useIsLandscape = (): boolean => {
  const dimensions = useWindowDimensions();
  return dimensions.width > dimensions.height;
};
