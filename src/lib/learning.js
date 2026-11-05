import { REVISION_INTERVALS } from '../data/content.js'

export function getTopicEvidence(attempts) {
  const byTopic = new Map()
  for (const attempt of attempts) {
    const topic = attempt.topic || 'Uncategorised'
    const subject = attempt.subject || 'General'
    const key = subject + '::' + topic
    const current = byTopic.get(key) || { topic, subject, distinct:new Map(), attempts:0, lastAttempt:0 }
    current.attempts += 1
    if (!current.distinct.has(attempt.questionId) || current.distinct.get(attempt.questionId).date < attempt.date) current.distinct.set(attempt.questionId, attempt)
    current.lastAttempt = Math.max(current.lastAttempt, attempt.date || 0)
    byTopic.set(key, current)
  }
  return [...byTopic.values()].map(item => {
    const evidence = [...item.distinct.values()]
    const correct = evidence.filter(a => a.correct).length
    const accuracy = evidence.length ? Math.round(correct / evidence.length * 100) : null
    let status = 'Insufficient data'
    if (evidence.length >= 5) status = accuracy >= 80 ? 'Strong' : accuracy >= 55 ? 'Improving' : 'Needs attention'
    return { topic:item.topic, subject:item.subject, attempts:item.attempts, distinctQuestions:evidence.length, accuracy, status, lastAttempt:item.lastAttempt }
  }).sort((a,b) => (a.accuracy ?? 101) - (b.accuracy ?? 101))
}

export function nextRevision({ currentInterval = 1, result = 'good', confidence = 'somewhat', now = Date.now() }) {
  let index = REVISION_INTERVALS.indexOf(currentInterval)
  if (index < 0) index = 0
  if (result === 'incorrect' || result === 'again') index = 0
  else if (result === 'hard' || confidence === 'guessing') index = Math.max(0, index - 1)
  else if (result === 'easy' && confidence === 'sure') index = Math.min(REVISION_INTERVALS.length - 1, index + 2)
  else index = Math.min(REVISION_INTERVALS.length - 1, index + 1)
  const days = REVISION_INTERVALS[index]
  return { intervalDays:days, dueAt:now + days * 86400000, algorithmVersion:1 }
}

export function buildTodayFocus({ profile, revisions = [], mistakes = [], gaps = [], attempts = [] }) {
  const actions = []
  const due = revisions.filter(r => r.dueAt <= Date.now())
  if (due.length) actions.push({ id:'revise-due', label:'Review ' + Math.min(due.length, 3) + ' due concept' + (due.length > 1 ? 's' : ''), detail:'Keep overdue work manageable.', target:'ReviseOS', minutes:15 })
  const openMistakes = mistakes.filter(m => !m.resolved)
  if (openMistakes.length) actions.push({ id:'mistakes', label:'Revisit one recent mistake', detail:'Understand the reason, then retry.', target:'Mistake Notebook', minutes:10 })
  if (gaps.length) actions.push({ id:'gap', label:'Strengthen "' + (gaps[0].topic || gaps[0].title) + '"', detail:'Start with a short diagnostic or explanation.', target:'Gap Finder', minutes:15 })
  if (!attempts.length) actions.push({ id:'practice', label:'Try your first practice set', detail:'Start with a few sample questions.', target:'Practice Lab', minutes:10 })
  if (!actions.length) actions.push({ id:'practice', label:'Complete a focused practice set', detail:'Build evidence on a topic you are studying.', target:'Practice Lab', minutes:15 })
  if (profile?.studyMinutes && actions.length > 1) {
    const budget = Number(profile.studyMinutes) || 45
    return actions.slice(0, 4).map(a => ({ ...a, minutes:Math.min(a.minutes, Math.max(5, Math.floor(budget / Math.min(actions.length, 4)))) }))
  }
  return actions.slice(0, 4)
}

export function makeRevisionItem({ topic, subject, source='manual', reason='Student added this topic', currentInterval=1 }) {
  return { id:crypto.randomUUID(), topic, subject, source, reason, createdAt:Date.now(), lastReviewedAt:null, intervalDays:currentInterval, dueAt:Date.now(), reviewCount:0, algorithmVersion:1 }
}

export function gradeQuestion(question, selectedIndex) {
  if (!question || !Number.isInteger(selectedIndex)) return { correct:false, valid:false }
  return { valid:true, correct:selectedIndex === question.answer, correctAnswer:question.answer, explanation:question.explanation }
}
