import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./stores/authStore";
import Login from "./pages/login";
import Dashboard from "./pages/dashBoard";
import MyGames from "./pages/myGames";
import GameRoom from "./pages/gameRoom";
import Layout from "./components/layout";
import { useEffect, useState } from "react";

function App() {
  const { user, initializeAuth } = useAuthStore();
  const [isAuthReady, setIsAuthReady] = useState(false);

  useEffect(() => {
    initializeAuth().then(() => {
      setIsAuthReady(true);
    });
  }, [initializeAuth]);

  if (!isAuthReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" />}
        />
        <Route element={user ? <Layout /> : <Navigate to="/login" />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/my-games" element={<MyGames />} />
          <Route path="/game/:id" element={<GameRoom />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
