import { useEffect, useMemo, useState } from 'react'

const starterQuestions = [
  { id: 1, subject: 'Physics', topic: 'Units & Measurements', level: 'Class 11', question: 'Which of the following is a fundamental SI unit?', options: ['Newton', 'Joule', 'Kelvin', 'Pascal'], answer: 2, explain: 'Kelvin is a base SI unit. Newton, joule and pascal are derived units.' },
  { id: 2, subject: 'Chemistry', topic: 'Some Basic Concepts', level: 'Class 11', question: 'The number of particles in one mole is approximately:', options: ['6.022 × 10²³', '3.0 × 10⁸', '9.8', '1.6 × 10⁻¹⁹'], answer: 0, explain: 'One mole contains Avogadro’s number of specified elementary entities.' },
  { id: 3, subject: 'Maths', topic: 'Sets', level: 'Class 11', question: 'If A = {1, 2} and B = {2, 3}, then A ∩ B is:', options: ['{1, 3}', '{2}', '{1, 2, 3}', '∅'], answer: 1, explain: 'Intersection contains only the elements common to both sets.' },
]

const initial = {
  name: '',
  goals: [],
  attempts: [],
  revisions: [],
  mistakes: [],
  gaps: [],
  streak: 0,
  lastActive: '',
}

function readData() {
  try {
    const saved = localStorage.getItem('gapzero-v1')
    return saved ? { ...initial, ...JSON.parse(saved) } : initial
  } catch {
    return initial
  }
}

