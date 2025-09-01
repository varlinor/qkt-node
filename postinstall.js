const fs = require('fs')
const path = require('path')

const baseRoot = process.cwd()
const target = './node_modules/.pnpm/unicorn-magic@0.1.0/node_modules/unicorn-magic/default.js'
const targetPath = path.join(baseRoot, target)
// console.log('current adapt file:',targetPath)
if (fs.existsSync(targetPath)) {
  const text = fs.readFileSync(target, 'utf-8')
  const newScript = `import {fileURLToPath} from 'node:url';

export function toPath(urlOrPath) {
  return urlOrPath instanceof URL ? fileURLToPath(urlOrPath) : urlOrPath;
}

${text}`

  if (text.indexOf('toPath(') === -1) {
    console.log('Fixing unicorn-magic script...')
    fs.writeFileSync(target, newScript, 'utf-8')
  } else {
    console.log('Skip fix unicorn-magic script. path:[%s]', targetPath)
  }
} else {
  console.error('target path is wrong:', targetPath)
}
