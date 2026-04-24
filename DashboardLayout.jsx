// import { useState, useEffect, useRef } from 'react'
// import { Upload, Zap, Eye, Maximize2 } from 'lucide-react'
// import './DashboardLayout.css'

// /* ── Animated Heatmap ───────────────────────────────────── */
// function Heatmap({ active, accentColor }) {
//   const canvasRef = useRef(null)
//   const rafRef    = useRef(null)
//   const timeRef   = useRef(0)

//   useEffect(() => {
//     const canvas = canvasRef.current
//     const ctx    = canvas.getContext('2d')

//     const draw = () => {
//       timeRef.current += 0.015
//       const t = timeRef.current
//       const w = canvas.width, h = canvas.height
//       ctx.clearRect(0, 0, w, h)

//       const blobs = [
//         { x: 0.35 + Math.sin(t * 0.7) * 0.08, y: 0.45 + Math.cos(t * 0.5) * 0.1,  r: 0.28, intensity: active ? 0.9 : 0.55 },
//         { x: 0.65 + Math.cos(t * 0.4) * 0.06, y: 0.40 + Math.sin(t * 0.6) * 0.08, r: 0.22, intensity: active ? 0.7 : 0.38 },
//         { x: 0.50 + Math.sin(t * 0.3) * 0.10, y: 0.60 + Math.cos(t * 0.8) * 0.05, r: 0.18, intensity: active ? 0.5 : 0.25 },
//       ]

//       blobs.forEach(({ x, y, r, intensity }) => {
//         const grd = ctx.createRadialGradient(x * w, y * h, 0, x * w, y * h, r * w)
//         if (accentColor === 'red') {
//           grd.addColorStop(0,   `rgba(255, 60, 60, ${intensity})`)
//           grd.addColorStop(0.4, `rgba(200, 80, 20, ${intensity * 0.55})`)
//         } else {
//           grd.addColorStop(0,   `rgba(255, 180, 0, ${intensity})`)
//           grd.addColorStop(0.4, `rgba(200, 100, 20, ${intensity * 0.55})`)
//         }
//         grd.addColorStop(1, 'rgba(0,0,0,0)')
//         ctx.fillStyle = grd
//         ctx.fillRect(0, 0, w, h)
//       })

//       rafRef.current = requestAnimationFrame(draw)
//     }

//     draw()
//     return () => cancelAnimationFrame(rafRef.current)
//   }, [active, accentColor])

//   return <canvas ref={canvasRef} width={480} height={140} className="heatmap-canvas" />
// }

// /* ── Radar ──────────────────────────────────────────────── */
// function Radar({ active, accentColor }) {
//   const canvasRef = useRef(null)
//   const rafRef    = useRef(null)
//   const angleRef  = useRef(0)

//   useEffect(() => {
//     const canvas = canvasRef.current
//     const ctx    = canvas.getContext('2d')
//     const cx = canvas.width / 2
//     const cy = canvas.height / 2
//     const R  = cx - 10

//     const blips = [
//       { angle: 45,  dist: 0.55, color: accentColor === 'red' ? '#ff3b3b' : '#ffb800' },
//       { angle: 160, dist: 0.35, color: '#1a6aff' },
//       { angle: 260, dist: 0.70, color: accentColor === 'red' ? '#ffb800' : '#ff3b3b' },
//     ]

//     const draw = () => {
//       ctx.clearRect(0, 0, canvas.width, canvas.height)

//       // grid rings
//       ctx.strokeStyle = 'rgba(30,61,95,0.55)'
//       ctx.lineWidth   = 0.8
//       ;[0.25, 0.5, 0.75, 1].forEach(r => {
//         ctx.beginPath()
//         ctx.arc(cx, cy, r * R, 0, Math.PI * 2)
//         ctx.stroke()
//       })

//       // crosshair
//       ctx.beginPath()
//       ctx.moveTo(cx, cy - R); ctx.lineTo(cx, cy + R)
//       ctx.moveTo(cx - R, cy); ctx.lineTo(cx + R, cy)
//       ctx.stroke()

