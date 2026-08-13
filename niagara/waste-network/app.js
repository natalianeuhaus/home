/* global L */

const film = document.getElementById("waste-film");
const progressBar = document.getElementById("film-progress-bar");
const sceneCounter = document.getElementById("scene-counter");
const pauseButton = document.getElementById("film-pause");
const sceneElements = Array.from(document.querySelectorAll(".scene"));
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const sites = [
  {
    name: "Linde",
    detail: "Tonawanda · refining",
    point: [42.9744103, -78.8930735],
    type: "factory",
    label: "top-right"
  },
  {
    name: "Electromet",
    detail: "Niagara Falls · uranium metal",
    point: [43.0874404, -79.0069049],
    type: "factory",
    label: null
  },
  {
    name: "Hooker",
    detail: "Niagara Falls · uranium recovery",
    point: [43.0795842, -79.0083173],
    type: "factory",
    label: null
  },
  {
    name: "Carborundum",
    detail: "Niagara Falls · industrial research",
    point: [43.0832908, -79.0385277],
    type: "factory",
    label: null
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
    label: "top-right"
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
  [42.91, -79.18],
  [43.29, -78.76]
]);
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
const niagaraZoom = Math.min(regionalZoom + Math.log2(10), 15);

sites.forEach((site, index) => {
  const label = site.label ? `<b>${site.name}<small>${site.detail}</small></b>` : "";
  const icon = L.divIcon({
    className: "waste-site-wrap",
    html: `<span class="waste-site waste-site--${site.type}${site.label ? ` waste-site--label-${site.label}` : ""}" data-order="${index + 1}"><i></i>${label}</span>`,
    iconSize: [210, 42],
    iconAnchor: [8, 8]
  });
  L.marker(site.point, { icon, interactive: false }).addTo(map);
});

const niagaraFactoriesIcon = L.divIcon({
  className: "niagara-factory-cluster-wrap",
  html: '<span class="niagara-factory-cluster"><i></i><b>Niagara Falls factories<small>Electromet · Hooker · Carborundum</small></b></span>',
  iconSize: [260, 42],
  iconAnchor: [30, 8]
});
L.marker([43.0834, -79.023], { icon: niagaraFactoriesIcon, interactive: false }).addTo(map);

const scenes = [
  { name: "intro", duration: 8000 },
  { name: "sources", duration: 9500 },
  { name: "solid", duration: 10000 },
  { name: "water", duration: 10000 },
  { name: "screening", duration: 10500 },
  { name: "gap", duration: 10500 },
  { name: "final", duration: 11000 }
];

const totalDuration = scenes.reduce((sum, scene) => sum + scene.duration, 0);
let sceneIndex = -1;
let progressFrame = 0;
let startTime = 0;
let elapsedBeforeStart = 0;
let isPaused = false;
let isFinished = false;

function focusNiagara(duration = 6) {
  map.flyTo(niagaraFocus, niagaraZoom, {
    duration,
    easeLinearity: 0.16
  });
}

function showScene(index) {
  sceneIndex = Math.max(0, Math.min(index, scenes.length - 1));
  const scene = scenes[sceneIndex];
  film.dataset.scene = scene.name;
  sceneElements.forEach(element => {
    element.classList.toggle("is-active", element.dataset.sceneName === scene.name);
  });
  sceneCounter.textContent = `${String(sceneIndex + 1).padStart(2, "0")} / ${String(scenes.length).padStart(2, "0")}`;

  if (scene.name === "solid" && !reducedMotion) {
    focusNiagara();
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

  if (scenes[sceneIndex].name === "solid" && map.getZoom() < niagaraZoom - 0.01) {
    const solidStart = scenes.slice(0, sceneIndex).reduce((sum, scene) => sum + scene.duration, 0);
    const remainingSeconds = Math.max(1, (solidStart + scenes[sceneIndex].duration - elapsedBeforeStart) / 1000);
    focusNiagara(Math.min(6, remainingSeconds));
  }

  progressFrame = window.requestAnimationFrame(updateProgress);
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

document.addEventListener("visibilitychange", () => {
  if (!document.hidden || reducedMotion) return;
  pauseFilm();
});

window.addEventListener("load", () => {
  map.invalidateSize();
  window.setTimeout(startFilm, 700);
});
