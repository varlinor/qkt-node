import json from '@rollup/plugin-json'
import rollupCommonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import alias from '@rollup/plugin-alias' // resolve dependencies like '../../../somemodule'
import vuePlugin from 'rollup-plugin-vue' //  as vue-loader in webpack
import rollupImage from '@rollup/plugin-image'
import rollupUrl from '@rollup/plugin-url'
import replacePlugin from '@rollup/plugin-replace'
import { babel as babelPlugin } from '@rollup/plugin-babel'
import postcss from 'rollup-plugin-postcss'
import postcssUrl from 'postcss-url'
import autoprefixer from 'autoprefixer'
import cssnano from 'cssnano'

const DEFAULT_EXTENSIONS = ['.ts', '.tsx', '.mjs', '.cjs', '.js', '.jsx', '.json', '.vue']

const DEFAULT_REPLACE_OPTIONS = {
  preventAssignment: true
}
const DEFAULT_BABEL_OPTIONS = {
  exclude: 'node_modules/**',
  extensions: DEFAULT_EXTENSIONS,
  babelHelpers: 'bundled',
  presets: [
    '@vue/babel-preset-jsx'
    /* [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        corejs: '3.31.1'
      }
    ] */
  ]
}

const DEFAULT_EXTERNALS = [
  'fs',
  'path',
  'events',
  'child_process',
  'util',
  'os',
  'process',
  'readline',
  'commander',
  'shelljs',
  'chalk',
  'promise',
  'bluebird',
  'axios',
  'element-ui',
  'sortablejs',
  'vue',
  'vue-i18n',
  'vuex',
  'vue-router',
  'nprogress',
  'nprogress/nprogress.css',
  'qs'
]

const DEFAULT_IMG_SIZE = 1 * 1024 * 1024

export function formatRollupOptions(opts = {}) {
  let replaceOpts = { ...DEFAULT_REPLACE_OPTIONS }
  if (opts.replace || (opts.rollup && opts.rollup.replace)) {
    replaceOpts = {
      ...DEFAULT_REPLACE_OPTIONS,
      ...opts.rollup.replace,
      values: {
        ...opts.replace,
        ...opts.rollup.replace.values
      }
    }
  }
  let resolveOpts = {
    extensions: DEFAULT_EXTENSIONS
  }
  if (opts.resolve) {
    resolveOpts = { extensions: DEFAULT_EXTENSIONS, ...opts.resolve }
  }

  const pluginArr = [
    replacePlugin(replaceOpts),
    alias(opts.alias),
    nodeResolve(resolveOpts),
    json(),
    rollupCommonjs()
  ]
  if (!opts.notVue) {
    pluginArr.push(
      vuePlugin({
        css: true,
        style: {
          // 处理sfc中style段的内容，但是不干涉script中 import的css文件
          postcssOptions: {
            extract: false,
            minimize: true,
            sourceMap: false
          },
          postcssPlugins: [
            postcssUrl({
              url: 'inline',
              maxSize: DEFAULT_IMG_SIZE / 1024 // 单位是kb
            }),
            autoprefixer({
              cascade: false,
              remove: false
            }),
            cssnano()
          ]
        },
        template: {
          isProduction: true
        }
      }),
      rollupUrl({
        // 处理sfc中script段里的import 图片
        limit: DEFAULT_IMG_SIZE
      }),
      postcss({
        // 处理剩余的，例如 script段中的css文件的import
        extract: false,
        inject: true,
        minimize: true,
        sourceMap: false,
        //extensions: ['.css', '.scss', '.less'],
        plugins: [
          postcssUrl({
            url: 'inline',
            maxSize: 0 //DEFAULT_IMG_SIZE / 1024 // 单位是kb
          }),
          autoprefixer({
            cascade: false,
            remove: false
          }),
          cssnano()
        ]
      })
    )
  }
  pluginArr.push(babelPlugin(DEFAULT_BABEL_OPTIONS))
  const rollupOpts = {
    input: opts.input,
    output: opts.output,
    plugins: pluginArr,
    external: opts.externals ? [...DEFAULT_EXTERNALS, ...opts.externals] : DEFAULT_EXTERNALS,
    onwarn(warning, rollupWarn) {
      // see at https://github.com/rollup/rollup/issues/1518
      if (warning.code === 'THIS_IS_UNDEFINED') return
      rollupWarn(warning) // this requires Rollup 0.46
    }
  }
  return rollupOpts
}
