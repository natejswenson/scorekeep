import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, DimensionValue } from 'react-native';
import { usePortraitLayout } from '../hooks/usePortraitLayout';

interface FloatingScoreCardProps {
  score: number;
  gamesWon: number;
  backgroundColor: string;
  position: 'top-left' | 'bottom-right';
  onIncrementScore: () => void;
  onDecrementScore: () => void;
  onIncrementWins: () => void;
  onDecrementWins: () => void;
  testIdPrefix: string;
}

/**
 * FloatingScoreCard - A minimalist card component for displaying team score
 * Features large typography, inline controls, and clean design
 * Dynamically sizes to fit within portrait mode zones using usePortraitLayout hook
 */
const FloatingScoreCard: React.FC<FloatingScoreCardProps> = ({
  score,
  gamesWon,
  backgroundColor,
  position,
  onIncrementScore,
  onDecrementScore,
  onIncrementWins,
  onDecrementWins,
  testIdPrefix,
}) => {
  const { safeFontSize, getMaxHeightPercent } = usePortraitLayout();

  const cardStyle = position === 'top-left' ? styles.cardTopLeft : styles.cardBottomRight;
  const isBottomCard = position === 'bottom-right';

  // Dynamic styles for responsive sizing
  const dynamicStyles = {
    card: {
      maxHeight: getMaxHeightPercent() as DimensionValue,
    },
    scoreText: {
      fontSize: safeFontSize,
      lineHeight: safeFontSize,
    },
  };

  return (
    <View testID={`${testIdPrefix}-card`} style={[styles.card, cardStyle, dynamicStyles.card, { backgroundColor }]}>
      {/* Conditional order: bottom card shows games won first, top card shows score first */}
      {isBottomCard ? (
        <>
          {/* Games Won Section */}
          <View style={styles.gamesSection}>
            <View style={styles.gamesControls}>
              <TouchableOpacity
                testID={`${testIdPrefix}-wins-decrement`}
                onPress={onDecrementWins}
                style={styles.smallButton}
              >
                <Text style={styles.smallButtonText}>−</Text>
              </TouchableOpacity>

              <Text testID={`${testIdPrefix}-wins`} style={styles.gamesText}>
                {gamesWon}
              </Text>

              <TouchableOpacity
                testID={`${testIdPrefix}-wins-increment`}
                onPress={onIncrementWins}
                style={styles.smallButton}
              >
                <Text style={styles.smallButtonText}>+</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.gamesLabel}>GAMES WON</Text>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Score Section */}
          <View style={styles.scoreSection}>
            <TouchableOpacity
              testID={`${testIdPrefix}-score-area`}
              onPress={onIncrementScore}
              style={styles.scoreButton}
            >
              <Text testID={`${testIdPrefix}-score`} style={[styles.scoreText, dynamicStyles.scoreText]}>
                {score}
              </Text>
            </TouchableOpacity>

            {/* Decrement button positioned beside score */}
            <TouchableOpacity
              testID={`${testIdPrefix}-decrement`}
              onPress={onDecrementScore}
              style={styles.decrementButton}
            >
              <Text style={styles.controlText}>−</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          {/* Score Section */}
          <View style={styles.scoreSection}>
            <TouchableOpacity
              testID={`${testIdPrefix}-score-area`}
              onPress={onIncrementScore}
              style={styles.scoreButton}
            >
              <Text testID={`${testIdPrefix}-score`} style={[styles.scoreText, dynamicStyles.scoreText]}>
                {score}
              </Text>
            </TouchableOpacity>

            {/* Decrement button positioned beside score */}
            <TouchableOpacity
              testID={`${testIdPrefix}-decrement`}
              onPress={onDecrementScore}
              style={styles.decrementButton}
            >
              <Text style={styles.controlText}>−</Text>
            </TouchableOpacity>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Games Won Section */}
          <View style={styles.gamesSection}>
            <View style={styles.gamesControls}>
              <TouchableOpacity
                testID={`${testIdPrefix}-wins-decrement`}
                onPress={onDecrementWins}
                style={styles.smallButton}
              >
                <Text style={styles.smallButtonText}>−</Text>
              </TouchableOpacity>

              <Text testID={`${testIdPrefix}-wins`} style={styles.gamesText}>
                {gamesWon}
              </Text>

              <TouchableOpacity
                testID={`${testIdPrefix}-wins-increment`}
                onPress={onIncrementWins}
                style={styles.smallButton}
              >
                <Text style={styles.smallButtonText}>+</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.gamesLabel}>GAMES WON</Text>
          </View>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    position: 'absolute',
    width: '85%',
    maxWidth: 360,
    borderRadius: 20,
    padding: 12, // Reduced from 20 to minimize extra space
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.35,
    shadowRadius: 20,
    elevation: 15,
  },
  cardTopLeft: {
    top: '7.5%', // Increased from 5% to better center in zone
    left: '7.5%',
  },
  cardBottomRight: {
    bottom: '7.5%', // Increased from 5% to better center in zone
    right: '7.5%',
  },
  scoreSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8, // Reduced from 12 to tighten layout
  },
  scoreButton: {
    paddingHorizontal: 4,
  },
  scoreText: {
    fontSize: 240,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 240,
  },
  decrementButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  controlText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  divider: {
    height: 1.5,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    marginVertical: 8, // Reduced from 12 to tighten layout
  },
  gamesSection: {
    alignItems: 'center',
  },
  gamesControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  gamesText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginHorizontal: 12,
    minWidth: 36,
    textAlign: 'center',
  },
  smallButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  gamesLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1.5,
    opacity: 0.6,
  },
});

export default FloatingScoreCard;
