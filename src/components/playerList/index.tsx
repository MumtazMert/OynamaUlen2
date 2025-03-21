import type { PlayersListProps } from "../../types";

export const PlayersList: React.FC<PlayersListProps> = ({
  players,
  currentTurn,
  game,
  userId,
}) => (
  <div className="w-full md:w-64 bg-white rounded-lg shadow p-4 overflow-y-auto">
    <h2 className="text-xl font-bold mb-4">Players</h2>
    <div className="space-y-3">
      {players.map((player) => (
        <div
          key={player.user_id}
          className={`p-3 rounded-md ${
            currentTurn === player.user_id
              ? "bg-blue-50 border border-blue-200"
              : ""
          }`}
        >
          <div className="flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: player.color }}
            ></div>
            <span className="font-medium truncate">
              {player.profiles?.email}
              {player.user_id === userId && " (You)"}
            </span>
          </div>
          <div className="mt-1 text-sm text-gray-600">
            Errors: {player.errors}/{game?.max_errors}
            {player.errors >= (game?.max_errors || 0) && (
              <span className="ml-2 text-red-500">(Eliminated)</span>
            )}
          </div>
          {currentTurn === player.user_id && (
            <div className="mt-1 text-sm font-medium text-blue-600">
              Current Turn
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);
