import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { supabase } from "../lib/supabase";
import { useAuthStore } from "./authStore";
import type { Game } from "../types";
import { getRandomColor } from "../utilities/colorUtils";
import { useGameStore } from "./gameStrore";
import { AppState } from "../types";
import { navigateTo } from "../utilities/navigationUtils";

export const useAppStore = create<AppState>()(
  immer((set, get) => ({
    availableGames: [],
    myGames: [],
    loading: true,
    setAvailableGames: (games: Game[]) => {
      set((state) => {
        state.availableGames = games;
      });
    },
    setMyGames: (games: Game[]) => {
      set((state) => {
        state.myGames = games;
      });
    },
    setLoading: (loading: boolean) => {
      set({ loading });
    },

    fetchAvailableGames: async () => {
      set({ loading: true });
      try {
        const { data, error } = await supabase
          .from("games")
          .select("*")
          .eq("status", "waiting")
          .order("created_at", { ascending: false });
        if (error) throw error;
        set((state) => {
          state.availableGames = data || [];
        });
      } catch (error) {
        console.error("Error fetching available games:", error);
        set((state) => {
          state.availableGames = [];
        });
      } finally {
        set({ loading: false });
      }
    },

    fetchMyGames: async () => {
      const { user } = useAuthStore.getState();
      if (!user?.id) {
        set({ myGames: [], loading: false });
        return;
      }

      set({ loading: true });
      try {
        const { data: createdGames, error: createdError } = await supabase
          .from("games")
          .select("*")
          .eq("creator_id", user.id)
          .order("created_at", { ascending: false });
        if (createdError) throw createdError;

        const { data: participatingGames, error: participatingError } =
          await supabase
            .from("game_players")
            .select("game_id")
            .eq("user_id", user.id);
        if (participatingError) throw participatingError;

        const participatingIds =
          participatingGames?.map((p) => p.game_id) || [];
        let allGames: Game[] = createdGames || [];

        if (participatingIds.length > 0) {
          const { data: games, error } = await supabase
            .from("games")
            .select("*")
            .in("id", participatingIds)
            .not("creator_id", "eq", user.id)
            .order("created_at", { ascending: false });
          if (error) throw error;
          allGames = [...allGames, ...(games || [])];
        }

        set((state) => {
          state.myGames = allGames;
        });
      } catch (error) {
        console.error("Error fetching my games:", error);
        set((state) => {
          state.myGames = [];
        });
      } finally {
        set({ loading: false });
      }
    },

    joinGame: async (gameId: string) => {
      const { user } = useAuthStore.getState();
      if (!user?.id) return;

      try {
        const { data: gameData } = await supabase
          .from("games")
          .select("current_players, max_players")
          .eq("id", gameId)
          .single();

        if (!gameData || gameData.current_players >= gameData.max_players) {
          alert("This game is full");
          return;
        }

        const { error } = await supabase.from("game_players").insert({
          game_id: gameId,
          user_id: user.id,
          color: getRandomColor(),
        });
        if (error) throw error;

        await supabase
          .from("games")
          .update({ current_players: gameData.current_players + 1 })
          .eq("id", gameId);

        const { data: updatedGame } = await supabase
          .from("games")
          .select("*")
          .eq("id", gameId)
          .single();
        if (updatedGame) useGameStore.getState().setGame(updatedGame);

        navigateTo(`/game/${gameId}`); // Navigasyon burada
      } catch (error) {
        console.error("Error joining game:", error);
      }
    },

    createGame: async (gameData: {
      name: string;
      max_players: number;
      max_errors: number;
    }) => {
      const { user } = useAuthStore.getState();
      if (!user?.id) return;

      try {
        const { data, error } = await supabase
          .from("games")
          .insert({
            name: gameData.name,
            creator_id: user.id,
            creator_name: user.email,
            max_players: gameData.max_players,
            max_errors: gameData.max_errors,
            current_players: 1,
            status: "waiting",
          })
          .select();

        if (error) throw error;

        if (data && data[0]) {
          await supabase.from("game_players").insert({
            game_id: data[0].id,
            user_id: user.id,
            color: getRandomColor(),
          });

          useGameStore.getState().setGame(data[0]);
          navigateTo(`/game/${data[0].id}`); // Navigasyon burada
          await get().fetchMyGames();
        }
      } catch (error) {
        console.error("Error creating game:", error);
      }
    },

    deleteGame: async (gameId: string) => {
      const { user } = useAuthStore.getState();
      if (!user?.id || !confirm("Are you sure you want to delete this game?"))
        return;

      try {
        const { error } = await supabase
          .from("games")
          .delete()
          .eq("id", gameId)
          .eq("creator_id", user.id);
        if (error) throw error;

        set((state) => {
          state.myGames = state.myGames.filter((game) => game.id !== gameId);
        });
      } catch (error) {
        console.error("Error deleting game:", error);
      }
    },
  }))
);

const setupSubscriptions = () => {
  const store = useAppStore.getState();
  supabase
    .channel("public:games")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "games" },
      () => {
        store.fetchAvailableGames();
        store.fetchMyGames();
      }
    )
    .subscribe();
};

setupSubscriptions();
