import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useAppStore } from "../../stores/appStore";
import { GameList } from "../../components/gameList";

const Dashboard = () => {
  const { availableGames, loading, fetchAvailableGames, joinGame } =
    useAppStore();

  useEffect(() => {
    fetchAvailableGames();
  }, [fetchAvailableGames]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Available Games</h1>
      {availableGames.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-600">
            No games available. Create one in "My Games"!
          </p>
          <Link
            to="/my-games"
            className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Create Game
          </Link>
        </div>
      ) : (
        <GameList games={availableGames} onJoin={joinGame} />
      )}
    </div>
  );
};

export default Dashboard;
