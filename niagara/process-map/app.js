/* global L */

const P = {
  shinkolobwe: [-11.06804, 26.54193],
  linde: [42.97441030070138, -78.8930735242712],
  electromet: [43.08744037093125, -79.00690488493662],
  hooker: [43.07958422985608, -79.00831731578447],
  loow: [43.2235, -78.9565],
  bliss: [42.8368, -78.8529],
  guterl: [43.16948064711221, -78.6929769560219]
};

const SHINKOLOBWE_OVERVIEW = [-11.06492, 26.52854];
const FACTORY_ZOOM = 16;
const LOOW_ZOOM = 14;
const steps = [
  {
    id: "shinkolobwe",
    number: "1",
    role: "Extraction",
    date: "Before 1940",
    title: "Shinkolobwe mine",
    shortTitle: "Shinkolobwe",
    location: "Katanga, Belgian Congo — now the Democratic Republic of the Congo",
    point: P.shinkolobwe,
    process: "Extremely high-grade pitchblende was mined here before entering the wartime uranium supply chain.",
    cameraPoint: SHINKOLOBWE_OVERVIEW,
    cameraZoom: 14,
    cameraDuration: 1.25
  },
  {
    id: "linde",
    number: "2",
    role: "Refining",
    date: "Full-scale operation by July 1943",
    title: "Linde Air Products",
    shortTitle: "Linde",
    location: "Tonawanda, New York",
    point: P.linde,
    process: "Linde refined uranium ore into oxides and uranium tetrafluoride—UF₄, known as ‘green salt.’",
    cameraPoint: [42.967, -78.935],
    cameraZoom: FACTORY_ZOOM,
    cameraDuration: 2.4
  },
  {
    id: "electromet",
    number: "3",
    role: "Reduction",
    date: "Manhattan Project and Cold War",
    title: "Electromet",
    shortTitle: "Electromet",
    location: "Niagara Falls, New York",
    point: P.electromet,
    process: "Electromet reduced green salt with magnesium to produce uranium metal, leaving uranium-bearing C-2 slag.",
    cameraZoom: FACTORY_ZOOM,
    cameraDuration: 2.1
  },
  {
    id: "hooker",
    number: "4",
    role: "Uranium recovery",
    date: "Wartime production",
    title: "Hooker Chemical",
    shortTitle: "Hooker",
    location: "Niagara Falls, New York",
    point: P.hooker,
    process: "Hooker treated C-2 slag from Electromet to recover uranium that remained in the residue.",
    cameraZoom: FACTORY_ZOOM,
    cameraDuration: 2.1
  },
  {
    id: "guterl",
    number: "5",
    role: "Rod rolling",
    date: "1948–1956",
    title: "Simonds Saw and Steel",
    shortTitle: "Simonds",
    location: "Lockport, New York — later Guterl Specialty Steel",
    point: P.guterl,
    process: "Simonds heated and rolled uranium metal into rods at its Lockport plant.",
    cameraZoom: FACTORY_ZOOM,
    cameraDuration: 2.1
  },
  {
    id: "bliss",
    number: "6",
    role: "Rod finishing",
    date: "1951–1952",
    title: "Bliss & Laughlin Steel",
    shortTitle: "Bliss & Laughlin",
    location: "110 Hopkins Street, Buffalo, New York",
    point: P.bliss,
    process: "Bliss & Laughlin machined, straightened, and finished uranium rods in Buffalo.",
    cameraZoom: FACTORY_ZOOM,
    cameraDuration: 2.1
  },
  {
    id: "loow",
    number: "7",
    role: "Designated waste destination",
    date: "From 1944",
    title: "Lake Ontario Ordnance Works",
    shortTitle: "LOOW",
    location: "Lewiston and Porter, New York",
    point: P.loow,
    process: "LOOW was the designated federal destination for radioactive residues from Western New York’s uranium-production network.",
    cameraZoom: LOOW_ZOOM,
    cameraDuration: 1.8
  }
];

const stepById = Object.fromEntries(steps.map(step => [step.id, step]));
let activeId = null;

const map = L.map("map", {
  center: SHINKOLOBWE_OVERVIEW,
  zoom: 14,
  minZoom: 2,
  maxZoom: 18,
  zoomSnap: .25,
  zoomDelta: .5,
  zoomControl: false,
  attributionControl: false
});
L.control.zoom({ position: "bottomright" }).addTo(map);

const satelliteLayer = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  { maxZoom: 18, updateWhenZooming: false, keepBuffer: 8 }
);
const labelsLayer = L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png",
  { subdomains: "abcd", maxZoom: 19, pane: "overlayPane", updateWhenZooming: false, keepBuffer: 8 }
);
const streetLayer = L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
  { subdomains: "abcd", maxZoom: 19, updateWhenZooming: false, keepBuffer: 8 }
);
satelliteLayer.addTo(map);
labelsLayer.addTo(map);

const tilePreloads = [];
function preloadSatellite(point, zoom, radius = 2) {
  const latitude = point[0] * (Math.PI / 180);
  const tileCount = 2 ** zoom;
  const centerX = Math.floor(((point[1] + 180) / 360) * tileCount);
  const centerY = Math.floor((1 - (Math.asinh(Math.tan(latitude)) / Math.PI)) / 2 * tileCount);

  for (let xOffset = -radius; xOffset <= radius; xOffset += 1) {
    for (let yOffset = -radius; yOffset <= radius; yOffset += 1) {
      const image = new Image();
      image.decoding = "async";
      image.src = `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/${zoom}/${centerY + yOffset}/${centerX + xOffset}`;
      tilePreloads.push(image);
    }
  }
}
preloadSatellite([18, -24], 3, 2);
preloadSatellite(SHINKOLOBWE_OVERVIEW, 14, 3);
preloadSatellite([42.967, -78.935], 12, 3);
preloadSatellite(P.electromet, 13);
preloadSatellite(P.hooker, 14);
preloadSatellite(P.guterl, 14);
preloadSatellite(P.bliss, 14);
preloadSatellite(P.loow, 14, 3);

