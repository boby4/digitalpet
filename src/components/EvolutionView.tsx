import { motion, AnimatePresence } from 'framer-motion';
import { usePetStore } from '../store/petStore';

export default function EvolutionView() {
  const showEvolution = usePetStore((s) => s.showEvolution);
  const evolvingTo = usePetStore((s) => s.evolvingTo);
  const dismissEvolution = usePetStore((s) => s.dismissEvolution);
  const currentEvolution = usePetStore((s) => s.currentEvolution);

  return (
    <AnimatePresence>
      {showEvolution && evolvingTo && (
        <motion.div
          className="evolution-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={dismissEvolution}
        >
          <motion.div
            className="evolution-card"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 20 }}
          >
            <motion.div
              className="evolution-glow"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.6, 1, 0.6],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            />

            <div className="evolution-content">
              <motion.div
                className="evolution-sparkle"
                animate={{ rotate: 360 }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
              >
                ✨
              </motion.div>

              <h2 className="evolution-title">进化！</h2>

              <div className="evolution-chain">
                <span className="evolution-from">
                  {currentEvolution.emoji} {currentEvolution.name}
                </span>
                <motion.span
                  className="evolution-arrow"
                  animate={{ x: [0, 8, 0] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  →
                </motion.span>
                <span className="evolution-to">
                  {evolvingTo.emoji} {evolvingTo.name}
                </span>
              </div>

              <p className="evolution-level">Level {evolvingTo.level}</p>

              <button className="evolution-dismiss-btn" onClick={dismissEvolution}>
                太棒了！
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