//       // sweep (only when active)
//       if (active) {
//         angleRef.current += 0.025
//         const a  = angleRef.current
//         const x2 = cx + Math.cos(a) * R
//         const y2 = cy + Math.sin(a) * R
//         const ac = accentColor === 'red' ? 'rgba(255,59,59,' : 'rgba(255,184,0,'
//         const grd = ctx.createLinearGradient(cx, cy, x2, y2)
//         grd.addColorStop(0, ac + '0.28)')
//         grd.addColorStop(1, ac + '0.04)')
//         ctx.beginPath()
//         ctx.moveTo(cx, cy)
//         ctx.arc(cx, cy, R, a - 1.2, a)
//         ctx.closePath()
//         ctx.fillStyle = grd
//         ctx.fill()

//         ctx.beginPath()
//         ctx.moveTo(cx, cy)
//         ctx.lineTo(x2, y2)
//         ctx.strokeStyle = accentColor === 'red' ? 'rgba(255,59,59,0.85)' : 'rgba(255,184,0,0.85)'
//         ctx.lineWidth = 1.5
//         ctx.stroke()
//       }

//       // blips
//       blips.forEach(({ angle, dist, color }) => {
//         const rad = (angle * Math.PI) / 180
//         const bx  = cx + Math.cos(rad) * dist * R
//         const by  = cy + Math.sin(rad) * dist * R
//         ctx.beginPath()
//         ctx.arc(bx, by, 3, 0, Math.PI * 2)
//         ctx.fillStyle  = color
//         ctx.shadowBlur = 10
//         ctx.shadowColor = color
//         ctx.fill()
//         ctx.shadowBlur = 0
//       })

//       rafRef.current = requestAnimationFrame(draw)
//     }

//     draw()
//     return () => cancelAnimationFrame(rafRef.current)
//   }, [active, accentColor])

//   return <canvas ref={canvasRef} width={180} height={180} className="radar-canvas" />
// }

// /* ── Upload Zone ────────────────────────────────────────── */
// function UploadZone({ onFile, videoSrc, monitoring, accentColor }) {
//   const [dragging, setDragging] = useState(false)
//   const inputRef = useRef(null)

//   const handleDrop = (e) => {
//     e.preventDefault()
//     setDragging(false)
//     const file = e.dataTransfer.files[0]
//     if (file && file.type.startsWith('video/')) onFile(file)
//   }

//   return (
//     <div
//       className={[
//         'upload-zone',
//         dragging ? 'drag' : '',
//         monitoring ? `monitoring ${accentColor}` : '',
//       ].join(' ')}
//       onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
//       onDragLeave={() => setDragging(false)}
//       onDrop={handleDrop}
//       onClick={() => !videoSrc && inputRef.current?.click()}
//     >
//       <input
//         ref={inputRef}
//         type="file"
//         accept="video/*"
//         hidden
//         onChange={(e) => onFile(e.target.files[0])}
//       />

//       {videoSrc ? (
//         <video src={videoSrc} controls autoPlay muted loop className="video-preview" />
//       ) : (
//         <div className="upload-placeholder">
//           <div className="upload-icon-box">
//             <Upload size={26} />
//           </div>
//           <p className="upload-title">Upload Video for Analysis</p>
//           <p className="upload-sub">Drag &amp; drop or click to select • MP4, AVI, MOV</p>
//         </div>
//       )}

//       {monitoring && <div className="scan-line" />}
//     </div>
//   )
// }

// /* ── Incident row ───────────────────────────────────────── */
// function IncidentItem({ type, time, severity }) {
//   return (
//     <div className={`incident-item ${severity}`}>
//       <div className={`incident-dot ${severity}`} />
//       <div className="incident-info">
//         <span className="incident-type">{type}</span>
//         <span className="incident-time">{time}</span>
//       </div>
//       <span className={`incident-badge ${severity}`}>{severity.toUpperCase()}</span>
//     </div>
//   )
// }

