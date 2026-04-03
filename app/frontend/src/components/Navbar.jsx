import { NavLink } from 'react-router-dom'

const linkClasses = ({ isActive }) =>
  [
    'rounded-full px-4 py-2 text-sm font-medium tracking-wide transition-all duration-200',
    isActive
      ? 'bg-skillmap-accent/20 text-skillmap-accent shadow-glow'
      : 'text-skillmap-muted hover:bg-white/5 hover:text-skillmap-text',
  ].join(' ')

function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-skillmap-bg/90 backdrop-blur-md">
      <nav className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-4 md:px-8">
        <div className="font-display text-2xl font-bold tracking-tight text-skillmap-text">
          SkillMap
        </div>

        <div className="flex items-center gap-2">
          <NavLink to="/" className={linkClasses} end>
            Home
          </NavLink>
          <NavLink to="/clusters" className={linkClasses}>
            Clusters
          </NavLink>
        </div>
      </nav>
    </header>
  )
}

export default Navbar
