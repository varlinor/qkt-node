import fs from 'fs-extra'
import os from 'os'
import path from 'path'
import YAML from 'yaml'
import shell from 'shelljs'
import semver from 'semver'
import { normalizePath } from '@qkt/node-tools'

/**
 * node ./internal/cli/dist/qkt-cli.mjs semver -i
 * node ./internal/cli/dist/qkt-cli.mjs semver -r
 * node ./internal/cli/dist/qkt-cli.mjs semver -s ajreport-snapshot
 * 如果changeset在预发版状态,即存在pre.json时,
 * 执行 node ./internal/cli/dist/qkt-cli.mjs semver -c snapshot 会自动读取pre.json中的tag字段,用作prerelease 信息的拼接
 */

function checkPrepare(baseDir) {
  // 检查是否是项目根目录:package.json\.gitignore
  console.log('checking base directory...')
  const pkgPath = path.join(baseDir, 'package.json')
  const ignore = path.join(baseDir, '.gitignore')
  return fs.existsSync(pkgPath) && fs.existsSync(ignore)
}

/**
 * 列出所有的包定义文件
 * @param {*} packageRoot
 * @returns
 */
function listAllPackageFiles(packageRoot) {
  const pkgFiles = []
  if (fs.existsSync(packageRoot)) {
    const subPkgs = fs.readdirSync(packageRoot, { withFileTypes: true })
    subPkgs.forEach((sub) => {
      const subPkg = path.join(packageRoot, sub.name, 'package.json')
      if (sub.isDirectory() && fs.existsSync(subPkg)) {
        pkgFiles.push(subPkg)
      }
    })
  }
  return pkgFiles
}

/**
 * 从指定目录获取版本信息
 * @param {*} baseDir
 * @returns
 */
// pnpm-workspace.yaml\packages目录
function parsePackageInfo(baseDir) {
  const wsDef = path.join(baseDir, 'pnpm-workspace.yaml')
  const pkgRoot = path.join(baseDir, 'packages')
  console.log('loading workspace define file...')
  const packagePath = []
  if (fs.existsSync(wsDef)) {
    const content = fs.readFileSync(wsDef, 'utf-8')
    const { packages: pkgDefs } = YAML.parse(content)
    // console.log('define info is:', pkgDefs)
    // get package dir
    pkgDefs.forEach((p) => {
      let packageRoot
      if (p.endsWith('/*')) {
        // 需要遍历下面多个目录
        packageRoot = path.join(baseDir, p.slice(0, -2))
      } else {
        packageRoot = path.join(baseDir, p)
      }
      const curPkgFiles = listAllPackageFiles(packageRoot)
      packagePath.push(...curPkgFiles)
    })
  } else if (fs.existsSync(pkgRoot)) {
    // get package dir
    const pkgFiles = listAllPackageFiles(pkgRoot)
    packagePath.push(...pkgFiles)
  }

  console.log('get all package files...')
  const pkgInfos = []
  if (packagePath.length) {
    // 根据changset的配置文件做清洗,以防扩大范围
    let changesetIgnoreList = []
    const changesetCfgFile = path.join(baseDir, '.changeset/config.json')
    if (fs.existsSync(changesetCfgFile)) {
      const changesetCfg = fs.readFileSync(changesetCfgFile, { encoding: 'utf-8' })
      const { ignore } = JSON.parse(changesetCfg)
      changesetIgnoreList = ignore
      console.log('Ignore packages:', JSON.stringify(changesetIgnoreList))
    }

    packagePath.forEach((pkg) => {
      const jsonstr = fs.readFileSync(pkg, { encoding: 'utf-8' })
      try {
        const json = JSON.parse(jsonstr)
        const { version, name } = json
        const ignorePackage = changesetIgnoreList && changesetIgnoreList.find((p) => p == name)
        if (!ignorePackage) {
          // console.log('add package:%s , current version: %s', name, version)
          pkgInfos.push({
            name,
            version,
            packageFile: pkg
          })
        }
      } catch (error) {
        console.error(error)
      }
    })
  }
  return pkgInfos
}

