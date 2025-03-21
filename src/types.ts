export type Game = {
  id: string;
  name: string;
  creator_id: string;
  creator_name: string;
  max_players: number;
  max_errors: number;
  current_players: number;
  status: "waiting" | "in_progress" | "completed";
  created_at: string;
  winner_id: string | null;
};

export interface GamePlayer {
  id: string;
  game_id: string;
  user_id: string;
  color: string;
  errors: number;
  joined_at: string;
  profiles?: {
    email: string;
  };
}

export interface GameWord {
  id: string;
  game_id: string;
  user_id: string;
  word: string;
  created_at: string;
}

export interface AppState {
  availableGames: Game[];
  myGames: Game[];
  loading: boolean;

  fetchAvailableGames: () => Promise<void>;
  fetchMyGames: () => Promise<void>;
  joinGame: (gameId: string) => Promise<void>;
  createGame: (gameData: {
    name: string;
    max_players: number;
    max_errors: number;
  }) => Promise<void>;
  deleteGame: (gameId: string) => Promise<void>;
}

export type AuthFormProps = {
  isLoginMode: boolean;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  confirmPassword: string;
  setConfirmPassword: (value: string) => void;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  onSubmit: (e: React.FormEvent) => void;
  toggleMode: () => void;
};

export type AuthState = {
  email: string;
  password: string;
  confirmPassword: string;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  clearUser: () => void;
};

export type CreateGameModalProps = {
  isOpen: boolean;
  onClose: () => void;
  newGame: { name: string; max_players: number; max_errors: number };
  setNewGame: (game: {
    name: string;
    max_players: number;
    max_errors: number;
  }) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export type GameListProps = {
  games: Game[];
  userId?: string | undefined;
  onDelete?: (gameId: string) => void;
  onNavigate?: (path: string) => void;
  onJoin?: (gameId: string) => void;
};

export type PlayersListProps = {
  players: GamePlayer[];
  currentTurn: string | null;
  game: Game | null;
  userId: string | undefined;
};

export type WordsAreaProps = {
  game: Game | null;
  words: GameWord[];
  getPlayerInfo: (userId: string) => { color: string; name: string };
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
};

export type WordInputProps = {
  game: Game | null;
  words: GameWord[];
  newWord: string;
  setNewWord: (value: string) => void;
  error: string | null;
  isMyTurn: boolean;
  currentTurn: string | null;
  userId: string | undefined;
  onSubmit: (e: React.FormEvent) => void;
  getPlayerInfo: (userId: string) => { name: string };
};
