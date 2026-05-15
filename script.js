const projects = [
  {
    title: "颜色管理流程",
    meta: "系统框架",
    description:
      "梳理从输入图像、工作色彩空间、白点适配、编码转换到目标显示的完整链路，作为后续 TMO、Gamut Mapping 和 HDR 显示适配的共同底座。",
    tags: ["Color Pipeline", "ICC / OCIO", "White Point"],
    links: [
      { label: "项目说明", url: "#" },
      { label: "流程图", url: "#" },
    ],
  },
  {
    title: "色调映射 Tonemapping",
    meta: "核心算法",
    description:
      "研究如何把 HDR 场景亮度压缩到目标显示范围，同时尽量保留局部对比度、明暗层次和自然观感。适合放 Reinhard、Drago、Mantiuk、Fattal 等方法对比。",
    tags: ["HDR", "Tone Mapping", "Perception"],
    links: [
      { label: "算法记录", url: "#" },
      { label: "打开 Demo", url: "demos/tmo-static/" },
    ],
  },
  {
    title: "色域映射 Gamut Mapping",
    meta: "颜色适配",
    description:
      "处理源色域到目标色域时的越界颜色，比较裁剪、压缩、感知保持等策略，重点观察高饱和颜色的色相偏移和细节损失。",
    tags: ["Gamut", "Display P3", "BT.2020"],
    links: [
      { label: "研究笔记", url: "#" },
      { label: "结果对比", url: "#" },
    ],
  },
  {
    title: "HDR 源到 HDR 显示",
    meta: "显示链路",
    description:
      "面向 HDR 显示设备保留高亮细节和亮度层次，关注 PQ / HLG、峰值亮度、元数据、显示能力与视觉一致性之间的关系。",
    tags: ["PQ / HLG", "HDR Display", "Metadata"],
    links: [
      { label: "流程说明", url: "#" },
      { label: "测试材料", url: "#" },
    ],
  },
  {
    title: "HDR 源到 SDR 显示",
    meta: "兼容输出",
    description:
      "把 HDR 内容转换到普通 SDR 屏幕可稳定观看的版本，结合色调映射、色域映射和亮度重分配，适合展示网页端预览结果。",
    tags: ["HDR to SDR", "Rec.709", "Web Preview"],
    links: [
      { label: "转换流程", url: "#" },
      { label: "样例结果", url: "#" },
    ],
  },
  {
    title: "色适应 CAT16",
    meta: "感知模型",
    description:
      "用 CAT16 描述不同观察条件和白点之间的颜色外观变化，作为颜色管理流程中连接设备无关颜色与观看环境的重要模块。",
    tags: ["CAT16", "Color Appearance", "Adaptation"],
    links: [
      { label: "模型说明", url: "#" },
      { label: "计算示例", url: "#" },
    ],
  },
];

const demos = [
  {
    title: "HDR显示及渲染",
    meta: "可打开",
    description:
      "展示 HDR 内容在目标显示条件下的渲染效果，关注亮度层次、高光保留、显示峰值与视觉一致性。",
    tags: ["HDR Display", "Rendering", "Preview"],
    links: [{ label: "占位入口", url: "#" }],
  },
  {
    title: "HDR到SDR的TMO对比",
    meta: "可交互",
    description:
      "比较同一 HDR 源图经过不同 tone mapping 方法转换到 SDR 后的结果，支持单算法查看、双算法并排、同步放大和 EXR 数据视图占位。",
    tags: ["HDR to SDR", "TMO", "Interactive Compare"],
    links: [{ label: "打开 Demo", url: "demos/tmo-static/" }],
  },
  {
    title: "色域映射可视化",
    meta: "规划中",
    description:
      "展示源色域与目标色域边界，配合图像结果或色点分布图，观察越界颜色如何被压缩或裁剪。",
    tags: ["Gamut", "Chromaticity", "Visualizer"],
    links: [{ label: "占位入口", url: "#" }],
  },
  {
    title: "CAT16色适应工具",
    meta: "规划中",
    description:
      "输入源白点、目标白点和观察环境，显示 CAT16 适应前后的颜色变化，适合做成轻量交互工具。",
    tags: ["CAT16", "White Point", "Interactive"],
    links: [{ label: "占位入口", url: "#" }],
  },
];

const roadmap = [
  {
    title: "显示流程整理",
    description:
      "整理 HDR Source -> Color Management -> Mapping -> Display Target 的主线流程，明确各个模块之间的输入输出关系。",
  },
  {
    title: "核心算法对比",
    description:
      "补充 Tonemapping、Gamut Mapping、CAT16 等方向的算法说明、参数设置和图像对比结果。",
  },
  {
    title: "交互 Demo 扩展",
    description:
      "逐步完善 HDR显示及渲染、HDR到SDR的TMO对比、色域映射可视化和 CAT16色适应工具。",
  },
];

function createCard(item) {
  const card = document.createElement("article");
  card.className = "card";

  const content = document.createElement("div");
  content.innerHTML = `
    <span class="card-meta">${item.meta}</span>
    <h3>${item.title}</h3>
    <p>${item.description}</p>
    <div class="tags">${item.tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>
  `;

  const links = document.createElement("div");
  links.className = "card-links";
  links.innerHTML = item.links
    .map((link) => `<a href="${link.url}" target="_blank" rel="noreferrer">${link.label}</a>`)
    .join("");

  card.append(content, links);
  return card;
}

function createRoadmapItem(item, index) {
  const row = document.createElement("article");
  row.className = "roadmap-item";
  row.innerHTML = `
    <span>${String(index + 1).padStart(2, "0")}</span>
    <div>
      <h3>${item.title}</h3>
      <p>${item.description}</p>
    </div>
  `;
  return row;
}

document.querySelector("#project-list").append(...projects.map(createCard));
document.querySelector("#demo-list").append(...demos.map(createCard));
document.querySelector("#roadmap-list").append(...roadmap.map(createRoadmapItem));
document.querySelector("#year").textContent = new Date().getFullYear();
