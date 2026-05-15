const algorithms = [
  { id: "reinhard_global", name: "Reinhard Global", type: "Global", note: "Photographic global tone reproduction baseline." },
  { id: "drago03", name: "Drago", type: "Log", note: "Adaptive logarithmic mapping for high-contrast scenes." },
  { id: "ward_global", name: "Ward Global", type: "Global", note: "Contrast-based global luminance scale factor." },
  { id: "shayne_tmo", name: "My TMO (Shayne)", type: "Proposed", note: "Project method copied from the final-paper MATLAB implementation." },
  { id: "icam06", name: "iCAM06", type: "Appearance", note: "Image appearance model based HDR rendering." },
  { id: "tmoz", name: "TMOz", type: "CAM16-Q", note: "Perceptual tone mapping model using CAM16-Q." },
  { id: "hui", name: "Hui", type: "Cluster", note: "Clustering-based MATLAB tone mapping implementation." },
  { id: "khan", name: "Khan", type: "TVI", note: "Adaptive TVI tone mapping with visual sensitivity." },
  { id: "liang", name: "Liang", type: "Layer", note: "Layer decomposition based tone mapping implementation." },
  { id: "durand_cli", name: "Durand", type: "Local", note: "Fast bilateral filtering via Luminance HDR CLI." },
  { id: "fattal_cli", name: "Fattal", type: "Gradient", note: "Gradient-domain compression via Luminance HDR CLI." },
  { id: "mantiuk08_cli", name: "Mantiuk", type: "Display", note: "Display-adaptive tone mapping via Luminance HDR CLI." },
];

const exrViews = {
  preview: {
    label: "SDR preview of the HDR source.",
    path: "preview.png",
  },
  log: {
    label: "Log luminance view for reading shadows and highlights together.",
    path: "exr-log-luminance.png",
  },
  "false-color": {
    label: "False-color luminance map for EV or log-luminance inspection.",
    path: "exr-false-color.png",
  },
};

const scenes = [
  createScene("LabWindow", "LabWindow", "Indoor scene with a bright exterior view, useful for judging highlight compression and shadow detail."),
  createScene("HDRMark", "HDRMark", "Portrait-oriented HDR scene for checking skin tone stability and natural face rendering."),
  createScene("Peppermill", "Peppermill", "Night scene with small point lights, deep shadows, and strong local contrast."),
  createScene("CemeteryTree_1_", "CemeteryTree(1)", "Strong backlight scene for testing silhouette preservation and highlight roll-off."),
  createScene("LuxoDoubleChecker", "LuxoDoubleChecker", "Extreme dynamic range target for stress-testing highlight loss, contrast, and tone scale behavior."),
  createScene("Flamingo", "Flamingo", "Highly saturated colors for evaluating hue preservation and saturation handling."),
  createScene("BarHarborSunrise", "BarHarborSunrise", "Sunrise sky with smooth gradients, suited for banding and luminance transition checks."),
  createScene("PeckLake", "PeckLake", "Outdoor landscape with water and foliage, useful for balancing natural contrast and midtone detail."),
];

