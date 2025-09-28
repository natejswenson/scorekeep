import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GameState, Team } from '../types';

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
} = gameSlice.actions;

export default gameSlice.reducer;