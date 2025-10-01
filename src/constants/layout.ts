/**
 * Layout constants for portrait mode
 * These values control the responsive behavior of floating score cards
 */
export const PORTRAIT_LAYOUT = {
  /**
   * Zone split ratio - 50% top (red), 50% bottom (blue)
   */
  ZONE_SPLIT: 0.5,

  /**
   * Maximum card height as a ratio of zone height
   * 80% ensures cards stay well within zone boundaries with margin
   */
  CARD_MAX_HEIGHT_RATIO: 0.80,

  /**
   * Score font size as a ratio of card height
   * 55% provides good visual balance while preventing overflow
   */
  SCORE_FONT_RATIO: 0.55,

  /**
   * Horizontal margin for card positioning
   */
  HORIZONTAL_MARGIN: '7.5%',

  /**
   * Minimum safe font size for readability
   */
  MIN_SAFE_FONT_SIZE: 120,

  /**
   * Maximum font size (original design size)
   */
  MAX_SAFE_FONT_SIZE: 240,

  /**
   * Reset button dimensions
   */
  RESET_BUTTON_SIZE: 56,

  /**
   * Tally badge top margin
   */
  TALLY_TOP_MARGIN: 24,
} as const;
