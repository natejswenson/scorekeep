import React from 'react';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import GameScreen from '../../src/components/GameScreen';
import gameReducer from '../../src/store/gameSlice';

// Helper to create a fresh store for each test
const createTestStore = () => {
  return configureStore({
    reducer: {
      game: gameReducer,
    },
  });
};

// Helper to mock window dimensions
const mockWindowDimensions = (width: number, height: number) => {
  Object.defineProperty(window, 'innerWidth', {
    writable: true,
    configurable: true,
    value: width,
  });
  Object.defineProperty(window, 'innerHeight', {
    writable: true,
    configurable: true,
    value: height,
  });
};

describe('Mobile Viewport Rendering', () => {
  const mobileViewports = [
    { width: 320, height: 568, device: 'iPhone SE' },
    { width: 375, height: 667, device: 'iPhone 8' },
    { width: 390, height: 844, device: 'iPhone 12' },
    { width: 428, height: 926, device: 'iPhone 14 Pro Max' },
  ];

  test.each(mobileViewports)(
    'should render correctly at $device dimensions',
    ({ width, height, device }) => {
      mockWindowDimensions(width, height);

      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      // Portrait mode - should have portrait container
      const team1ScoreArea = getByTestId('team1-score-area');
      const team2ScoreArea = getByTestId('team2-score-area');

      expect(team1ScoreArea).toBeTruthy();
      expect(team2ScoreArea).toBeTruthy();
    }
  );

  test('should handle orientation change from portrait to landscape', () => {
    const store = createTestStore();

    // Start in portrait
    mockWindowDimensions(375, 667);
    const { getByTestId, rerender } = render(
      <Provider store={store}>
        <GameScreen />
      </Provider>
    );

    // Portrait layout should be active
    expect(getByTestId('team1-side')).toBeTruthy();
    expect(getByTestId('team2-side')).toBeTruthy();

    // Switch to landscape
    mockWindowDimensions(667, 375);
    rerender(
      <Provider store={store}>
        <GameScreen />
      </Provider>
    );

    // Should still render both team sides
    expect(getByTestId('team1-side')).toBeTruthy();
    expect(getByTestId('team2-side')).toBeTruthy();
  });

  test('should handle orientation change from landscape to portrait', () => {
    const store = createTestStore();

    // Start in landscape
    mockWindowDimensions(667, 375);
    const { getByTestId, rerender } = render(
      <Provider store={store}>
        <GameScreen />
      </Provider>
    );

    expect(getByTestId('team1-side')).toBeTruthy();

    // Switch to portrait
    mockWindowDimensions(375, 667);
    rerender(
      <Provider store={store}>
        <GameScreen />
      </Provider>
    );

    expect(getByTestId('team1-side')).toBeTruthy();
  });

  test('should render touch targets at all viewport sizes', () => {
    const viewports = [
      { width: 320, height: 568 },
      { width: 428, height: 926 },
    ];

    viewports.forEach(({ width, height }) => {
      mockWindowDimensions(width, height);

      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      // All critical touch targets should be present
      expect(getByTestId('team1-score-area')).toBeTruthy();
      expect(getByTestId('team2-score-area')).toBeTruthy();
      expect(getByTestId('reset-button')).toBeTruthy();
      expect(getByTestId('team1-decrement')).toBeTruthy();
      expect(getByTestId('team2-decrement')).toBeTruthy();
    });
  });
});
