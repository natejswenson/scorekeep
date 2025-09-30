import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GameState, Team } from '../types';

const MAX_TEAM_NAME_LENGTH = 20;

const initialState: GameState = {
  team1: {
    name: 'Team 1',
    score: 0,
    color: '#FF0000',
  },
  team2: {
    name: 'Team 2',
    score: 0,
    color: '#0000FF',
  },
  scoreIncrement: 1,
  winCondition: 10,
  isGameActive: true,
  winner: null,
  editingTeam: null,
  gameWins: {
    team1: 0,
    team2: 0,
  },
};

export const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    incrementTeam1Score: (state) => {
      state.team1.score += state.scoreIncrement;
    },
    incrementTeam2Score: (state) => {
      state.team2.score += state.scoreIncrement;
    },
    decrementTeam1Score: (state) => {
      if (state.team1.score > 0) {
        state.team1.score -= state.scoreIncrement;
      }
    },
    decrementTeam2Score: (state) => {
      if (state.team2.score > 0) {
        state.team2.score -= state.scoreIncrement;
      }
    },
    resetScores: (state) => {
      state.team1.score = 0;
      state.team2.score = 0;
      state.isGameActive = true;
      state.winner = null;
    },
    updateTeam1: (state, action: PayloadAction<Partial<Team>>) => {
      state.team1 = { ...state.team1, ...action.payload };
    },
    updateTeam2: (state, action: PayloadAction<Partial<Team>>) => {
      state.team2 = { ...state.team2, ...action.payload };
    },
    setEditingTeam: (state, action: PayloadAction<'team1' | 'team2' | null>) => {
      state.editingTeam = action.payload;
    },
    updateTeamName: (state, action: PayloadAction<{ team: 'team1' | 'team2', name: string }>) => {
      const { team, name } = action.payload;
      const trimmedName = name.trim();

      // Validate name length and content
      if (trimmedName.length > 0 && trimmedName.length <= MAX_TEAM_NAME_LENGTH) {
        state[team].name = trimmedName;
      }

      // Clear editing state regardless of validation
      state.editingTeam = null;
    },
    incrementTeam1Wins: (state) => {
      state.gameWins.team1 += 1;
    },
    incrementTeam2Wins: (state) => {
      state.gameWins.team2 += 1;
    },
    decrementTeam1Wins: (state) => {
      if (state.gameWins.team1 > 0) {
        state.gameWins.team1 -= 1;
      }
    },
    decrementTeam2Wins: (state) => {
      if (state.gameWins.team2 > 0) {
        state.gameWins.team2 -= 1;
      }
    },
    resetGameWins: (state) => {
      state.gameWins.team1 = 0;
      state.gameWins.team2 = 0;
    },
  },
});

export const {
  incrementTeam1Score,
  incrementTeam2Score,
  decrementTeam1Score,
  decrementTeam2Score,
  resetScores,
  updateTeam1,
  updateTeam2,
  setEditingTeam,
  updateTeamName,
  incrementTeam1Wins,
  incrementTeam2Wins,
  decrementTeam1Wins,
  decrementTeam2Wins,
  resetGameWins,
} = gameSlice.actions;

export default gameSlice.reducer;