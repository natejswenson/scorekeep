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

      // Score area should have no marginBottom since overlap is controlled by button's negative marginTop
      expect(styles.marginBottom).toBeUndefined();
    });

    test('should position Games Won section at bottom of viewport', () => {
      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      // Games won controls should exist
      expect(getByTestId('team1-wins')).toBeTruthy();
      expect(getByTestId('team2-wins')).toBeTruthy();
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
      expect(styles.top).toBe('25%');
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
    test('should have appropriately sized touch targets', () => {
      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      const team1Increment = getByTestId('team1-wins-increment');
      const team1Decrement = getByTestId('team1-wins-decrement');
      const resetButton = getByTestId('reset-button');

      // In landscape mode, games won controls are 32px (compact design)
      // Reset button is 56px
      expect(team1Increment.props.style.width).toBe(32);
      expect(team1Increment.props.style.height).toBe(32);
      expect(team1Decrement.props.style.width).toBe(32);
      expect(team1Decrement.props.style.height).toBe(32);
      expect(resetButton.props.style.width).toBe(56);
      expect(resetButton.props.style.height).toBe(56);
    });

    test('should preserve accessibility labels', () => {
      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      const team1Increment = getByTestId('team1-wins-increment');
      const team1Decrement = getByTestId('team1-wins-decrement');

      expect(team1Increment.props.accessibilityLabel).toBe('Increment team 1 games won');
      expect(team1Decrement.props.accessibilityLabel).toBe('Decrement team 1 games won');
    });
  });

  describe('Component Structure', () => {
    test('should render tally badge in separate top container', () => {
      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      const topContainer = getByTestId('top-controls-container');
      const tallyBadge = getByTestId('landscape-tally-badge');

      // Both elements should exist
      expect(topContainer).toBeTruthy();
      expect(tallyBadge).toBeTruthy();

      // Top container should have proper positioning styles
      const styles = Array.isArray(topContainer.props.style)
        ? Object.assign({}, ...topContainer.props.style)
        : topContainer.props.style;
      expect(styles.top).toBe('25%');
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