const sceneHistograms = {
  LabWindow: { bins: [0.0236, 0.0387, 0.0595, 0.085, 0.065, 0.0373, 0.0343, 0.0374, 0.0276, 0.0424, 0.0893, 0.1253, 0.1493, 0.2278, 0.1836, 0.1633, 0.2092, 0.2256, 0.2774, 0.4088, 1, 0.3897, 0.2657, 0.2534, 0.2358, 0.2274, 0.1753, 0.1937, 0.1497, 0.0919, 0.0811, 0.1051, 0.133, 0.1348, 0.1392, 0.1309, 0.1129, 0.0953, 0.1067, 0.0884, 0.0795, 0.0723, 0.057, 0.0515, 0.0499, 0.0434, 0.0616, 0.0465], ticks: [-2.99, -1.74, -0.49, 0.76, 2.02] },
  HDRMark: { bins: [0.0094, 0.0131, 0.0125, 0.0077, 0.0047, 0.0108, 0.0134, 0.0249, 0.0788, 0.1359, 0.2421, 0.6569, 0.9784, 0.8291, 0.8464, 0.7431, 0.6234, 0.6055, 1, 0.4676, 0.3735, 0.3209, 0.1788, 0.2096, 0.31, 0.1523, 0.1396, 0.1311, 0.1314, 0.1482, 0.1572, 0.1354, 0.1232, 0.1343, 0.0956, 0.1082, 0.1025, 0.0791, 0.1148, 0.0736, 0.0491, 0.0559, 0.0229, 0.0163, 0.0615, 0.0129, 0.0163, 0.1077], ticks: [-2.94, -1.71, -0.48, 0.76, 1.99] },
  Peppermill: { bins: [0.0085, 0.0128, 0.0206, 0.0397, 0.0631, 0.101, 0.1586, 0.2143, 0.2123, 0.241, 0.3067, 0.2725, 0.2546, 0.2404, 0.2779, 0.2823, 0.3419, 0.4639, 0.691, 1, 0.9594, 0.8247, 0.7456, 0.6282, 0.4945, 0.3503, 0.2094, 0.127, 0.0954, 0.0772, 0.0662, 0.0588, 0.0539, 0.0534, 0.045, 0.0423, 0.0444, 0.0437, 0.0324, 0.0253, 0.0211, 0.0184, 0.0093, 0.0057, 0.0037, 0.0021, 0.0021, 0.0013], ticks: [-3.32, -2.11, -0.89, 0.32, 1.53] },
  CemeteryTree_1_: { bins: [0.0141, 0.0225, 0.0355, 0.0557, 0.0883, 0.1391, 0.2091, 0.3071, 0.4525, 0.6423, 0.8389, 0.9848, 1, 0.982, 0.9775, 0.9264, 0.8285, 0.7958, 0.7677, 0.7404, 0.6825, 0.6262, 0.5999, 0.5271, 0.4844, 0.4929, 0.5139, 0.5345, 0.5719, 0.6095, 0.6338, 0.6517, 0.6492, 0.6311, 0.6009, 0.5511, 0.4849, 0.4367, 0.4252, 0.7549, 0.738, 0.4131, 0.3273, 0.2056, 0.1323, 0.1089, 0.0993, 0.0426], ticks: [-2.23, -1.43, -0.63, 0.17, 0.97] },
  LuxoDoubleChecker: { bins: [0.103, 0.5161, 0.3125, 0.3003, 0.6196, 0.5524, 0.4452, 0.2951, 0.2896, 0.3096, 0.5256, 1, 0.8496, 0.4718, 0.3538, 0.2736, 0.2654, 0.2291, 0.151, 0.1188, 0.084, 0.1169, 0.1546, 0.1245, 0.1145, 0.0942, 0.1286, 0.1224, 0.1278, 0.1465, 0.115, 0.1443, 0.0919, 0.1369, 0.0843, 0.0772, 0.0475, 0.0407, 0.0542, 0.0211, 0.0289, 0.0323, 0.002, 0.0003, 0.0019, 0.0147, 0.0173, 0.0107], ticks: [-2.68, -1.31, 0.07, 1.45, 2.83] },
  Flamingo: { bins: [0.0754, 0.1186, 0.0103, 0.2636, 0.0842, 0.3532, 0.348, 0.2513, 0.4032, 0.5209, 0.5935, 0.5497, 0.5475, 0.5633, 0.5197, 0.3625, 0.2549, 0.2812, 0.3934, 0.5478, 0.6463, 0.7369, 0.8876, 0.9069, 0.8212, 0.9345, 1, 0.8679, 0.7298, 0.7728, 0.9278, 0.993, 0.7642, 0.7678, 0.7921, 0.5317, 0.434, 0.3161, 0.207, 0.1332, 0.1072, 0.0988, 0.0913, 0.0776, 0.0528, 0.0492, 0.0203, 0.0097], ticks: [-4.93, -3.46, -1.98, -0.51, 0.96] },
  BarHarborSunrise: { bins: [0.0099, 0.0204, 0.033, 0.0455, 0.0606, 0.088, 0.1278, 0.1832, 0.2387, 0.2899, 0.3088, 0.315, 0.2689, 0.2074, 0.1344, 0.0714, 0.0485, 0.0373, 0.032, 0.0308, 0.0321, 0.0448, 0.0984, 0.2302, 0.5081, 0.8339, 0.939, 1, 0.7867, 0.4679, 0.267, 0.1632, 0.1069, 0.0684, 0.0475, 0.0299, 0.0195, 0.0123, 0.0083, 0.0057, 0.0041, 0.0042, 0.0037, 0.0029, 0.0024, 0.0022, 0.002, 0.0017], ticks: [-2.48, -1.52, -0.56, 0.39, 1.35] },
  PeckLake: { bins: [0.0072, 0.0103, 0.0151, 0.0213, 0.03, 0.0427, 0.0591, 0.0815, 0.103, 0.1246, 0.145, 0.1677, 0.1924, 0.2442, 0.3262, 0.3613, 0.4055, 0.4475, 0.4745, 0.4847, 0.4841, 0.4801, 0.4832, 0.4818, 0.4711, 0.4547, 0.4357, 0.4702, 0.5306, 0.449, 0.3924, 0.4317, 0.4572, 0.4397, 0.4226, 0.4684, 0.5742, 1, 0.4896, 0.7327, 0.3048, 0.2692, 0.2152, 0.2499, 0.2624, 0.2509, 0.1812, 0.074], ticks: [-2.14, -1.37, -0.61, 0.16, 0.92] },
};

