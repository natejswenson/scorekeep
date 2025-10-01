import React from 'react';
import { render } from '@testing-library/react-native';
import TallyControls from '../src/components/TallyControls';

describe('TallyControls Component', () => {
  const mockProps = {
    team1Wins: 0,
    team2Wins: 0,
  };

  describe('Rendering', () => {
    test('should not render increment/decrement buttons', () => {
      const { queryByTestId } = render(<TallyControls {...mockProps} />);

      expect(queryByTestId('team1-increment-button')).toBeNull();
      expect(queryByTestId('team1-decrement-button')).toBeNull();
      expect(queryByTestId('team2-increment-button')).toBeNull();
      expect(queryByTestId('team2-decrement-button')).toBeNull();
    });

    test('should not render team control containers', () => {
      const { queryByTestId } = render(<TallyControls {...mockProps} />);

      expect(queryByTestId('team1-controls')).toBeNull();
      expect(queryByTestId('team2-controls')).toBeNull();
    });

    test('should render only TotalGameCounter component', () => {
      const { getByTestId } = render(<TallyControls {...mockProps} />);

      expect(getByTestId('total-game-counter')).toBeTruthy();
    });

    test('should display correct total games calculation', () => {
      const { getByTestId } = render(
        <TallyControls
          team1Wins={2}
          team2Wins={1}
        />
      );

      expect(getByTestId('total-game-counter')).toHaveTextContent('4'); // 2 + 1 + 1
    });
  });

  describe('Component simplicity', () => {
    test('should render simple container with centered layout', () => {
      const { getByTestId } = render(<TallyControls {...mockProps} />);

      const container = getByTestId('tally-controls-container');
      expect(container).toBeTruthy();
    });

    test('should contain only TotalGameCounter as child', () => {
      const { getByTestId } = render(<TallyControls {...mockProps} />);

      expect(getByTestId('total-game-counter')).toBeTruthy();
      expect(getByTestId('total-game-container')).toBeTruthy();
    });
  });

  describe('Component updates', () => {
    test('should update total games counter when win counts change', () => {
      const { getByTestId, rerender } = render(
        <TallyControls team1Wins={0} team2Wins={0} />
      );

      expect(getByTestId('total-game-counter')).toHaveTextContent('1');

      rerender(
        <TallyControls team1Wins={1} team2Wins={2} />
      );

      expect(getByTestId('total-game-counter')).toHaveTextContent('4');
    });

    test('should calculate total with different win values', () => {
      const { getByTestId } = render(
        <TallyControls team1Wins={5} team2Wins={3} />
      );

      expect(getByTestId('total-game-counter')).toHaveTextContent('9'); // 5 + 3 + 1
    });
  });
});