/**
 * 批量从registry获取版本信息
 * @param {*} pkgInfos
 */
async function collectAllPackageRegistryInfo(pkgInfos) {
  if (pkgInfos) {
    const promiseArr = []
    pkgInfos.forEach((pkgInfo) => {
      const { name, version } = pkgInfo
      promiseArr.push(
        new Promise((resolve) => {
          shell.exec(`npm view ${name} versions`, (code, stdout, stderr) => {
            if (code == 0) {
              if (typeof stdout === 'string') {
                let output
                const tmpStr = stdout.replace(/[\n\s]+/g, '').replace(/'/g, '"')
                if (tmpStr.indexOf('[') < 0 && tmpStr.indexOf(']') < 0) {
                  // 纯字符串,非数组
                  output = tmpStr ? [tmpStr] : []
                } else [(output = JSON.parse(tmpStr))]
                resolve(output)
              }
            } else [resolve([])]
          })
        })
      )
    })
    const allPackageInfo = await Promise.all(promiseArr)
      .then((results) => {
        const totalInfo = []
        if (results.length === pkgInfos.length) {
          results.forEach((r, idx) => {
            const { name, version, packageFile } = pkgInfos[idx]
            const sorted = r.length ? r.sort(semver.compare) : r
            totalInfo.push({
              name,
              packageFile,
              localVer: version,
              registryVers: sorted.reverse()
            })
          })
        }
        return totalInfo
      })
      .catch((err) => {
        console.error(err)
      })
    return allPackageInfo
  }
}

export async function processPackageInfos(baseDir, opts) {
  const { create, info, remote, output } = opts
  let snapshot = opts.snapshot
  let changesetPreCfg
  const changesetRoot = path.join(baseDir, '.changeset')
  if (checkPrepare(baseDir)) {
    const pkgInfos = parsePackageInfo(baseDir)
    if (info) {
      pkgInfos.forEach((pkg) => {
        console.log('package: %s , version in project: %s', pkg.name, pkg.version)
      })
      return
    }
    // 判断changeset的pre.json是否存在,如果存在,从pre.json上获取snapshot
    const changesetPreCfgFile = path.join(changesetRoot, 'pre.json')
    if (fs.existsSync(changesetPreCfgFile) && !snapshot) {
      const changesetPreCfgStr = fs.readFileSync(changesetPreCfgFile, { encoding: 'utf-8' })
      changesetPreCfg = JSON.parse(changesetPreCfgStr)
      snapshot = changesetPreCfg.tag
      console.log('release version for tag: %s ', snapshot)
    }

    const preparedPkgs = await collectAllPackageRegistryInfo(pkgInfos)
    if (Array.isArray(preparedPkgs)) {
      if (remote) {
        preparedPkgs.forEach((pkg) => {
          console.log(
            'package: %s , version in registry: %s',
            pkg.name,
            JSON.stringify(pkg.registryVers)
          )
        })
        return
      }
      if (!create && !snapshot) {
        return
      }
      let releaseType = 'patch',
        prerelease = ''
      if (create == 'major') {
        releaseType = 'major'
      } else if (create == 'minor') {
        releaseType = 'minor'
      } else {
        releaseType = 'patch'
        if (snapshot) {
          releaseType = 'prerelease'
          prerelease = snapshot
        }
      }

      const modifyPromiseArr = []
      preparedPkgs.forEach((pkgInfo) => {
        const { name, localVer, registryVers, packageFile } = pkgInfo
        /* 处理逻辑如下:
        1. 判断本地版本是否在远程版本列表中,如果存在且X.Y.Z最大,直接版本加一,如果是快照,则按照快照规则追加
        */
        modifyPromiseArr.push(
          new Promise((resolve) => {
            let newVer
            if (!registryVers.length) {
              // 初次发包
              newVer = semver.inc(localVer, releaseType, prerelease)
            } else if (registryVers.find((r) => r == localVer)) {
              // 直接追加
              newVer = semver.inc(localVer, releaseType, prerelease)
            } else {
              let latestVer = registryVers[0]

              // 如果是2个不同的分支的快照,则无法直接比对大小,在加上版本发布后获取的registry可能会比较乱,因此需要筛选
              const localSemVer = semver.parse(localVer)
              const localMainVer = `${localSemVer.major}.${localSemVer.minor}.${localSemVer.patch}`
              let snapshotKey, prereleaseVer
              if (localSemVer.prerelease.length) {
                const [snapshotName, ver] = localSemVer.prerelease
                snapshotKey = snapshotName
                prereleaseVer = ver
              }

              for (let i = 0; i < registryVers.length; i++) {
                const rVer = registryVers[i]
                const rSemver = semver.parse(rVer)
                const rMain = `${rSemver.major}.${rSemver.minor}.${rSemver.patch}`
                if (semver.eq(rMain, localMainVer)) {
                  if (rSemver.prerelease.length && rSemver.prerelease[0] == snapshotKey) {
                    latestVer = rVer
                  } else {
                    latestVer = rMain
                  }
                  /*
                  diff('1.2.3-aj-snapshot.1','1.2.4-aj-snapshot.2')  --> 'prepatch'
                  diff('1.2.3-aj-snapshot.1','1.2.3-aj-snapshot.2')  --> 'prerelease'
                  diff('1.3.3-aj-snapshot.1','1.2.3-aj-snapshot.2')  --> 'preminor'
                  diff('1.3.3','1.2.3')  --> 'minor'
                  diff('1.2.3','1.2.3-aj-snapshot.2')  --> 'patch'
                  */
                  const diffType = semver.diff(localSemVer, latestVer)
                  if (diffType == 'prerelease') {
                    // 同版本快照
                    releaseType = diffType
                  } else if (diffType == 'prepatch') {
                    // 补丁快照
                    releaseType = diffType
                    // } else if (diffType == 'preminor') {
                    //   // 次要版本快照
                    //   releaseType = diffType
                  }
                  // 因为已经倒序了,所以找到匹配的第一个,直接跳出循环
                  break
                }
              }

              // 跟最新版本比较大小
              if (semver.lte(localVer, latestVer)) {
                newVer = semver.inc(latestVer, releaseType, prerelease)
              } else {
                newVer = semver.inc(localVer, releaseType, prerelease)
              }
            }
            // console.log('%s - new version:', name, newVer)
            resolve({
              name,
              version: newVer,
              packageFile
            })
          })
        )
      })
      const preparePkgs = await Promise.all(modifyPromiseArr)
      console.log("Ready to update 'package.json' files:")
      const successedList = updatePackageFiles(preparePkgs)

      // 判断是否输出到templates/package.json
      console.log('check params:[output]:', output)
      if (output) {
        console.log('ready to modify template package.json file!')
        const targetFile = path.join(baseDir, 'templates/package.json')
        updateTemplatePackageFile(targetFile, successedList)
      }

      prepareChangesetPreInfo(changesetRoot, changesetPreCfg, releaseType, successedList)
    } else {
      console.log('packageInfo is empty, please check!')
    }
  } else {
    console.log('Current path [%s] is not project root path, cannot execute this command!')
  }
}

/**
 * 根据列表更改包定义文件
 * @param {*} prepareList
 */
export function updatePackageFiles(prepareList) {
  const successed = []
  if (Array.isArray(prepareList)) {
    prepareList.forEach((item) => {
      const { name, version, packageFile } = item
      if (fs.existsSync(packageFile)) {
        // 读文件
        const pkgStr = fs.readFileSync(packageFile, { encoding: 'utf-8' })
        const packageData = JSON.parse(pkgStr)
        //  改版本
        if (name == packageData.name && semver.valid(version)) {
          packageData.version = version

          // 保存修改后的 package.json 文件
          fs.writeFileSync(packageFile, JSON.stringify(packageData, null, 2), 'utf-8')
          successed.push({ name, version })
          console.log('%s has been updated --> %s | %s', name, version, packageFile)
        } else {
          console.warn('Package is not correct or version is illegal')
        }
      }
    })
    console.log('All package file have been updated!')
  }
  return successed
}

async function prepareChangesetPreInfo(changesetRoot, preCfgData, releaseType, pkgInfos) {
  if (changesetRoot && preCfgData && releaseType && Array.isArray(pkgInfos)) {
    // create md file
    const { code, stdout } = shell.exec(`pnpm changeset --empty`)
    let verFileName
    if (code == 0 && typeof stdout === 'string') {
      const regex = /(?:\/|\\)([^\/\\]+\.md)/ // 提取changeset自动生成文件的文件名
      const matchStrArr = stdout.match(regex)
      if (matchStrArr && matchStrArr[1]) {
        verFileName = matchStrArr[1].slice(0, -3) // 移除.md后缀
      }
    }
    if (!verFileName) {
      const files = fs.readdirSync(changesetRoot, { withFileTypes: true })
      const seq = files.length + 1
      verFileName = `auto-${seq}-${releaseType}`
      shell.ShellString('').to(path.join(changesetRoot, `${verFileName}.md`))
    }

    let changesetType = releaseType
    if (releaseType == 'prerelease' || releaseType == 'prepatch') {
      changesetType = 'patch'
    }
    // 收集变更包的信息
    const contentArr = ['---']
    pkgInfos.forEach((pkg) => {
      const { name } = pkg
      contentArr.push(`'${name}': ${changesetType}`)
    })
    contentArr.push('---')
    contentArr.push('')
    contentArr.push(`auto generate ${releaseType} version`)

    // 写版本记录 markdown文件
    const content = contentArr.join(os.EOL)
    shell.ShellString(content).to(path.join(changesetRoot, `${verFileName}.md`))
    // 回写pre.json
    preCfgData.changesets.push(verFileName)
    fs.writeFileSync(
      path.join(changesetRoot, 'pre.json'),
      JSON.stringify(preCfgData, null, 2),
      'utf-8'
    )
    console.log('All version info has been recorded into Changeset config: pre.json')
  } else {
    console.error('Parameters Error!')
  }
}

/**
 * 将版本信息同步到模板文件中
 * @param {*} targetFile
 * @param {*} versionList
 */
function updateTemplatePackageFile(targetFile, versionList) {
  if (Array.isArray(versionList) && fs.existsSync(targetFile)) {
    const versionMap = {}
    let mainVer
    versionList.forEach((v) => {
      versionMap[v.name] = v.version
      if (v.name == '@qkt2/common') {
        mainVer = v.version
      }
    })
    const replaceVersion = (pkgs) => {
      for (const key in pkgs) {
        if (Object.hasOwnProperty.call(pkgs, key) && versionMap.hasOwnProperty(key)) {
          pkgs[key] = versionMap[key]
        }
      }
      return pkgs
    }
    const contentStr = fs.readFileSync(targetFile, { encoding: 'utf-8' })
    const tempDefines = JSON.parse(contentStr)
    const { dependencies, devDependencies } = tempDefines
    const tmpD = replaceVersion(dependencies)
    const tmpDev = replaceVersion(devDependencies)

    if (mainVer) {
      tempDefines.version = mainVer
    }
    tempDefines.dependencies = tmpD
    tempDefines.devDependencies = tmpDev

    fs.writeFileSync(targetFile, JSON.stringify(tempDefines, null, 2), { encoding: 'utf-8' })
    console.log('templates/package.json has been updated to new versions!')
  }
}