const state = {
  sceneId: scenes[0].id,
  mode: "single",
  algorithmA: "reinhard_global",
  algorithmB: "shayne_tmo",
  exrView: "preview",
  activePane: 0,
  paneViews: [
    { zoom: 1, pan: { x: 0, y: 0 } },
    { zoom: 1, pan: { x: 0, y: 0 } },
  ],
};

const elements = {
  sceneList: document.querySelector("#scene-list"),
  modeButtons: Array.from(document.querySelectorAll(".mode-button")),
  algorithmA: document.querySelector("#algorithm-a"),
  algorithmB: document.querySelector("#algorithm-b"),
  algorithmBField: document.querySelector("#algorithm-b-field"),
  zoomReset: document.querySelector("#zoom-reset"),
  syncZoom: document.querySelector("#sync-zoom"),
  currentScene: document.querySelector("#current-scene"),
  sceneNote: document.querySelector("#scene-note"),
  viewerStatus: document.querySelector("#viewer-status"),
  imageStage: document.querySelector("#image-stage"),
  exrButtons: Array.from(document.querySelectorAll(".exr-button")),
  exrImage: document.querySelector("#exr-image"),
  exrCaption: document.querySelector("#exr-caption"),
  histogram: document.querySelector("#histogram"),
  histogramAxis: document.querySelector("#histogram-axis"),
};

function createScene(id, name, note) {
  return {
    id,
    name,
    note,
    images: Object.fromEntries(
      algorithms.map((algorithm) => [algorithm.id, `assets/${id}/${algorithm.id}.png`])
    ),
    exr: Object.fromEntries(
      Object.entries(exrViews).map(([key, view]) => [key, `assets/${id}/${view.path}`])
    ),
  };
}

function getScene() {
  return scenes.find((scene) => scene.id === state.sceneId);
}

function getAlgorithm(id) {
  return algorithms.find((algorithm) => algorithm.id === id);
}

