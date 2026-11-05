import test from 'node:test'
import assert from 'node:assert/strict'
import { getTopicEvidence, nextRevision, gradeQuestion, buildTodayFocus } from './learning.js'

test('topic mastery stays insufficient until five distinct questions exist', () => {
  const attempts = Array.from({length:4}, (_,i) => ({ questionId:'q'+i, topic:'Vectors', subject:'Physics', correct:true, date:i+1 }))
  assert.equal(getTopicEvidence(attempts)[0].status, 'Insufficient data')
  attempts.push({ questionId:'q4', topic:'Vectors', subject:'Physics', correct:true, date:5 })
  assert.equal(getTopicEvidence(attempts)[0].status, 'Strong')
})

test('repeated attempts on one question do not inflate distinct evidence', () => {
  const attempts = Array.from({length:8}, (_,i) => ({ questionId:'same-question', topic:'Sets', subject:'Mathematics', correct:true, date:i+1 }))
  const item = getTopicEvidence(attempts)[0]
  assert.equal(item.attempts, 8)
  assert.equal(item.distinctQuestions, 1)
  assert.equal(item.status, 'Insufficient data')
})

test('incorrect recall resets revision to the short interval', () => {
  const result = nextRevision({ currentInterval:14, result:'incorrect', confidence:'sure', now:1000 })
  assert.equal(result.intervalDays, 1)
  assert.equal(result.dueAt, 86401000)
})

test('easy high-confidence recall advances two interval steps', () => {
  const result = nextRevision({ currentInterval:3, result:'easy', confidence:'sure', now:0 })
  assert.equal(result.intervalDays, 14)
})

test('question grader checks the answer index', () => {
  const q = { answer:2, explanation:'The correct option is C.' }
  assert.equal(gradeQuestion(q,2).correct, true)
  assert.equal(gradeQuestion(q,1).correct, false)
})

test('dashboard focus creates a first-practice action for an empty workspace', () => {
  const actions = buildTodayFocus({ profile:null, revisions:[], mistakes:[], gaps:[], attempts:[] })
  assert.equal(actions.length, 1)
  assert.equal(actions[0].target, 'Practice Lab')
})

test('same topic title in different subjects is kept separate', () => {
  const attempts = [
    ...Array.from({length:5}, (_,i) => ({ questionId:'physics-'+i, topic:'Vectors', subject:'Physics', correct:true, date:i+1 })),
    ...Array.from({length:5}, (_,i) => ({ questionId:'maths-'+i, topic:'Vectors', subject:'Mathematics', correct:false, date:i+1 })),
  ]
  const rows = getTopicEvidence(attempts)
  assert.equal(rows.length, 2)
  assert.equal(rows.find(x => x.subject === 'Physics').status, 'Strong')
  assert.equal(rows.find(x => x.subject === 'Mathematics').status, 'Needs attention')
})

test('hard recall moves back one interval step', () => {
  const result = nextRevision({ currentInterval:14, result:'hard', confidence:'somewhat', now:0 })
  assert.equal(result.intervalDays, 7)
})
