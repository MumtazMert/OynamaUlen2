import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useAuth } from "./hooks/useAuth";
import AuthForm from "../../components/authForm";

const Login = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const {
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
  } = useAuth();

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    resetMessages();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md space-y-6">
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50"
        >
          <FcGoogle size={20} />
          <span>
            {isLoginMode ? "Continue with Google" : "Sign up with Google"}
          </span>
        </button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              {isLoginMode ? "Or login with email" : "Or sign up with email"}
            </span>
          </div>
        </div>

        <AuthForm
          isLoginMode={isLoginMode}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          loading={loading}
          error={error}
          successMessage={successMessage}
          onSubmit={isLoginMode ? handleEmailLogin : handleSignUp}
          toggleMode={toggleMode}
        />
      </div>
    </div>
  );
};

export default Login;
