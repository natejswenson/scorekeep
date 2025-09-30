export interface Team {
  name: string;
  score: number;
  color: string;
}

export interface GameState {
  team1: Team;
  team2: Team;
  scoreIncrement: number;
  winCondition: number;
  isGameActive: boolean;
  winner: string | null;
  editingTeam: 'team1' | 'team2' | null;
}

export interface AppState {
  game: GameState;
  settings: {
    soundEnabled: boolean;
    vibrationEnabled: boolean;
  };
  history: GameRecord[];
}

export interface GameRecord {
  id: string;
  team1Name: string;
  team2Name: string;
  team1Score: number;
  team2Score: number;
  winner: string | null;
  timestamp: number;
}