import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import type { Game, GamePlayer, GameWord } from "../types";

interface GameState {
  game: Game | null;
  players: GamePlayer[];
  words: GameWord[];
  currentTurn: string | null;

  setGame: (game: Game | null) => void;
  setPlayers: (players: GamePlayer[]) => void;
  setWords: (words: GameWord[]) => void;
  addWord: (word: GameWord) => void;
  setCurrentTurn: (userId: string | null) => void;
}

export const useGameStore = create<GameState>()(
  immer((set) => ({
    game: null,
    players: [],
    words: [],
    currentTurn: null,

    setGame: (game) =>
      set((state) => {
        state.game = game;
      }),

    setPlayers: (players) =>
      set((state) => {
        state.players = players;
      }),

    setWords: (words) =>
      set((state) => {
        state.words = words;
      }),

    addWord: (word) =>
      set((state) => {
        state.words.push(word);
      }),

    setCurrentTurn: (userId) =>
      set((state) => {
        state.currentTurn = userId;
      }),
  }))
);
