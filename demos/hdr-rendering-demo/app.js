const state = {
  manifest: null,
  scene: null,
  mode: "source",
  sourceViewMode: "preview",
  mediaMode: "video",
  syncPlayback: true,
  assetVersion: "ui-structure-1"
};

const els = {
  targetSummary: document.querySelector("#targetSummary"),
  hdrStatus: document.querySelector("#hdrStatus"),
  hdrHint: document.querySelector("#hdrHint"),
  sceneSelect: document.querySelector("#sceneSelect"),
  leftControl: document.querySelector("#leftControl"),
  leftControlLabel: document.querySelector("#leftControlLabel"),
  rightControl: document.querySelector("#rightControl"),
  rightControlLabel: document.querySelector("#rightControlLabel"),
  leftSelect: document.querySelector("#leftSelect"),
  rightSelect: document.querySelector("#rightSelect"),
  mediaControl: document.querySelector("#mediaControl"),
  mediaSelect: document.querySelector("#mediaSelect"),
  syncControl: document.querySelector("#syncControl"),
  syncToggle: document.querySelector("#syncToggle"),
  leftVideo: document.querySelector("#leftVideo"),
  rightVideo: document.querySelector("#rightVideo"),
  leftTitle: document.querySelector("#leftTitle"),
  rightTitle: document.querySelector("#rightTitle"),
  leftMeta: document.querySelector("#leftMeta"),
  rightMeta: document.querySelector("#rightMeta"),
  leftMissing: document.querySelector("#leftMissing"),
  rightMissing: document.querySelector("#rightMissing"),
  leftImage: document.querySelector("#leftImage"),
  rightImage: document.querySelector("#rightImage"),
  leftImageTitle: document.querySelector("#leftImageTitle"),
  rightImageTitle: document.querySelector("#rightImageTitle"),
  leftImageMeta: document.querySelector("#leftImageMeta"),
  rightImageMeta: document.querySelector("#rightImageMeta"),
  leftImageMissing: document.querySelector("#leftImageMissing"),
  rightImageMissing: document.querySelector("#rightImageMissing"),
  emptyState: document.querySelector("#emptyState"),
  sourceView: document.querySelector("#sourceView"),
  sourceViewTitle: document.querySelector("#sourceViewTitle"),
  sourceViewImage: document.querySelector("#sourceViewImage"),
  sourceViewMissing: document.querySelector("#sourceViewMissing"),
  sourceSceneId: document.querySelector("#sourceSceneId"),
  sourceStats: document.querySelector("#sourceStats"),
  histogramCanvas: document.querySelector("#histogramCanvas"),
  histogramMeta: document.querySelector("#histogramMeta"),
  groupSummary: document.querySelector("#groupSummary"),
  groupEyebrow: document.querySelector("#groupEyebrow"),
  groupTitle: document.querySelector("#groupTitle"),
  groupDescription: document.querySelector("#groupDescription"),
  distortionGrid: document.querySelector("#distortionGrid"),
  modeTabs: [...document.querySelectorAll(".modeTab")],
  comparisonSections: [...document.querySelectorAll(".comparison")],
  playPause: document.querySelector("#playPause"),
  reset: document.querySelector("#reset")
};

function setHdrStatus() {
  const videoHdr = window.matchMedia("(video-dynamic-range: high)").matches;
  const displayHdr = window.matchMedia("(dynamic-range: high)").matches;
  const p3 = window.matchMedia("(color-gamut: p3)").matches;

  if (videoHdr || displayHdr) {
    els.hdrStatus.textContent = p3 ? "HDR + P3 path detected" : "HDR path detected";
    els.hdrStatus.className = "status ok";
    els.hdrHint.textContent = "The browser reports an HDR-capable display path for video playback.";
    return;
  }

  els.hdrStatus.textContent = p3 ? "P3 display, HDR not detected" : "SDR display path";
  els.hdrStatus.className = "status warn";
  els.hdrHint.textContent = "HDR assets may be tone-mapped by the browser or operating system on this display.";
}

function option(label, value) {
  const node = document.createElement("option");
  node.value = value;
  node.textContent = label;
  return node;
}

function populateScenes() {
  els.sceneSelect.replaceChildren(
    ...state.manifest.scenes.map((scene) => option(scene.name, scene.id))
  );
  state.scene = state.manifest.scenes[0];
  els.sceneSelect.value = state.scene.id;
  populateVariants();
}

