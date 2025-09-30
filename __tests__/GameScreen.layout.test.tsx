import React from 'react';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import GameScreen from '../src/components/GameScreen';
import { gameSlice } from '../src/store/gameSlice';

const createTestStore = (initialState?: any) => {
  return configureStore({
    reducer: {
      game: gameSlice.reducer,
    },
    preloadedState: initialState,
  });
};

describe('GameScreen Layout Optimization', () => {
  describe('Vertical Spacing', () => {
    test('should reduce gap between score circle and decrement button', () => {
      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      const scoreArea = getByTestId('team1-score-area');
      const styles = scoreArea.props.style;

      // Expect reduced marginBottom (10 instead of 40)
      expect(styles.marginBottom).toBe(10);
    });

    test('should position Games Won section higher in viewport', () => {
      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      const gamesWonContainer = getByTestId('team1-wins-container');
      const styles = gamesWonContainer.props.style;

      // Expect reduced marginTop (8 instead of 20)
      expect(styles.marginTop).toBe(8);
    });
  });

  describe('Tally Controls Position', () => {
    test('should position tally controls at top of screen', () => {
      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      const topContainer = getByTestId('top-controls-container');
      const styles = Array.isArray(topContainer.props.style)
        ? Object.assign({}, ...topContainer.props.style)
        : topContainer.props.style;

      // The top container should have top position at 8% instead of 45%
      expect(styles.top).toBe('8%');
    });

    test('should center tally controls horizontally', () => {
      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      const topContainer = getByTestId('top-controls-container');
      const styles = Array.isArray(topContainer.props.style)
        ? Object.assign({}, ...topContainer.props.style)
        : topContainer.props.style;

      expect(styles.left).toBe('50%');
      expect(styles.position).toBe('absolute');
    });
  });

  describe('Reset Button Position', () => {
    test('should position reset button in middle area separate from tally controls', () => {
      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      const middleContainer = getByTestId('middle-controls-container');
      const styles = Array.isArray(middleContainer.props.style)
        ? Object.assign({}, ...middleContainer.props.style)
        : middleContainer.props.style;

      // Reset button should be in its own container positioned at 45%
      expect(styles.top).toBe('45%');
    });

    test('should not be grouped with tally controls', () => {
      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      const topContainer = getByTestId('top-controls-container');
      const middleContainer = getByTestId('middle-controls-container');

      // Tally controls and reset button should be in different containers
      expect(topContainer).toBeTruthy();
      expect(middleContainer).toBeTruthy();
      expect(topContainer).not.toBe(middleContainer);
    });
  });

  describe('Accessibility', () => {
    test('should maintain minimum 44px touch targets for all controls', () => {
      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      const team1Increment = getByTestId('team1-increment-button');
      const team1Decrement = getByTestId('team1-decrement-button');
      const resetButton = getByTestId('reset-button');

      // Check touch targets are at least 44px
      expect(team1Increment.props.style.minWidth).toBeGreaterThanOrEqual(44);
      expect(team1Increment.props.style.minHeight).toBeGreaterThanOrEqual(44);
      expect(team1Decrement.props.style.minWidth).toBeGreaterThanOrEqual(44);
      expect(team1Decrement.props.style.minHeight).toBeGreaterThanOrEqual(44);
      expect(resetButton.props.style.width).toBeGreaterThanOrEqual(44);
      expect(resetButton.props.style.height).toBeGreaterThanOrEqual(44);
    });

    test('should preserve accessibility labels', () => {
      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      const team1Increment = getByTestId('team1-increment-button');
      const team1Decrement = getByTestId('team1-decrement-button');

      expect(team1Increment.props.accessibilityLabel).toBe('Increment team 1 wins');
      expect(team1Decrement.props.accessibilityLabel).toBe('Decrement team 1 wins');
    });
  });

  describe('Component Structure', () => {
    test('should render tally controls in separate top container', () => {
      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      const topContainer = getByTestId('top-controls-container');
      const tallyControls = getByTestId('tally-controls-container');

      // Both containers should exist
      expect(topContainer).toBeTruthy();
      expect(tallyControls).toBeTruthy();

      // Top container should have proper positioning styles
      const styles = Array.isArray(topContainer.props.style)
        ? Object.assign({}, ...topContainer.props.style)
        : topContainer.props.style;
      expect(styles.top).toBe('8%');
    });

    test('should render reset button in separate middle container', () => {
      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      const middleContainer = getByTestId('middle-controls-container');
      const resetButton = getByTestId('reset-button');

      // Both elements should exist
      expect(middleContainer).toBeTruthy();
      expect(resetButton).toBeTruthy();

      // Middle container should have proper positioning styles
      const styles = Array.isArray(middleContainer.props.style)
        ? Object.assign({}, ...middleContainer.props.style)
        : middleContainer.props.style;
      expect(styles.top).toBe('45%');
    });
  });
});