// /* ── Main Dashboard ─────────────────────────────────────── */
// export default function DashboardLayout({
//   accentColor,   // 'red' | 'yellow'
//   detections,    // [{ label, confidence }]
//   incidents,     // [{ type, time, severity }]
//   monitoring,
//   aiStatus,
//   threatLevel,
//   insights,
//   stats,         // [{ label, value, color }]
// }) {
//   const [videoSrc, setVideoSrc] = useState(null)
//   const [timer, setTimer]       = useState(0)

//   useEffect(() => {
//     let t
//     if (monitoring) t = setInterval(() => setTimer(s => s + 1), 1000)
//     else setTimer(0)
//     return () => clearInterval(t)
//   }, [monitoring])

//   const fmtTimer = (s) => {
//     const h   = String(Math.floor(s / 3600)).padStart(2, '0')
//     const m   = String(Math.floor((s % 3600) / 60)).padStart(2, '0')
//     const sec = String(s % 60).padStart(2, '0')
//     return `${h}:${m}:${sec}`
//   }

//   const accentVar = accentColor === 'red' ? 'var(--accent-red)' : 'var(--accent-yellow)'

//   return (
//     <div className="dash-grid">

//       {/* ── LEFT: Video Analysis ── */}
//       <div className="dash-panel">
//         <div className="panel-header">
//           <span className="panel-title">VIDEO ANALYSIS</span>
//           <span className={`panel-timer ${monitoring ? 'active' : ''}`}>
//             {fmtTimer(timer)}
//           </span>
//         </div>

//         <UploadZone
//           onFile={(file) => setVideoSrc(URL.createObjectURL(file))}
//           videoSrc={videoSrc}
//           monitoring={monitoring}
//           accentColor={accentColor}
//         />

//         {/* Stats row */}
//         <div className="vstats">
//           {stats.map((s, i) => (
//             <div key={i} className="vstat">
//               <span className="vstat-label">{s.label}</span>
//               <span className="vstat-value" style={{ color: s.color }}>{s.value}</span>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* ── MIDDLE: AI Insights ── */}
//       <div className="dash-panel">
//         <div className="panel-header">
//           <span className="panel-title">AI INSIGHTS</span>
//           <span className={`ai-pill ${monitoring ? 'active' : ''}`}>●</span>
//         </div>

//         <div className="ai-meta">
//           <div className="ai-meta-row">
//             <span className="ai-meta-key">AI STATUS:</span>
//             <span className={`ai-meta-val ${monitoring ? 'green' : ''}`}>{aiStatus}</span>
//           </div>
//           <div className="ai-meta-row">
//             <span className="ai-meta-key">Threat Level:</span>
//             <span className={`ai-meta-val threat-${threatLevel.toLowerCase()}`}>{threatLevel}</span>
//           </div>
//         </div>

//         <span className="heatmap-label">HEATMAP</span>
//         <Heatmap active={monitoring} accentColor={accentColor} />

//         <div className="sub-header">
//           <Zap size={13} style={{ color: accentVar }} />
//           <span className="sub-title">Active Detections</span>
//         </div>

//         <div className="detections-list">
//           {detections.length === 0 ? (
//             <p className="no-data">No activity detected</p>
//           ) : (
//             detections.map((d, i) => (
//               <div key={i} className="det-item">
//                 <div
//                   className="det-bar"
//                   style={{ width: `${d.confidence}%`, background: accentVar }}
//                 />
//                 <span className="det-label">{d.label}</span>
//                 <span className="det-conf">{d.confidence}%</span>
//               </div>
//             ))
//           )}
//         </div>

//         <div className="panel-header" style={{ marginTop: 'auto' }}>
//           <span className="panel-title">AI INSIGHTS</span>
//           <Eye size={13} style={{ color: 'var(--text-secondary)' }} />
//         </div>
//         <div className="insights-text">
//           {insights ?? <span className="no-data">No detections yet</span>}
//         </div>
//       </div>

//       {/* ── RIGHT: Incident Timeline ── */}
//       <div className="dash-panel">
//         <div className="panel-header">
//           <span className="panel-title">INCIDENT TIMELINE</span>
//           <Maximize2 size={12} style={{ color: 'var(--text-secondary)' }} />
//         </div>

