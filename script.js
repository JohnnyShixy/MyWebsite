const projects = [
  {
    title: "HDR Tone Mapping 研究",
    description: "展示研究背景、算法对比、主观实验结果，以及可复现实验材料。",
    tags: ["Research", "HDR", "Visualization"],
    links: [
      { label: "项目说明", url: "#" },
      { label: "代码仓库", url: "https://github.com/yourname/project" },
    ],
  },
  {
    title: "交互式数据可视化",
    description: "用于呈现实验数据、统计结果和可交互图表的网页 Demo。",
    tags: ["D3.js", "Experiment", "Demo"],
    links: [
      { label: "在线 Demo", url: "#" },
      { label: "数据说明", url: "#" },
    ],
  },
  {
    title: "图像质量评估工具",
    description: "收集用户偏好、展示图像对比，并导出实验结果的工具页面。",
    tags: ["Web App", "Image", "User Study"],
    links: [
      { label: "工具入口", url: "#" },
      { label: "文档", url: "#" },
    ],
  },
];

const demos = [
  {
    title: "Demo A: 图像对比",
    description: "放置一个可运行的图像对比 Demo，适合展示算法效果。",
    tags: ["Before / After", "Interactive"],
    links: [{ label: "打开 Demo", url: "#" }],
  },
  {
    title: "Demo B: 实验结果看板",
    description: "放置统计图、热力图、排序结果或实验摘要。",
    tags: ["Dashboard", "Results"],
    links: [{ label: "查看看板", url: "#" }],
  },
];

const experiments = [
  {
    title: "正式实验入口",
    description: "面向被试的正式实验页面，可以替换为 Flask、问卷或外部系统链接。",
    status: "Active",
    url: "#",
  },
  {
    title: "预实验 / Pilot Study",
    description: "用于小范围测试流程、指导语和数据记录是否正常。",
    status: "Testing",
    url: "#",
  },
  {
    title: "内部测试链接",
    description: "给合作者或自己快速访问开发中的实验版本。",
    status: "Internal",
    url: "#",
  },
];

function createCard(item) {
  const card = document.createElement("article");
  card.className = "card";

  const content = document.createElement("div");
  content.innerHTML = `
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

function createExperimentLink(item) {
  const row = document.createElement("article");
  row.className = "experiment-link";
  row.innerHTML = `
    <div>
      <span class="badge">${item.status}</span>
      <h3>${item.title}</h3>
      <p>${item.description}</p>
    </div>
    <a href="${item.url}" target="_blank" rel="noreferrer">进入实验</a>
  `;
  return row;
}

document.querySelector("#project-list").append(...projects.map(createCard));
document.querySelector("#demo-list").append(...demos.map(createCard));
document.querySelector("#experiment-list").append(...experiments.map(createExperimentLink));
document.querySelector("#year").textContent = new Date().getFullYear();
