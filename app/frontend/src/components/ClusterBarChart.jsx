import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

function ClusterBarChart({ clusters }) {
  return (
    <section className="rounded-2xl border border-white/10 bg-skillmap-card p-4 md:p-6">
      <h2 className="mb-5 font-display text-xl text-skillmap-text">Cluster Size Overview</h2>
      <div className="h-80 w-full">
        <ResponsiveContainer>
          <BarChart data={clusters} margin={{ top: 8, right: 24, left: 8, bottom: 40 }}>
            <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.08)" />
            <XAxis
              dataKey="name"
              angle={-20}
              textAnchor="end"
              interval={0}
              height={70}
              tick={{ fill: '#9db5b3', fontSize: 11 }}
            />
            <YAxis tick={{ fill: '#9db5b3', fontSize: 11 }} />
            <Tooltip
              cursor={{ fill: 'rgba(255,255,255,0.04)' }}
              contentStyle={{
                background: '#111315',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '0.75rem',
                color: '#e6f5f4',
              }}
            />
            <Bar dataKey="size" radius={[8, 8, 0, 0]} fill="#39c5bb" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}

export default ClusterBarChart