//         <div className="sev-legend">
//           <span className="sev low">LOW</span>
//           <span className="sev medium">MEDIUM</span>
//           <span className="sev high">HIGH</span>
//         </div>

//         <div className="incidents-list">
//           {incidents.length === 0 ? (
//             <div className="no-incidents">
//               <span className="no-inc-icon">⊕</span>
//               <p>No incidents detected yet.</p>
//             </div>
//           ) : (
//             incidents.map((inc, i) => <IncidentItem key={i} {...inc} />)
//           )}
//         </div>

//         <div className="radar-wrap">
//           <Radar active={monitoring} accentColor={accentColor} />
//         </div>
//       </div>

//     </div>
//   )
// }

import { useState, useEffect, useRef } from 'react'
import { Upload, Zap, Eye, Maximize2 } from 'lucide-react'
import './DashboardLayout.css'

/* ── Animated Heatmap ───────────────────────────────────── */
function Heatmap({ active, accentColor }) {
  const canvasRef = useRef(null)
  const rafRef    = useRef(null)
  const timeRef   = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx    = canvas.getContext('2d')

    const draw = () => {
      timeRef.current += 0.015
      const t = timeRef.current
      const w = canvas.width, h = canvas.height
      ctx.clearRect(0, 0, w, h)

      const blobs = [
        { x: 0.35 + Math.sin(t * 0.7) * 0.08, y: 0.45 + Math.cos(t * 0.5) * 0.1,  r: 0.28, intensity: active ? 0.9 : 0.55 },
        { x: 0.65 + Math.cos(t * 0.4) * 0.06, y: 0.40 + Math.sin(t * 0.6) * 0.08, r: 0.22, intensity: active ? 0.7 : 0.38 },
        { x: 0.50 + Math.sin(t * 0.3) * 0.10, y: 0.60 + Math.cos(t * 0.8) * 0.05, r: 0.18, intensity: active ? 0.5 : 0.25 },
      ]

      blobs.forEach(({ x, y, r, intensity }) => {
        const grd = ctx.createRadialGradient(x * w, y * h, 0, x * w, y * h, r * w)
        if (accentColor === 'red') {
          grd.addColorStop(0,   `rgba(255, 60, 60, ${intensity})`)
          grd.addColorStop(0.4, `rgba(200, 80, 20, ${intensity * 0.55})`)
        } else {
          grd.addColorStop(0,   `rgba(255, 180, 0, ${intensity})`)
          grd.addColorStop(0.4, `rgba(200, 100, 20, ${intensity * 0.55})`)
        }
        grd.addColorStop(1, 'rgba(0,0,0,0)')
        ctx.fillStyle = grd
        ctx.fillRect(0, 0, w, h)
      })

      rafRef.current = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(rafRef.current)
  }, [active, accentColor])

  return <canvas ref={canvasRef} width={480} height={140} className="heatmap-canvas" />
}

