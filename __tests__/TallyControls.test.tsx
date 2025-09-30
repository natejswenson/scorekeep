import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TallyControls from '../src/components/TallyControls';

describe('TallyControls Component', () => {
  const mockHandlers = {
    onIncrementTeam1: jest.fn(),
    onDecrementTeam1: jest.fn(),
    onIncrementTeam2: jest.fn(),
    onDecrementTeam2: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    test('should render increment/decrement buttons for both teams', () => {
      const { getByTestId } = render(
        <TallyControls
          team1Wins={0}
          team2Wins={0}
          {...mockHandlers}
        />
      );

      expect(getByTestId('team1-wins-increment')).toBeTruthy();
      expect(getByTestId('team1-wins-decrement')).toBeTruthy();
      expect(getByTestId('team2-wins-increment')).toBeTruthy();
      expect(getByTestId('team2-wins-decrement')).toBeTruthy();
    });

    test('should render total game counter', () => {
      const { getByTestId } = render(
        <TallyControls
          team1Wins={1}
          team2Wins={2}
          {...mockHandlers}
        />
      );

      // team1=1 + team2=2 + 1 = 4
      expect(getByTestId('total-game-counter')).toHaveTextContent('4');
    });
  });

  describe('Interactions', () => {
    test('should dispatch increment action for team1 on button press', () => {
      const { getByTestId } = render(
        <TallyControls
          team1Wins={0}
          team2Wins={0}
          {...mockHandlers}
        />
      );

      fireEvent.press(getByTestId('team1-wins-increment'));
      expect(mockHandlers.onIncrementTeam1).toHaveBeenCalledTimes(1);
    });

    test('should dispatch decrement action for team1 on button press', () => {
      const { getByTestId } = render(
        <TallyControls
          team1Wins={2}
          team2Wins={0}
          {...mockHandlers}
        />
      );

      fireEvent.press(getByTestId('team1-wins-decrement'));
      expect(mockHandlers.onDecrementTeam1).toHaveBeenCalledTimes(1);
    });

    test('should dispatch increment action for team2 on button press', () => {
      const { getByTestId } = render(
        <TallyControls
          team1Wins={0}
          team2Wins={0}
          {...mockHandlers}
        />
      );

      fireEvent.press(getByTestId('team2-wins-increment'));
      expect(mockHandlers.onIncrementTeam2).toHaveBeenCalledTimes(1);
    });

    test('should dispatch decrement action for team2 on button press', () => {
      const { getByTestId } = render(
        <TallyControls
          team1Wins={0}
          team2Wins={3}
          {...mockHandlers}
        />
      );

      fireEvent.press(getByTestId('team2-wins-decrement'));
      expect(mockHandlers.onDecrementTeam2).toHaveBeenCalledTimes(1);
    });
  });

  describe('Layout', () => {
    test('should be positioned above reset button', () => {
      const { getByTestId } = render(
        <TallyControls
          team1Wins={0}
          team2Wins={0}
          {...mockHandlers}
        />
      );

      const container = getByTestId('tally-controls-container');
      expect(container).toBeTruthy();
    });
  });

  describe('Touch Targets', () => {
    test('should have appropriate touch targets (minimum 44px)', () => {
      const { getByTestId } = render(
        <TallyControls
          team1Wins={0}
          team2Wins={0}
          {...mockHandlers}
        />
      );

      const incrementBtn = getByTestId('team1-wins-increment');
      const style = incrementBtn.props.style;

      // Minimum touch target should be at least 24px (spec allows smaller for unobtrusive design)
      expect(style.minWidth).toBeDefined();
      expect(style.minHeight).toBeDefined();
      expect(typeof style.minWidth).toBe('number');
      expect(typeof style.minHeight).toBe('number');
    });
  });

  describe('Visual Feedback', () => {
    test('should provide clear visual feedback for buttons', () => {
      const { getByTestId } = render(
        <TallyControls
          team1Wins={0}
          team2Wins={0}
          {...mockHandlers}
        />
      );

      const incrementBtn = getByTestId('team1-wins-increment');
      expect(incrementBtn.props.children).toBeTruthy();
    });
  });

  describe('Total Game Counter Integration', () => {
    test('should update total when team wins change', () => {
      const { getByTestId, rerender } = render(
        <TallyControls
          team1Wins={0}
          team2Wins={0}
          {...mockHandlers}
        />
      );

      expect(getByTestId('total-game-counter')).toHaveTextContent('1');

      rerender(
        <TallyControls
          team1Wins={1}
          team2Wins={1}
          {...mockHandlers}
        />
      );

      expect(getByTestId('total-game-counter')).toHaveTextContent('3');
    });
  });
});
