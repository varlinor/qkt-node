// 组件定义接口
export interface SfcDefineInfo {
  // 包名
  packageName: string;
  // 基础目录路径
  basedir: string;
  // 组件文件名
  filename: string;
  // 导出的组件名称
  exportName: string;
  // 导入路径
  importPath: string;
  // 输出文件名
  outputFileName: string;
  // 输出路径
  outputPath: string;
}