# Shayne Shi | HDR & Color Imaging

这是一个轻量级静态研究作品集网站，用来展示颜色科学、影像 ISP、HDR 图像处理相关的项目、在线 Demo 和后续内容规划。

## 目录结构

```text
.
├── index.html
├── styles.css
├── script.js
├── README.md
└── demos/
    ├── hdr-rendering-demo/
    └── hdr-to-sdr-tmo-compare/
```

## 主要文件

- `index.html`: 主页结构、导航、流程概览、项目区、Demo 区和联系信息。
- `styles.css`: 主页样式、卡片布局、响应式排版。
- `script.js`: 主页中的项目、Demo 和 Roadmap 数据。
- `demos/`: 独立 Demo 页面，每个子目录都是一个可单独打开的静态页面。

## Demo 目录命名约定

Demo 目录统一使用小写英文和连字符，名称直接描述功能：

- `hdr-rendering-demo`: HDR 显示及渲染 Demo。
- `hdr-to-sdr-tmo-compare`: HDR 到 SDR 的 TMO 对比 Demo。

后续新增 Demo 建议继续使用同一风格，例如：

- `gamut-mapping-visualizer`
- `cat16-adaptation-tool`

## 如何修改内容

1. 修改主页标题、简介、导航或联系信息：编辑 `index.html`。
2. 修改项目卡片、Demo 卡片或后续规划：编辑 `script.js`。
3. 修改视觉样式、间距、字体大小或移动端布局：编辑 `styles.css`。
4. 修改某个具体 Demo：进入 `demos/<demo-name>/`，编辑该 Demo 自己的 `index.html`、CSS 和 JS。

## 如何预览

这个项目是纯静态网站，可以直接在浏览器打开 `index.html`。

也可以使用 VS Code Live Server 或任意静态服务器预览，路径示例：

- 主页：`index.html`
- HDR 到 SDR 的 TMO 对比：`demos/hdr-to-sdr-tmo-compare/index.html`
- HDR 显示及渲染：`demos/hdr-rendering-demo/index.html`

## HDR 到 SDR 的 TMO 对比 Demo

该 Demo 位于 `demos/hdr-to-sdr-tmo-compare/`。

图片素材放在：

```text
demos/hdr-to-sdr-tmo-compare/assets/<scene-name>/
```

每个场景目录中可放置不同算法的输出图，例如：

```text
preview.png
reinhard_global.png
drago03.png
mantiuk08_cli.png
fattal_cli.png
```

场景列表、算法列表和图片路径在：

```text
demos/hdr-to-sdr-tmo-compare/script.js
```

## 部署建议

- GitHub Pages: 适合这个纯静态网站。
- Netlify: 适合拖拽部署或自动部署。
- Vercel: 后续如果升级为 React / Next.js，可以再考虑。

如果视频或 HDR 素材继续增多，建议只把轻量预览图放进仓库，大体积视频放到 Release、对象存储或 CDN。
