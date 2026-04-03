import { useState } from 'react'
import ResultCard from '../components/ResultCard'
import { analyzeResume } from '../services/api'

function HomePage() {
  const [resumeText, setResumeText] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const onAnalyze = async () => {
    setError('')
    setResult(null)

    if (!resumeText.trim()) {
      setError('Please paste resume text before running analysis.')
      return
    }

    try {
      setLoading(true)
      const prediction = await analyzeResume(resumeText)
      setResult(prediction)
    } catch (err) {
      const apiError = err?.response?.data?.error
      setError(apiError || 'Unable to analyze resume. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto w-full max-w-6xl px-4 pb-12 pt-8 md:px-8">
      <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-skillmap-card p-6 md:p-10">
        <div className="absolute -left-16 -top-16 h-48 w-48 rounded-full bg-skillmap-accent/20 blur-3xl" />
        <div className="absolute -bottom-20 right-0 h-60 w-60 rounded-full bg-amber-300/10 blur-3xl" />

        <div className="relative z-10 space-y-6">
          <div className="space-y-2">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-skillmap-muted">
              Student Skill Profile Clustering
            </p>
            <h1 className="font-display text-4xl leading-tight text-skillmap-text md:text-5xl">
              SkillMap
            </h1>
            <p className="max-w-2xl text-lg text-skillmap-muted">
              Discover Your Professional Cluster
            </p>
          </div>

          <div className="space-y-4">
            <textarea
              value={resumeText}
              onChange={(event) => setResumeText(event.target.value)}
              placeholder="Paste your resume text here to identify your best-fit professional cluster..."
              className="min-h-56 w-full rounded-2xl border border-white/10 bg-[#101010] p-4 text-sm text-skillmap-text outline-none transition focus:border-skillmap-accent focus:ring-2 focus:ring-skillmap-accent/40"
            />

            <button
              type="button"
              onClick={onAnalyze}
              disabled={loading}
              className="rounded-full bg-skillmap-accent px-8 py-3 font-semibold text-[#06211f] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Analyzing...' : 'Analyze Resume'}
            </button>
          </div>

          {error ? <p className="text-sm text-rose-300">{error}</p> : null}
        </div>
      </section>

      <section className="mt-8">
        {result ? <ResultCard result={result} /> : null}
      </section>
    </main>
  )
}

export default HomePage
