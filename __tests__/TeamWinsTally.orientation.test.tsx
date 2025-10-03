import React from 'react';
import { render } from '../src/test-utils/test-utils';
import TeamWinsTally from '../src/components/TeamWinsTally';

describe('TeamWinsTally Orientation Support', () => {
  test('should accept isLandscape prop', () => {
    const { rerender } = render(
      <TeamWinsTally teamId="team1" wins={3} isLandscape={true} />
    );
    expect(() => rerender(
      <TeamWinsTally teamId="team1" wins={3} isLandscape={false} />
    )).not.toThrow();
  });

  test('should apply landscape positioning styles when isLandscape=true for team1', () => {
    const { getByTestId } = render(
      <TeamWinsTally teamId="team1" wins={3} isLandscape={true} />
    );

    const container = getByTestId('team1-wins-container');
    const styles = Array.isArray(container.props.style)
      ? Object.assign({}, ...container.props.style)
      : container.props.style;

    expect(styles.position).toBe('absolute');
    expect(styles.left).toBeDefined();
    expect(styles.top).toBe('50%');
  });

  test('should apply landscape positioning styles when isLandscape=true for team2', () => {
    const { getByTestId } = render(
      <TeamWinsTally teamId="team2" wins={5} isLandscape={true} />
    );

    const container = getByTestId('team2-wins-container');
    const styles = Array.isArray(container.props.style)
      ? Object.assign({}, ...container.props.style)
      : container.props.style;

    expect(styles.position).toBe('absolute');
    expect(styles.right).toBeDefined();
    expect(styles.top).toBe('50%');
  });

  test('should apply portrait positioning when isLandscape=false', () => {
    const { getByTestId } = render(
      <TeamWinsTally teamId="team1" wins={3} isLandscape={false} />
    );

    const container = getByTestId('team1-wins-container');
    const styles = Array.isArray(container.props.style)
      ? Object.assign({}, ...container.props.style)
      : container.props.style;

    expect(styles.position).not.toBe('absolute');
  });

  test('should default to portrait mode when isLandscape prop not provided', () => {
    const { getByTestId } = render(
      <TeamWinsTally teamId="team1" wins={3} />
    );

    const container = getByTestId('team1-wins-container');
    const styles = Array.isArray(container.props.style)
      ? Object.assign({}, ...container.props.style)
      : container.props.style;

    expect(styles.position).not.toBe('absolute');
  });

  test('should center vertically in landscape mode', () => {
    const { getByTestId } = render(
      <TeamWinsTally teamId="team1" wins={3} isLandscape={true} />
    );

    const container = getByTestId('team1-wins-container');
    const styles = Array.isArray(container.props.style)
      ? Object.assign({}, ...container.props.style)
      : container.props.style;

    expect(styles.top).toBe('50%');
    expect(styles.transform).toBeDefined();
    expect(Array.isArray(styles.transform)).toBe(true);
  });

  test('should maintain accessibility in both modes', () => {
    const { getByTestId, rerender } = render(
      <TeamWinsTally teamId="team1" wins={3} isLandscape={false} />
    );

    const portraitLabel = getByTestId('team1-wins-container').props.accessibilityLabel;

    rerender(<TeamWinsTally teamId="team1" wins={3} isLandscape={true} />);

    const landscapeLabel = getByTestId('team1-wins-container').props.accessibilityLabel;

    expect(portraitLabel).toBe(landscapeLabel);
    expect(portraitLabel).toContain('Team 1');
  });

  test('should display correct content in both orientations', () => {
    const { getByTestId, rerender } = render(
      <TeamWinsTally teamId="team1" wins={7} isLandscape={false} />
    );

    expect(getByTestId('team1-wins-label')).toHaveTextContent('Games Won');
    expect(getByTestId('team1-wins-count')).toHaveTextContent('7');

    rerender(<TeamWinsTally teamId="team1" wins={7} isLandscape={true} />);

    expect(getByTestId('team1-wins-label')).toHaveTextContent('Games Won');
    expect(getByTestId('team1-wins-count')).toHaveTextContent('7');
  });
});
