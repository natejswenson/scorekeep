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

      // In portrait, floating cards should be rendered instead of team sides
      const team1Card = getByTestId('team1-card');
      const team2Card = getByTestId('team2-card');

      expect(team1Card).toBeTruthy();
      expect(team2Card).toBeTruthy();
    });
  });

  describe('Floating Cards in Portrait', () => {
    test('should render floating cards positioned correctly', () => {
      useWindowDimensions.mockReturnValue({ width: 400, height: 800 });

      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      const team1Card = getByTestId('team1-card');
      const team2Card = getByTestId('team2-card');

      // Both cards should have absolute positioning for floating effect
      const team1Styles = Array.isArray(team1Card.props.style)
        ? Object.assign({}, ...team1Card.props.style)
        : team1Card.props.style;
      const team2Styles = Array.isArray(team2Card.props.style)
        ? Object.assign({}, ...team2Card.props.style)
        : team2Card.props.style;

      expect(team1Styles.position).toBe('absolute');
      expect(team2Styles.position).toBe('absolute');
    });

    test('should display scores and game wins in floating cards', () => {
      useWindowDimensions.mockReturnValue({ width: 400, height: 800 });

      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      // Verify scores are displayed in cards
      const team1Score = getByTestId('team1-score');
      const team2Score = getByTestId('team2-score');
      const team1Wins = getByTestId('team1-wins');
      const team2Wins = getByTestId('team2-wins');

      expect(team1Score).toBeTruthy();
      expect(team2Score).toBeTruthy();
      expect(team1Wins).toBeTruthy();
      expect(team2Wins).toBeTruthy();
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

    test('should not affect tally badge in landscape', () => {
      useWindowDimensions.mockReturnValue({ width: 800, height: 400 });

      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      const tallyBadge = getByTestId('landscape-tally-badge');
      expect(tallyBadge).toBeTruthy();

      const team1Increment = getByTestId('team1-wins-increment');
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
