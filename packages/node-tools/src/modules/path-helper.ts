/**
 * 归一化路径
 * @param {*} filePath
 * @returns
 */
 export function normalizePath(filePath:string):string {
  if (filePath) {
    return filePath.replace(/\\/g, '/')
  }
  return filePath
}

/**
 * 移除后缀
 * @param path
 * @returns
 */
export function removeFileExt(path: string): string {
  const lastDotIndex = path.lastIndexOf('.')
  if (lastDotIndex === -1) return path // 没有找到点，返回原路径
  return path.substring(0, lastDotIndex)
}