/* ── Radar ──────────────────────────────────────────────── */
function Radar({ active, accentColor }) {
  const canvasRef = useRef(null)
  const rafRef    = useRef(null)
  const angleRef  = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx    = canvas.getContext('2d')
    const cx = canvas.width / 2
    const cy = canvas.height / 2
    const R  = cx - 10

    const blips = [
      { angle: 45,  dist: 0.55, color: accentColor === 'red' ? '#ff3b3b' : '#ffb800' },
      { angle: 160, dist: 0.35, color: '#1a6aff' },
      { angle: 260, dist: 0.70, color: accentColor === 'red' ? '#ffb800' : '#ff3b3b' },
    ]

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      ctx.strokeStyle = 'rgba(30,61,95,0.55)'
      ctx.lineWidth   = 0.8
      ;[0.25, 0.5, 0.75, 1].forEach(r => {
        ctx.beginPath()
        ctx.arc(cx, cy, r * R, 0, Math.PI * 2)
        ctx.stroke()
      })

      ctx.beginPath()
      ctx.moveTo(cx, cy - R); ctx.lineTo(cx, cy + R)
      ctx.moveTo(cx - R, cy); ctx.lineTo(cx + R, cy)
      ctx.stroke()

      if (active) {
        angleRef.current += 0.025
        const a  = angleRef.current
        const x2 = cx + Math.cos(a) * R
        const y2 = cy + Math.sin(a) * R
        const ac = accentColor === 'red' ? 'rgba(255,59,59,' : 'rgba(255,184,0,'
        const grd = ctx.createLinearGradient(cx, cy, x2, y2)
        grd.addColorStop(0, ac + '0.28)')
        grd.addColorStop(1, ac + '0.04)')
        ctx.beginPath()
        ctx.moveTo(cx, cy)
        ctx.arc(cx, cy, R, a - 1.2, a)
        ctx.closePath()
        ctx.fillStyle = grd
        ctx.fill()

        ctx.beginPath()
        ctx.moveTo(cx, cy)
        ctx.lineTo(x2, y2)
        ctx.strokeStyle = accentColor === 'red' ? 'rgba(255,59,59,0.85)' : 'rgba(255,184,0,0.85)'
        ctx.lineWidth = 1.5
        ctx.stroke()
      }

      blips.forEach(({ angle, dist, color }) => {
        const rad = (angle * Math.PI) / 180
        const bx  = cx + Math.cos(rad) * dist * R
        const by  = cy + Math.sin(rad) * dist * R
        ctx.beginPath()
        ctx.arc(bx, by, 3, 0, Math.PI * 2)
        ctx.fillStyle  = color
        ctx.shadowBlur = 10
        ctx.shadowColor = color
        ctx.fill()
        ctx.shadowBlur = 0
      })

      rafRef.current = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(rafRef.current)
  }, [active, accentColor])

  return <canvas ref={canvasRef} width={180} height={180} className="radar-canvas" />
}

/* ── Upload Zone ────────────────────────────────────────── */
function UploadZone({ onFile, videoSrc, monitoring, accentColor }) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef(null)

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) onFile(file)
  }

  return (
    <div
      className={[
        'upload-zone',
        dragging ? 'drag' : '',
        monitoring ? `monitoring ${accentColor}` : '',
      ].join(' ')}
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => !videoSrc && inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="video/*,image/*"
        hidden
        onChange={(e) => onFile(e.target.files[0])}
      />

      {videoSrc ? (
        <video src={videoSrc} controls autoPlay muted loop className="video-preview" />
      ) : (
        <div className="upload-placeholder">
          <div className="upload-icon-box">
            <Upload size={26} />
          </div>
          <p className="upload-title">Upload Video or Image for Analysis</p>
          <p className="upload-sub">Drag &amp; drop or click to select • MP4, AVI, MOV, JPG, PNG</p>
        </div>
      )}

      {monitoring && <div className="scan-line" />}
    </div>
  )
}

/* ── Incident row ───────────────────────────────────────── */
function IncidentItem({ type, time, severity }) {
  return (
    <div className={`incident-item ${severity}`}>
      <div className={`incident-dot ${severity}`} />
      <div className="incident-info">
        <span className="incident-type">{type}</span>
        <span className="incident-time">{time}</span>
      </div>
      <span className={`incident-badge ${severity}`}>{severity.toUpperCase()}</span>
    </div>
  )
}

