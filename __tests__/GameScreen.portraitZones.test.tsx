import React from 'react';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { Dimensions } from 'react-native';
import GameScreen from '../src/components/GameScreen';
import { gameSlice } from '../src/store/gameSlice';

// Mock useWindowDimensions to return portrait dimensions
jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
  default: jest.fn(),
}));

const useWindowDimensions = require('react-native/Libraries/Utilities/useWindowDimensions').default;

const createTestStore = (initialState?: any) => {
  return configureStore({
    reducer: {
      game: gameSlice.reducer,
    },
    preloadedState: initialState,
  });
};

// Helper functions for boundary testing
const getElementPosition = (element: any) => {
  const flattenStyles = (styles: any): any => {
    if (Array.isArray(styles)) {
      return Object.assign({}, ...styles.map(flattenStyles));
    }
    return styles || {};
  };

  const style = flattenStyles(element.props.style);
  return {
    top: style.top,
    bottom: style.bottom,
    left: style.left,
    right: style.right,
    height: style.height,
    maxHeight: style.maxHeight,
  };
};

const parsePercentage = (value: string | number): number => {
  if (typeof value === 'string' && value.includes('%')) {
    return parseFloat(value) / 100;
  }
  return typeof value === 'number' ? value : 0;
};

describe('Portrait Mode Zone Boundaries - RED PHASE', () => {
  beforeEach(() => {
    // Set portrait mode with standard phone dimensions
    useWindowDimensions.mockReturnValue({ width: 375, height: 667 });
  });

  describe('Zone Structure', () => {
    test('should have red zone occupying top 50% of screen', () => {
      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      const redZone = getByTestId('red-zone');
      const position = getElementPosition(redZone);

      expect(position.top).toBe(0);
      expect(position.height).toBe('50%');
    });

    test('should have blue zone occupying bottom 50% of screen', () => {
      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      const blueZone = getByTestId('blue-zone');
      const position = getElementPosition(blueZone);

      expect(position.bottom).toBe(0);
      expect(position.height).toBe('50%');
    });

    test('zones should have overflow hidden to prevent card spillover', () => {
      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      const redZone = getByTestId('red-zone');
      const blueZone = getByTestId('blue-zone');

      const redStyle = Array.isArray(redZone.props.style)
        ? Object.assign({}, ...redZone.props.style)
        : redZone.props.style;

      const blueStyle = Array.isArray(blueZone.props.style)
        ? Object.assign({}, ...blueZone.props.style)
        : blueZone.props.style;

      expect(redStyle.overflow).toBe('hidden');
      expect(blueStyle.overflow).toBe('hidden');
    });
  });

  describe('Card Containment Within Zones', () => {
    test('red card should be contained within red zone', () => {
      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      const redCard = getByTestId('team1-card');
      const position = getElementPosition(redCard);

      // Card should have maxHeight constraint
      expect(position.maxHeight).toBeDefined();

      // MaxHeight should be percentage of zone height (85% of 50%)
      const maxHeightPercent = parsePercentage(position.maxHeight);
      expect(maxHeightPercent).toBeGreaterThan(0);
      expect(maxHeightPercent).toBeLessThanOrEqual(0.5); // Should fit in 50% zone
    });

    test('blue card should be contained within blue zone', () => {
      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      const blueCard = getByTestId('team2-card');
      const position = getElementPosition(blueCard);

      // Card should have maxHeight constraint
      expect(position.maxHeight).toBeDefined();

      // MaxHeight should be percentage of zone height (85% of 50%)
      const maxHeightPercent = parsePercentage(position.maxHeight);
      expect(maxHeightPercent).toBeGreaterThan(0);
      expect(maxHeightPercent).toBeLessThanOrEqual(0.5); // Should fit in 50% zone
    });

    test('red card should not extend beyond midline (50%)', () => {
      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      const redCard = getByTestId('team1-card');
      const position = getElementPosition(redCard);

      // Card positioned from top, should not reach 50% mark
      // With maxHeight of 42.5% (85% of 50%) and centered positioning,
      // bottom should be well below 50% line
      expect(position.top).toBeDefined();

      // If using percentage positioning
      if (typeof position.top === 'string') {
        const topPercent = parsePercentage(position.top);
        const maxHeightPercent = parsePercentage(position.maxHeight);

        // Card bottom = top + maxHeight should be <= 50%
        expect(topPercent + maxHeightPercent).toBeLessThanOrEqual(0.5);
      }
    });

    test('blue card should not extend beyond midline (50%)', () => {
      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      const blueCard = getByTestId('team2-card');
      const position = getElementPosition(blueCard);

      // Card positioned from bottom, should not reach 50% mark
      expect(position.bottom).toBeDefined();

      // If using percentage positioning
      if (typeof position.bottom === 'string') {
        const bottomPercent = parsePercentage(position.bottom);
        const maxHeightPercent = parsePercentage(position.maxHeight);

        // Card top = 100% - (bottom + maxHeight) should be >= 50%
        expect(bottomPercent + maxHeightPercent).toBeLessThanOrEqual(0.5);
      }
    });
  });

  describe('Responsive Sizing Across Screen Sizes', () => {
    const testDevices = [
      { width: 320, height: 568, name: 'iPhone SE (Small)' },
      { width: 375, height: 667, name: 'iPhone 8' },
      { width: 390, height: 844, name: 'iPhone 14' },
      { width: 430, height: 932, name: 'iPhone 14 Pro Max' },
      { width: 768, height: 1024, name: 'iPad Mini' },
    ];

    testDevices.forEach(({ width, height, name }) => {
      test(`cards should have maxHeight constraint on ${name}`, () => {
        useWindowDimensions.mockReturnValue({ width, height });

        const store = createTestStore();
        const { getByTestId } = render(
          <Provider store={store}>
            <GameScreen />
          </Provider>
        );

        const redCard = getByTestId('team1-card');
        const blueCard = getByTestId('team2-card');

        const redPosition = getElementPosition(redCard);
        const bluePosition = getElementPosition(blueCard);

        // Both cards should have maxHeight defined
        expect(redPosition.maxHeight).toBeDefined();
        expect(bluePosition.maxHeight).toBeDefined();

        // MaxHeight should be reasonable (not exceeding zone)
        const redMaxPercent = parsePercentage(redPosition.maxHeight);
        const blueMaxPercent = parsePercentage(bluePosition.maxHeight);

        expect(redMaxPercent).toBeGreaterThan(0);
        expect(redMaxPercent).toBeLessThanOrEqual(0.5);
        expect(blueMaxPercent).toBeGreaterThan(0);
        expect(blueMaxPercent).toBeLessThanOrEqual(0.5);
      });
    });

    test('should scale font size responsively on small screens', () => {
      // Small screen
      useWindowDimensions.mockReturnValue({ width: 320, height: 568 });

      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      const scoreText = getByTestId('team1-score');
      const style = Array.isArray(scoreText.props.style)
        ? Object.assign({}, ...scoreText.props.style)
        : scoreText.props.style;

      // Font size should be less than the original 240px on small screen
      expect(style.fontSize).toBeLessThan(240);
      expect(style.fontSize).toBeGreaterThanOrEqual(120); // Minimum readable size
    });

    test('should use maximum font size on large screens', () => {
      // Large screen
      useWindowDimensions.mockReturnValue({ width: 768, height: 1024 });

      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      const scoreText = getByTestId('team1-score');
      const style = Array.isArray(scoreText.props.style)
        ? Object.assign({}, ...scoreText.props.style)
        : scoreText.props.style;

      // On large screen, font size is calculated as:
      // zoneHeight (512) * CARD_MAX_HEIGHT_RATIO (0.70) * SCORE_FONT_RATIO (0.45) = 161.28
      // This ensures proper containment with all card content
      expect(style.fontSize).toBeGreaterThan(150);
      expect(style.fontSize).toBeLessThanOrEqual(240);
    });
  });

  describe('Component Layout Preservation', () => {
    test('reset button should remain at 50% midline', () => {
      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      const resetContainer = getByTestId('middle-controls-container');
      const position = getElementPosition(resetContainer);

      // Reset button should be positioned at 50% from top
      expect(position.top).toBe('50%');
    });

    test('tally badge should remain at top', () => {
      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      const tallyContainer = getByTestId('top-controls-container');
      const position = getElementPosition(tallyContainer);

      expect(position.top).toBe(24);
    });

    test('background split should remain 50/50', () => {
      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      const topBg = getByTestId('top-background');
      const bottomBg = getByTestId('bottom-background');

      const topStyle = Array.isArray(topBg.props.style)
        ? Object.assign({}, ...topBg.props.style)
        : topBg.props.style;

      const bottomStyle = Array.isArray(bottomBg.props.style)
        ? Object.assign({}, ...bottomBg.props.style)
        : bottomBg.props.style;

      expect(topStyle.height).toBe('50%');
      expect(topStyle.backgroundColor).toBe('#FF0000');
      expect(bottomStyle.height).toBe('50%');
      expect(bottomStyle.backgroundColor).toBe('#0000FF');
    });
  });

  describe('Visual Design Preservation', () => {
    test('cards should maintain floating aesthetic', () => {
      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      const redCard = getByTestId('team1-card');
      const style = Array.isArray(redCard.props.style)
        ? Object.assign({}, ...redCard.props.style)
        : redCard.props.style;

      expect(style.position).toBe('absolute');
      expect(style.borderRadius).toBe(20);
      expect(style.shadowOpacity).toBeGreaterThan(0);
      expect(style.elevation).toBeGreaterThan(0);
    });

    test('cards should maintain proper z-index layering', () => {
      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      const redZone = getByTestId('red-zone');
      const resetContainer = getByTestId('middle-controls-container');
      const tallyContainer = getByTestId('top-controls-container');

      const resetStyle = Array.isArray(resetContainer.props.style)
        ? Object.assign({}, ...resetContainer.props.style)
        : resetContainer.props.style;

      const tallyStyle = Array.isArray(tallyContainer.props.style)
        ? Object.assign({}, ...tallyContainer.props.style)
        : tallyContainer.props.style;

      // Tally badge should have highest z-index
      expect(tallyStyle.zIndex).toBe(10);
      // Reset button should be above cards
      expect(resetStyle.zIndex).toBe(5);
    });
  });
});
