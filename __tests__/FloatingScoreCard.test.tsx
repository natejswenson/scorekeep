import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import FloatingScoreCard from '../src/components/FloatingScoreCard';

describe('FloatingScoreCard', () => {
  const defaultProps = {
    score: 5,
    gamesWon: 3,
    backgroundColor: '#FF0000',
    position: 'top-left' as const,
    onIncrementScore: jest.fn(),
    onDecrementScore: jest.fn(),
    onIncrementWins: jest.fn(),
    onDecrementWins: jest.fn(),
    testIdPrefix: 'team1',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the card', () => {
    const { getByTestId } = render(<FloatingScoreCard {...defaultProps} />);
    expect(getByTestId('team1-card')).toBeTruthy();
  });

  it('should display current score', () => {
    const { getByTestId } = render(<FloatingScoreCard {...defaultProps} />);
    expect(getByTestId('team1-score')).toHaveTextContent('5');
  });

  it('should display games won', () => {
    const { getByTestId } = render(<FloatingScoreCard {...defaultProps} />);
    expect(getByTestId('team1-wins')).toHaveTextContent('3');
  });

  it('should call onIncrementScore when score area is pressed', () => {
    const { getByTestId } = render(<FloatingScoreCard {...defaultProps} />);
    fireEvent.press(getByTestId('team1-score-area'));
    expect(defaultProps.onIncrementScore).toHaveBeenCalledTimes(1);
  });

  it('should call onDecrementScore when decrement button is pressed', () => {
    const { getByTestId } = render(<FloatingScoreCard {...defaultProps} />);
    fireEvent.press(getByTestId('team1-decrement'));
    expect(defaultProps.onDecrementScore).toHaveBeenCalledTimes(1);
  });

  it('should call onIncrementWins when wins increment button is pressed', () => {
    const { getByTestId } = render(<FloatingScoreCard {...defaultProps} />);
    fireEvent.press(getByTestId('team1-wins-increment'));
    expect(defaultProps.onIncrementWins).toHaveBeenCalledTimes(1);
  });

  it('should call onDecrementWins when wins decrement button is pressed', () => {
    const { getByTestId } = render(<FloatingScoreCard {...defaultProps} />);
    fireEvent.press(getByTestId('team1-wins-decrement'));
    expect(defaultProps.onDecrementWins).toHaveBeenCalledTimes(1);
  });


  it('should render with bottom-right positioning', () => {
    const { getByTestId } = render(
      <FloatingScoreCard {...defaultProps} position="bottom-right" />
    );
    const card = getByTestId('team1-card');
    expect(card).toBeTruthy();
  });

  it('should apply correct background color', () => {
    const { getByTestId } = render(
      <FloatingScoreCard {...defaultProps} backgroundColor="#0000FF" />
    );
    const card = getByTestId('team1-card');
    const styles = Array.isArray(card.props.style)
      ? Object.assign({}, ...card.props.style)
      : card.props.style;
    expect(styles.backgroundColor).toBe('#0000FF');
  });

});
