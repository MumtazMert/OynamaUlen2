import type { GamePlayer, GameWord } from "../types";

export const getActivePlayerIds = (players: GamePlayer[], maxErrors: number) =>
  players.filter((p) => p.errors < maxErrors).map((p) => p.user_id);

export const determineNextTurn = (
  players: GamePlayer[],
  words: GameWord[],
  maxErrors: number
): string | null => {
  const activePlayerIds = getActivePlayerIds(players, maxErrors);
  if (activePlayerIds.length === 0) return null;

  if (words.length === 0) return activePlayerIds[0];

  const lastWordUserId = words[words.length - 1].user_id;
  const lastWordUserIndex = activePlayerIds.indexOf(lastWordUserId);
  const nextPlayerIndex = (lastWordUserIndex + 1) % activePlayerIds.length;
  return activePlayerIds[nextPlayerIndex];
};

export const validateWord = (
  word: string,
  words: GameWord[],
  setError: (error: string | null) => void
): boolean => {
  const trimmedWord = word.trim().toLowerCase();
  if (trimmedWord.length < 2) {
    setError("Word must be at least 2 characters long");
    return false;
  }

  if (words.length > 0) {
    const lastWord = words[words.length - 1].word;
    if (trimmedWord[0] !== lastWord[lastWord.length - 1]) {
      setError(
        `Word must start with the letter "${lastWord[lastWord.length - 1]}"`
      );
      return false;
    }
  }

  if (words.some((w) => w.word === trimmedWord)) {
    setError("This word has already been used");
    return false;
  }

  setError(null);
  return true;
};

export const checkGameOver = (
  players: GamePlayer[],
  maxErrors: number
): string | null => {
  const activePlayers = players.filter((p) => p.errors < maxErrors);
  return activePlayers.length <= 1 ? activePlayers[0]?.user_id || null : null;
};
