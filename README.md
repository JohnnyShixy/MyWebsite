# 个人项目展示网站

这是一个轻量级静态网站模板，用来展示个人项目、在线 Demo 和实验链接。

## 文件结构

- `index.html`: 页面结构和栏目入口
- `styles.css`: 页面样式和响应式布局
- `script.js`: 项目、Demo、实验链接数据

## 如何修改内容

1. 在 `index.html` 中把 `Your Name`、邮箱和 GitHub 链接替换成你的信息。
2. 在 `script.js` 中修改 `projects`、`demos`、`experiments` 数组。
3. 如果你的实验是 Flask、本地服务或问卷链接，把对应 `url` 改成真实地址。

## 如何预览

直接在浏览器打开 `index.html` 即可。也可以用 VS Code 的 Live Server 插件或任意静态服务器预览。

## 如何部署

推荐三种简单方式：

- GitHub Pages: 适合个人主页和公开项目展示。
- Netlify: 适合拖拽部署和自动部署。
- Vercel: 适合后续升级为 React / Next.js 项目。
