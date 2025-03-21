import { supabase } from "../lib/supabase";
import { BASE_URL } from "../utilities/authUtils";
import type { User } from "@supabase/supabase-js";

type AuthResponse = {
  user?: User | null;
  error: Error | null;
  url?: string;
};

export const signInWithEmail = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { user: data?.user ?? null, error };
};

export const signInWithGoogle = async (): Promise<AuthResponse> => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${BASE_URL}/`,
      scopes: "https://www.googleapis.com/auth/userinfo.email",
    },
  });

  if (error) {
    return { error };
  }
  return { url: data.url, error: null };
};

export const signUpWithEmail = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${BASE_URL}/`,
    },
  });
  return { user: data?.user ?? null, error };
};