function App() {
  const [data, setData] = useState(readData)
  const [page, setPage] = useState('Overview')
  const [subject, setSubject] = useState('All')
  const [questionIndex, setQuestionIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [checked, setChecked] = useState(false)
  const [topic, setTopic] = useState('')
  const [note, setNote] = useState('')
  const [showBackup, setShowBackup] = useState(false)
  const [toast, setToast] = useState('')

  useEffect(() => {
    localStorage.setItem('gapzero-v1', JSON.stringify(data))
  }, [data])

  const questions = useMemo(() => subject === 'All' ? starterQuestions : starterQuestions.filter(q => q.subject === subject), [subject])
  const question = questions[questionIndex % Math.max(questions.length, 1)]
  const correct = data.attempts.filter(a => a.correct).length
  const accuracy = data.attempts.length ? Math.round(correct / data.attempts.length * 100) : 0
  const due = data.revisions.filter(r => r.due <= Date.now()).length

  function update(patch) { setData(prev => ({ ...prev, ...patch })) }
  function notify(message) { setToast(message); window.setTimeout(() => setToast(''), 2400) }

  function markAnswer() {
    if (selected === null || checked) return
    const isCorrect = selected === question.answer
    const attempt = { questionId: question.id, subject: question.subject, topic: question.topic, correct: isCorrect, date: Date.now() }
    update({
      attempts: [...data.attempts, attempt],
      revisions: isCorrect ? data.revisions : [...data.revisions, { id: Date.now(), title: question.topic, subject: question.subject, due: Date.now(), interval: 1 }],
      mistakes: isCorrect ? data.mistakes : [...data.mistakes, { id: Date.now(), title: question.topic, detail: 'Review the explanation and retry this concept.', date: Date.now(), resolved: false }],
    })
    setChecked(true)
  }

  function nextQuestion() {
    setQuestionIndex(i => (i + 1) % Math.max(questions.length, 1))
    setSelected(null)
    setChecked(false)
  }

  function addGap(e) {
    e.preventDefault()
    if (!topic.trim()) return
    update({ gaps: [...data.gaps, { id: Date.now(), title: topic.trim(), subject, created: Date.now() }] })
    setTopic('')
    notify('Gap added to your learning list')
  }

  function addNote(e) {
    e.preventDefault()
    if (!note.trim()) return
    update({ revisions: [...data.revisions, { id: Date.now(), title: note.trim(), subject: subject === 'All' ? 'General' : subject, due: Date.now(), interval: 1 }] })
    setNote('')
    notify('Added to ReviseOS')
  }

  function exportBackup() {
    const blob = new Blob([JSON.stringify({ version: 1, exportedAt: new Date().toISOString(), data }, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'gapzero-backup.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  function importBackup(file) {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result))
        const candidate = parsed.data ?? parsed
        if (!candidate || !Array.isArray(candidate.attempts) || !Array.isArray(candidate.revisions) || !Array.isArray(candidate.mistakes)) throw new Error('Invalid backup')
        if (!window.confirm('Restore this backup? Your current local GapZero data will be replaced.')) return
        setData({ ...initial, ...candidate })
        setShowBackup(false)
        notify('Backup restored')
      } catch { notify('That file is not a valid GapZero backup') }
    }
    reader.readAsText(file)
  }

  const nav = ['Overview', 'Gap Finder', 'ReviseOS', 'Practice Lab', 'Mistake Notebook', 'Analytics']
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <a className="brand" href="#" onClick={e => { e.preventDefault(); setPage('Overview') }}><span className="brand-mark">g.</span><span>gapzero<small>LEARN WITH CLARITY</small></span></a>
        <div className="side-label">WORKSPACE</div>
        <nav>{nav.map((item, i) => <button key={item} className={page === item ? 'nav-item active' : 'nav-item'} onClick={() => setPage(item)}><span className="nav-icon">{['⌂', '◎', '↻', '▤', '✎', '▥'][i]}</span>{item}{item === 'ReviseOS' && due > 0 && <b className="nav-count">{due}</b>}</button>)}</nav>
        <div className="sidebar-bottom">
          <div className="privacy-chip"><span className="privacy-dot" /> Your data stays on this device</div>
          <button className="nav-item" onClick={() => setShowBackup(true)}><span className="nav-icon">⚙</span>Settings & backup</button>
          <div className="profile"><div className="avatar">S</div><div><strong>Student workspace</strong><small>Local account · No login</small></div></div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar"><div className="breadcrumb">Workspace <span>/</span> <strong>{page}</strong></div><div className="top-actions"><span className="local-pill"><i /> Local mode</span><button className="icon-button" title="Settings and backup" onClick={() => setShowBackup(true)}>⚙</button></div></header>
        <div className="content">
          {page === 'Overview' && <section>
            <div className="welcome-row"><div><div className="eyebrow">YOUR LEARNING, DECODED</div><h1>Make every study session <em>count.</em></h1><p className="subhead">Find what you don’t know. Build a plan to master it.</p></div><div className="date-card"><span>YOUR LEARNING SPACE</span><strong>{new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}</strong></div></div>
            <div className="stat-grid"><Stat label="Questions attempted" value={data.attempts.length} meta="Across all practice sessions" icon="▤"/><Stat label="Accuracy" value={accuracy + '%'} meta="Based on your attempts" icon="◎"/><Stat label="Topics to revise" value={due} meta="Ready for a quick review" icon="↻"/><Stat label="Concept gaps" value={data.gaps.length} meta="Topics you want to strengthen" icon="◇"/></div>
            <div className="section-heading"><div><div className="eyebrow">PICK UP WHERE YOU LEFT OFF</div><h2>Your learning toolkit</h2></div><span className="muted">Built around your progress</span></div>
            <div className="tool-grid">
              <ToolCard icon="◎" tint="blue" title="Find your gaps" text="Spot weak concepts and turn them into a clear next step." action="Open Gap Finder" onClick={() => setPage('Gap Finder')} />
              <ToolCard icon="↻" tint="violet" title="Revise with intent" text="Keep important concepts in a simple spaced-revision queue." action="Open ReviseOS" onClick={() => setPage('ReviseOS')} />
              <ToolCard icon="▤" tint="orange" title="Practice actively" text="Test your understanding with focused questions." action="Start practicing" onClick={() => setPage('Practice Lab')} />
            </div>
            <div className="bottom-grid"><div className="panel"><div className="panel-head"><div><div className="eyebrow">YOUR NEXT STEPS</div><h3>Learning queue</h3></div><button className="text-button" onClick={() => setPage('ReviseOS')}>View all →</button></div>{data.revisions.length ? data.revisions.slice(0, 3).map(r => <div className="queue-row" key={r.id}><span className="queue-dot" /><div><strong>{r.title}</strong><small>{r.subject} · Due now</small></div><span className="tag">Review</span></div>) : <Empty title="Your queue is clear" text="Add a concept in ReviseOS or answer a practice question incorrectly to build your revision queue." />}</div>
            <div className="panel insight-panel"><div className="eyebrow">A SMALL DAILY WIN</div><h3>Consistency beats cramming.</h3><p>Start with one concept you find difficult. A focused 15-minute session is a good place to begin.</p><button className="primary-button" onClick={() => setPage('Practice Lab')}>Start a practice session <span>→</span></button></div></div>
          </section>}

          {page === 'Gap Finder' && <section><PageIntro eyebrow="KNOW WHAT TO WORK ON" title="Find your gaps." text="Capture the concepts that feel unclear. Gap Finder turns a vague struggle into a visible learning list."/><div className="two-col"><div className="panel"><h3>Add a concept gap</h3><p className="muted">Be specific. “Newton’s third law examples” is more useful than “Physics”.</p><form onSubmit={addGap} className="stack-form"><label>Subject</label><select value={subject} onChange={e => setSubject(e.target.value)}><option>All</option><option>Physics</option><option>Chemistry</option><option>Maths</option></select><label>Concept or topic</label><input value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g. Significant figures" /><button className="primary-button">Add to my gaps <span>→</span></button></form></div><div className="panel soft-panel"><div className="eyebrow">A BETTER WAY TO DIAGNOSE</div><h3>Use evidence, not guesswork.</h3><p>Try a practice question. Incorrect answers are automatically saved in your Mistake Notebook and revision queue.</p><button className="secondary-button" onClick={() => setPage('Practice Lab')}>Try a diagnostic question</button></div></div><div className="panel list-panel"><div className="panel-head"><h3>Your concept gaps <span className="count">{data.gaps.length}</span></h3></div>{data.gaps.length ? data.gaps.map(g => <div className="list-row" key={g.id}><div className="list-symbol">◇</div><div className="list-main"><strong>{g.title}</strong><small>{g.subject} · Added {new Date(g.created).toLocaleDateString()}</small></div><button className="small-action" onClick={() => update({ revisions: [...data.revisions, { id: Date.now(), title: g.title, subject: g.subject, due: Date.now(), interval: 1 }] })}>Add to revision</button><button className="remove-button" onClick={() => update({ gaps: data.gaps.filter(x => x.id !== g.id) })}>×</button></div>) : <Empty title="No gaps captured yet" text="Add a topic you want to understand better. Your list is private to this device." />}</div></section>}

          {page === 'ReviseOS' && <section><PageIntro eyebrow="REMEMBER WHAT YOU LEARN" title="Revision that sticks." text="A simple queue for concepts you need to revisit. Start small, return consistently."/><div className="revision-summary"><div><strong>{due}</strong><span>Due today</span></div><div><strong>{data.revisions.length}</strong><span>Total in queue</span></div><div><strong>1 · 3 · 7 · 21</strong><span>Suggested review rhythm (days)</span></div></div><div className="panel"><h3>Add something to revise</h3><form className="inline-form" onSubmit={addNote}><input value={note} onChange={e => setNote(e.target.value)} placeholder="Add a formula, definition, or concept..." /><button className="primary-button">Add item</button></form></div><div className="panel list-panel"><div className="panel-head"><h3>Revision queue</h3><span className="muted">{data.revisions.length} items</span></div>{data.revisions.length ? data.revisions.map(r => <div className="list-row" key={r.id}><div className="list-symbol violet-symbol">↻</div><div className="list-main"><strong>{r.title}</strong><small>{r.subject} · {r.due <= Date.now() ? 'Due now' : 'Scheduled'}</small></div><button className="small-action" onClick={() => update({ revisions: data.revisions.map(x => x.id === r.id ? { ...x, due: Date.now() + 3 * 86400000, interval: 3 } : x) })}>Reviewed · next in 3d</button><button className="remove-button" onClick={() => update({ revisions: data.revisions.filter(x => x.id !== r.id) })}>×</button></div>) : <Empty title="Nothing to revise yet" text="Add a topic above or answer a practice question incorrectly. It will appear here." />}</div></section>}

          {page === 'Practice Lab' && <section><PageIntro eyebrow="LEARN BY RETRIEVING" title="Practice with purpose." text="A small starter set of illustrative questions. These are demonstrations, not a complete syllabus or PYQ collection."/><div className="practice-toolbar"><div className="segmented">{['All', 'Physics', 'Chemistry', 'Maths'].map(s => <button key={s} className={subject === s ? 'selected' : ''} onClick={() => { setSubject(s); setQuestionIndex(0); setSelected(null); setChecked(false) }}>{s}</button>)}</div><span className="muted">Question {(questionIndex % Math.max(questions.length, 1)) + 1} of {questions.length}</span></div>{question ? <div className="question-card"><div className="question-meta"><span className="tag">{question.subject}</span><span>{question.level} · Illustrative sample</span></div><h2>{question.question}</h2><div className="options">{question.options.map((o, i) => <button key={o} disabled={checked} className={'option ' + (checked && i === question.answer ? 'right' : checked && i === selected ? 'wrong' : selected === i ? 'chosen' : '')} onClick={() => setSelected(i)}><span className="option-letter">{String.fromCharCode(65 + i)}</span>{o}{checked && i === question.answer && <b>✓</b>}</button>)}</div>{checked && <div className={selected === question.answer ? 'feedback good' : 'feedback bad'}><strong>{selected === question.answer ? 'Correct. Nice work.' : 'Not quite. Learn from this one.'}</strong><p>{question.explain}</p></div>}<div className="question-footer"><span className="muted">Take your time. Understand the why.</span>{checked ? <button className="primary-button" onClick={nextQuestion}>Next question →</button> : <button className="primary-button" disabled={selected === null} onClick={markAnswer}>Check answer <span>→</span></button>}</div></div> : <Empty title="No questions in this filter" text="Choose another subject."/>}<p className="disclaimer">Starter demonstration content only. Curriculum coverage and question accuracy must be expanded and reviewed before exam use.</p></section>}

          {page === 'Mistake Notebook' && <section><PageIntro eyebrow="TURN ERRORS INTO INSIGHT" title="Your mistake notebook." text="Incorrect practice answers are captured here so you can revisit the underlying idea."/><div className="panel list-panel">{data.mistakes.length ? data.mistakes.map(m => <div className="list-row" key={m.id}><div className="list-symbol orange-symbol">!</div><div className="list-main"><strong>{m.title}</strong><small>{m.detail}</small></div><button className="small-action" onClick={() => update({ mistakes: data.mistakes.map(x => x.id === m.id ? { ...x, resolved: !x.resolved } : x) })}>{m.resolved ? 'Reopen' : 'Mark reviewed'}</button><span className={m.resolved ? 'status-done' : 'status-open'}>{m.resolved ? 'Reviewed' : 'Open'}</span></div>) : <Empty title="No mistakes recorded" text="Your incorrect answers from Practice Lab will appear here automatically." />}</div></section>}

          {page === 'Analytics' && <section><PageIntro eyebrow="PROGRESS, MADE VISIBLE" title="See your progress." text="A transparent snapshot of activity recorded on this device. No predictions or inflated scores."/><div className="stat-grid"><Stat label="Attempts" value={data.attempts.length} meta="Total recorded answers" icon="▤"/><Stat label="Correct" value={correct} meta="Correct answers" icon="✓"/><Stat label="Accuracy" value={accuracy + '%'} meta="Correct ÷ total attempts" icon="◎"/><Stat label="Open mistakes" value={data.mistakes.filter(m => !m.resolved).length} meta="Still to review" icon="!" /></div><div className="panel analytics-panel"><div className="panel-head"><h3>Subject activity</h3><span className="muted">Recorded attempts</span></div>{['Physics', 'Chemistry', 'Maths'].map(s => { const total = data.attempts.filter(a => a.subject === s).length; const pct = data.attempts.length ? total / data.attempts.length * 100 : 0; return <div className="bar-row" key={s}><span>{s}</span><div className="bar-track"><i style={{ width: pct + '%' }}/></div><strong>{total}</strong></div> })}</div></section>}
        </div>
        <footer className="footer"><span>GAPZERO <b>·</b> FIND YOUR GAPS. MASTER EVERY CONCEPT.</span><span>Local-first by design · V1 in progress</span></footer>
      </main>

      {showBackup && <div className="modal-backdrop" onMouseDown={e => { if (e.target === e.currentTarget) setShowBackup(false) }}><div className="modal"><button className="modal-close" onClick={() => setShowBackup(false)}>×</button><div className="eyebrow">YOUR DATA, YOUR DEVICE</div><h2>Settings & backup</h2><p>GapZero stores this workspace in your browser’s local storage. Clearing browser data may erase it, so export a backup periodically.</p><div className="backup-actions"><button className="primary-button" onClick={exportBackup}>↓ Export JSON backup</button><label className="secondary-button file-label">↑ Restore from JSON<input type="file" accept="application/json,.json" onChange={e => importBackup(e.target.files?.[0])}/></label></div><div className="privacy-note"><span>●</span> No account, server sync, or cloud AI is used by this prototype.</div><button className="danger-link" onClick={() => { if (window.confirm('Delete all GapZero data stored in this browser? This cannot be undone unless you have a backup.')) { localStorage.removeItem('gapzero-v1'); setData(initial); setShowBackup(false); notify('Local data cleared') } }}>Delete local workspace data</button></div></div>}
      {toast && <div className="toast">{toast}</div>}
    </div>
  )
}

function Stat({ label, value, meta, icon }) { return <div className="stat-card"><div className="stat-top"><span>{label}</span><i>{icon}</i></div><strong>{value}</strong><small>{meta}</small></div> }
function ToolCard({ icon, tint, title, text, action, onClick }) { return <div className="tool-card"><div className={'tool-icon ' + tint}>{icon}</div><h3>{title}</h3><p>{text}</p><button className="text-button" onClick={onClick}>{action} →</button></div> }
function PageIntro({ eyebrow, title, text }) { return <div className="page-intro"><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{text}</p></div> }
function Empty({ title, text }) { return <div className="empty-state"><span>✳</span><strong>{title}</strong><p>{text}</p></div> }

export default App