function populateVariants() {
  setControlLabels();
  document.body.dataset.mode = state.mode;
  if (state.mode === "source") {
    populateSourceControls();
    updateVideos();
    return;
  }

  if (isGroupedMode()) {
    populateGroupedControls();
    updateVideos();
    return;
  }

  const variants = variantsForMode();
  const nodes = variants.map((variant) => option(variant.label, variant.id));
  els.leftSelect.replaceChildren(...nodes.map((node) => node.cloneNode(true)));
  els.rightSelect.replaceChildren(...nodes.map((node) => node.cloneNode(true)));
  els.leftSelect.disabled = variants.length === 0;
  els.rightSelect.disabled = variants.length === 0;
  els.leftSelect.value = variants[0]?.id ?? "";
  els.rightSelect.value = variants[2]?.id ?? variants[1]?.id ?? variants[0]?.id ?? "";
  updateVideos();
}

function setControlLabels() {
  const grouped = isGroupedMode();
  els.leftControlLabel.textContent = state.mode === "source" ? "View" : grouped ? `${groupedModeLabel()} Type` : "Left TMO";
  els.rightControlLabel.textContent = state.mode === "rendering" ? "Right Rendering" : "Right TMO";
  els.rightControl.hidden = grouped || state.mode === "source";
  els.mediaControl.hidden = state.mode === "source";
  els.syncControl.hidden = state.mode === "source";
  els.playPause.hidden = state.mode === "source";
  els.reset.hidden = state.mode === "source";
  els.playPause.textContent = "Play";
}

function variantsForMode() {
  return state.scene.variants.filter((variant) => (variant.experiment ?? "tmo") === state.mode);
}

function populateSourceControls() {
  const modes = [
    ["Preview", "preview"],
    ["Log", "log"],
    ["False Color", "falseColor"]
  ];
  els.leftSelect.replaceChildren(...modes.map(([label, value]) => option(label, value)));
  els.leftSelect.disabled = !state.scene.sourceView;
  els.rightSelect.replaceChildren();
  els.rightSelect.disabled = true;
  els.leftSelect.value = state.sourceViewMode;
}

function isGroupedMode() {
  return state.mode === "distortion" || state.mode === "rendering";
}

function groupedModeLabel() {
  return state.mode === "rendering" ? "Rendering" : "Distortion";
}

function controlForVariant(variant) {
  return state.mode === "rendering" ? variant.renderingControl : variant.distortion;
}

function activeGroupStateKey() {
  return state.mode === "rendering" ? "renderingGroup" : "distortionGroup";
}

function groupedVariants() {
  const groups = [];
  variantsForMode().forEach((variant) => {
    const control = controlForVariant(variant);
    if (!control?.group || groups.some((group) => group.id === control.group)) {
      return;
    }
    groups.push({
      id: control.group,
      label: control.group_label ?? control.group
    });
  });
  return groups;
}

function populateGroupedControls() {
  const groups = groupedVariants();
  const groupKey = activeGroupStateKey();
  els.leftSelect.replaceChildren(...groups.map((group) => option(group.label, group.id)));
  els.leftSelect.disabled = groups.length === 0;
  els.rightSelect.replaceChildren();
  els.rightSelect.disabled = true;
  state[groupKey] = groups.some((group) => group.id === state[groupKey])
    ? state[groupKey]
    : groups[0]?.id ?? "";
  els.leftSelect.value = state[groupKey];
}

function variantsForActiveGroup() {
  const groupKey = activeGroupStateKey();
  return variantsForMode()
    .filter((variant) => controlForVariant(variant)?.group === state[groupKey])
    .sort((a, b) => (controlForVariant(a)?.order ?? 0) - (controlForVariant(b)?.order ?? 0));
}

function getVariant(id) {
  return variantsForMode().find((variant) => variant.id === id);
}

function describe(variant) {
  return [variant.tmo, variant.rendering, variant.distortion].filter(Boolean).join(" / ");
}

function videoFormatLabel() {
  return "HEVC Main10 / PQ / BT.2020";
}

function imageFormatLabel() {
  return "AVIF / PQ / BT.2020";
}

function setVideo(side, variant) {
  if (!variant) {
    clearSide(side);
    return;
  }

  const video = els[`${side}Video`];
  const title = els[`${side}Title`];
  const meta = els[`${side}Meta`];
  const missing = els[`${side}Missing`];
  const image = els[`${side}Image`];
  const imageTitle = els[`${side}ImageTitle`];
  const imageMeta = els[`${side}ImageMeta`];
  const imageMissing = els[`${side}ImageMissing`];

  title.textContent = variant.label;
  meta.textContent = videoFormatLabel();
  imageTitle.textContent = variant.label;
  imageMeta.textContent = imageFormatLabel();
  missing.textContent = "";
  imageMissing.textContent = "";
  video.src = withVersion(variant.video);
  video.load();
  image.src = withVersion(variant.image);

  video.addEventListener("error", () => {
    missing.textContent = `Video not found yet: ${variant.video}`;
  }, { once: true });

  image.addEventListener("error", () => {
    image.removeAttribute("src");
    imageMissing.textContent = `HDR image not found or unsupported: ${variant.image}`;
  }, { once: true });
}

