import { motion } from 'motion/react';
import { FileText } from 'lucide-react';

export function DocumentSwapAnimation() {
  return (
    <div className="relative w-96 h-96 flex items-center justify-center">
      {/* First Document - moves in circular path */}
      <motion.div
        className="absolute"
        animate={{
          x: [0, 100, 100, 0, -100, -100, 0],
          y: [0, -100, -100, 0, -100, -100, 0],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="bg-white p-10 rounded-xl shadow-xl border-2 border-orange-200">
          <FileText className="text-orange-600" size={80} />
        </div>
      </motion.div>

      {/* Second Document - moves in opposite circular path */}
      <motion.div
        className="absolute"
        animate={{
          x: [0, -100, -100, 0, 100, 100, 0],
          y: [0, 100, 100, 0, 100, 100, 0],
          rotate: [0, -180, -360],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <div className="bg-white p-10 rounded-xl shadow-xl border-2 border-orange-600">
          <FileText className="text-orange-600" size={80} />
        </div>
      </motion.div>

      {/* Center Circle for visual reference */}
      <div className="absolute w-3 h-3 bg-orange-300 rounded-full opacity-50"></div>
    </div>
  );
}
