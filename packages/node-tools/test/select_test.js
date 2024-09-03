import { selectSfc } from '../dist/index.mjs'

const baseDir = process.cwd()
console.log('current work directory:', baseDir)
const selected = await selectSfc(baseDir)
console.log('scanned all')
