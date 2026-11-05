import test from 'node:test'
import assert from 'node:assert/strict'
import { smartStudyReply } from './ai.js'

test('Smart Mode explains a topic that exists in the installed demo pack', () => {
  const result = smartStudyReply({ prompt:'Dimensional analysis', action:'explain', profile:{ classLevel:'Class 11' } })
  assert.match(result.title, /Dimensional analysis/)
  assert.match(result.body, /Work = force|dimensional/i)
  assert.equal(result.limitation, false)
})

test('Smart Mode refuses to fabricate an explanation for an unknown topic', () => {
  const result = smartStudyReply({ prompt:'Quantum field theory in curved spacetime', action:'explain', profile:{ classLevel:'Class 11' } })
  assert.equal(result.limitation, true)
  assert.match(result.body, /not a generative AI model/i)
  assert.match(result.body, /will not fabricate/i)
})

test('Study Agent plan is grounded in actual due revision records', () => {
  const result = smartStudyReply({
    action:'plan',
    profile:{ classLevel:'Class 11', studyMinutes:60, goals:['JEE Main'] },
    revisions:[{ id:'r1', topic:'Mole concept', subject:'Chemistry', dueAt:0 }],
    mistakes:[],
    attempts:[],
  })
  assert.match(result.body, /Mole concept/)
  assert.match(result.body, /60 minutes/)
})

test('Study Agent analyzer describes empty evidence honestly', () => {
  const result = smartStudyReply({ action:'analyze', prompt:'', attempts:[], mistakes:[], revisions:[] })
  assert.match(result.body, /no saved attempts/i)
})
