import { defineBuildConfig } from 'unbuild'
import path from 'path'
import fs from 'fs-extra'
import { dependencies } from './package.json'
import { devDependencies } from '../../package.json'
import { getAllDependencies } from '@varlinor/node-tools'

console.log('prepare for build lib:')
const entries = [
  { name: 'index', input: './src/index.ts' },
  { name: 'utils/dynamic-import', input: './src/utils/dynamic-import.ts' },
  { name: 'vue2', input: './src/vue2/index.ts' },
  { name: 'vue3', input: './src/vue3/index.ts' }
]

// 获取externals
const externals = getAllDependencies(dependencies)
const devExternals = getAllDependencies(devDependencies)
externals.push(...devExternals)

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
