import { motion } from 'framer-motion'
import { emojiForCluster } from '../constants/clusterEmojis'

function ResultCard({ result }) {
  const confidencePercent = Math.max(0, Math.min(100, Math.round(result.confidence * 100)))

  return (
    <motion.section
      initial={{ opacity: 0, y: 20, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="space-y-5 rounded-2xl border border-white/10 bg-skillmap-card p-6 shadow-2xl"
    >
      <div className="flex items-center gap-3">
        <span className="text-3xl" aria-hidden="true">
          {emojiForCluster(result.cluster_name)}
        </span>
        <div>
          <p className="text-sm text-skillmap-muted">Predicted Cluster</p>
          <h2 className="font-display text-2xl text-skillmap-text">{result.cluster_name}</h2>
        </div>
      </div>

      <div>
        <div className="mb-2 flex justify-between text-sm text-skillmap-muted">
          <span>Confidence</span>
          <span className="font-mono text-skillmap-text">{confidencePercent}%</span>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-white/10">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${confidencePercent}%` }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="h-full rounded-full bg-gradient-to-r from-skillmap-accent to-emerald-300"
          />
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm text-skillmap-muted">Top Keywords</p>
        <div className="flex flex-wrap gap-2">
          {result.top_terms?.length ? (
            result.top_terms.map((term) => (
              <span
                key={term}
                className="rounded-full border border-skillmap-accent/40 bg-skillmap-accent/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-skillmap-text"
              >
                {term}
              </span>
            ))
          ) : (
            <span className="text-sm text-skillmap-muted">No high-signal terms found.</span>
          )}
        </div>
      </div>
    </motion.section>
  )
}

export default ResultCard
