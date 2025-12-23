import { motion, AnimatePresence } from "framer-motion";
export default function ParticipantList({ participants = [], leftMessage }) {
	return (
		<div className="w-full bg-white/50 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-lg min-h-[260px]">
			<div className="flex items-center justify-between mb-6">
				<div className="flex items-center gap-2">
					<span className="w-5 h-5 text-violet-500 text-lg">👥</span>
					<h2 className="text-xl font-bold text-gray-900">
						Players ({participants.length})
					</h2>
				</div>
				{leftMessage && (
					<motion.div
						initial={{ opacity: 0, x: 20 }}
						animate={{ opacity: 1, x: 0 }}
						className="text-red-500 bg-red-50 px-4 py-1 rounded-full text-sm font-medium"
					>
						{leftMessage}
					</motion.div>
				)}
			</div>

			<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
				<AnimatePresence>
					{participants.map((p) => {
						const name = p.username || p.fullName || "Player";
						return (
							<motion.div
								key={p.userId || name}
								initial={{ scale: 0, opacity: 0 }}
								animate={{ scale: 1, opacity: 1 }}
								exit={{ scale: 0, opacity: 0 }}
								className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-3"
							>
								<div className="w-10 h-10 bg-gradient-to-br from-violet-100 to-fuchsia-100 rounded-full flex items-center justify-center text-violet-600 font-bold">
									{name[0].toUpperCase()}
								</div>
								<span className="font-medium text-gray-700 truncate">{name}</span>
							</motion.div>
						);
					})}
				</AnimatePresence>

				{participants.length === 0 && (
					<div className="col-span-full text-center py-10 text-gray-400">
						Waiting for players to join...
					</div>
				)}
			</div>
		</div>
	);
}
