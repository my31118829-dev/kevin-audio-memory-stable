import { execSync } from 'node:child_process'

function getTrackedFiles() {
  try {
    const output = execSync('git ls-files', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] })
    return output.split('\n').map(line => line.trim()).filter(Boolean)
  } catch {
    return []
  }
}

const tracked = getTrackedFiles()
const bad = tracked.filter(file => file === 'node_modules' || file.startsWith('node_modules/') || file.includes('/node_modules/'))

if (bad.length > 0) {
  console.error('Build blocked: tracked node_modules detected.')
  console.error('Run: git rm -r --cached node_modules && commit the cleanup.')
  console.error(`Detected ${bad.length} tracked path(s) under node_modules.`)
  process.exit(1)
}

console.log('Repo check passed: no tracked node_modules.')
