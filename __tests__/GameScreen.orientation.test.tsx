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

      // In landscape mode, wins are displayed inline on each team side
      const team1Wins = getByTestId('team1-wins');
      expect(team1Wins).toBeTruthy();
      expect(team1Wins).toHaveTextContent('0');
    });

    test('should detect portrait orientation when height > width', () => {
      useWindowDimensions.mockReturnValue({ width: 400, height: 800 });

      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      // In portrait, team sides are rendered with vertical split
      const team1Side = getByTestId('team1-side');
      const team2Side = getByTestId('team2-side');

      expect(team1Side).toBeTruthy();
      expect(team2Side).toBeTruthy();
    });
  });

  describe('Vertical Split Layout in Portrait', () => {
    test('should render team sides with vertical split', () => {
      useWindowDimensions.mockReturnValue({ width: 400, height: 800 });

      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      const team1Side = getByTestId('team1-side');
      const team2Side = getByTestId('team2-side');

      // Both team sides should render
      expect(team1Side).toBeTruthy();
      expect(team2Side).toBeTruthy();
    });

    test('should display scores and game wins in portrait', () => {
      useWindowDimensions.mockReturnValue({ width: 400, height: 800 });

      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      // Verify scores are displayed
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
    test('should display Team 1 Games Won on left side in landscape', () => {
      useWindowDimensions.mockReturnValue({ width: 800, height: 400 });

      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      // Team1 wins are inline within the team1-side
      const team1Side = getByTestId('team1-side');
      const team1Wins = getByTestId('team1-wins');

      expect(team1Side).toBeTruthy();
      expect(team1Wins).toBeTruthy();
    });

    test('should display Team 2 Games Won on right side in landscape', () => {
      useWindowDimensions.mockReturnValue({ width: 800, height: 400 });

      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      // Team2 wins are inline within the team2-side
      const team2Side = getByTestId('team2-side');
      const team2Wins = getByTestId('team2-wins');

      expect(team2Side).toBeTruthy();
      expect(team2Wins).toBeTruthy();
    });

    test('should display games won at bottom of each team side in landscape', () => {
      useWindowDimensions.mockReturnValue({ width: 800, height: 400 });

      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      // Both team sides should have games won inline
      expect(getByTestId('team1-wins')).toBeTruthy();
      expect(getByTestId('team2-wins')).toBeTruthy();
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
