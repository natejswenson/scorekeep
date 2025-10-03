import React from 'react';
import { render } from '../src/test-utils/test-utils';
import TeamWinsTally from '../src/components/TeamWinsTally';

describe('TeamWinsTally Component', () => {
  describe('Rendering', () => {
    test('should display current win count', () => {
      const { getByTestId } = render(
        <TeamWinsTally
          teamId="team1"
          wins={3}
        />
      );

      expect(getByTestId('team1-wins-count')).toHaveTextContent('3');
    });

    test('should display "Games Won" label', () => {
      const { getByTestId } = render(
        <TeamWinsTally
          teamId="team2"
          wins={0}
        />
      );

      expect(getByTestId('team2-wins-label')).toHaveTextContent('Games Won');
    });

    test('should render with white text for visibility', () => {
      const { getByTestId } = render(
        <TeamWinsTally
          teamId="team1"
          wins={1}
        />
      );

      expect(getByTestId('team1-wins-label')).toHaveStyle({ color: '#FFFFFF' });
      expect(getByTestId('team1-wins-count')).toHaveStyle({ color: '#FFFFFF' });
    });

    test('should display zero wins correctly', () => {
      const { getByTestId } = render(
        <TeamWinsTally
          teamId="team1"
          wins={0}
        />
      );

      expect(getByTestId('team1-wins-count')).toHaveTextContent('0');
    });

    test('should handle large win counts', () => {
      const { getByTestId } = render(
        <TeamWinsTally
          teamId="team2"
          wins={99}
        />
      );

      expect(getByTestId('team2-wins-count')).toHaveTextContent('99');
    });
  });

  describe('Team-specific behavior', () => {
    test('should use correct testIDs for team1', () => {
      const { getByTestId } = render(
        <TeamWinsTally
          teamId="team1"
          wins={2}
        />
      );

      expect(getByTestId('team1-wins-container')).toBeTruthy();
      expect(getByTestId('team1-wins-label')).toBeTruthy();
      expect(getByTestId('team1-wins-count')).toBeTruthy();
    });

    test('should use correct testIDs for team2', () => {
      const { getByTestId } = render(
        <TeamWinsTally
          teamId="team2"
          wins={2}
        />
      );

      expect(getByTestId('team2-wins-container')).toBeTruthy();
      expect(getByTestId('team2-wins-label')).toBeTruthy();
      expect(getByTestId('team2-wins-count')).toBeTruthy();
    });
  });

  describe('Accessibility', () => {
    test('should have proper accessibility labels', () => {
      const { getByTestId } = render(
        <TeamWinsTally
          teamId="team1"
          wins={5}
        />
      );

      expect(getByTestId('team1-wins-container')).toHaveProp('accessibilityLabel', 'Team 1 games won: 5');
    });

    test('should handle singular vs plural accessibility labels', () => {
      const { getByTestId } = render(
        <TeamWinsTally
          teamId="team2"
          wins={1}
        />
      );

      expect(getByTestId('team2-wins-container')).toHaveProp('accessibilityLabel', 'Team 2 game won: 1');
    });
  });

  describe('Styling requirements', () => {
    test('should be positioned at bottom of team section', () => {
      const { getByTestId } = render(
        <TeamWinsTally
          teamId="team1"
          wins={1}
        />
      );

      const container = getByTestId('team1-wins-container');
      expect(container).toHaveStyle({
        alignItems: 'center',
        marginTop: 8,
      });
    });

    test('should have appropriate text sizing', () => {
      const { getByTestId } = render(
        <TeamWinsTally
          teamId="team1"
          wins={1}
        />
      );

      expect(getByTestId('team1-wins-label')).toHaveStyle({ fontSize: 16 });
      expect(getByTestId('team1-wins-count')).toHaveStyle({ fontSize: 24 });
    });
  });
});