/* ── Main Dashboard ─────────────────────────────────────── */
export default function DashboardLayout({
  accentColor,
  detections,
  incidents,
  monitoring,
  aiStatus,
  threatLevel,
  insights,
  stats,
  onFile,        // ← NEW: bubble file up to parent page
}) {
  const [videoSrc, setVideoSrc] = useState(null)
  const [timer, setTimer]       = useState(0)

  useEffect(() => {
    let t
    if (monitoring) t = setInterval(() => setTimer(s => s + 1), 1000)
    else setTimer(0)
    return () => clearInterval(t)
  }, [monitoring])

  // Reset preview when monitoring stops
  useEffect(() => {
    if (!monitoring) setVideoSrc(null)
  }, [monitoring])

  const fmtTimer = (s) => {
    const h   = String(Math.floor(s / 3600)).padStart(2, '0')
    const m   = String(Math.floor((s % 3600) / 60)).padStart(2, '0')
    const sec = String(s % 60).padStart(2, '0')
    return `${h}:${m}:${sec}`
  }

  const handleFile = (file) => {
    setVideoSrc(URL.createObjectURL(file))
    onFile?.(file)   // bubble up to FightDetection / WeaponDetection
  }

  const accentVar = accentColor === 'red' ? 'var(--accent-red)' : 'var(--accent-yellow)'

  return (
    <div className="dash-grid">

      {/* ── LEFT: Video Analysis ── */}
      <div className="dash-panel">
        <div className="panel-header">
          <span className="panel-title">VIDEO ANALYSIS</span>
          <span className={`panel-timer ${monitoring ? 'active' : ''}`}>
            {fmtTimer(timer)}
          </span>
        </div>

        <UploadZone
          onFile={handleFile}
          videoSrc={videoSrc}
          monitoring={monitoring}
          accentColor={accentColor}
        />

        <div className="vstats">
          {stats.map((s, i) => (
            <div key={i} className="vstat">
              <span className="vstat-label">{s.label}</span>
              <span className="vstat-value" style={{ color: s.color }}>{s.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── MIDDLE: AI Insights ── */}
      <div className="dash-panel">
        <div className="panel-header">
          <span className="panel-title">AI INSIGHTS</span>
          <span className={`ai-pill ${monitoring ? 'active' : ''}`}>●</span>
        </div>

        <div className="ai-meta">
          <div className="ai-meta-row">
            <span className="ai-meta-key">AI STATUS:</span>
            <span className={`ai-meta-val ${monitoring ? 'green' : ''}`}>{aiStatus}</span>
          </div>
          <div className="ai-meta-row">
            <span className="ai-meta-key">Threat Level:</span>
            <span className={`ai-meta-val threat-${threatLevel.toLowerCase()}`}>{threatLevel}</span>
          </div>
        </div>

        <span className="heatmap-label">HEATMAP</span>
        <Heatmap active={monitoring} accentColor={accentColor} />

        <div className="sub-header">
          <Zap size={13} style={{ color: accentVar }} />
          <span className="sub-title">Active Detections</span>
        </div>

        <div className="detections-list">
          {detections.length === 0 ? (
            <p className="no-data">No activity detected</p>
          ) : (
            detections.map((d, i) => (
              <div key={i} className="det-item">
                <div
                  className="det-bar"
                  style={{ width: `${d.confidence}%`, background: accentVar }}
                />
                <span className="det-label">{d.label}</span>
                <span className="det-conf">{d.confidence}%</span>
              </div>
            ))
          )}
        </div>

        <div className="panel-header" style={{ marginTop: 'auto' }}>
          <span className="panel-title">AI INSIGHTS</span>
          <Eye size={13} style={{ color: 'var(--text-secondary)' }} />
        </div>
        <div className="insights-text">
          {insights ?? <span className="no-data">No detections yet</span>}
        </div>
      </div>

      {/* ── RIGHT: Incident Timeline ── */}
      <div className="dash-panel">
        <div className="panel-header">
          <span className="panel-title">INCIDENT TIMELINE</span>
          <Maximize2 size={12} style={{ color: 'var(--text-secondary)' }} />
        </div>

        <div className="sev-legend">
          <span className="sev low">LOW</span>
          <span className="sev medium">MEDIUM</span>
          <span className="sev high">HIGH</span>
        </div>

        <div className="incidents-list">
          {incidents.length === 0 ? (
            <div className="no-incidents">
              <span className="no-inc-icon">⊕</span>
              <p>No incidents detected yet.</p>
            </div>
          ) : (
            incidents.map((inc, i) => <IncidentItem key={i} {...inc} />)
          )}
        </div>

        <div className="radar-wrap">
          <Radar active={monitoring} accentColor={accentColor} />
        </div>
      </div>

    </div>
  )
}