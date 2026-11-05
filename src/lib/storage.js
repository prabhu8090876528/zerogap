const DB_NAME = 'gapzero-local'
const DB_VERSION = 1
const STORE = 'workspace'
const RECORD_KEY = 'primary'

const EMPTY_WORKSPACE = {
  schemaVersion:1,
  profile:null,
  preferences:{ language:'English', dailyRevisionCap:45 },
  attempts:[],
  revisions:[],
  flashcards:[],
  mistakes:[],
  gaps:[],
  notes:[],
  bookmarks:[],
  activity:[],
}

function openDatabase() {
  return new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) return reject(new Error('IndexedDB is not supported in this browser.'))
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE)
    }
    request.onsuccess = () => resolve(request.result)
    request.onerror = () => reject(request.error || new Error('Could not open local storage.'))
    request.onblocked = () => reject(new Error('Storage upgrade is blocked by another GapZero tab. Close other tabs and retry.'))
  })
}

export async function loadWorkspace() {
  const db = await openDatabase()
  try {
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readonly')
      const request = tx.objectStore(STORE).get(RECORD_KEY)
      request.onsuccess = () => {
        if (request.result) return resolve({ ...EMPTY_WORKSPACE, ...request.result })
        let legacy = null
        try { legacy = JSON.parse(localStorage.getItem('gapzero-v1') || 'null') } catch {}
        if (!legacy) return resolve({ ...EMPTY_WORKSPACE })
        const migrateId = value => String(value ?? crypto.randomUUID())
        const migrated = {
          ...EMPTY_WORKSPACE,
          attempts: (legacy.attempts || []).map(item => ({ ...item, id:migrateId(item.id), questionId:String(item.questionId), topic:item.topic || 'Uncategorised', date:item.date || Date.now() })),
          revisions: (legacy.revisions || []).map(item => ({ ...item, id:migrateId(item.id), topic:item.topic || item.title || 'Untitled topic', subject:item.subject || 'General', dueAt:item.dueAt || item.due || Date.now(), intervalDays:item.intervalDays || item.interval || 1, reason:item.reason || 'Migrated from previous workspace', reviewCount:item.reviewCount || 0 })),
          mistakes: (legacy.mistakes || []).map(item => ({ ...item, id:migrateId(item.id), topic:item.topic || item.title || 'Uncategorised', explanation:item.explanation || item.detail || 'Review the related concept.', date:item.date || Date.now(), resolved:!!item.resolved, mistakeType:item.mistakeType || 'Concept', reflection:item.reflection || '' })),
          gaps: (legacy.gaps || []).map(item => ({ ...item, id:migrateId(item.id), topic:item.topic || item.title || 'Untitled topic', createdAt:item.createdAt || item.created || Date.now() })),
        }
        const write = db.transaction(STORE, 'readwrite')
        write.objectStore(STORE).put(migrated, RECORD_KEY)
        write.oncomplete = () => resolve(migrated)
        write.onerror = () => reject(write.error || new Error('Could not migrate the previous local workspace.'))
      }
      request.onerror = () => reject(request.error || new Error('Could not read your study data.'))
    })
  } finally { db.close() }
}

export async function saveWorkspace(workspace) {
  const db = await openDatabase()
  try {
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite')
      tx.objectStore(STORE).put({ ...workspace, schemaVersion:1, lastSavedAt:Date.now() }, RECORD_KEY)
      tx.oncomplete = resolve
      tx.onerror = () => reject(tx.error || new Error('Your changes could not be saved.'))
      tx.onabort = () => reject(tx.error || new Error('Saving was cancelled.'))
    })
    return true
  } catch (error) {
    if (error?.name === 'QuotaExceededError') throw new Error('Device storage is full. Export a backup and free some space before continuing.')
    throw error
  } finally { db.close() }
}

export async function clearWorkspace() {
  const db = await openDatabase()
  try {
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE, 'readwrite')
      tx.objectStore(STORE).delete(RECORD_KEY)
      tx.oncomplete = resolve
      tx.onerror = () => reject(tx.error || new Error('Could not clear local workspace.'))
    })
  } finally { db.close() }
}

export function validateBackup(parsed) {
  if (!parsed || typeof parsed !== 'object' || parsed.app !== 'GapZero' || !parsed.data || typeof parsed.data !== 'object') throw new Error('This is not a GapZero backup file.')
  const d = parsed.data
  for (const key of ['attempts','revisions','flashcards','mistakes','gaps','notes','bookmarks']) {
    if (d[key] !== undefined && !Array.isArray(d[key])) throw new Error('Backup is invalid: ' + key + ' must be a list.')
  }
  if (parsed.schemaVersion !== 1) throw new Error('This backup version is not supported by this build.')
  const bytes = new Blob([JSON.stringify(parsed)]).size
  if (bytes > 15 * 1024 * 1024) throw new Error('Backup is larger than the 15 MB safety limit.')
  return { ...EMPTY_WORKSPACE, ...d }
}

export function mergeWorkspace(current, incoming) {
  const keys = ['attempts','revisions','flashcards','mistakes','gaps','notes','bookmarks','activity']
  const merged = { ...current, profile:incoming.profile || current.profile, preferences:{ ...current.preferences, ...incoming.preferences } }
  for (const key of keys) {
    const map = new Map([...(current[key] || []), ...(incoming[key] || [])].map(item => [item.id || JSON.stringify(item), item]))
    merged[key] = [...map.values()]
  }
  return merged
}

export function makeBackup(workspace) {
  return {
    app:'GapZero',
    appVersion:'0.2.0',
    schemaVersion:1,
    exportedAt:new Date().toISOString(),
    contentPacks:['gapzero-demo-2026-01'],
    data:workspace,
  }
}
