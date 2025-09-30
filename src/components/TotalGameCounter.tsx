import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface TotalGameCounterProps {
  totalGames: number;
}

const TotalGameCounter: React.FC<TotalGameCounterProps> = ({ totalGames }) => {
  return (
    <View style={styles.container}>
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
    marginVertical: 8,
  },
  label: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },
  counter: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default TotalGameCounter;
