import { create } from "zustand";
import { supabase } from "../lib/supabase";
import type { User } from "@supabase/supabase-js";

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  initializeAuth: () => Promise<void>;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,

  setUser: (user) => {
    console.log("setUser called with:", user);
    set({ user });
  },

  initializeAuth: async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      console.log("Initial session:", data.session);
      if (data.session?.user) {
        set({ user: data.session.user });
      }

      supabase.auth.onAuthStateChange((event, session) => {
        console.log("Auth state changed:", event, session);
        if (event === "SIGNED_IN" && session?.user) {
          set({ user: session.user });
        } else if (event === "SIGNED_OUT") {
          set({ user: null });
        }
      });
    } catch (error) {
      console.error("Error initializing auth:", error);
    }
  },
}));

const initializeStore = async () => {
  await useAuthStore.getState().initializeAuth();
};

initializeStore();

export { useAuthStore };
