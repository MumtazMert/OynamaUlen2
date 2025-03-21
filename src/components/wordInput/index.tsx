import type { WordInputProps } from "../../types";

export const WordInput: React.FC<WordInputProps> = ({
  game,
  words,
  newWord,
  setNewWord,
  error,
  isMyTurn,
  currentTurn,
  userId,
  onSubmit,
  getPlayerInfo,
}) => (
  <div className="p-4 border-t">
    {game?.status === "in_progress" ? (
      <form onSubmit={onSubmit} className="flex flex-col">
        {error && (
          <div className="mb-2 p-2 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}
        <div className="flex gap-2">
          <input
            type="text"
            value={newWord}
            onChange={(e) => setNewWord(e.target.value)}
            disabled={!isMyTurn || userId !== currentTurn}
            placeholder={
              isMyTurn ? "Enter a word..." : "Waiting for your turn..."
            }
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={!isMyTurn || !newWord.trim()}
            className={`px-4 py-2 rounded-md ${
              !isMyTurn || !newWord.trim()
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            Submit
          </button>
        </div>
        {words.length > 0 && (
          <div className="mt-2 text-sm text-gray-600">
            Your word must start with the letter "
            <span className="font-bold">
              {
                words[words.length - 1].word[
                  words[words.length - 1].word.length - 1
                ]
              }
            </span>
            "
          </div>
        )}
      </form>
    ) : game?.status === "waiting" ? (
      <div className="text-center py-2 text-gray-600">
        Waiting for the game to start...
      </div>
    ) : (
      <div className="text-center py-2 text-gray-600">
        Game has ended. Winner: {getPlayerInfo(game?.winner_id || "").name}
      </div>
    )}
  </div>
);
