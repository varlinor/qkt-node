# varlinor-node

一套用于 Node.js 环境的工具集，专注于简化 Vue.js 项目的构建流程。包含构建工具、CLI 命令行工具和实用函数库，特别适用于 Vite + Vue 3 项目。

A toolkit for Node.js environments, focusing on simplifying the build process for Vue.js projects. Includes build tools, CLI utilities, and utility function libraries, especially suitable for Vite + Vue 3 projects.

## Requirements

- **Node.js**: >= 18.0.0
- **Package Manager**: npm, pnpm, or yarn
- **Vite**: >= 5.0.0 (for builder-vue3)
- **Vue**: >= 3.0.0 (for builder-vue3)

详细的环境要求和兼容性说明，请查看 [系统要求文档](./docs/requirements.md) 和 [版本兼容性说明](./docs/compatibility.md)。

For detailed requirements and compatibility information, please see [Requirements](./docs/requirements.md) and [Compatibility Guide](./docs/compatibility.md).

## Package Introduce

### node-tools

这个包提供了一组用于 Node.js 环境的实用函数，主要专注于文件操作、JSON 解析、依赖管理和 Vue 组件扫描。它包含用于递归扫描目录、加载和解析 JSON 文件、管理依赖项、合并 TypeScript 配置别名以及提供交互式文件选择的函数。这些工具对于需要简化构建流程和高效管理项目依赖项的 Node.js 开发者特别有用。

插件则提供了一系列专注于简化前端开发构建过程的 Rollup 插件。它包括用于生成 SVG 符号、支持 Vue 3 单文件组件以及处理动态模块导入的插件。通过这些工具，开发者可以更有效地管理资源、优化构建过程，并增强项目的灵活性。

相关介绍，详见[node-tools Readme.md](./packages/node-tools/README.md)

### builder-vue2

这个包提供 vue2 工程打包相关的一些方法

相关介绍，详见[builder-vue2 Readme.md](./packages/builder-vue2/README.md)

### builder-vue3

这个包提供 vue3 工程打包相关的一些方法

相关介绍，详见[builder-vue3 Readme.md](./packages/builder-vue3/README.md)

### cli

这个包提供命令行工具
相关介绍，详见[cli Readme.md](./packages/cli/README.md)

## Documentation

- [系统要求和环境依赖](./docs/requirements.md) - System Requirements
- [版本兼容性说明](./docs/compatibility.md) - Version Compatibility
- [常见问题/故障排除](./docs/troubleshooting.md) - Troubleshooting

## Contributing

Contributions are welcome! Please read the [contributing guidelines](CONTRIBUTING.md) before submitting a pull request.

## License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.
