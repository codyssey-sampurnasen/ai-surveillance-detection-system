// import { useState } from 'react'
// import Topbar from '../components/Topbar.jsx'
// import Bottombar from '../components/Bottombar.jsx'
// import DashboardLayout from '../components/DashboardLayout.jsx'
// import './Page.css'

// const IDLE = {
//   aiStatus: 'IDLE', threatLevel: 'LOW',
//   detections: [], incidents: [], insights: null,
//   cpu: 18, gpu: 32,
// }

// const ACTIVE = {
//   aiStatus: 'ACTIVE', threatLevel: 'MEDIUM',
//   detections: [
//     { label: 'Physical Altercation', confidence: 92 },
//     { label: 'Aggressive Posture',   confidence: 76 },
//     { label: 'Crowd Formation',      confidence: 55 },
//   ],
//   incidents: [
//     { type: 'Altercation — Zone B', time: '00:00:08', severity: 'high' },
//     { type: 'Aggressive Behavior',  time: '00:00:22', severity: 'medium' },
//     { type: 'Group Gathering',      time: '00:00:37', severity: 'low' },
//     { type: 'Motion Anomaly',       time: '00:00:51', severity: 'medium' },
//   ],
//   insights: 'Physical altercation pattern detected. Pose estimation indicates aggressive behavior. Flagging for review.',
//   cpu: 61, gpu: 78,
// }

// const STATS_IDLE = [
//   { label: 'FRAMES',  value: '0', color: 'var(--text-muted)' },
//   { label: 'PERSONS', value: '0', color: 'var(--text-muted)' },
//   { label: 'ALERTS',  value: '0', color: 'var(--text-muted)' },
//   { label: 'FPS',     value: '—', color: 'var(--text-muted)' },
// ]
// const STATS_ACTIVE = [
//   { label: 'FRAMES',  value: '2,091', color: 'var(--accent-blue)' },
//   { label: 'PERSONS', value: '5',     color: 'var(--accent-yellow)' },
//   { label: 'ALERTS',  value: '3',     color: 'var(--accent-yellow)' },
//   { label: 'FPS',     value: '30.0',  color: 'var(--accent-green)' },
// ]

// export default function FightDetection() {
//   const [monitoring, setMonitoring] = useState(false)
//   const [state, setState]           = useState(IDLE)

//   const toggle = () => {
//     setMonitoring(m => !m)
//     setState(s => (s === IDLE ? ACTIVE : IDLE))
//   }

//   return (
//     <div className="page-root">
//       <Topbar cpu={state.cpu} gpu={state.gpu} />
//       <DashboardLayout
//         accentColor="yellow"
//         detections={state.detections}
//         incidents={state.incidents}
//         monitoring={monitoring}
//         aiStatus={state.aiStatus}
//         threatLevel={state.threatLevel}
//         insights={state.insights}
//         stats={monitoring ? STATS_ACTIVE : STATS_IDLE}
//       />
//       <Bottombar onStartMonitoring={toggle} monitoring={monitoring} />
//     </div>
//   )
// }

import { useState, useRef } from 'react'
import Topbar from '../components/Topbar.jsx'
import Bottombar from '../components/Bottombar.jsx'
import DashboardLayout from '../components/DashboardLayout.jsx'
import './Page.css'

const IDLE_STATE = {
  aiStatus: 'IDLE', threatLevel: 'LOW',
  detections: [], incidents: [], insights: null,
  cpu: 18, gpu: 32,
}

function buildStats(result) {
  const weaponCount = result?.weapons?.count ?? 0
  const alertCount  = (result?.violence?.detected ? 1 : 0) + weaponCount
  return [
    { label: 'FRAMES',  value: '—',                                    color: 'var(--accent-blue)' },
    { label: 'PERSONS', value: '—',                                    color: 'var(--accent-yellow)' },
    { label: 'ALERTS',  value: String(alertCount),                     color: alertCount > 0 ? 'var(--accent-red)' : 'var(--accent-green)' },
    { label: 'FPS',     value: '—',                                    color: 'var(--text-muted)' },
  ]
}

const STATS_IDLE = [
  { label: 'FRAMES',  value: '0', color: 'var(--text-muted)' },
  { label: 'PERSONS', value: '0', color: 'var(--text-muted)' },
  { label: 'ALERTS',  value: '0', color: 'var(--text-muted)' },
  { label: 'FPS',     value: '—', color: 'var(--text-muted)' },
]

