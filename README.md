# varlinor-node

for node environment, includes node-tools, builder, cli, etc.

## Package Introduce

### node-tools

这个包提供了一组用于 Node.js 环境的实用函数，主要专注于文件操作、JSON 解析、依赖管理和 Vue 组件扫描。它包含用于递归扫描目录、加载和解析 JSON 文件、管理依赖项、合并 TypeScript 配置别名以及提供交互式文件选择的函数。这些工具对于需要简化构建流程和高效管理项目依赖项的 Node.js 开发者特别有用。

插件则提供了一系列专注于简化前端开发构建过程的 Rollup 插件。它包括用于生成 SVG 符号、支持 Vue 3 单文件组件以及处理动态模块导入的插件。通过这些工具，开发者可以更有效地管理资源、优化构建过程，并增强项目的灵活性。

相关介绍，详见[node-tools Readme.md](./packages/node-tools/README.md)

### builder

这个包提供打包相关的一些方法

相关介绍，详见[builder Readme.md](./packages/builder/README.md)

### cli

这个包提供命令行工具
相关介绍，详见[cli Readme.md](./packages/cli/README.md)

## Contributing

Contributions are welcome! Please read the [contributing guidelines](CONTRIBUTING.md) before submitting a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
