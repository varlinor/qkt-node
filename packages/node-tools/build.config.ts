import { defineBuildConfig } from 'unbuild'
import path from 'path'
import fs from 'fs-extra'
import { dependencies } from './package.json'
import { getAllDependencies } from './src/index'


console.log('prepare for build lib:')
const entries = [
  { name: 'index', input: './src/index.ts' },
  { name: 'plugins', input: './src/plugins/index.ts' },
]

// 获取externals
const externals = getAllDependencies(dependencies)

export default defineBuildConfig({
  entries,
  failOnWarn: false,
  clean: true,
  declaration: false,
  externals,
  rollup: {
    emitCJS: true
  }
})