export default function FightDetection() {
  const [monitoring, setMonitoring] = useState(false)
  const [state, setState]           = useState(IDLE_STATE)
  const [stats, setStats]           = useState(STATS_IDLE)
  const [loading, setLoading]       = useState(false)
  const [error, setError]           = useState(null)
  const fileRef                     = useRef(null) // holds the last uploaded File

  // Called by DashboardLayout's UploadZone when user picks a file
  const handleFile = (file) => {
    fileRef.current = file
    // Reset to idle until they hit Start Monitoring
    setState(IDLE_STATE)
    setStats(STATS_IDLE)
    setError(null)
  }

  const startAnalysis = async () => {
    const file = fileRef.current
    if (!file) {
      setError('Please upload a video first.')
      return
    }

    setLoading(true)
    setError(null)
    setMonitoring(true)
    setState(s => ({ ...s, aiStatus: 'SCANNING', threatLevel: 'MEDIUM' }))

    try {
      const form = new FormData()
      form.append('file', file)

      const isVideo = file.type.startsWith('video/')
      const endpoint = isVideo ? '/analyze/video' : '/analyze/image'

      const res = await fetch(endpoint, { method: 'POST', body: form })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.detail || `Server error ${res.status}`)
      }

      const result = await res.json()

      // ── Build detections list ──────────────────────────────────────────────
      const detections = []
      if (result.violence?.detected) {
        detections.push({
          label:      'Violence / Fight Detected',
          confidence: Math.round(result.violence.confidence * 100),
        })
      }
      result.weapons?.detections?.forEach(w => {
        detections.push({
          label:      w.class,
          confidence: Math.round(w.confidence * 100),
        })
      })

      // ── Build incidents list ───────────────────────────────────────────────
      const incidents = []
      if (result.violence?.detected) {
        incidents.push({
          type:     `Fight — ${result.violence.label}`,
          time:     new Date().toLocaleTimeString(),
          severity: result.violence.confidence > 0.8 ? 'high' : 'medium',
        })
      }
      result.weapons?.detections?.forEach(w => {
        incidents.push({
          type:     `Weapon: ${w.class}`,
          time:     new Date().toLocaleTimeString(),
          severity: 'high',
        })
      })

      // ── Threat level ──────────────────────────────────────────────────────
      const threatLevel = result.alert
        ? (result.violence?.confidence > 0.8 || result.weapons?.count > 0 ? 'HIGH' : 'MEDIUM')
        : 'LOW'

      // ── AI Insights text ──────────────────────────────────────────────────
      let insights = null
      if (result.alert) {
        const parts = []
        if (result.violence?.detected)
          parts.push(`Fight/violence detected with ${Math.round(result.violence.confidence * 100)}% confidence.`)
        if (result.weapons?.detected)
          parts.push(`${result.weapons.count} weapon(s) identified: ${result.weapons.detections.map(w => w.class).join(', ')}.`)
        parts.push('Flagging for immediate review.')
        insights = parts.join(' ')
      } else {
        insights = 'No violence or weapons detected. Scene appears safe.'
      }

      setState({
        aiStatus:    'ACTIVE',
        threatLevel,
        detections,
        incidents,
        insights,
        cpu: 65,
        gpu: 80,
      })
      setStats(buildStats(result))

    } catch (e) {
      setError(e.message)
      setState(s => ({ ...s, aiStatus: 'ERROR', threatLevel: 'LOW' }))
    } finally {
      setLoading(false)
    }
  }

  const stopMonitoring = () => {
    setMonitoring(false)
    setState(IDLE_STATE)
    setStats(STATS_IDLE)
    setError(null)
    fileRef.current = null
  }

  const toggle = () => {
    if (monitoring) {
      stopMonitoring()
    } else {
      startAnalysis()
    }
  }

  return (
    <div className="page-root">
      <Topbar cpu={state.cpu} gpu={state.gpu} />

      {/* Loading overlay */}
      {loading && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          zIndex: 999, color: '#ffb800', fontFamily: 'Share Tech Mono, monospace',
          gap: '1rem',
        }}>
          <div style={{ fontSize: '1.1rem', letterSpacing: '0.15em' }}>
            ⟳ ANALYZING…
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>
            Running violence & weapon detection models
          </div>
        </div>
      )}

      {/* Error banner */}
      {error && (
        <div style={{
          background: 'rgba(255,59,59,0.15)', border: '1px solid rgba(255,59,59,0.4)',
          color: '#ff3b3b', padding: '0.5rem 1.5rem',
          fontSize: '0.78rem', fontFamily: 'Share Tech Mono, monospace',
          textAlign: 'center',
        }}>
          ⚠ {error}
        </div>
      )}

      <DashboardLayout
        accentColor="yellow"
        detections={state.detections}
        incidents={state.incidents}
        monitoring={monitoring}
        aiStatus={loading ? 'SCANNING…' : state.aiStatus}
        threatLevel={state.threatLevel}
        insights={state.insights}
        stats={stats}
        onFile={handleFile}
      />
      <Bottombar onStartMonitoring={toggle} monitoring={monitoring} />
    </div>
  )
}