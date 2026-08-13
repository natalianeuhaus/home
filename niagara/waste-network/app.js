/* global L */

const film = document.getElementById("waste-film");
const progressBar = document.getElementById("film-progress-bar");
const sceneCounter = document.getElementById("scene-counter");
const pauseButton = document.getElementById("film-pause");
const previousButton = document.getElementById("film-previous");
const nextButton = document.getElementById("film-next");
const sceneElements = Array.from(document.querySelectorAll(".scene"));
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const sites = [
  {
    name: "Linde",
    detail: "Tonawanda · refining",
    point: [42.9744103, -78.8930735],
    type: "factory",
    label: "top-left"
  },
  {
    name: "Electromet",
    detail: "Niagara Falls · uranium metal",
    point: [43.0874404, -79.0069049],
    type: "factory",
    label: "top-right"
  },
  {
    name: "Hooker",
    detail: "Niagara Falls · uranium recovery",
    point: [43.0795842, -79.0083173],
    type: "factory",
    label: "bottom-left"
  },
  {
    name: "Carborundum",
    detail: "Niagara Falls · industrial research",
    point: [43.0832908, -79.0385277],
    type: "factory",
    label: "top-left"
  },
  {
    name: "Simonds Saw and Steel",
    detail: "Lockport · uranium rod rolling",
    point: [43.16948064711221, -78.6929769560219],
    type: "factory",
    label: "top-left"
  },
  {
    name: "Bliss & Laughlin Steel",
    detail: "Buffalo · uranium rod finishing",
    point: [42.8368, -78.8529],
    type: "factory",
    label: "top-left"
  },
  {
    name: "LOOW",
    detail: "Federal storage and disposal",
    point: [43.2235, -78.9565],
    type: "disposal",
    label: "top-right"
  },
  {
    name: "Union Carbide landfill",
    detail: "Later incorporated into CECOS",
    point: [43.091845, -78.9996943],
    type: "disposal",
    label: "bottom-right"
  }
];

const map = L.map("waste-map", {
  zoomControl: false,
  attributionControl: false,
  zoomSnap: 0.25,
  zoomDelta: 0.25,
  dragging: false,
  scrollWheelZoom: false,
  doubleClickZoom: false,
  boxZoom: false,
  keyboard: false,
  tap: false,
  touchZoom: false,
  preferCanvas: true
});

const regionalBounds = L.latLngBounds([
  [42.79, -79.18],
  [43.29, -78.61]
]);
const sourceBounds = L.latLngBounds(sites.map(site => site.point)).pad(0.1);
const niagaraFocus = window.innerWidth < 900
  ? [43.095, -79.005]
  : [43.095, -79.04];

L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
  subdomains: "abcd",
  maxZoom: 19,
  updateWhenZooming: false,
  keepBuffer: 6
}).addTo(map);

map.fitBounds(regionalBounds, {
  paddingTopLeft: [window.innerWidth < 900 ? 20 : Math.round(window.innerWidth * .43), 80],
  paddingBottomRight: [30, 40],
  animate: false
});

const regionalZoom = map.getZoom();
const sourceZoom = regionalZoom + 0.75;
const niagaraZoom = Math.min(Math.max(
  regionalZoom + Math.log2(10),
  window.innerWidth < 900 ? 13.25 : 14.25
), 15);

sites.forEach((site, index) => {
  const label = site.label ? `<b>${site.name}<small>${site.detail}</small></b>` : "";
  const icon = L.divIcon({
    className: "waste-site-wrap",
    html: `<span class="waste-site waste-site--${site.type}${site.label ? ` waste-site--label-${site.label}` : ""}" data-order="${index + 1}"><i></i>${label}</span>`,
    iconSize: [210, 42],
    iconAnchor: [8, 8]
  });
  L.marker(site.point, {
    icon,
    interactive: false,
    zIndexOffset: site.name === "Union Carbide landfill" ? 1200 : index * 20
  }).addTo(map);
});

const scenes = [
  { name: "sources", duration: 10000 },
  { name: "solid", duration: 10000 },
  { name: "water", duration: 10000 },
  { name: "history", duration: 10500 },
  { name: "screening", duration: 10500 },
  { name: "final", duration: 11000 }
];

const totalDuration = scenes.reduce((sum, scene) => sum + scene.duration, 0);
const sceneStartTimes = scenes.map((scene, index) => (
  scenes.slice(0, index).reduce((sum, previousScene) => sum + previousScene.duration, 0)
));
let sceneIndex = -1;
let progressFrame = 0;
let startTime = 0;
let elapsedBeforeStart = 0;
let isPaused = false;
let isFinished = false;

function focusSources(duration = 2.8) {
  map.flyToBounds(sourceBounds, {
    paddingTopLeft: [window.innerWidth < 900 ? 24 : Math.round(window.innerWidth * .43), 85],
    paddingBottomRight: [window.innerWidth < 900 ? 34 : 250, 70],
    maxZoom: sourceZoom,
    duration,
    easeLinearity: 0.18
  });
}