function clearSide(side) {
  els[`${side}Title`].textContent = side === "left" ? "Left" : "Right";
  els[`${side}Meta`].textContent = "";
  els[`${side}ImageTitle`].textContent = side === "left" ? "Left" : "Right";
  els[`${side}ImageMeta`].textContent = "";
  els[`${side}Missing`].textContent = "";
  els[`${side}ImageMissing`].textContent = "";
  els[`${side}Video`].removeAttribute("src");
  els[`${side}Video`].load();
  els[`${side}Image`].removeAttribute("src");
}

function withVersion(url) {
  if (!url) {
    return "";
  }
  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}v=${state.assetVersion}`;
}

function updateVideos() {
  if (state.mode === "source") {
    els.groupSummary.hidden = true;
    updateSourceView();
    return;
  }

  els.sourceView.hidden = true;
  if (isGroupedMode()) {
    updateGroupedGrid();
    return;
  }

  els.distortionGrid.hidden = true;
  els.distortionGrid.replaceChildren();
  els.groupSummary.hidden = true;
  const variants = variantsForMode();
  const hasVariants = variants.length > 0;
  els.emptyState.textContent = hasVariants ? "" : emptyTextForMode();
  els.emptyState.hidden = hasVariants;
  els.comparisonSections.forEach((section) => {
    section.hidden = !hasVariants;
  });

  if (!hasVariants) {
    clearSide("left");
    clearSide("right");
    return;
  }

  setVideo("left", getVariant(els.leftSelect.value));
  setVideo("right", getVariant(els.rightSelect.value));
  applyMediaMode();
}

function updateGroupedGrid() {
  els.sourceView.hidden = true;
  const variants = variantsForActiveGroup();
  const hasVariants = variants.length > 0;
  els.emptyState.textContent = hasVariants ? "" : emptyTextForMode();
  els.emptyState.hidden = hasVariants;
  els.comparisonSections.forEach((section) => {
    section.hidden = true;
  });
  els.distortionGrid.hidden = !hasVariants;
  els.distortionGrid.replaceChildren(...variants.map(createDistortionCard));
  updateGroupSummary(variants);
  applyMediaMode();
}

function updateSourceView() {
  els.distortionGrid.hidden = true;
  els.distortionGrid.replaceChildren();
  els.comparisonSections.forEach((section) => {
    section.hidden = true;
  });

  const sourceView = state.scene.sourceView;
  const hasSourceView = Boolean(sourceView);
  els.emptyState.textContent = hasSourceView ? "" : "Source view assets pending";
  els.emptyState.hidden = hasSourceView;
  els.sourceView.hidden = !hasSourceView;
  if (!hasSourceView) {
    return;
  }

  const labelByMode = {
    preview: "Preview",
    log: "Log",
    falseColor: "False Color"
  };
  els.sourceViewTitle.textContent = labelByMode[state.sourceViewMode] ?? "Preview";
  els.sourceSceneId.textContent = state.scene.id;
  els.sourceViewMissing.textContent = "";
  els.sourceViewImage.src = withVersion(sourceView[state.sourceViewMode]);
  els.sourceViewImage.addEventListener("error", () => {
    els.sourceViewImage.removeAttribute("src");
    els.sourceViewMissing.textContent = `Source image not found: ${sourceView[state.sourceViewMode]}`;
  }, { once: true });
  renderSourceStats(sourceView.histogram);
  drawHistogram(sourceView.histogram);
}

function renderSourceStats(histogram) {
  const stats = histogram?.stats;
  const rows = [
    ["Scene", state.scene.name],
    ["Source", state.scene.source?.split("/").pop() ?? "EXR"],
    ["Peak raw", formatNumber(stats?.rawMax)],
    ["P99 raw", formatNumber(stats?.rawP99)],
    ["Median raw", formatNumber(stats?.rawP50)],
    ["Log range", stats ? `${stats.log2P001.toFixed(2)} to ${stats.log2P999.toFixed(2)}` : "n/a"]
  ];

  els.sourceStats.replaceChildren(...rows.flatMap(([label, value]) => {
    const dt = document.createElement("dt");
    dt.textContent = label;
    const dd = document.createElement("dd");
    dd.textContent = value;
    return [dt, dd];
  }));
}

function formatNumber(value) {
  if (!Number.isFinite(value)) {
    return "n/a";
  }
  if (Math.abs(value) >= 10) {
    return value.toFixed(2);
  }
  if (Math.abs(value) >= 1) {
    return value.toFixed(3);
  }
  return value.toPrecision(3);
}

function drawHistogram(histogram) {
  const canvas = els.histogramCanvas;
  const ctx = canvas.getContext("2d");
  const width = canvas.width;
  const height = canvas.height;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#050607";
  ctx.fillRect(0, 0, width, height);

  if (!histogram?.counts?.length || !histogram?.binEdges?.length) {
    els.histogramMeta.textContent = "No histogram";
    return;
  }

  const counts = histogram.counts;
  const edges = histogram.binEdges;
  const maxCount = Math.max(...counts, 1);
  const left = 46;
  const right = 12;
  const top = 16;
  const bottom = 34;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;

  ctx.strokeStyle = "#3a3f47";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(left, top);
  ctx.lineTo(left, top + plotHeight);
  ctx.lineTo(left + plotWidth, top + plotHeight);
  ctx.stroke();

  const barWidth = plotWidth / counts.length;
  ctx.fillStyle = "#75b7ff";
  counts.forEach((count, index) => {
    const barHeight = (count / maxCount) * plotHeight;
    const x = left + index * barWidth;
    const y = top + plotHeight - barHeight;
    ctx.fillRect(x, y, Math.max(barWidth - 1, 1), barHeight);
  });

  ctx.fillStyle = "#aeb6c2";
  ctx.font = "18px Segoe UI, sans-serif";
  ctx.fillText(edges[0].toFixed(1), left, height - 10);
  ctx.fillText(edges[edges.length - 1].toFixed(1), left + plotWidth - 44, height - 10);
  ctx.save();
  ctx.translate(14, top + plotHeight - 8);
  ctx.rotate(-Math.PI / 2);
  ctx.fillText("count", 0, 0);
  ctx.restore();

  els.histogramMeta.textContent = histogram.domain ?? "log2(mean raw EXR RGB)";
}

function createDistortionCard(variant) {
  const card = document.createElement("article");
  card.className = "panel distortionCard";
  if (isReferenceVariant(variant)) {
    card.classList.add("referenceCard");
  }

  const header = document.createElement("div");
  header.className = "panelHeader";
  const title = document.createElement("h2");
  title.textContent = variant.label;
  const meta = document.createElement("span");
  meta.textContent = state.mediaMode === "image" ? imageFormatLabel() : videoFormatLabel();
  header.append(title, meta);

  const video = document.createElement("video");
  video.dataset.media = "video";
  video.controls = true;
  video.playsInline = true;
  video.preload = "metadata";
  const videoMissing = document.createElement("div");
  videoMissing.className = "missing";
  videoMissing.dataset.media = "video";
  video.addEventListener("error", () => {
    videoMissing.textContent = `Video not found yet: ${variant.video}`;
  }, { once: true });
  if (state.mediaMode !== "image") {
    video.src = withVersion(variant.video);
  }

  const imageHeader = document.createElement("div");
  imageHeader.className = "panelHeader subHeader";
  imageHeader.dataset.media = "image";
  const imageTitle = document.createElement("h2");
  imageTitle.textContent = variant.label;
  const imageMeta = document.createElement("span");
  imageMeta.textContent = imageFormatLabel();
  imageHeader.append(imageTitle, imageMeta);

  const image = document.createElement("img");
  image.dataset.media = "image";
  image.alt = `${variant.label} HDR still image`;
  const imageMissing = document.createElement("div");
  imageMissing.className = "missing";
  imageMissing.dataset.media = "image";
  image.addEventListener("error", () => {
    image.removeAttribute("src");
    imageMissing.textContent = `HDR image not found or unsupported: ${variant.image}`;
  }, { once: true });
  if (state.mediaMode !== "video") {
    image.src = withVersion(variant.image);
  }

  card.append(header, video, videoMissing, imageHeader, image, imageMissing);
  return card;
}

function isReferenceVariant(variant) {
  const control = controlForVariant(variant);
  return control?.type === "reference" || control?.level === "reference";
}

function updateGroupSummary(variants) {
  if (!isGroupedMode() || variants.length === 0) {
    els.groupSummary.hidden = true;
    return;
  }

  const control = controlForVariant(variants[0]);
  const reference = variants.find(isReferenceVariant);
  els.groupEyebrow.textContent = state.mode === "rendering" ? "Rendering Control" : "Distortion Type";
  els.groupTitle.textContent = control?.group_label ?? groupedModeLabel();
  els.groupDescription.textContent = reference?.rendering ?? variants[0].rendering ?? describe(variants[0]);
  els.groupSummary.hidden = false;
}

function applyMediaMode() {
  document.body.dataset.media = state.mediaMode;
  if (state.mode === "source") {
    return;
  }

  const showVideo = state.mediaMode !== "image";
  const showImage = state.mediaMode !== "video";
  els.comparisonSections[0].hidden = !showVideo || isGroupedMode();
  els.comparisonSections[1].hidden = !showImage || isGroupedMode();
  els.distortionGrid.querySelectorAll("[data-media='video']").forEach((node) => {
    node.hidden = !showVideo;
  });
  els.distortionGrid.querySelectorAll("[data-media='image']").forEach((node) => {
    node.hidden = !showImage;
  });
}

function emptyTextForMode() {
  if (state.mode === "distortion") {
    return "Distortion variants pending";
  }
  if (state.mode === "rendering") {
    return "Rendering variants pending";
  }
  return "No variants available";
}

function setMode(mode) {
  state.mode = mode;
  els.modeTabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.mode === mode);
  });
  populateVariants();
}

function syncVideos() {
  if (!state.syncPlayback) {
    return;
  }
  const videos = activeVideos();
  if (videos.length < 2) {
    return;
  }
  videos.slice(1).forEach((video) => {
    video.currentTime = videos[0].currentTime;
  });
}

function togglePlay() {
  syncVideos();
  const videos = activeVideos();
  if (videos.length === 0) {
    return;
  }
  if (videos[0].paused) {
    videos.forEach((video) => void video.play());
    els.playPause.textContent = "Pause";
  } else {
    videos.forEach((video) => video.pause());
    els.playPause.textContent = "Play";
  }
}

function activeVideos() {
  if (isGroupedMode()) {
    return [...els.distortionGrid.querySelectorAll("video")];
  }
  return [els.leftVideo, els.rightVideo].filter((video) => video.src);
}

async function init() {
  setHdrStatus();
  const response = await fetch(withVersion("manifest.json"), { cache: "no-store" });
  state.manifest = await response.json();
  const target = state.manifest.target;
  els.targetSummary.textContent = `${target.transfer} / ${target.contentGamut} / ${target.peakNits} nit / ${target.codec}`;
  els.mediaSelect.value = state.mediaMode;
  populateScenes();

  els.sceneSelect.addEventListener("change", () => {
    state.scene = state.manifest.scenes.find((scene) => scene.id === els.sceneSelect.value);
    populateVariants();
  });
  els.modeTabs.forEach((tab) => {
    tab.addEventListener("click", () => setMode(tab.dataset.mode));
  });
  els.leftSelect.addEventListener("change", () => {
    if (state.mode === "source") {
      state.sourceViewMode = els.leftSelect.value;
    } else if (isGroupedMode()) {
      state[activeGroupStateKey()] = els.leftSelect.value;
    }
    updateVideos();
  });
  els.rightSelect.addEventListener("change", updateVideos);
  els.mediaSelect.addEventListener("change", () => {
    state.mediaMode = els.mediaSelect.value;
    updateVideos();
  });
  els.syncToggle.addEventListener("click", () => {
    state.syncPlayback = !state.syncPlayback;
    els.syncToggle.classList.toggle("active", state.syncPlayback);
    els.syncToggle.textContent = state.syncPlayback ? "On" : "Off";
    els.syncToggle.setAttribute("aria-pressed", String(state.syncPlayback));
    if (state.syncPlayback) {
      syncVideos();
    }
  });
  els.playPause.addEventListener("click", togglePlay);
  els.reset.addEventListener("click", () => {
    activeVideos().forEach((video) => {
      video.currentTime = 0;
    });
    els.playPause.textContent = "Play";
  });
  els.leftVideo.addEventListener("play", () => {
    syncVideos();
    if (state.syncPlayback) {
      void els.rightVideo.play();
    }
    els.playPause.textContent = "Pause";
  });
  els.leftVideo.addEventListener("pause", () => {
    if (state.syncPlayback) {
      els.rightVideo.pause();
    }
    els.playPause.textContent = "Play";
  });
  els.leftVideo.addEventListener("seeked", syncVideos);
}

init().catch((error) => {
  els.hdrStatus.textContent = error.message;
  els.hdrStatus.className = "status warn";
});
