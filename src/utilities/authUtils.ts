export const BASE_URL = window.location.origin;

export const setLoadingState = (
  setLoading: (value: boolean) => void,
  setError: (value: string | null) => void,
  setSuccessMessage: (value: string | null) => void,
  loading: boolean,
  error: string | null = null,
  success: string | null = null
) => {
  setLoading(loading);
  setError(error);
  setSuccessMessage(success);
};

export const validatePasswords = (
  password: string,
  confirmPassword: string,
  setError: (value: string | null) => void
): boolean => {
  if (password !== confirmPassword) {
    setError("Passwords do not match");
    return false;
  }
  if (password.length < 6) {
    setError("Password must be at least 6 characters long");
    return false;
  }
  return true;
};
