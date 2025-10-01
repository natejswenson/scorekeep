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
  setEditingTeam,
  updateTeamName,
  incrementTeam1Wins,
  incrementTeam2Wins,
  decrementTeam1Wins,
  decrementTeam2Wins,
} from '../store/gameSlice';
import TeamNameDisplay from './TeamNameDisplay';
import TeamWinsTally from './TeamWinsTally';
import TallyControls from './TallyControls';
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
  const { team1, team2, editingTeam, gameWins } = useSelector((state: RootState) => state.game);
  const dispatch = useDispatch();
  const isLandscape = useIsLandscape();

  const handleStartEdit = (teamId: 'team1' | 'team2') => {
    dispatch(setEditingTeam(teamId));
  };

  const handleSaveName = (teamId: 'team1' | 'team2', name: string) => {
    dispatch(updateTeamName({ team: teamId, name }));
  };

  const handleCancelEdit = () => {
    dispatch(setEditingTeam(null));
  };

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
        <View style={styles.topBackground} />
        <View style={styles.bottomBackground} />

        {/* Floating Card - Team 1 (Top Left) */}
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

        {/* Floating Card - Team 2 (Bottom Right) */}
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

  // Landscape: Traditional side-by-side layout
  return (
    <View style={styles.container}>
      {/* Team 1 - Red Side */}
      <View testID="team1-side" style={[styles.teamSide, styles.redSide]}>
        <TeamNameDisplay
          teamId="team1"
          name={team1.name}
          isEditing={editingTeam === 'team1'}
          onStartEdit={handleStartEdit}
          onSaveName={handleSaveName}
          onCancelEdit={handleCancelEdit}
        />
        <TouchableOpacity
          testID="team1-score-area"
          style={styles.scoreArea}
          onPress={() => dispatch(incrementTeam1Score())}
        >
          <Text testID="team1-score" style={styles.score}>
            {team1.score}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          testID="team1-decrement"
          style={styles.decrementButton}
          onPress={() => dispatch(decrementTeam1Score())}
        >
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
        <TeamWinsTally
          teamId="team1"
          wins={gameWins.team1}
          isLandscape={isLandscape}
          onIncrement={handleIncrementTeam1Wins}
          onDecrement={handleDecrementTeam1Wins}
        />
      </View>

      {/* Team 2 - Blue Side */}
      <View testID="team2-side" style={[styles.teamSide, styles.blueSide]}>
        <TeamNameDisplay
          teamId="team2"
          name={team2.name}
          isEditing={editingTeam === 'team2'}
          onStartEdit={handleStartEdit}
          onSaveName={handleSaveName}
          onCancelEdit={handleCancelEdit}
        />
        <TouchableOpacity
          testID="team2-score-area"
          style={styles.scoreArea}
          onPress={() => dispatch(incrementTeam2Score())}
        >
          <Text testID="team2-score" style={styles.score}>
            {team2.score}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          testID="team2-decrement"
          style={styles.decrementButton}
          onPress={() => dispatch(decrementTeam2Score())}
        >
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
        <TeamWinsTally
          teamId="team2"
          wins={gameWins.team2}
          isLandscape={isLandscape}
          onIncrement={handleIncrementTeam2Wins}
          onDecrement={handleDecrementTeam2Wins}
        />
      </View>

      {/* Top Controls - Total Game Counter */}
      <View testID="top-controls-container" style={styles.topControls}>
        <TallyControls
          team1Wins={gameWins.team1}
          team2Wins={gameWins.team2}
        />
      </View>

      {/* Middle Controls - Reset Button in middle area */}
      <View testID="middle-controls-container" style={styles.middleControls}>
        <TouchableOpacity
          testID="reset-button"
          style={styles.resetButton}
          onPress={() => dispatch(resetScores())}
        >
          <Text style={styles.resetIcon}>↻</Text>
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
    padding: 20,
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
    top: LAYOUT_CONSTANTS.TOP_CONTROLS_POSITION,
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
});

export default GameScreen;