import { useEffect, useState } from 'react'
import ClusterBarChart from '../components/ClusterBarChart'
import { emojiForCluster } from '../constants/clusterEmojis'
import { fetchClusters } from '../services/api'

function ClustersPage() {
  const [clusters, setClusters] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadClusters = async () => {
      try {
        const data = await fetchClusters()
        setClusters(data.clusters || [])
      } catch {
        setError('Could not load cluster dashboard.')
      } finally {
        setLoading(false)
      }
    }

    loadClusters()
  }, [])

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-12 pt-8 md:px-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl text-skillmap-text md:text-4xl">Clusters Dashboard</h1>
        <p className="mt-2 text-skillmap-muted">Explore all 8 professional cluster profiles.</p>
      </div>

      {loading ? <p className="text-skillmap-muted">Loading clusters...</p> : null}
      {error ? <p className="text-rose-300">{error}</p> : null}

      {!loading && !error ? (
        <>
          <div className="grid gap-4 md:grid-cols-2">
            {clusters.map((cluster) => (
              <article
                key={cluster.id}
                className="rounded-2xl border border-white/10 bg-skillmap-card p-5 transition hover:border-skillmap-accent/40"
              >
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="font-display text-xl text-skillmap-text">
                    <span className="mr-2" aria-hidden="true">
                      {emojiForCluster(cluster.name)}
                    </span>
                    {cluster.name}
                  </h2>
                  <span className="rounded-full bg-white/5 px-3 py-1 font-mono text-xs text-skillmap-muted">
                    {cluster.size} profiles
                  </span>
                </div>

                <div className="flex flex-wrap gap-2">
                  {(cluster.key_terms || []).map((term) => (
                    <span
                      key={`${cluster.id}-${term}`}
                      className="rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs text-skillmap-muted"
                    >
                      {term}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>

          <div className="mt-8">
            <ClusterBarChart clusters={clusters} />
          </div>
        </>
      ) : null}
    </main>
  )
}

export default ClustersPage
