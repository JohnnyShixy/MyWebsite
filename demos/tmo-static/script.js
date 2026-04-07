const algorithms = [
  { id: "preview", name: "Reference Preview" },
  { id: "reinhard", name: "Reinhard Global" },
  { id: "drago", name: "Drago" },
  { id: "mantiuk", name: "Mantiuk" },
  { id: "fattal", name: "Fattal" },
];

const scenes = [
  createScene("memorial", "Memorial"),
  createScene("office", "Office"),
  createScene("atrium", "Atrium"),
  createScene("landscape", "Landscape"),
  createScene("room", "Room"),
  createScene("church", "Church"),
  createScene("bridge", "Bridge"),
  createScene("forest", "Forest"),
  createScene("street", "Street"),
  createScene("studio", "Studio"),
];

function createScene(id, name) {
  return {
    id,
    name,
    images: {
      preview: `assets/${id}/preview.png`,
      reinhard: `assets/${id}/reinhard.png`,
      drago: `assets/${id}/drago.png`,
      mantiuk: `assets/${id}/mantiuk.png`,
      fattal: `assets/${id}/fattal.png`,
    },
  };
}

function placeholderSvg(sceneName, algorithmName) {
  const label = `${sceneName} - ${algorithmName}`;
  const encodedLabel = label.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const hue = Array.from(label).reduce((sum, char) => sum + char.charCodeAt(0), 0) % 360;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="900" viewBox="0 0 1200 900">
      <defs>
        <linearGradient id="bg" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="hsl(${hue}, 85%, 32%)"/>
          <stop offset="55%" stop-color="hsl(${(hue + 55) % 360}, 80%, 18%)"/>
          <stop offset="100%" stop-color="hsl(${(hue + 120) % 360}, 90%, 12%)"/>
        </linearGradient>
        <radialGradient id="glow" cx="70%" cy="28%" r="52%">
          <stop offset="0%" stop-color="rgba(255,255,255,0.88)"/>
          <stop offset="100%" stop-color="rgba(255,255,255,0)"/>
        </radialGradient>
      </defs>
      <rect width="1200" height="900" fill="url(#bg)"/>
      <circle cx="840" cy="250" r="280" fill="url(#glow)"/>
      <path d="M0 680 C220 520 360 780 560 620 S920 500 1200 650 L1200 900 L0 900 Z" fill="rgba(15,23,42,0.62)"/>
      <path d="M0 760 C280 620 420 850 650 700 S980 620 1200 740 L1200 900 L0 900 Z" fill="rgba(15,23,42,0.74)"/>
      <text x="72" y="116" fill="white" font-family="Segoe UI, Arial, sans-serif" font-size="46" font-weight="800">${encodedLabel}</text>
      <text x="72" y="174" fill="rgba(255,255,255,0.78)" font-family="Segoe UI, Arial, sans-serif" font-size="28">Placeholder image - replace with your generated PNG</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function setOptions(select, items) {
  select.innerHTML = items
    .map((item) => `<option value="${item.id}">${item.name}</option>`)
    .join("");
}

function updateViewer() {
  const scene = scenes.find((item) => item.id === sceneSelect.value);
  const algorithm = algorithms.find((item) => item.id === algorithmSelect.value);

  referenceTitle.textContent = `${scene.name} preview`;
  resultTitle.textContent = `${scene.name} - ${algorithm.name}`;

  referenceImage.src = scene.images.preview;
  referenceImage.onerror = () => {
    referenceImage.onerror = null;
    referenceImage.src = placeholderSvg(scene.name, "Reference Preview");
  };

  resultImage.src = scene.images[algorithm.id];
  resultImage.onerror = () => {
    resultImage.onerror = null;
    resultImage.src = placeholderSvg(scene.name, algorithm.name);
  };
}

const sceneSelect = document.querySelector("#scene-select");
const algorithmSelect = document.querySelector("#algorithm-select");
const referenceTitle = document.querySelector("#reference-title");
const resultTitle = document.querySelector("#result-title");
const referenceImage = document.querySelector("#reference-image");
const resultImage = document.querySelector("#result-image");

setOptions(sceneSelect, scenes);
setOptions(algorithmSelect, algorithms.filter((item) => item.id !== "preview"));
sceneSelect.addEventListener("change", updateViewer);
algorithmSelect.addEventListener("change", updateViewer);
updateViewer();