function escapeText(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function placeholderSvg(title, subtitle, variant = "image") {
  const seed = Array.from(`${title}${subtitle}${variant}`).reduce(
    (sum, char) => sum + char.charCodeAt(0),
    0
  );
  const hueA = seed % 360;
  const hueB = (hueA + 72) % 360;
  const label = escapeText(title);
  const detail = escapeText(subtitle);
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1200" viewBox="0 0 1600 1200">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="hsl(${hueA}, 64%, 26%)"/>
          <stop offset="54%" stop-color="hsl(${hueB}, 58%, 38%)"/>
          <stop offset="100%" stop-color="hsl(${(hueA + 148) % 360}, 54%, 22%)"/>
        </linearGradient>
        <linearGradient id="accent" x1="0" x2="1">
          <stop offset="0%" stop-color="#f8fafc"/>
          <stop offset="100%" stop-color="#f4b45f"/>
        </linearGradient>
      </defs>
      <rect width="1600" height="1200" fill="url(#bg)"/>
      <rect x="128" y="140" width="1344" height="920" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.24)" stroke-width="2"/>
      <rect x="188" y="220" width="420" height="12" fill="url(#accent)"/>
      <circle cx="1160" cy="340" r="170" fill="rgba(255,255,255,0.18)"/>
      <path d="M128 820 C320 690 460 860 660 740 S1020 650 1472 815 L1472 1060 L128 1060 Z" fill="rgba(14,37,43,0.42)"/>
      <path d="M128 930 C360 760 548 1010 782 850 S1150 770 1472 910 L1472 1060 L128 1060 Z" fill="rgba(12,20,32,0.48)"/>
      <text x="188" y="350" fill="white" font-family="Segoe UI, Arial, sans-serif" font-size="62" font-weight="800">${label}</text>
      <text x="188" y="421" fill="rgba(255,255,255,0.82)" font-family="Segoe UI, Arial, sans-serif" font-size="32">${detail}</text>
      <text x="188" y="1000" fill="rgba(255,255,255,0.78)" font-family="Cascadia Code, Consolas, monospace" font-size="25">Replace with generated PNG/WebP output.</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function renderSceneList() {
  elements.sceneList.innerHTML = scenes
    .map(
      (scene, index) => `
        <button class="scene-button${scene.id === state.sceneId ? " active" : ""}" type="button" data-scene="${scene.id}">
          <span>${String(index + 1).padStart(2, "0")}</span>
          <strong>${scene.name}</strong>
        </button>
      `
    )
    .join("");
}

function renderAlgorithmOptions() {
  const options = algorithms
    .map((algorithm) => `<option value="${algorithm.id}">${algorithm.name}</option>`)
    .join("");
  elements.algorithmA.innerHTML = options;
  elements.algorithmB.innerHTML = options;
  elements.algorithmA.value = state.algorithmA;
  elements.algorithmB.value = state.algorithmB;
}

function renderStage() {
  const scene = getScene();
  elements.imageStage.className = `image-stage ${state.mode}-mode`;
  const cards = [state.algorithmA];
  if (state.mode === "compare") {
    cards.push(state.algorithmB);
  }
  elements.imageStage.innerHTML = cards.map((algorithmId, index) => renderImagePane(scene, algorithmId, index)).join("");

  elements.imageStage.querySelectorAll(".zoom-canvas").forEach((canvas) => {
    canvas.addEventListener("wheel", onWheelZoom, { passive: false });
  });

  updateTransforms();
}

function renderImagePane(scene, algorithmId, index) {
  const algorithm = getAlgorithm(algorithmId);
  const imagePath = scene.images[algorithmId];
  const paneLabel = state.mode === "compare" ? (index === 0 ? "A" : "B") : "Result";
  return `
    <article class="image-pane" data-pane="${index}">
      <header>
        <span>${paneLabel}</span>
        <div>
          <h3>${algorithm.name}</h3>
        </div>
      </header>
      <div class="zoom-canvas" data-pane="${index}">
        <img
          src="${imagePath}"
          alt="${scene.name} - ${algorithm.name}"
          data-title="${escapeText(scene.name)}"
          data-subtitle="${escapeText(algorithm.name)}"
        >
      </div>
    </article>
  `;
}

function updateBrokenImages() {
  document.querySelectorAll(".zoom-canvas img, #exr-image").forEach((image) => {
    image.onload = () => updateStageAspect(image);
    image.onerror = () => {
      image.onerror = null;
      const title = image.dataset.title || getScene().name;
      const subtitle = image.dataset.subtitle || "EXR visualization";
      image.src = placeholderSvg(title, subtitle, image.id === "exr-image" ? "exr" : "algorithm");
    };
  });
}

function updateStageAspect(image) {
  if (!image.closest(".zoom-canvas") || !image.naturalWidth || !image.naturalHeight) {
    return;
  }
  elements.imageStage.style.setProperty("--stage-aspect", `${image.naturalWidth} / ${image.naturalHeight}`);
}

function renderExrPanel() {
  const scene = getScene();
  const view = exrViews[state.exrView];
  elements.exrCaption.textContent = view.label;
  elements.exrImage.src = scene.exr[state.exrView];
  elements.exrImage.dataset.title = `${scene.name} EXR`;
  elements.exrImage.dataset.subtitle = state.exrView;
  renderHistogram(scene.id);
}

function renderHistogram(sceneId) {
  const histogram = sceneHistograms[sceneId] || { bins: [], ticks: [] };

  elements.histogram.innerHTML = histogram.bins
    .map((height) => `<span style="height:${Math.round(height * 100)}%"></span>`)
    .join("");
  elements.histogramAxis.innerHTML = histogram.ticks
    .map((tick) => `<span>${tick.toFixed(2)}</span>`)
    .join("");
}

function updateTransforms() {
  document.querySelectorAll(".zoom-canvas img").forEach((image) => {
    const paneIndex = Number(image.closest(".zoom-canvas").dataset.pane || 0);
    const view = elements.syncZoom.checked ? state.paneViews[0] : state.paneViews[paneIndex];
    image.style.transform = `matrix(${view.zoom}, 0, 0, ${view.zoom}, ${view.pan.x}, ${view.pan.y})`;
  });
  updateViewerStatus();
}

function getActiveView() {
  return elements.syncZoom.checked ? state.paneViews[0] : state.paneViews[state.activePane];
}

function setViewForPane(paneIndex, view) {
  state.paneViews[paneIndex] = {
    zoom: view.zoom,
    pan: { x: view.pan.x, y: view.pan.y },
  };
}

function setSyncedView(view) {
  setViewForPane(0, view);
  setViewForPane(1, view);
}

function setZoom(value) {
  const zoom = Math.min(5, Math.max(1, Number(value)));
  const nextView = { zoom, pan: { x: 0, y: 0 } };

  if (elements.syncZoom.checked) {
    setSyncedView(nextView);
  } else {
    setViewForPane(state.activePane, nextView);
  }

  updateTransforms();
}

function resetZoom() {
  setSyncedView({ zoom: 1, pan: { x: 0, y: 0 } });
  state.activePane = 0;
  updateTransforms();
}

function onWheelZoom(event) {
  event.preventDefault();
  state.activePane = Number(event.currentTarget.dataset.pane || 0);
  const canvas = event.currentTarget;
  const rect = canvas.getBoundingClientRect();
  const pointer = {
    x: event.clientX - rect.left - rect.width / 2,
    y: event.clientY - rect.top - rect.height / 2,
  };
  const currentView = getActiveView();
  const nextZoom = Math.min(5, Math.max(1, currentView.zoom + (event.deltaY > 0 ? -0.25 : 0.25)));
  const scaleRatio = nextZoom / currentView.zoom;
  const nextView = {
    zoom: nextZoom,
    pan:
      nextZoom === 1
        ? { x: 0, y: 0 }
        : {
            x: pointer.x - (pointer.x - currentView.pan.x) * scaleRatio,
            y: pointer.y - (pointer.y - currentView.pan.y) * scaleRatio,
          },
  };

  if (elements.syncZoom.checked) {
    setSyncedView(nextView);
  } else {
    setViewForPane(state.activePane, nextView);
  }
  updateTransforms();
}

function renderAll() {
  const scene = getScene();
  renderSceneList();
  renderAlgorithmOptions();
  elements.currentScene.textContent = scene.name;
  elements.sceneNote.textContent = scene.note;
  elements.modeButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.mode === state.mode);
  });
  elements.algorithmBField.classList.toggle("hidden", state.mode === "single");
  elements.exrButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.exr === state.exrView);
  });
  renderStage();
  renderExrPanel();
  updateBrokenImages();
  updateViewerStatus();
}

