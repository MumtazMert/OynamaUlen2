import { useState } from "react";
import { useAuthStore } from "../../../stores/authStore";
import {
  signInWithEmail,
  signInWithGoogle,
  signUpWithEmail,
  type AuthResponse,
} from "../../../services/authService";
import {
  setLoadingState,
  validatePasswords,
} from "../../../utilities/authUtils";

export const useAuth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { setUser } = useAuthStore();

  const handleAuth = async (
    authFn: () => Promise<AuthResponse>,
    redirect = false
  ) => {
    setLoadingState(setLoading, setError, setSuccessMessage, true);
    const { user, error } = await authFn();

    if (error) {
      setLoadingState(
        setLoading,
        setError,
        setSuccessMessage,
        false,
        error.message
      );
      return;
    }

    if (user) {
      setUser(user);
      if (redirect) window.location.href = "/";
    }
    setLoadingState(setLoading, setError, setSuccessMessage, false);
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    handleAuth(() => signInWithEmail(email, password), true);
  };

  const handleGoogleLogin = () => {
    handleAuth(signInWithGoogle);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatePasswords(password, confirmPassword, setError)) {
      setLoading(false);
      return;
    }

    const { user, error } = await signUpWithEmail(email, password);
    setLoadingState(setLoading, setError, setSuccessMessage, false);

    if (error) {
      setError(error.message);
      return;
    }

    if (user) {
      if (user.identities?.length === 0) {
        setError("An account with this email already exists");
      } else {
        setSuccessMessage("Please check your email to confirm your account");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
      }
    }
  };

  const resetMessages = () => {
    setError(null);
    setSuccessMessage(null);
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    loading,
    error,
    successMessage,
    handleEmailLogin,
    handleGoogleLogin,
    handleSignUp,
    resetMessages,
  };
};
