import { motion } from "framer-motion";

export default function QuestionCard({ question, showTimerSlot = false, children }) {
	if (!question) return null;

	return (
		<motion.div
			key={question._id}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="w-full bg-white rounded-3xl shadow-xl p-8 md:p-10 mb-8 relative overflow-hidden"
		>
			<div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-violet-500 to-fuchsia-500" />

			<div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
				<h2 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight flex-1">
					{question.text}
				</h2>

				{showTimerSlot && (
					<div className="flex-shrink-0 flex items-center justify-center">
						{children}
					</div>
				)}
			</div>
		</motion.div>
	);
}

