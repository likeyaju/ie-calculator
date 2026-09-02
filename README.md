# IE计算器 V1.1

IE计算器是一个面向生产现场的纯前端工具，支持手机、平板和电脑，并可构建为单文件离线版。

## 仓库内容

- `index.html`：当前 GitHub Pages 在线部署文件。
- `source/`：Vue 3 + Vite + TypeScript 完整模块化源码，是项目的唯一真实版本。
- `releases/IE计算器-V1.1-离线版.html`：可直接双击运行的单文件离线版。

`node_modules`、`dist` 和 TypeScript 构建缓存不会上传，因为它们都能从源码重新生成。

## 恢复项目

1. 安装 Node.js 和 pnpm。
2. 进入 `source` 目录。
3. 运行 `pnpm install` 安装依赖。
4. 运行 `pnpm dev` 启动本地开发预览。

## 重新构建

在 `source` 目录运行：

```text
pnpm run build:online
```

生成在线部署版 `source/dist/index.html`。将它复制到仓库根目录的 `index.html` 后提交，即可更新 GitHub Pages。

运行：

```text
pnpm run build:single
```

生成免访问参数的单文件离线版 `source/dist/index.html`。

## 轮换二维码访问参数

在线访问Token集中在：

```text
source/src/app/appConfig.ts
```

修改该文件中的 `ONLINE_ACCESS_TOKEN`，重新构建在线版并替换仓库根目录的 `index.html`，旧二维码即可失效。

> 访问参数仅用于内部轻量防扩散，不是真正的安全认证，也不应存放敏感密码。
