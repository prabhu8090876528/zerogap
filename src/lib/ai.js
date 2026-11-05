import { DEMO_QUESTIONS } from '../data/content.js'

let localSession = null

export async function detectLocalModel() {
  if (!('LanguageModel' in window)) return { status:'unsupported', label:'Not supported on this browser', reason:'This browser does not expose the on-device Prompt API.' }
  try {
    // Check capability first. Never call create() just to probe availability.
    const status = await window.LanguageModel.availability()
    if (status === 'available') return { status:'available', label:'On-device AI available', reason:'The browser reports that its local language model is ready on this device.' }
    if (status === 'downloadable') return { status:'downloadable', label:'Model download needed', reason:'The browser reports that a local model can be prepared after you explicitly choose to enable it.' }
    if (status === 'downloading') return { status:'downloading', label:'Model downloading', reason:'The browser is already preparing its local model.' }
    return { status:'unsupported', label:'Not supported on this device', reason:'The browser reports that the local model is unavailable on this device.' }
  } catch (error) {
    return { status:'unsupported', label:'Local AI unavailable', reason:error?.message || 'The browser did not allow the local model check.' }
  }
}

export async function connectLocalModel(onProgress = () => {}) {
  if (!('LanguageModel' in window)) throw new Error('This browser does not support the on-device Prompt API.')
  const status = await window.LanguageModel.availability()
  if (status === 'unavailable') throw new Error('The browser reports that this device cannot run the local model. Smart Mode remains available.')
  localSession = await window.LanguageModel.create({
    monitor(monitor) {
      monitor.addEventListener('downloadprogress', event => onProgress(Math.round((event.loaded || 0) * 100)))
    },
  })
  return true
}

export async function askLocalModel(prompt, context = {}) {
  if (!localSession) throw new Error('Connect the on-device model first.')
  const systemContext = [
    'You are GapZero, a careful school and competitive-exam study tutor.',
    'Learner path: ' + (context.classLevel || 'Not selected') + '; goals: ' + ((context.goals || []).join(', ') || 'Not selected') + '; language preference: ' + (context.language || 'English') + '.',
    'Explain step by step. State assumptions. For calculations, show formulas and verify the result. Do not invent syllabus facts or question sources. Say when you are uncertain. Ask one focused follow-up only when essential.',
    'Never guarantee marks or rank. Keep the answer appropriate to the learner level.',
  ].join(' ')
  return localSession.prompt(systemContext + '\n\nStudent request: ' + prompt)
}

export function endLocalModel() {
  try { localSession?.destroy?.() } catch {}
  localSession = null
}

function findKnownConcept(text) {
  const normalized = (text || '').toLowerCase()
  return DEMO_QUESTIONS.find(q => [q.topic,q.chapter,q.subject].some(term => normalized.includes(term.toLowerCase())))
}

function formatProfile(profile) {
  return (profile?.classLevel || 'your level') + (profile?.goals?.length ? ' · ' + profile.goals.join(', ') : '')
}

export function smartStudyReply({ prompt, action='explain', profile, attempts=[], mistakes=[], revisions=[] }) {
  const input = (prompt || '').trim()
  if (!input && action !== 'plan' && action !== 'revise' && action !== 'analyze') return { title:'Tell me what you are studying', body:'Add a topic or paste a doubt. Smart Mode can use installed GapZero explanations and your saved study records. It works offline and is not a generative AI model.', limitation:false }
  const openMistakes = mistakes.filter(m => !m.resolved)
  if (action === 'plan') {
    const due = revisions.filter(r => r.dueAt <= Date.now()).slice(0,3)
    const lines = [...due.map(x => 'Revise ' + x.topic + ' (' + x.subject + ') - due now'), ...openMistakes.slice(0,2).map(x => 'Repair ' + x.topic + ' - revisit your ' + (x.mistakeType || 'recorded') + ' error')]
    if (!lines.length) lines.push('Start with one 15-minute diagnostic or practice set in your selected subject.')
    return { title:'A realistic next session', body:'Your selected path: ' + formatProfile(profile) + '\n\n' + lines.map((line,i) => (i+1) + '. ' + line).join('\n') + '\n\nKeep the session within ' + (profile?.studyMinutes || 45) + ' minutes. This plan uses your saved GapZero records, not a prediction of exam results.', limitation:false }
  }
  if (action === 'revise') {
    const due = revisions.filter(r => r.dueAt <= Date.now()).slice(0,5)
    return { title:'Your revision priorities', body:due.length ? due.map((r,i) => (i+1) + '. ' + r.topic + ' - ' + (r.reason || 'scheduled revision')).join('\n') + '\n\nUse active recall first, then open the explanation only after attempting to remember.' : 'There are no due items right now. Add a concept to ReviseOS or complete a practice question to build a review queue.', limitation:false }
  }
  if (action === 'analyze') {
    const recent = [...attempts].slice(-5).reverse()
    const lines = recent.map(a => '• ' + a.topic + ': ' + (a.correct ? 'correct' : 'incorrect') + '; confidence: ' + (a.confidence || 'not recorded'))
    return { title:'Evidence from your recent attempts', body:lines.length ? lines.join('\n') + '\n\nLook for a repeat pattern before deciding the cause. A small sample cannot prove a root cause. Open Mistake Notebook to add your reflection and next action.' : 'There are no saved attempts yet. Complete a Gap Finder diagnostic or Practice Lab question first; I can then analyze the recorded evidence.', limitation:false }
  }
  const known = findKnownConcept(input)
  if (known) {
    let detail = known.explanation
    if (action === 'hint') detail = known.hint
    if (action === 'solve') detail = 'Step 1: Identify the relevant fact: ' + known.hint + '\nStep 2: Apply it to the question.\nStep 3: Check the result against the options.\n\nAnswer: ' + known.options[known.answer] + '. ' + known.explanation
    return { title:known.topic + ' · ' + (action === 'hint' ? 'Hint' : action === 'solve' ? 'Guided solution' : 'Concept explanation'), body:detail + '\n\nPack: ' + known.classLevel + ' demonstration content. Verify with your current textbook and syllabus before exam use.', limitation:false }
  }
  if (action === 'quiz') return { title:'Build a focused practice set', body:'I can select questions only from the currently installed demonstration pack. Open Gap Finder or Practice Lab, then filter by your subject and available chapter. I will not invent a question bank or claim generated questions are verified.', limitation:false }
  return { title:'Let’s break the doubt down', body:'Your request: “' + input + '”\n\nSmart Mode is an offline, deterministic study assistant—not a generative AI model. The installed demonstration pack does not contain a verified explanation for this exact topic, so I will not fabricate a solution.\n\nTry this next:\n1. Select your class, subject and chapter in Gap Finder.\n2. Open the concept in your textbook or class notes.\n3. Paste the exact question and your attempted steps.\n\nFor open-ended explanations on supported desktops, check whether On-device AI is available in Settings.', limitation:true }
}
