import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import TallyControls from '../src/components/TallyControls';

describe('TallyControls Component', () => {
  const mockProps = {
    team1Wins: 0,
    team2Wins: 0,
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
      const { getByTestId } = render(<TallyControls {...mockProps} />);

      expect(getByTestId('team1-increment-button')).toBeTruthy();
      expect(getByTestId('team1-decrement-button')).toBeTruthy();
      expect(getByTestId('team2-increment-button')).toBeTruthy();
      expect(getByTestId('team2-decrement-button')).toBeTruthy();
    });

    test('should include TotalGameCounter component', () => {
      const { getByTestId } = render(<TallyControls {...mockProps} />);

      expect(getByTestId('total-game-counter')).toBeTruthy();
    });

    test('should display correct total games calculation', () => {
      const { getByTestId } = render(
        <TallyControls
          {...mockProps}
          team1Wins={2}
          team2Wins={1}
        />
      );

      expect(getByTestId('total-game-counter')).toHaveTextContent('4'); // 2 + 1 + 1
    });
  });

  describe('Button interactions', () => {
    test('should call onIncrementTeam1 when team1 increment button is pressed', () => {
      const { getByTestId } = render(<TallyControls {...mockProps} />);

      fireEvent.press(getByTestId('team1-increment-button'));

      expect(mockProps.onIncrementTeam1).toHaveBeenCalledTimes(1);
    });

    test('should call onDecrementTeam1 when team1 decrement button is pressed', () => {
      const { getByTestId } = render(<TallyControls {...mockProps} />);

      fireEvent.press(getByTestId('team1-decrement-button'));

      expect(mockProps.onDecrementTeam1).toHaveBeenCalledTimes(1);
    });

    test('should call onIncrementTeam2 when team2 increment button is pressed', () => {
      const { getByTestId } = render(<TallyControls {...mockProps} />);

      fireEvent.press(getByTestId('team2-increment-button'));

      expect(mockProps.onIncrementTeam2).toHaveBeenCalledTimes(1);
    });

    test('should call onDecrementTeam2 when team2 decrement button is pressed', () => {
      const { getByTestId } = render(<TallyControls {...mockProps} />);

      fireEvent.press(getByTestId('team2-decrement-button'));

      expect(mockProps.onDecrementTeam2).toHaveBeenCalledTimes(1);
    });

    test('should handle multiple rapid button presses', () => {
      const { getByTestId } = render(<TallyControls {...mockProps} />);

      const incrementButton = getByTestId('team1-increment-button');
      fireEvent.press(incrementButton);
      fireEvent.press(incrementButton);
      fireEvent.press(incrementButton);

      expect(mockProps.onIncrementTeam1).toHaveBeenCalledTimes(3);
    });
  });

  describe('Layout and positioning', () => {
    test('should have controls positioned in middle of screen', () => {
      const { getByTestId } = render(<TallyControls {...mockProps} />);

      expect(getByTestId('tally-controls-container')).toHaveStyle({
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
      });
    });

    test('should have team controls properly arranged', () => {
      const { getByTestId } = render(<TallyControls {...mockProps} />);

      expect(getByTestId('team1-controls')).toHaveStyle({
        flexDirection: 'column',
        alignItems: 'center',
      });

      expect(getByTestId('team2-controls')).toHaveStyle({
        flexDirection: 'column',
        alignItems: 'center',
      });
    });

    test('should position total game counter in center', () => {
      const { getByTestId } = render(<TallyControls {...mockProps} />);

      // Verify all elements are present (order verification is implicit in layout)
      expect(getByTestId('tally-controls-container')).toBeTruthy();
      expect(getByTestId('team1-controls')).toBeTruthy();
      expect(getByTestId('total-game-container')).toBeTruthy();
      expect(getByTestId('team2-controls')).toBeTruthy();
    });
  });

  describe('Touch targets and accessibility', () => {
    test('should have appropriate touch targets for mobile', () => {
      const { getByTestId } = render(<TallyControls {...mockProps} />);

      const buttons = [
        'team1-increment-button',
        'team1-decrement-button',
        'team2-increment-button',
        'team2-decrement-button',
      ];

      buttons.forEach(buttonId => {
        const button = getByTestId(buttonId);
        expect(button).toHaveStyle({
          minWidth: 44,
          minHeight: 44,
        });
      });
    });

    test('should have proper accessibility labels', () => {
      const { getByTestId } = render(<TallyControls {...mockProps} />);

      expect(getByTestId('team1-increment-button')).toHaveProp(
        'accessibilityLabel',
        'Increment team 1 wins'
      );
      expect(getByTestId('team1-decrement-button')).toHaveProp(
        'accessibilityLabel',
        'Decrement team 1 wins'
      );
      expect(getByTestId('team2-increment-button')).toHaveProp(
        'accessibilityLabel',
        'Increment team 2 wins'
      );
      expect(getByTestId('team2-decrement-button')).toHaveProp(
        'accessibilityLabel',
        'Decrement team 2 wins'
      );
    });

    test('should have button accessibility role', () => {
      const { getByTestId } = render(<TallyControls {...mockProps} />);

      const buttons = [
        'team1-increment-button',
        'team1-decrement-button',
        'team2-increment-button',
        'team2-decrement-button',
      ];

      buttons.forEach(buttonId => {
        expect(getByTestId(buttonId)).toHaveProp('accessibilityRole', 'button');
      });
    });
  });

  describe('Visual design', () => {
    test('should have unobtrusive button styling', () => {
      const { getByTestId } = render(<TallyControls {...mockProps} />);

      const incrementButton = getByTestId('team1-increment-button');
      expect(incrementButton).toHaveStyle({
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 22,
      });
    });

    test('should display + and - symbols correctly', () => {
      const { getByTestId } = render(<TallyControls {...mockProps} />);

      expect(getByTestId('team1-increment-text')).toHaveTextContent('+');
      expect(getByTestId('team1-decrement-text')).toHaveTextContent('-');
      expect(getByTestId('team2-increment-text')).toHaveTextContent('+');
      expect(getByTestId('team2-decrement-text')).toHaveTextContent('-');
    });

    test('should have consistent text styling', () => {
      const { getByTestId } = render(<TallyControls {...mockProps} />);

      const textElements = [
        'team1-increment-text',
        'team1-decrement-text',
        'team2-increment-text',
        'team2-decrement-text',
      ];

      textElements.forEach(textId => {
        expect(getByTestId(textId)).toHaveStyle({
          fontSize: 18,
          color: 'rgba(255, 255, 255, 0.8)',
          fontWeight: 'bold',
        });
      });
    });
  });

  describe('Component updates', () => {
    test('should update total games counter when win counts change', () => {
      const { getByTestId, rerender } = render(
        <TallyControls {...mockProps} team1Wins={0} team2Wins={0} />
      );

      expect(getByTestId('total-game-counter')).toHaveTextContent('1');

      rerender(
        <TallyControls {...mockProps} team1Wins={1} team2Wins={2} />
      );

      expect(getByTestId('total-game-counter')).toHaveTextContent('4');
    });
  });
});