const stepMarkers = {};

steps.forEach(step => {
  const icon = L.divIcon({
    className: "facility-marker-wrap",
    html: `<span class="facility-marker" aria-hidden="true"><span>${step.number}</span><i></i></span>`,
    iconSize: [42, 58],
    iconAnchor: [21, 50]
  });
  const marker = L.marker(step.point, {
    icon,
    keyboard: true,
    title: `${step.title} — ${step.location}`,
    riseOnHover: true
  }).addTo(map);
  marker.on("click", () => selectStep(step.id));
  stepMarkers[step.id] = marker;
});

function renderStepper() {
  const stepper = document.getElementById("network-index");
  steps.forEach(step => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.nodeId = step.id;
    button.innerHTML = `<span>${step.number}</span><b>${step.shortTitle}</b>`;
    button.addEventListener("click", () => selectStep(step.id));
    stepper.appendChild(button);
  });

  stepper.addEventListener("wheel", event => {
    if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
      stepper.scrollLeft += event.deltaY;
      event.preventDefault();
    }
  }, { passive: false });
}

function drawActiveRoute() {
  if (!activeId) return;

  const step = stepById[activeId];
  map.stop();
  const cameraPoint = step.id === "shinkolobwe"
    ? step.cameraPoint || step.point
    : step.cameraPoint || step.point;
  map.flyTo(cameraPoint, step.cameraZoom, {
    duration: step.cameraDuration,
    easeLinearity: .22
  });

  steps.forEach(item => {
    const marker = stepMarkers[item.id];
    const selected = item.id === activeId;
    marker.setOpacity(selected ? 1 : .32);
    marker.getElement()?.classList.toggle("is-active-marker", selected);
  });
}

function selectStep(id) {
  activeId = id;
  const step = stepById[id];
  const activeIndex = steps.findIndex(item => item.id === id);

  document.getElementById("discovery-card").hidden = true;
  document.getElementById("network-card").hidden = false;
  document.getElementById("node-kicker").textContent = `${step.number} · ${step.role}`;
  document.getElementById("node-date").textContent = step.date;
  document.getElementById("node-title").textContent = step.title;
  document.getElementById("node-location").textContent = step.location;
  document.getElementById("node-process").textContent = step.process;
  document.getElementById("map-heading-title").textContent = `Step ${step.number} · ${step.shortTitle}`;
  document.getElementById("step-count").textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(steps.length).padStart(2, "0")}`;

  const next = document.getElementById("next-button");
  const isLast = activeIndex === steps.length - 1;
  next.innerHTML = `${isLast ? "Restart" : "Next"} <span aria-hidden="true">→</span>`;
  next.setAttribute("aria-label", isLast ? "Restart at the mine" : "Next step");

  document.querySelectorAll(".linear-stepper button").forEach(button => {
    const buttonIndex = steps.findIndex(item => item.id === button.dataset.nodeId);
    const selected = button.dataset.nodeId === id;
    button.classList.toggle("is-active", selected);
    button.classList.toggle("is-past", buttonIndex < activeIndex);
    if (selected) {
      button.setAttribute("aria-current", "step");
      const stepper = document.getElementById("network-index");
      const targetLeft = activeIndex === 0
        ? 0
        : Math.max(0, button.offsetLeft - ((stepper.clientWidth - button.offsetWidth) / 2));
      stepper.scrollTo({ left: targetLeft, behavior: "smooth" });
    } else {
      button.removeAttribute("aria-current");
    }
  });

  drawActiveRoute();
}

document.getElementById("previous-button").addEventListener("click", () => {
  const current = activeId ? steps.findIndex(step => step.id === activeId) : 0;
  selectStep(steps[current <= 0 ? steps.length - 1 : current - 1].id);
});

document.getElementById("next-button").addEventListener("click", () => {
  const current = activeId ? steps.findIndex(step => step.id === activeId) : -1;
  selectStep(steps[current < 0 || current === steps.length - 1 ? 0 : current + 1].id);
});

document.getElementById("satellite-button").addEventListener("click", () => {
  if (map.hasLayer(streetLayer)) map.removeLayer(streetLayer);
  if (!map.hasLayer(satelliteLayer)) satelliteLayer.addTo(map);
  if (!map.hasLayer(labelsLayer)) labelsLayer.addTo(map);
  document.getElementById("satellite-button").classList.add("is-active");
  document.getElementById("map-button").classList.remove("is-active");
});

document.getElementById("map-button").addEventListener("click", () => {
  if (map.hasLayer(satelliteLayer)) map.removeLayer(satelliteLayer);
  if (map.hasLayer(labelsLayer)) map.removeLayer(labelsLayer);
  if (!map.hasLayer(streetLayer)) streetLayer.addTo(map);
  document.getElementById("map-button").classList.add("is-active");
  document.getElementById("satellite-button").classList.remove("is-active");
});

renderStepper();
selectStep("shinkolobwe");
window.setTimeout(() => map.invalidateSize(), 120);
