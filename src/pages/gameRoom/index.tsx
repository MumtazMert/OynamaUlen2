import { useGameRoom } from "./hooks/useGameRoom";
import { PlayersList } from "../../components/playerList";
import { WordsArea } from "../../components/wordsArea";
import { WordInput } from "../../components/wordInput";

const GameRoom = () => {
  const {
    game,
    players,
    words,
    currentTurn,
    loading,
    newWord,
    setNewWord,
    error,
    isMyTurn,
    messagesEndRef,
    startGame,
    submitWord,
    getPlayerInfo,
    user,
  } = useGameRoom();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!game) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold text-red-600">Game not found</h2>
      </div>
    );
  }

  const inprogresscompletelabel =
    game.status === "in_progress" ? "In Progress" : "Completed";

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-6rem)] gap-4">
      <PlayersList
        players={players}
        currentTurn={currentTurn}
        game={game}
        userId={user?.id}
      />
      <div className="flex-1 flex flex-col bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">{game.name}</h1>
            <div className="text-sm text-gray-600">
              Status:{" "}
              {game.status === "waiting"
                ? "Waiting to Start"
                : inprogresscompletelabel}
            </div>
          </div>
          {game.status === "waiting" && game.creator_id === user?.id && (
            <button
              onClick={startGame}
              disabled={players.length < 2}
              className={`mt-2 px-4 py-2 rounded-md ${
                players.length < 2
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600 text-white"
              }`}
            >
              {players.length < 2 ? "Need at least 2 players" : "Start Game"}
            </button>
          )}
          {game.status === "completed" && (
            <div className="mt-2 p-2 bg-yellow-100 text-yellow-800 rounded-md">
              Game completed! Winner: {getPlayerInfo(game.winner_id || "").name}
            </div>
          )}
        </div>
        <WordsArea
          game={game}
          words={words}
          getPlayerInfo={getPlayerInfo}
          messagesEndRef={messagesEndRef}
        />
        <WordInput
          game={game}
          words={words}
          newWord={newWord}
          setNewWord={setNewWord}
          error={error}
          isMyTurn={isMyTurn}
          currentTurn={currentTurn}
          userId={user?.id || ""}
          onSubmit={submitWord}
          getPlayerInfo={getPlayerInfo}
        />
      </div>
    </div>
  );
};

export default GameRoom;
