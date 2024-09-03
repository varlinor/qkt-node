import path from 'path'
import fs from 'fs-extra'
import { dependencies } from './package.json'
import { defineBuildConfig } from 'unbuild'
import { getAllDependencies } from '@varlinor/node-tools'

const entries = [
  { name: 'index', input: './src/index.ts' },
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
