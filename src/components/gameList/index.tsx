import type { GameListProps } from "../../types";

export const GameList: React.FC<GameListProps> = ({
  games,
  userId,
  onDelete,
  onNavigate,
  onJoin,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {games.map((game) => (
      <div key={game.id} className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-2">{game.name}</h2>
          <div className="flex justify-between text-sm text-gray-600 mb-4">
            <span>Created by: {game.creator_name}</span>
            <span>
              Players: {game.current_players}/{game.max_players}
            </span>
          </div>
          <div className="mb-4">
            <span className="text-sm font-medium text-gray-700">
              Status: {game.status === "waiting" ? "Waiting" : "In Progress"}
            </span>
          </div>
          <div className="flex space-x-2">
            {onJoin ? (
              <button
                onClick={() => onJoin(game.id)}
                disabled={game.current_players >= game.max_players}
                className={`flex-1 py-2 px-4 rounded-md ${
                  game.current_players >= game.max_players
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
              >
                {game.current_players >= game.max_players
                  ? "Game Full"
                  : "Join Game"}
              </button>
            ) : onNavigate ? (
              <button
                onClick={() => onNavigate(`/game/${game.id}`)}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md"
              >
                {game.status === "waiting" ? "Enter Lobby" : "Continue Game"}
              </button>
            ) : null}
            {game.creator_id === userId && onDelete && (
              <button
                onClick={() => onDelete(game.id)}
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    ))}
  </div>
);
