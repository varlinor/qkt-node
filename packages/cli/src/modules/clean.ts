import fs from 'fs-extra'
import path from 'path'

export function cleanNodeModules(baseDir, moduleName) {
  if (baseDir && moduleName) {
    const pkgPath = path.join(baseDir, moduleName, 'node_modules')
    fs.removeSync(pkgPath)
    console.log(`clean '${moduleName}/node_modules' successfully!`)
  }
}
