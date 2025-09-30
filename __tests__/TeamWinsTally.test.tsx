import React from 'react';
import { render } from '@testing-library/react-native';
import TeamWinsTally from '../src/components/TeamWinsTally';

describe('TeamWinsTally Component', () => {
  describe('Rendering', () => {
    test('should display current win count', () => {
      const { getByTestId } = render(
        <TeamWinsTally teamId="team1" wins={3} teamColor="#FF0000" />
      );

      expect(getByTestId('team1-wins-count')).toHaveTextContent('3');
    });

    test('should display zero wins initially', () => {
      const { getByTestId } = render(
        <TeamWinsTally teamId="team2" wins={0} teamColor="#0000FF" />
      );

      expect(getByTestId('team2-wins-count')).toHaveTextContent('0');
    });

    test('should display label "Games Won"', () => {
      const { getByTestId } = render(
        <TeamWinsTally teamId="team1" wins={5} teamColor="#FF0000" />
      );

      expect(getByTestId('team1-wins-label')).toHaveTextContent('Games Won');
    });
  });

  describe('Styling', () => {
    test('should render with team1 color styling', () => {
      const { getByTestId } = render(
        <TeamWinsTally teamId="team1" wins={2} teamColor="#FF0000" />
      );

      const label = getByTestId('team1-wins-label');
      const count = getByTestId('team1-wins-count');

      expect(label.props.style).toContainEqual(
        expect.objectContaining({ color: '#FF0000' })
      );
      expect(count.props.style).toContainEqual(
        expect.objectContaining({ color: '#FF0000' })
      );
    });

    test('should render with team2 color styling', () => {
      const { getByTestId } = render(
        <TeamWinsTally teamId="team2" wins={4} teamColor="#0000FF" />
      );

      const label = getByTestId('team2-wins-label');
      const count = getByTestId('team2-wins-count');

      expect(label.props.style).toContainEqual(
        expect.objectContaining({ color: '#0000FF' })
      );
      expect(count.props.style).toContainEqual(
        expect.objectContaining({ color: '#0000FF' })
      );
    });
  });

  describe('Updates', () => {
    test('should update when win count changes', () => {
      const { getByTestId, rerender } = render(
        <TeamWinsTally teamId="team1" wins={1} teamColor="#FF0000" />
      );

      expect(getByTestId('team1-wins-count')).toHaveTextContent('1');

      rerender(<TeamWinsTally teamId="team1" wins={2} teamColor="#FF0000" />);

      expect(getByTestId('team1-wins-count')).toHaveTextContent('2');
    });
  });

  describe('Layout', () => {
    test('should be positioned at bottom of team section', () => {
      const { getByTestId } = render(
        <TeamWinsTally teamId="team1" wins={3} teamColor="#FF0000" />
      );

      const container = getByTestId('team1-wins-tally-container');
      expect(container).toBeTruthy();
    });
  });
});