elements.sceneList.addEventListener("click", (event) => {
  const button = event.target.closest(".scene-button");
  if (!button) return;
  state.sceneId = button.dataset.scene;
  resetZoom();
  renderAll();
});

elements.modeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.mode = button.dataset.mode;
    resetZoom();
    renderAll();
  });
});

elements.algorithmA.addEventListener("change", () => {
  state.algorithmA = elements.algorithmA.value;
  renderAll();
});

elements.algorithmB.addEventListener("change", () => {
  state.algorithmB = elements.algorithmB.value;
  renderAll();
});

elements.zoomReset.addEventListener("click", resetZoom);

elements.syncZoom.addEventListener("change", () => {
  const activeView = state.paneViews[state.activePane];
  if (elements.syncZoom.checked) {
    setSyncedView(activeView);
    updateTransforms();
  }
});

elements.exrButtons.forEach((button) => {
  button.addEventListener("click", () => {
    state.exrView = button.dataset.exr;
    renderAll();
  });
});

function applyUrlState() {
  const params = new URLSearchParams(window.location.search);
  const mode = params.get("mode");
  const scene = params.get("scene");
  const algorithmA = params.get("a");
  const algorithmB = params.get("b");

  if (mode === "single" || mode === "compare") {
    state.mode = mode;
  }
  if (scenes.some((item) => item.id === scene)) {
    state.sceneId = scene;
  }
  if (algorithms.some((item) => item.id === algorithmA)) {
    state.algorithmA = algorithmA;
  }
  if (algorithms.some((item) => item.id === algorithmB)) {
    state.algorithmB = algorithmB;
  }
}

function updateViewerStatus() {
  const modeLabel = state.mode === "compare" ? "Side-by-side" : "Single";
  const zoom = getActiveView().zoom.toFixed(2);
  const sync = elements.syncZoom.checked ? "Synced" : "Independent";
  elements.viewerStatus.textContent = `${modeLabel} - ${zoom}x - ${sync}`;
}

applyUrlState();
renderAlgorithmOptions();
renderAll();
