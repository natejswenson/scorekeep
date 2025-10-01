import React from 'react';
import { render } from '@testing-library/react-native';
import { Provider } from 'react-redux';
import GameScreen from '../src/components/GameScreen';
import { configureStore } from '@reduxjs/toolkit';
import gameReducer from '../src/store/gameSlice';

const createTestStore = (initialState?: any) => {
  return configureStore({
    reducer: {
      game: gameReducer,
    },
    preloadedState: initialState,
  });
};

describe('GameScreen - Visual Enhancements', () => {
  describe('Score Circle Size', () => {
    test('should have score circle with 200px width', () => {
      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      const scoreArea = getByTestId('team1-score-area');

      expect(scoreArea).toHaveStyle({
        width: 200,
      });
    });

    test('should have score circle with 200px height', () => {
      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      const scoreArea = getByTestId('team1-score-area');

      expect(scoreArea).toHaveStyle({
        height: 200,
      });
    });

    test('should have score circle with 100px border radius', () => {
      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      const scoreArea = getByTestId('team1-score-area');

      expect(scoreArea).toHaveStyle({
        borderRadius: 100,
      });
    });

    test('should maintain 3px white border on score circle', () => {
      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      const scoreArea = getByTestId('team1-score-area');

      expect(scoreArea).toHaveStyle({
        borderWidth: 3,
        borderColor: '#FFFFFF',
      });
    });

    test('should apply same size to team2 score circle', () => {
      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      const team2ScoreArea = getByTestId('team2-score-area');

      expect(team2ScoreArea).toHaveStyle({
        width: 200,
        height: 200,
        borderRadius: 100,
      });
    });
  });

  describe('Score Font Size', () => {
    test('should have score with 96px font size', () => {
      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      const scoreText = getByTestId('team1-score');

      expect(scoreText).toHaveStyle({
        fontSize: 96,
      });
    });

    test('should maintain bold font weight', () => {
      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      const scoreText = getByTestId('team1-score');

      expect(scoreText).toHaveStyle({
        fontWeight: 'bold',
      });
    });

    test('should maintain white color', () => {
      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      const scoreText = getByTestId('team1-score');

      expect(scoreText).toHaveStyle({
        color: '#FFFFFF',
      });
    });

    test('should apply same font size to team2 score', () => {
      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      const team2ScoreText = getByTestId('team2-score');

      expect(team2ScoreText).toHaveStyle({
        fontSize: 96,
      });
    });
  });

  describe('Borderless Decrement Button', () => {
    test('should have no borderWidth on decrement button', () => {
      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      const decrementButton = getByTestId('team1-decrement');
      const style = decrementButton.props.style;

      // Check if borderWidth is undefined or 0
      const borderWidth = Array.isArray(style)
        ? style.find((s: any) => s?.borderWidth !== undefined)?.borderWidth
        : style?.borderWidth;

      expect(borderWidth).toBeUndefined();
    });

    test('should have no borderColor on decrement button', () => {
      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      const decrementButton = getByTestId('team1-decrement');
      const style = decrementButton.props.style;

      // Check if borderColor is undefined
      const borderColor = Array.isArray(style)
        ? style.find((s: any) => s?.borderColor !== undefined)?.borderColor
        : style?.borderColor;

      expect(borderColor).toBeUndefined();
    });

    test('should maintain background color on decrement button', () => {
      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      const decrementButton = getByTestId('team1-decrement');

      expect(decrementButton).toHaveStyle({
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
      });
    });

    test('should maintain 60px size on decrement button', () => {
      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      const decrementButton = getByTestId('team1-decrement');

      expect(decrementButton).toHaveStyle({
        width: 60,
        height: 60,
      });
    });

    test('should apply borderless style to team2 decrement button', () => {
      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      const team2DecrementButton = getByTestId('team2-decrement');
      const style = team2DecrementButton.props.style;

      const borderWidth = Array.isArray(style)
        ? style.find((s: any) => s?.borderWidth !== undefined)?.borderWidth
        : style?.borderWidth;

      expect(borderWidth).toBeUndefined();
    });
  });

  describe('Visual Hierarchy', () => {
    test('should have score circle larger than decrement button', () => {
      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      const scoreArea = getByTestId('team1-score-area');
      const decrementButton = getByTestId('team1-decrement');

      const scoreWidth = scoreArea.props.style.width;
      const buttonWidth = decrementButton.props.style.width;

      expect(scoreWidth).toBeGreaterThan(buttonWidth);
    });

    test('should maintain 45% overlap with larger score circle', () => {
      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      const decrementButton = getByTestId('team1-decrement');

      // Overlap is based on button size, not score circle size
      expect(decrementButton).toHaveStyle({
        marginTop: -27, // 45% of 60px button
      });
    });
  });
});
