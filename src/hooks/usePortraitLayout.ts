import { useWindowDimensions } from 'react-native';
import { PORTRAIT_LAYOUT } from '../constants/layout';

/**
 * Custom hook for calculating portrait layout dimensions
 * Provides dynamic sizing for floating score cards based on screen size
 *
 * @returns Layout calculations for portrait mode
 */
export const usePortraitLayout = () => {
  const { width, height } = useWindowDimensions();
  const isPortrait = height > width;

  // Calculate zone height (50% of screen)
  const zoneHeight = height * PORTRAIT_LAYOUT.ZONE_SPLIT;

  // Calculate maximum card height (85% of zone)
  const maxCardHeight = zoneHeight * PORTRAIT_LAYOUT.CARD_MAX_HEIGHT_RATIO;

  // Calculate safe font size: 60% of card height, clamped between min and max
  const safeFontSize = Math.min(
    PORTRAIT_LAYOUT.MAX_SAFE_FONT_SIZE,
    Math.max(PORTRAIT_LAYOUT.MIN_SAFE_FONT_SIZE, maxCardHeight * PORTRAIT_LAYOUT.SCORE_FONT_RATIO)
  );

  /**
   * Get card position styles for a specific zone
   * @param position - 'top' for red zone, 'bottom' for blue zone
   * @returns Position style object
   */
  const getCardPosition = (position: 'top' | 'bottom') => {
    // Calculate vertical margin to center card in zone
    const verticalMargin = (zoneHeight - maxCardHeight) / 2;

    if (position === 'top') {
      return {
        top: verticalMargin,
        left: PORTRAIT_LAYOUT.HORIZONTAL_MARGIN,
      };
    }

    return {
      bottom: verticalMargin,
      right: PORTRAIT_LAYOUT.HORIZONTAL_MARGIN,
    };
  };

  /**
   * Get max height as percentage of screen height
   * @returns MaxHeight as percentage string (compatible with DimensionValue)
   */
  const getMaxHeightPercent = () => {
    return `${(maxCardHeight / height) * 100}%` as const;
  };

  return {
    isPortrait,
    zoneHeight,
    maxCardHeight,
    safeFontSize,
    getCardPosition,
    getMaxHeightPercent,
    screenDimensions: { width, height },
  };
};
