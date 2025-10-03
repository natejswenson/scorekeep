import React from 'react';
import { render } from '../src/test-utils/test-utils';
import TeamWinsTally from '../src/components/TeamWinsTally';

describe('TeamWinsTally - Inline Controls Responsive Behavior', () => {
  const mockProps = {
    teamId: 'team1' as const,
    wins: 5,
    onIncrement: jest.fn(),
    onDecrement: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Portrait Mode', () => {
    test('should maintain inline layout in portrait mode', () => {
      const { getByTestId } = render(
        <TeamWinsTally {...mockProps} isLandscape={false} />
      );

      const controlsContainer = getByTestId('team1-wins-controls-container');
      expect(controlsContainer).toHaveStyle({
        flexDirection: 'row',
      });
    });

    test('should constrain width in portrait mode', () => {
      const { getByTestId } = render(
        <TeamWinsTally {...mockProps} isLandscape={false} />
      );

      const controlsContainer = getByTestId('team1-wins-controls-container');
      expect(controlsContainer).toHaveStyle({
        alignSelf: 'center',
      });
    });

    test('should render all controls in portrait mode', () => {
      const { getByTestId } = render(
        <TeamWinsTally {...mockProps} isLandscape={false} />
      );

      expect(getByTestId('team1-wins-decrement-button')).toBeTruthy();
      expect(getByTestId('team1-wins-count')).toBeTruthy();
      expect(getByTestId('team1-wins-increment-button')).toBeTruthy();
    });
  });

  describe('Landscape Mode', () => {
    test('should maintain inline layout in landscape mode', () => {
      const { getByTestId } = render(
        <TeamWinsTally {...mockProps} isLandscape={true} />
      );

      const controlsContainer = getByTestId('team1-wins-controls-container');
      expect(controlsContainer).toHaveStyle({
        flexDirection: 'row',
      });
    });

    test('should constrain width in landscape mode', () => {
      const { getByTestId } = render(
        <TeamWinsTally {...mockProps} isLandscape={true} />
      );

      const controlsContainer = getByTestId('team1-wins-controls-container');
      expect(controlsContainer).toHaveStyle({
        alignSelf: 'center',
      });
    });

    test('should render all controls in landscape mode', () => {
      const { getByTestId } = render(
        <TeamWinsTally {...mockProps} isLandscape={true} />
      );

      expect(getByTestId('team1-wins-decrement-button')).toBeTruthy();
      expect(getByTestId('team1-wins-count')).toBeTruthy();
      expect(getByTestId('team1-wins-increment-button')).toBeTruthy();
    });

    test('should maintain absolute positioning of parent container in landscape', () => {
      const { getByTestId } = render(
        <TeamWinsTally {...mockProps} isLandscape={true} />
      );

      const container = getByTestId('team1-wins-container');
      expect(container.props.style).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            position: 'absolute',
          })
        ])
      );
    });
  });

  describe('Orientation Changes', () => {
    test('should adapt when switching from portrait to landscape', () => {
      const { getByTestId, rerender } = render(
        <TeamWinsTally {...mockProps} isLandscape={false} />
      );

      // Initially portrait
      expect(getByTestId('team1-wins-controls-container')).toBeTruthy();

      // Switch to landscape
      rerender(<TeamWinsTally {...mockProps} isLandscape={true} />);

      // Controls should still be present
      expect(getByTestId('team1-wins-controls-container')).toBeTruthy();
      expect(getByTestId('team1-wins-decrement-button')).toBeTruthy();
      expect(getByTestId('team1-wins-count')).toBeTruthy();
      expect(getByTestId('team1-wins-increment-button')).toBeTruthy();
    });

    test('should adapt when switching from landscape to portrait', () => {
      const { getByTestId, rerender } = render(
        <TeamWinsTally {...mockProps} isLandscape={true} />
      );

      // Initially landscape
      expect(getByTestId('team1-wins-controls-container')).toBeTruthy();

      // Switch to portrait
      rerender(<TeamWinsTally {...mockProps} isLandscape={false} />);

      // Controls should still be present
      expect(getByTestId('team1-wins-controls-container')).toBeTruthy();
      expect(getByTestId('team1-wins-decrement-button')).toBeTruthy();
      expect(getByTestId('team1-wins-count')).toBeTruthy();
      expect(getByTestId('team1-wins-increment-button')).toBeTruthy();
    });
  });
});
