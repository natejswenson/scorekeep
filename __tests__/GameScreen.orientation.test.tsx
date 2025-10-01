import React from 'react';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { Dimensions } from 'react-native';
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

// Mock useWindowDimensions
jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
  default: jest.fn(),
}));

const useWindowDimensions = require('react-native/Libraries/Utilities/useWindowDimensions').default;

describe('GameScreen Orientation Handling', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Orientation Detection', () => {
    test('should detect landscape orientation when width > height', () => {
      useWindowDimensions.mockReturnValue({ width: 800, height: 400 });

      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      // In landscape, Games Won should have isLandscape prop
      const team1Wins = getByTestId('team1-wins-container');
      expect(team1Wins).toBeTruthy();

      // Check if the container has position absolute (landscape style)
      const styles = Array.isArray(team1Wins.props.style)
        ? Object.assign({}, ...team1Wins.props.style)
        : team1Wins.props.style;

      expect(styles.position).toBe('absolute');
    });

    test('should detect portrait orientation when height > width', () => {
      useWindowDimensions.mockReturnValue({ width: 400, height: 800 });

      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      // In portrait, Games Won should not have absolute positioning
      const team1Wins = getByTestId('team1-wins-container');
      const styles = Array.isArray(team1Wins.props.style)
        ? Object.assign({}, ...team1Wins.props.style)
        : team1Wins.props.style;

      expect(styles.position).not.toBe('absolute');
    });
  });

  describe('Tally Position in Portrait', () => {
    test('should position Games Won at bottom of team sections', () => {
      useWindowDimensions.mockReturnValue({ width: 400, height: 800 });

      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      const team1Side = getByTestId('team1-side');
      const styles = Array.isArray(team1Side.props.style)
        ? Object.assign({}, ...team1Side.props.style)
        : team1Side.props.style;

      // In portrait, team side should use space-between to push tally to bottom
      expect(styles.justifyContent).toBe('space-between');
    });

    test('should maintain vertical layout in portrait', () => {
      useWindowDimensions.mockReturnValue({ width: 400, height: 800 });

      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      const team1Side = getByTestId('team1-side');
      const styles = Array.isArray(team1Side.props.style)
        ? Object.assign({}, ...team1Side.props.style)
        : team1Side.props.style;

      expect(styles.flexDirection).toBe(undefined); // Default is column
    });
  });

  describe('Tally Position in Landscape', () => {
    test('should position Team 1 Games Won on left side in landscape', () => {
      useWindowDimensions.mockReturnValue({ width: 800, height: 400 });

      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      const team1Wins = getByTestId('team1-wins-container');
      const styles = Array.isArray(team1Wins.props.style)
        ? Object.assign({}, ...team1Wins.props.style)
        : team1Wins.props.style;

      expect(styles.position).toBe('absolute');
      expect(styles.left).toBeDefined();
      expect(styles.top).toBe('50%');
    });

    test('should position Team 2 Games Won on right side in landscape', () => {
      useWindowDimensions.mockReturnValue({ width: 800, height: 400 });

      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      const team2Wins = getByTestId('team2-wins-container');
      const styles = Array.isArray(team2Wins.props.style)
        ? Object.assign({}, ...team2Wins.props.style)
        : team2Wins.props.style;

      expect(styles.position).toBe('absolute');
      expect(styles.right).toBeDefined();
      expect(styles.top).toBe('50%');
    });

    test('should center vertically in landscape', () => {
      useWindowDimensions.mockReturnValue({ width: 800, height: 400 });

      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      const team1Wins = getByTestId('team1-wins-container');
      const styles = Array.isArray(team1Wins.props.style)
        ? Object.assign({}, ...team1Wins.props.style)
        : team1Wins.props.style;

      expect(styles.top).toBe('50%');
      // Transform should exist for vertical centering
      expect(styles.transform).toBeDefined();
    });
  });

  describe('Component Independence', () => {
    test('should not affect scoring functionality in landscape', () => {
      useWindowDimensions.mockReturnValue({ width: 800, height: 400 });

      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      const scoreArea = getByTestId('team1-score-area');
      expect(scoreArea).toBeTruthy();

      const scoreText = getByTestId('team1-score');
      expect(scoreText.props.children).toBe(0);
    });

    test('should not affect tally controls in landscape', () => {
      useWindowDimensions.mockReturnValue({ width: 800, height: 400 });

      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      const tallyControls = getByTestId('tally-controls-container');
      expect(tallyControls).toBeTruthy();

      const team1Increment = getByTestId('team1-wins-increment-button');
      expect(team1Increment).toBeTruthy();
    });

    test('should not affect reset button in landscape', () => {
      useWindowDimensions.mockReturnValue({ width: 800, height: 400 });

      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      const resetButton = getByTestId('reset-button');
      expect(resetButton).toBeTruthy();
    });
  });
});
