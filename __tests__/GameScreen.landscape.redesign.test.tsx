import React from 'react';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import GameScreen from '../src/components/GameScreen';
import { gameSlice } from '../src/store/gameSlice';

// Mock useWindowDimensions for landscape mode
jest.mock('react-native/Libraries/Utilities/useWindowDimensions', () => ({
  default: jest.fn(() => ({ width: 800, height: 600 })), // Landscape dimensions
}));

const createTestStore = (initialState?: any) => {
  return configureStore({
    reducer: {
      game: gameSlice.reducer,
    },
    preloadedState: initialState,
  });
};

describe('GameScreen Landscape Redesign', () => {
  describe('Score Display', () => {
    it('should render score with 240pt font in landscape', () => {
      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      const team1Score = getByTestId('team1-score');
      const styles = Array.isArray(team1Score.props.style)
        ? Object.assign({}, ...team1Score.props.style)
        : team1Score.props.style;

      expect(styles.fontSize).toBe(240);
    });

    it('should not render TeamNameDisplay in landscape', () => {
      const store = createTestStore();
      const { queryByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      // Team name display should not be rendered
      expect(queryByTestId('team1-name')).toBeNull();
      expect(queryByTestId('team2-name')).toBeNull();
    });

    it('should maintain side-by-side layout in landscape', () => {
      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      const team1Side = getByTestId('team1-side');
      const team2Side = getByTestId('team2-side');

      expect(team1Side).toBeTruthy();
      expect(team2Side).toBeTruthy();
    });
  });

  describe('Games Won Display', () => {
    it('should render games won with 28pt font in landscape', () => {
      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      const team1Wins = getByTestId('team1-wins');
      const styles = Array.isArray(team1Wins.props.style)
        ? Object.assign({}, ...team1Wins.props.style)
        : team1Wins.props.style;

      expect(styles.fontSize).toBe(28);
    });

    it('should render games won buttons with 32px size', () => {
      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      const incrementButton = getByTestId('team1-wins-increment');
      const styles = Array.isArray(incrementButton.props.style)
        ? Object.assign({}, ...incrementButton.props.style)
        : incrementButton.props.style;

      expect(styles.width).toBe(32);
      expect(styles.height).toBe(32);
    });
  });

  describe('Control Buttons', () => {
    it('should render reset button with 56px size in landscape', () => {
      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      const resetButton = getByTestId('reset-button');
      const styles = Array.isArray(resetButton.props.style)
        ? Object.assign({}, ...resetButton.props.style)
        : resetButton.props.style;

      expect(styles.width).toBe(56);
      expect(styles.height).toBe(56);
    });

    it('should render reset button with semi-transparent background', () => {
      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      const resetButton = getByTestId('reset-button');
      const styles = Array.isArray(resetButton.props.style)
        ? Object.assign({}, ...resetButton.props.style)
        : resetButton.props.style;

      expect(styles.backgroundColor).toBe('rgba(255, 255, 255, 0.9)');
    });

    it('should render decrement button with 52px size', () => {
      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      const decrementButton = getByTestId('team1-decrement');
      const styles = Array.isArray(decrementButton.props.style)
        ? Object.assign({}, ...decrementButton.props.style)
        : decrementButton.props.style;

      expect(styles.width).toBe(52);
      expect(styles.height).toBe(52);
    });
  });

  describe('Top Tally Badge', () => {
    it('should render tally badge instead of TallyControls', () => {
      const store = createTestStore({
        game: {
          team1: { name: 'Team 1', score: 0, color: '#FF0000' },
          team2: { name: 'Team 2', score: 0, color: '#0000FF' },
          scoreIncrement: 1,
          winCondition: 10,
          isGameActive: true,
          winner: null,
          editingTeam: null,
          gameWins: { team1: 2, team2: 3 },
        },
      });

      const { getByTestId, queryByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      // Should have tally badge
      expect(getByTestId('landscape-tally-badge')).toBeTruthy();

      // Should NOT have increment/decrement buttons in top area
      expect(queryByTestId('total-games-increment')).toBeNull();
      expect(queryByTestId('total-games-decrement')).toBeNull();
    });

    it('should display correct game wins in tally badge', () => {
      const store = createTestStore({
        game: {
          team1: { name: 'Team 1', score: 0, color: '#FF0000' },
          team2: { name: 'Team 2', score: 0, color: '#0000FF' },
          scoreIncrement: 1,
          winCondition: 10,
          isGameActive: true,
          winner: null,
          editingTeam: null,
          gameWins: { team1: 2, team2: 3 },
        },
      });

      const { getByText } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      expect(getByText('2 - 3')).toBeTruthy();
    });
  });
});
