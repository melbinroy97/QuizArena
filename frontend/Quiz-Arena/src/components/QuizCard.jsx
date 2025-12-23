import { Play, Trash2, Clock, HelpCircle } from "lucide-react";

export default function QuizCard({ quiz, onHost, onDelete }) {
  const totalTime = quiz.questions?.reduce((acc, q) => acc + (q.timeLimit || 0), 0) || 0;
  const durationMins = Math.ceil(totalTime / 60);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col h-full hover:shadow-md transition-all duration-200">
      <div className="flex-1 mb-6">
        {quiz.title && (
           <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
             {quiz.title}
           </h3>
        )}
        <p className="text-gray-500 text-sm line-clamp-2">
          {quiz.description || "No description provided."}
        </p>
      </div>

      <div className="space-y-6">
        <div className="flex items-center gap-6 text-gray-500 text-sm">
          <div className="flex items-center gap-2">
            <HelpCircle size={18} />
            <span>{quiz.questions?.length || 0} Qs</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock size={18} />
            <span>{durationMins}m</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onHost}
            className="flex-1 h-10 flex items-center justify-center gap-2 rounded-lg bg-gray-100 text-gray-900 font-medium hover:bg-gray-200 transition-colors"
          >
            <Play size={16} className="fill-current" />
            Host
          </button>
          {onDelete && (
            <button
              onClick={onDelete}
              className="h-10 w-10 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:border-red-500 hover:text-red-500 hover:bg-red-50 transition-all"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
