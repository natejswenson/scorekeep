import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import {
  incrementTeam1Score,
  incrementTeam2Score,
  decrementTeam1Score,
  decrementTeam2Score,
  resetScores,
  incrementTeam1Wins,
  incrementTeam2Wins,
  decrementTeam1Wins,
  decrementTeam2Wins,
} from '../store/gameSlice';
import FloatingScoreCard from './FloatingScoreCard';
import { useIsLandscape } from '../hooks/useOrientation';

// Layout constants for optimized spacing in landscape mode
const LAYOUT_CONSTANTS = {
  SCORE_AREA_MARGIN_BOTTOM: 10, // Reduced from 40 to bring elements closer
  TOP_CONTROLS_POSITION: '8%' as const, // Tally controls positioned at top
  MIDDLE_CONTROLS_POSITION: '45%' as const, // Reset button stays in middle
  DECREMENT_BUTTON_SIZE: 60,
  BUTTON_OVERLAP_PERCENTAGE: 0.45, // 45% overlap for tighter visual grouping
  BUTTON_OVERLAP_OFFSET: -27, // -(60 * 0.45) = -27px overlap
};

const GameScreen: React.FC = () => {
  const { team1, team2, gameWins } = useSelector((state: RootState) => state.game);
  const dispatch = useDispatch();
  const isLandscape = useIsLandscape();

  const handleIncrementTeam1Wins = () => {
    dispatch(incrementTeam1Wins());
  };

  const handleIncrementTeam2Wins = () => {
    dispatch(incrementTeam2Wins());
  };

  const handleDecrementTeam1Wins = () => {
    dispatch(decrementTeam1Wins());
  };

  const handleDecrementTeam2Wins = () => {
    dispatch(decrementTeam2Wins());
  };

  // Use floating cards layout for portrait, traditional layout for landscape
  if (!isLandscape) {
    return (
      <View style={styles.portraitContainer}>
        {/* Split background - red top, blue bottom */}
        <View testID="top-background" style={styles.topBackground} />
        <View testID="bottom-background" style={styles.bottomBackground} />

        {/* Red Zone - Top Half */}
        <View testID="red-zone" style={styles.redZone}>
          <FloatingScoreCard
            score={team1.score}
            gamesWon={gameWins.team1}
            backgroundColor="#FF0000"
            position="top-left"
            onIncrementScore={() => dispatch(incrementTeam1Score())}
            onDecrementScore={() => dispatch(decrementTeam1Score())}
            onIncrementWins={handleIncrementTeam1Wins}
            onDecrementWins={handleDecrementTeam1Wins}
            testIdPrefix="team1"
          />
        </View>

        {/* Blue Zone - Bottom Half */}
        <View testID="blue-zone" style={styles.blueZone}>
          <FloatingScoreCard
            score={team2.score}
            gamesWon={gameWins.team2}
            backgroundColor="#0000FF"
            position="bottom-right"
            onIncrementScore={() => dispatch(incrementTeam2Score())}
            onDecrementScore={() => dispatch(decrementTeam2Score())}
            onIncrementWins={handleIncrementTeam2Wins}
            onDecrementWins={handleDecrementTeam2Wins}
            testIdPrefix="team2"
          />
        </View>

        {/* Center Reset Button */}
        <View testID="middle-controls-container" style={styles.portraitResetContainer}>
          <TouchableOpacity
            testID="reset-button"
            style={styles.portraitResetButton}
            onPress={() => dispatch(resetScores())}
          >
            <Text style={styles.portraitResetIcon}>↻</Text>
          </TouchableOpacity>
        </View>

        {/* Top Tally */}
        <View testID="top-controls-container" style={styles.portraitTopControls}>
          <View style={styles.tallyBadge}>
            <Text style={styles.tallyText}>
              {gameWins.team1} - {gameWins.team2}
            </Text>
          </View>
        </View>
      </View>
    );
  }

  // Landscape: Minimalist side-by-side layout
  return (
    <View style={styles.container}>
      {/* Team 1 - Red Side */}
      <View testID="team1-side" style={[styles.teamSide, styles.redSide]}>
        <TouchableOpacity
          testID="team1-score-area"
          style={styles.landscapeScoreButton}
          onPress={() => dispatch(incrementTeam1Score())}
        >
          <Text testID="team1-score" style={styles.landscapeScore}>
            {team1.score}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          testID="team1-decrement"
          style={styles.landscapeDecrementButton}
          onPress={() => dispatch(decrementTeam1Score())}
        >
          <Text style={styles.landscapeControlText}>−</Text>
        </TouchableOpacity>
        <View style={styles.landscapeGamesSection}>
          <View style={styles.landscapeGamesControls}>
            <TouchableOpacity
              testID="team1-wins-decrement"
              accessibilityLabel="Decrement team 1 games won"
              onPress={handleDecrementTeam1Wins}
              style={styles.landscapeSmallButton}
            >
              <Text style={styles.landscapeSmallButtonText}>−</Text>
            </TouchableOpacity>

            <Text testID="team1-wins" style={styles.landscapeGamesText}>
              {gameWins.team1}
            </Text>

            <TouchableOpacity
              testID="team1-wins-increment"
              accessibilityLabel="Increment team 1 games won"
              onPress={handleIncrementTeam1Wins}
              style={styles.landscapeSmallButton}
            >
              <Text style={styles.landscapeSmallButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.landscapeGamesLabel}>GAMES WON</Text>
        </View>
      </View>

      {/* Team 2 - Blue Side */}
      <View testID="team2-side" style={[styles.teamSide, styles.blueSide]}>
        <TouchableOpacity
          testID="team2-score-area"
          style={styles.landscapeScoreButton}
          onPress={() => dispatch(incrementTeam2Score())}
        >
          <Text testID="team2-score" style={styles.landscapeScore}>
            {team2.score}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          testID="team2-decrement"
          style={styles.landscapeDecrementButton}
          onPress={() => dispatch(decrementTeam2Score())}
        >
          <Text style={styles.landscapeControlText}>−</Text>
        </TouchableOpacity>
        <View style={styles.landscapeGamesSection}>
          <View style={styles.landscapeGamesControls}>
            <TouchableOpacity
              testID="team2-wins-decrement"
              accessibilityLabel="Decrement team 2 games won"
              onPress={handleDecrementTeam2Wins}
              style={styles.landscapeSmallButton}
            >
              <Text style={styles.landscapeSmallButtonText}>−</Text>
            </TouchableOpacity>

            <Text testID="team2-wins" style={styles.landscapeGamesText}>
              {gameWins.team2}
            </Text>

            <TouchableOpacity
              testID="team2-wins-increment"
              accessibilityLabel="Increment team 2 games won"
              onPress={handleIncrementTeam2Wins}
              style={styles.landscapeSmallButton}
            >
              <Text style={styles.landscapeSmallButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.landscapeGamesLabel}>GAMES WON</Text>
        </View>
      </View>

      {/* Top Controls - Tally Badge */}
      <View testID="top-controls-container" style={styles.topControls}>
        <View testID="landscape-tally-badge" style={styles.landscapeTallyBadge}>
          <Text style={styles.landscapeTallyText}>
            {gameWins.team1} - {gameWins.team2}
          </Text>
        </View>
      </View>

      {/* Middle Controls - Reset Button in middle area */}
      <View testID="middle-controls-container" style={styles.middleControls}>
        <TouchableOpacity
          testID="reset-button"
          style={styles.landscapeResetButton}
          onPress={() => dispatch(resetScores())}
        >
          <Text style={styles.landscapeResetIcon}>↻</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    position: 'relative',
  },
  teamSide: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 40,
  },
  redSide: {
    backgroundColor: '#FF0000',
  },
  blueSide: {
    backgroundColor: '#0000FF',
  },
  teamName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 40,
    textAlign: 'center',
  },
  scoreArea: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    zIndex: 2, // Higher z-index to appear above decrement button
  },
  score: {
    fontSize: 72,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  decrementButton: {
    width: LAYOUT_CONSTANTS.DECREMENT_BUTTON_SIZE,
    height: LAYOUT_CONSTANTS.DECREMENT_BUTTON_SIZE,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: LAYOUT_CONSTANTS.DECREMENT_BUTTON_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    zIndex: 1, // Lower z-index to appear behind score circle
    marginTop: LAYOUT_CONSTANTS.BUTTON_OVERLAP_OFFSET, // Negative margin for 20% overlap
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
  topControls: {
    position: 'absolute',
    left: '50%',
    top: '25%',
    transform: [{ translateX: -75 }, { translateY: -50 }],
    alignItems: 'center',
    width: 150,
    zIndex: 10, // Ensure tally controls appear above other elements
  },
  middleControls: {
    position: 'absolute',
    left: '50%',
    top: LAYOUT_CONSTANTS.MIDDLE_CONTROLS_POSITION,
    transform: [{ translateX: -35 }, { translateY: -35 }],
    alignItems: 'center',
  },
  resetButton: {
    width: 70,
    height: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  resetIcon: {
    fontSize: 32,
    color: '#333333',
    fontWeight: 'bold',
  },
  // Portrait-specific styles
  portraitContainer: {
    flex: 1,
  },
  topBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: '#FF0000',
  },
  bottomBackground: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: '#0000FF',
  },
  redZone: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    overflow: 'hidden', // Prevent card overflow into blue zone
  },
  blueZone: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '50%',
    overflow: 'hidden', // Prevent card overflow into red zone
  },
  portraitResetContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -28 }, { translateY: -28 }],
    zIndex: 5,
  },
  portraitResetButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 2,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  portraitResetIcon: {
    fontSize: 24,
    color: '#333',
    fontWeight: '600',
  },
  portraitTopControls: {
    position: 'absolute',
    top: 24,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  tallyBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tallyText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    letterSpacing: 1,
  },
  // Landscape-specific styles
  landscapeScoreButton: {
    paddingHorizontal: 4,
  },
  landscapeScore: {
    fontSize: 240,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 240,
    textAlign: 'center',
  },
  landscapeDecrementButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: -27, // Overlap with score for tighter grouping
  },
  landscapeControlText: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  landscapeGamesSection: {
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: '15%',
  },
  landscapeGamesControls: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  landscapeGamesText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginHorizontal: 12,
    minWidth: 36,
    textAlign: 'center',
  },
  landscapeSmallButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  landscapeSmallButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  landscapeGamesLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1.5,
    opacity: 0.6,
  },
  landscapeTallyBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  landscapeTallyText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
    letterSpacing: 1,
  },
  landscapeResetButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 2,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  landscapeResetIcon: {
    fontSize: 24,
    color: '#333',
    fontWeight: '600',
  },
});

export default GameScreen;