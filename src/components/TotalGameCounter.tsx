import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface TotalGameCounterProps {
  totalGames: number;
}

const TotalGameCounter: React.FC<TotalGameCounterProps> = ({ totalGames }) => {
  const getAccessibilityLabel = () => {
    return `Game ${totalGames} of match`;
  };

  return (
    <View
      testID="total-game-container"
      style={styles.container}
      accessibilityLabel={getAccessibilityLabel()}
      accessibilityRole="text"
    >
      <Text testID="total-game-label" style={styles.label}>
        Game
      </Text>
      <Text testID="total-game-counter" style={styles.counter}>
        {totalGames}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 2,
  },
  counter: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default TotalGameCounter;