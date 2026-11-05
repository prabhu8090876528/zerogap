import test from 'node:test'
import assert from 'node:assert/strict'
import { makeBackup, mergeWorkspace, validateBackup } from './storage.js'

const sample = {
  schemaVersion:1,
  profile:{ classLevel:'Class 11', subjects:['Physics'] },
  attempts:[{ id:'a1', questionId:'q1', correct:true }],
  revisions:[{ id:'r1', topic:'Units' }],
  mistakes:[],
  flashcards:[],
  gaps:[],
  notes:[],
  bookmarks:[],
  activity:[],
}

test('backup round-trips through the versioned schema validator', () => {
  const backup = makeBackup(sample)
  const restored = validateBackup(backup)
  assert.equal(backup.app, 'GapZero')
  assert.equal(restored.profile.classLevel, 'Class 11')
  assert.equal(restored.attempts.length, 1)
})

test('backup validator rejects unrelated JSON', () => {
  assert.throws(() => validateBackup({ data:{} }), /not a GapZero backup/i)
})

test('backup merge preserves current data and avoids duplicate ids', () => {
  const current = { ...sample, attempts:[{ id:'a1', correct:false },{ id:'a2', correct:true }] }
  const incoming = { ...sample, attempts:[{ id:'a1', correct:true },{ id:'a3', correct:true }] }
  const merged = mergeWorkspace(current, incoming)
  assert.equal(merged.attempts.length, 3)
  assert.equal(merged.attempts.find(x => x.id === 'a1').correct, true)
})
