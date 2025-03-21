import { supabase } from "../lib/supabase";
import type { Game, GamePlayer, GameWord } from "../types";

export const fetchGame = async (gameId: string): Promise<Game> => {
  const { data, error } = await supabase
    .from("games")
    .select("*")
    .eq("id", gameId)
    .single();
  if (error) throw error;
  return data;
};

export const fetchPlayers = async (gameId: string): Promise<GamePlayer[]> => {
  const { data, error } = await supabase
    .from("game_players")
    .select("*, profiles(email)")
    .eq("game_id", gameId)
    .order("joined_at", { ascending: true });
  if (error) throw error;
  return data;
};

export const fetchWords = async (gameId: string): Promise<GameWord[]> => {
  const { data, error } = await supabase
    .from("game_words")
    .select("*")
    .eq("game_id", gameId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data || [];
};

export const updateGameStatus = async (
  gameId: string,
  status: string,
  winnerId?: string
) => {
  const { error } = await supabase
    .from("games")
    .update({ status, ...(winnerId && { winner_id: winnerId }) })
    .eq("id", gameId);
  if (error) throw error;
};

export const addGameWord = async (
  gameId: string,
  userId: string,
  word: string
) => {
  const { error } = await supabase
    .from("game_words")
    .insert({ game_id: gameId, user_id: userId, word })
    .select();
  if (error) throw error;
};

export const updatePlayerErrors = async (
  gameId: string,
  userId: string,
  errors: number
) => {
  const { error } = await supabase
    .from("game_players")
    .update({ errors })
    .eq("game_id", gameId)
    .eq("user_id", userId);
  if (error) throw error;
};

export const getPlayerErrors = async (
  gameId: string,
  userId: string
): Promise<number> => {
  const { data, error } = await supabase
    .from("game_players")
    .select("errors")
    .eq("game_id", gameId)
    .eq("user_id", userId)
    .single();
  if (error) throw error;
  return data?.errors || 0;
};

export const subscribeToGameChanges = (
  gameId: string,
  table: string,
  callback: () => void
) =>
  supabase
    .channel(`${table}:${gameId}`)
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table, filter: `id=eq.${gameId}` },
      callback
    )
    .subscribe();
