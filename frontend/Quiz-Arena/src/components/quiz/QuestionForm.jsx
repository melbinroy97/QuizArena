export default function QuestionForm({
  index,
  question,
  updateQuestion,
  removeQuestion,
}) {
  const updateField = (field, value) => {
    updateQuestion(index, { ...question, [field]: value });
  };

  return (
    <div className="border p-4 rounded mb-4 bg-gray-50">
      <h4 className="font-semibold mb-2">
        Question {index + 1}
      </h4>

      <input
        type="text"
        placeholder="Question text"
        value={question.text}
        onChange={(e) => updateField("text", e.target.value)}
        className="w-full p-2 border rounded mb-2"
      />

      {question.options.map((opt, i) => (
        <input
          key={i}
          type="text"
          placeholder={`Option ${i + 1}`}
          value={opt}
          onChange={(e) => {
            const newOpts = [...question.options];
            newOpts[i] = e.target.value;
            updateField("options", newOpts);
          }}
          className="w-full p-2 border rounded mb-2"
        />
      ))}

      <select
        value={question.correctIndex}
        onChange={(e) =>
          updateField("correctIndex", Number(e.target.value))
        }
        className="w-full p-2 border rounded mb-2"
      >
        {question.options.map((_, i) => (
          <option key={i} value={i}>
            Correct Option {i + 1}
          </option>
        ))}
      </select>

      <input
        type="number"
        min={5}
        placeholder="Time limit (seconds)"
        value={question.timeLimit}
        onChange={(e) =>
          updateField("timeLimit", Number(e.target.value))
        }
        className="w-full p-2 border rounded mb-2"
      />

      <button
        onClick={() => removeQuestion(index)}
        className="text-red-600 text-sm"
      >
        Remove Question
      </button>
    </div>
  );
}
