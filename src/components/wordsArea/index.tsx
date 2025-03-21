import type { WordsAreaProps } from "../../types";

export const WordsArea: React.FC<WordsAreaProps> = ({
  game,
  words,
  getPlayerInfo,
  messagesEndRef,
}) => (
  <div className="flex-1 p-4 overflow-y-auto">
    {words.length === 0 ? (
      <div className="text-center py-10 text-gray-500">
        {game?.status === "waiting"
          ? "Waiting for the game to start..."
          : "The game has started. Submit the first word!"}
      </div>
    ) : (
      <div className="space-y-2">
        {words.map((word) => (
          <div key={word.id} className="flex items-start gap-2">
            <div
              className="w-4 h-4 mt-1 rounded-full flex-shrink-0"
              style={{ backgroundColor: getPlayerInfo(word.user_id).color }}
            ></div>
            <div>
              <div className="text-sm text-gray-600">
                {getPlayerInfo(word.user_id).name}:
              </div>
              <div className="text-lg font-medium">{word.word}</div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    )}
  </div>
);
