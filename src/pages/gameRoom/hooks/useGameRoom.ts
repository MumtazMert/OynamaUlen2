import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useAuthStore } from "../../../stores/authStore";
import { useGameStore } from "../../../stores/gameStrore";
import {
  fetchGame,
  fetchPlayers,
  fetchWords,
  updateGameStatus,
  addGameWord,
  updatePlayerErrors,
  getPlayerErrors,
  subscribeToGameChanges,
} from "../../../services/gameService";
import {
  determineNextTurn,
  validateWord,
  checkGameOver,
  getActivePlayerIds,
} from "../../../utilities/gameUtils";

export const useGameRoom = () => {
  const { id: gameId } = useParams<{ id: string }>();
  const { user } = useAuthStore();
  const {
    game,
    players,
    words,
    currentTurn,
    setGame,
    setPlayers,
    setWords,
    setCurrentTurn,
  } = useGameStore();
  const [loading, setLoading] = useState(true);
  const [newWord, setNewWord] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchGameData = async () => {
    if (!gameId) return;
    try {
      const [gameData, playersData, wordsData] = await Promise.all([
        fetchGame(gameId),
        fetchPlayers(gameId),
        fetchWords(gameId),
      ]);
      setGame(gameData);
      setPlayers(playersData);
      setWords(wordsData);

      if (gameData.status === "in_progress") {
        const nextTurn = determineNextTurn(
          playersData,
          wordsData,
          gameData.max_errors
        );
        setCurrentTurn(nextTurn);
      }
      setIsMyTurn(currentTurn === user?.id);
    } catch (error) {
      console.error("Error fetching game data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGameData();
    if (!gameId) return;

    const subscriptions = [
      subscribeToGameChanges(gameId, "games", fetchGameData),
      subscribeToGameChanges(gameId, "game_players", fetchGameData),
      subscribeToGameChanges(gameId, "game_words", fetchGameData),
    ];
    return () => subscriptions.forEach((sub) => sub.unsubscribe());
  }, [gameId, user?.id, currentTurn]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [words]);

  const startGame = async () => {
    if (!game || game.creator_id !== user?.id || !gameId) return;
    try {
      await updateGameStatus(gameId, "in_progress");
      const activePlayerIds = getActivePlayerIds(players, game.max_errors);
      if (activePlayerIds.length > 0) setCurrentTurn(activePlayerIds[0]);
    } catch (error) {
      console.error("Error starting game:", error);
    }
  };

  const submitWord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!game || !user || currentTurn !== user.id || !gameId) return;

    const wordToSubmit = newWord.trim().toLowerCase();
    if (!validateWord(wordToSubmit, words, setError)) {
      const currentErrors = await getPlayerErrors(gameId, user.id);
      const newErrorCount = currentErrors + 1;
      await updatePlayerErrors(gameId, user.id, newErrorCount);

      const updatedPlayers = await fetchPlayers(gameId);
      setPlayers(updatedPlayers);

      const winnerId = checkGameOver(updatedPlayers, game.max_errors);
      if (winnerId !== null) {
        await updateGameStatus(gameId, "completed", winnerId);
        setGame({ ...game, status: "completed", winner_id: winnerId });
      } else {
        const nextTurn = determineNextTurn(
          updatedPlayers,
          words,
          game.max_errors
        );
        setCurrentTurn(nextTurn);
      }
      return;
    }

    try {
      await addGameWord(gameId, user.id, wordToSubmit);
      setNewWord("");
      const updatedWords = [
        ...words,
        {
          game_id: gameId,
          user_id: user.id,
          word: wordToSubmit,
          id: "",
          created_at: "",
        },
      ];
      setWords(updatedWords);
      const nextTurn = determineNextTurn(
        players,
        updatedWords,
        game.max_errors
      );
      setCurrentTurn(nextTurn);
    } catch (error) {
      console.error("Error submitting word:", error);
    }
  };

  const getPlayerInfo = (userId: string) => ({
    color: players.find((p) => p.user_id === userId)?.color || "#CCCCCC",
    name:
      players.find((p) => p.user_id === userId)?.profiles?.email ||
      "Unknown Player",
  });

  return {
    game,
    players,
    words,
    currentTurn,
    loading,
    newWord,
    setNewWord,
    error,
    isMyTurn,
    messagesEndRef,
    startGame,
    submitWord,
    getPlayerInfo,
    user,
    gameId,
  };
};
