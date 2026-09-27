import { useEffect, useState } from 'react'
import { Link, NavLink, Route, Routes } from 'react-router-dom'
import octofitLogo from '../../../docs/octofitapp-small.png'
import './App.css'

const sections = [
  { path: '/activities', label: 'Activities', title: 'Activity log' },
  { path: '/teams', label: 'Teams', title: 'Your teams' },
  { path: '/leaderboard', label: 'Leaderboard', title: 'Leaderboard' },
  { path: '/workouts', label: 'Workouts', title: 'Workout ideas' },
]

function App() {
  const [serviceStatus, setServiceStatus] = useState({ api: 'checking', database: 'checking' })

  useEffect(() => {
    let active = true

    fetch('/api/health')
      .then((response) => {
        if (!response.ok) throw new Error('API unavailable')
        return response.json()
      })
      .then((health) => {
        if (active) setServiceStatus({ api: 'online', database: health.database })
      })
      .catch(() => {
        if (active) setServiceStatus({ api: 'offline', database: 'unavailable' })
      })

    return () => {
      active = false
    }
  }, [])

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link className="brand" to="/" aria-label="OctoFit Tracker home">
          <img src={octofitLogo} alt="" />
          <span>OctoFit <strong>Tracker</strong></span>
        </Link>

        <div className="nav-caption">TRAINING</div>
        <nav className="app-nav" aria-label="Main navigation">
          <NavLink end to="/" className={({ isActive }) => `app-nav-link${isActive ? ' active' : ''}`}>
            <span className="nav-mark" aria-hidden="true">◫</span> Overview
          </NavLink>
          {sections.map((section, index) => (
            <NavLink key={section.path} to={section.path} className={({ isActive }) => `app-nav-link${isActive ? ' active' : ''}`}>
              <span className="nav-mark" aria-hidden="true">{['↗', '◎', '≋', '✳'][index]}</span> {section.label}
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <span className="avatar-mark">OF</span>
          <div><strong>OctoFit member</strong><span>Personal account</span></div>
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <span className="today-label">TRAINING OVERVIEW</span>
          <div className="service-status" aria-label="Service status">
            <span className={`status-dot ${serviceStatus.api}`} />
            <span>API {serviceStatus.api}</span>
            <span className="status-divider" />
            <span className={`status-dot ${serviceStatus.database === 'connected' ? 'online' : 'checking'}`} />
            <span>MongoDB {serviceStatus.database}</span>
          </div>
        </header>

        <div className="content-wrap">
          <Routes>
            <Route path="/" element={<Overview />} />
            {sections.map((section) => (
              <Route key={section.path} path={section.path} element={<SectionPage title={section.title} />} />
            ))}
            <Route path="*" element={<SectionPage title="Page not found" />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

function Overview() {
  return (
    <>
      <section className="welcome-row">
        <div>
          <p className="eyebrow">YOUR TRAINING SPACE</p>
          <h1>Move with <em>purpose.</em></h1>
          <p className="welcome-copy">A clear view of your activity, your team, and what comes next.</p>
        </div>
        <Link to="/activities" className="btn btn-dark log-button">Log activity <span aria-hidden="true">↗</span></Link>
      </section>

      <section className="metrics-grid" aria-label="Activity summary">
        <article className="metric-block">
          <div className="metric-head"><span>THIS WEEK</span><span className="metric-symbol green">↗</span></div>
          <strong className="metric-value">0 <small>min</small></strong>
          <p>Active time</p>
          <div className="metric-rule"><span className="rule-green" /></div>
        </article>
        <article className="metric-block">
          <div className="metric-head"><span>TEAM POINTS</span><span className="metric-symbol coral">✳</span></div>
          <strong className="metric-value">0</strong>
          <p>Points earned</p>
          <div className="metric-rule"><span className="rule-coral" /></div>
        </article>
        <article className="metric-block">
          <div className="metric-head"><span>SESSIONS</span><span className="metric-symbol blue">◷</span></div>
          <strong className="metric-value">0</strong>
          <p>Workouts logged</p>
          <div className="metric-rule"><span className="rule-blue" /></div>
        </article>
      </section>

      <section className="activity-section">
        <div className="section-heading">
          <div><p className="eyebrow">RECENT MOVEMENT</p><h2>Activity</h2></div>
          <Link to="/activities" className="text-link">View activity <span aria-hidden="true">→</span></Link>
        </div>
        <div className="empty-state">
          <span className="empty-icon" aria-hidden="true">↗</span>
          <div><strong>Your activity will appear here</strong><p>Nothing logged this week.</p></div>
          <Link to="/activities" className="btn btn-outline-dark btn-sm">Open activity log</Link>
        </div>
      </section>
    </>
  )
}

function SectionPage({ title }) {
  return (
    <section className="section-page">
      <p className="eyebrow">OCTOFIT TRACKER</p>
      <h1>{title}</h1>
      <div className="empty-state section-empty">
        <span className="empty-icon" aria-hidden="true">＋</span>
        <div><strong>No entries yet</strong><p>This space is ready for your OctoFit data.</p></div>
      </div>
    </section>
  )
}

export default App
