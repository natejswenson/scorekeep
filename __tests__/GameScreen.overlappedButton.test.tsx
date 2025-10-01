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

describe('GameScreen - Overlapped Decrement Button', () => {
  describe('Z-Index Layering', () => {
    test('should have score circle with higher z-index than decrement button', () => {
      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      const scoreArea = getByTestId('team1-score-area');
      const decrementButton = getByTestId('team1-decrement');

      // Extract zIndex from styles
      const scoreZIndex = scoreArea.props.style?.zIndex ||
        (Array.isArray(scoreArea.props.style) &&
         scoreArea.props.style.find((s: any) => s?.zIndex)?.zIndex) || 0;

      const buttonZIndex = decrementButton.props.style?.zIndex ||
        (Array.isArray(decrementButton.props.style) &&
         decrementButton.props.style.find((s: any) => s?.zIndex)?.zIndex) || 0;

      expect(scoreZIndex).toBeGreaterThan(buttonZIndex);
    });

    test('should have score circle with z-index of 2', () => {
      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      const scoreArea = getByTestId('team1-score-area');

      // Check if zIndex: 2 exists in styles
      expect(scoreArea).toHaveStyle({
        zIndex: 2,
      });
    });

    test('should have decrement button with z-index of 1', () => {
      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      const decrementButton = getByTestId('team1-decrement');

      expect(decrementButton).toHaveStyle({
        zIndex: 1,
      });
    });
  });

  describe('Overlap Positioning', () => {
    test('should have decrement button with negative top margin for overlap', () => {
      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      const decrementButton = getByTestId('team1-decrement');

      // Should have negative marginTop to create overlap
      expect(decrementButton).toHaveStyle({
        marginTop: -27, // 45% of 60px button height for tighter grouping
      });
    });

    test('should calculate overlap as 45% of button size', () => {
      const BUTTON_SIZE = 60;
      const OVERLAP_PERCENTAGE = 0.45;
      const expectedOverlap = -(BUTTON_SIZE * OVERLAP_PERCENTAGE);

      expect(expectedOverlap).toBe(-27);

      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      const decrementButton = getByTestId('team1-decrement');
      expect(decrementButton).toHaveStyle({
        marginTop: expectedOverlap,
      });
    });

    test('should apply same overlap to team2 decrement button', () => {
      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      const team2DecrementButton = getByTestId('team2-decrement');

      expect(team2DecrementButton).toHaveStyle({
        marginTop: -27,
        zIndex: 1,
      });
    });
  });

  describe('Button Sizing', () => {
    test('should maintain 60px button size', () => {
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

    test('should maintain 150px score circle size', () => {
      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      const scoreArea = getByTestId('team1-score-area');

      expect(scoreArea).toHaveStyle({
        width: 150,
        height: 150,
      });
    });
  });

  describe('Visual Grouping', () => {
    test('should render decrement button after score circle in DOM order', () => {
      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      const team1Side = getByTestId('team1-side');
      const children = team1Side.props.children;

      // Find indices of score area and decrement button
      let scoreIndex = -1;
      let buttonIndex = -1;

      children.forEach((child: any, index: number) => {
        if (child?.props?.testID === 'team1-score-area') scoreIndex = index;
        if (child?.props?.testID === 'team1-decrement') buttonIndex = index;
      });

      // Decrement button should come after score circle in DOM
      expect(buttonIndex).toBeGreaterThan(scoreIndex);
    });
  });

  describe('Touch Targets', () => {
    test('should maintain minimum 44x44 touch target on decrement button', () => {
      const store = createTestStore();
      const { getByTestId } = render(
        <Provider store={store}>
          <GameScreen />
        </Provider>
      );

      const decrementButton = getByTestId('team1-decrement');

      // 60x60 is well above minimum 44x44
      expect(decrementButton.props.style.width).toBeGreaterThanOrEqual(44);
      expect(decrementButton.props.style.height).toBeGreaterThanOrEqual(44);
    });
  });
});
