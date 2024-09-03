import path from 'path'
import { formatRollupOptions } from './formatter';
import { uniq, toLower, endsWith } from 'lodash-es'

const DEF_SEPARATER = '/'

/**
 * 创建打包对象
 * @param {*} taskInfos [{input,output:{dir,format,entryFileNames}}]
 * @param {*} commonOpts
 * @returns
 */
export function createBuildOptions(taskInfos = [], commonOpts) {
  const taskOpts = []
  if (Array.isArray(taskInfos)) {
    taskInfos.forEach((info) => {
      const cTask = formatRollupOptions({ ...commonOpts, ...info })
      taskOpts.push(cTask)
    })
  }
  return taskOpts
}

function mergePath(basePath, subPath, separater = DEF_SEPARATER) {
  let i = 0,
    j = 0
  const base = basePath.split(separater),
    sub = subPath.split(separater)
  // 找到连续相等的元素序列的起始和结束索引
  while (i < base.length && j < sub.length) {
    if (base[i] === sub[j]) {
      i++
      j++
    } else {
      i++
      j = 0
    }
  }

  // 如果找到了连续相等的元素序列，则删除它们
  const tmp = [...base]
  if (j > 0) {
    tmp.splice(i - j, j)
  }

  // 合并数组
  const mergedArray = [...tmp, ...sub]
  const realPath = mergedArray.join(separater)
  return realPath
}
/**
 * @deprecated  please use createPackObj
 * @param comDefines
 * @param distDir
 * @param format
 * @param rollupOpts
 * @returns
 */
export function preparePackageBuildOptions(comDefines, distDir, format = 'es', rollupOpts = {}) {
  return createPackObj(comDefines,distDir,format,rollupOpts)
}
/**
 * @deprecated please use createPackObjForJS
 * @param fileArr
 * @param distDir
 * @param format
 * @param rollupOpts
 * @returns
 */
export function preparePackageBuildOptionsOnlyJS(fileArr, distDir, format = 'es', rollupOpts = {}){
  return createPackObjForJS(fileArr,distDir,format,rollupOpts)
}

export function createPackObj(comDefines, distDir, format = 'es', rollupOpts = {}) {
  const taskInfos = []
  if (Array.isArray(comDefines)) {
    const curRootDir = process.cwd().replace(/\\/g, DEF_SEPARATER)
    // const rootDirParts = curRootDir.split(DEF_SEPARATER)
    comDefines.forEach((com) => {
      // 注意：outputFileName是为了防止同一目录下同时出现同名的vue文件和js文件
      // 因为加载时路径不带后缀，因此按照加载规则，有可能是js先加载（加载顺序可被改变）
      // 所以，出现同名不同后缀的文件时，引用需要完整的后缀，这样一来会影响组件单独打包后的文件引用，
      // 基于上述原因，定义文件增加了outputFileName，用于指定打包后的输出，而同时filename被追加了特定前缀，防止这种加载混乱
      const { filename, importPath, exportName, packageName, basedir, hasInstall, outputFileName } =
        com
      const tmpDirParts = basedir.split(DEF_SEPARATER)

      // 合并当前目录和定义中指定的组件的baseDir
      // 不能用uniq唯一,因为会存在同名的不同级目录
      const entryFilePath = mergePath(curRootDir, basedir, DEF_SEPARATER)
      const inputFile = `${entryFilePath}/${filename}`
      let outputPrefix = '' //  类似 packages/layout/src
      if (basedir.indexOf('src/') > -1) {
        //  类似 packages/layout/src/lock
        outputPrefix = basedir.substring(basedir.indexOf('src/') + 4)
      }
      const outputBase = `${distDir}/${outputPrefix}`
      // 防止filename的后缀干扰
      let fName = filename,
        tmpF = toLower(filename)
      if (endsWith(tmpF, '.js') && fName.length > 3) {
        fName = fName.slice(0, -3)
      } else if (endsWith(tmpF, '.vue') && fName.length > 4) {
        fName = fName.slice(0, -4)
      }
      taskInfos.push({
        input: inputFile,
        output: {
          dir: outputBase,
          format: format,
          entryFileNames: `${outputFileName ? outputFileName : fName}.js`
        },
        outdir: outputBase
      })
    })

    const tasks = createBuildOptions(taskInfos, rollupOpts)
    return tasks
  }
  return null
}


/**
 * 在包含sfc的包中,处理单个js打包配置的格式化
 * @param {*} fileArr
 * @param {*} distDir
 * @param {*} format
 * @param {*} rollupOpts
 * @returns
 */
export function createPackObjForJS(fileArr, distDir, format = 'es', rollupOpts = {}) {
  const taskInfos = []
  if (Array.isArray(fileArr)) {
    const curRootDir = process.cwd().replace(/\\/g, DEF_SEPARATER)
    // const rootDirParts = curRootDir.split(DEF_SEPARATER)
    fileArr.forEach((file) => {
      const { name, input } = file

      const inputFile = `${curRootDir}/${input.replace(/\\/g, DEF_SEPARATER)}`
      const outputBase = path.join(curRootDir, distDir).replace(/\\/g, DEF_SEPARATER)

      taskInfos.push({
        input: inputFile,
        output: {
          dir: outputBase,
          format: format,
          entryFileNames: `${name}.js`
        },
        outdir: outputBase
      })
    })
    const localRollupOpts = {
      ...rollupOpts,
      notVue: true // 非vue文件打包
    }
    const tasks = createBuildOptions(taskInfos, localRollupOpts)
    return tasks
  }
  return null
}

