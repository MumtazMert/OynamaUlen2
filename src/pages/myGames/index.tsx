import { useEffect, useState } from "react";
import { useAppStore } from "../../stores/appStore";
import { useAuthStore } from "../../stores/authStore";
import { GameList } from "../../components/gameList";
import { CreateGameModal } from "../../components/createGameModal";
import { useAppNavigation } from "../../utilities/navigationUtils";

const MyGames = () => {
  const { myGames, loading, fetchMyGames, createGame, deleteGame } =
    useAppStore();
  const { goTo } = useAppNavigation();
  const { user } = useAuthStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newGame, setNewGame] = useState({
    name: "",
    max_players: 4,
    max_errors: 3,
  });

  useEffect(() => {
    fetchMyGames();
  }, [fetchMyGames]);

  const handleCreateGame = async (e: React.FormEvent) => {
    e.preventDefault();
    await createGame(newGame);
    setShowCreateModal(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Games</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Create New Game
        </button>
      </div>

      {myGames.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <p className="text-gray-600">
            You haven't created or joined any games yet.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Create Your First Game
          </button>
        </div>
      ) : (
        <GameList
          games={myGames}
          userId={user?.id}
          onDelete={deleteGame}
          onNavigate={goTo}
        />
      )}

      <CreateGameModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        newGame={newGame}
        setNewGame={setNewGame}
        onSubmit={handleCreateGame}
      />
    </div>
  );
};

export default MyGames;