function focusNiagara(duration = 6) {
  map.flyTo(niagaraFocus, niagaraZoom, {
    duration,
    easeLinearity: 0.16
  });
}

function updateNavigationButtons() {
  previousButton.disabled = sceneIndex <= 0;
  nextButton.disabled = sceneIndex >= scenes.length - 1;
}

function showScene(index) {
  sceneIndex = Math.max(0, Math.min(index, scenes.length - 1));
  const scene = scenes[sceneIndex];
  film.dataset.scene = scene.name;
  sceneElements.forEach(element => {
    element.classList.toggle("is-active", element.dataset.sceneName === scene.name);
  });
  sceneCounter.textContent = `${String(sceneIndex + 1).padStart(2, "0")} / ${String(scenes.length).padStart(2, "0")}`;
  updateNavigationButtons();

  if (!reducedMotion) {
    if (scene.name === "sources") focusSources();
    if (scene.name === "solid") focusNiagara();
  }
}

function getSceneIndex(elapsed) {
  let sceneEnd = 0;
  for (let index = 0; index < scenes.length; index += 1) {
    sceneEnd += scenes[index].duration;
    if (elapsed < sceneEnd) return index;
  }
  return scenes.length - 1;
}

function getElapsed(timestamp = performance.now()) {
  const activeElapsed = startTime ? timestamp - startTime : 0;
  return Math.min(totalDuration, elapsedBeforeStart + activeElapsed);
}

function setPauseButton(paused) {
  pauseButton.textContent = paused ? "Play" : "Pause";
  pauseButton.setAttribute("aria-label", paused ? "Resume animation" : "Pause animation");
  pauseButton.setAttribute("aria-pressed", String(paused));
}

function updateProgress(timestamp) {
  if (!startTime) startTime = timestamp;
  const elapsed = getElapsed(timestamp);
  progressBar.style.width = `${(elapsed / totalDuration) * 100}%`;
  const nextSceneIndex = getSceneIndex(elapsed);
  if (nextSceneIndex !== sceneIndex) showScene(nextSceneIndex);

  if (elapsed < totalDuration && !isPaused) {
    progressFrame = window.requestAnimationFrame(updateProgress);
  } else if (elapsed >= totalDuration) {
    isFinished = true;
    pauseButton.textContent = "Finished";
    pauseButton.setAttribute("aria-label", "Animation finished");
    pauseButton.disabled = true;
  }
}

function pauseFilm() {
  if (isPaused || isFinished || reducedMotion) return;
  elapsedBeforeStart = getElapsed();
  startTime = 0;
  isPaused = true;
  film.classList.add("is-paused");
  window.cancelAnimationFrame(progressFrame);
  map.stop();
  setPauseButton(true);
}

function resumeFilm() {
  if (!isPaused || isFinished || reducedMotion) return;
  isPaused = false;
  film.classList.remove("is-paused");
  setPauseButton(false);

  const currentScene = scenes[sceneIndex];
  const remainingSeconds = Math.max(1, (sceneStartTimes[sceneIndex] + currentScene.duration - elapsedBeforeStart) / 1000);
  if (currentScene.name === "sources" && map.getZoom() < sourceZoom - 0.01) {
    focusSources(Math.min(2.8, remainingSeconds));
  }
  if (currentScene.name === "solid" && map.getZoom() < niagaraZoom - 0.01) {
    focusNiagara(Math.min(6, remainingSeconds));
  }

  progressFrame = window.requestAnimationFrame(updateProgress);
}

function jumpToScene(index) {
  const targetIndex = Math.max(0, Math.min(index, scenes.length - 1));
  window.cancelAnimationFrame(progressFrame);
  elapsedBeforeStart = sceneStartTimes[targetIndex];
  startTime = 0;
  isFinished = false;
  showScene(targetIndex);
  progressBar.style.width = `${(elapsedBeforeStart / totalDuration) * 100}%`;

  if (!reducedMotion) {
    pauseButton.disabled = false;
    setPauseButton(isPaused);
    if (!isPaused) progressFrame = window.requestAnimationFrame(updateProgress);
  }
}

function startFilm() {
  if (reducedMotion) {
    showScene(scenes.length - 1);
    progressBar.style.width = "100%";
    pauseButton.hidden = true;
    return;
  }
  pauseButton.disabled = false;
  showScene(0);
  progressFrame = window.requestAnimationFrame(updateProgress);
}

pauseButton.addEventListener("click", () => {
  if (isPaused) resumeFilm();
  else pauseFilm();
});

previousButton.addEventListener("click", () => jumpToScene(sceneIndex - 1));
nextButton.addEventListener("click", () => jumpToScene(sceneIndex + 1));

document.addEventListener("visibilitychange", () => {
  if (!document.hidden || reducedMotion) return;
  pauseFilm();
});

window.addEventListener("load", () => {
  map.invalidateSize();
  window.setTimeout(startFilm, 700);
});
