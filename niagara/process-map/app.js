/* global L */

const P = {
  shinkolobwe: [-11.06804, 26.54193],
  staten: [40.6402778, -74.1419444],
  seneca: [42.716, -76.889],
  linde: [42.97441030070138, -78.8930735242712],
  electromet: [43.08744037093125, -79.00690488493662],
  hooker: [43.07958422985608, -79.00831731578447],
  loow: [43.2235, -78.9565],
  bliss: [42.8368, -78.8529],
  guterl: [43.16948064711221, -78.6929769560219]
};

const SHINKOLOBWE_OVERVIEW = [-11.06492, 26.52854];
const WESTERN_NEW_YORK_ZOOM = 12.25;
const WESTERN_NEW_YORK_MARKER_OFFSET = .11;
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
    routeKind: "material",
    route: [P.shinkolobwe, [-7.5, 20], [-5.8, 13.2], [4, -12], [24, -43], [38, -68], P.staten],
    cameraPoint: SHINKOLOBWE_OVERVIEW,
    cameraZoom: 14,
    cameraDuration: 1.25,
    caption: "The route begins here. Select Linde when you are ready to follow the material across the Atlantic and into Western New York."
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
    routeKind: "material",
    route: [],
    panOnly: true,
    cameraPoint: [42.967, -78.935],
    cameraZoom: WESTERN_NEW_YORK_ZOOM,
    cameraDuration: 2.7,
    caption: "The narrative now enters Western New York at Linde. Staten Island and Seneca Depot remain part of the journey described in step 1."
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
    routeKind: "material",
    route: [P.linde, [43.021, -78.925], P.electromet],
    cameraZoom: WESTERN_NEW_YORK_ZOOM,
    cameraDuration: 2.4,
    caption: "The line brings green salt from Linde to Electromet."
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
    routeKind: "material",
    route: [P.electromet, [43.0838, -79.0115], P.hooker],
    cameraZoom: WESTERN_NEW_YORK_ZOOM,
    cameraDuration: 2.1,
    caption: "The line brings uranium-bearing C-2 slag from Electromet to Hooker for recovery."
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
    routeKind: "material",
    route: [P.electromet, [43.1205, -78.875], P.guterl],
    cameraZoom: WESTERN_NEW_YORK_ZOOM,
    cameraDuration: 2.1,
    caption: "Returning to the uranium metal produced at Electromet, the line follows the fabrication network to rod rolling at Simonds Saw and Steel in Lockport."
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
    routeKind: "material",
    route: [P.electromet, [42.96, -78.92], P.bliss],
    cameraZoom: WESTERN_NEW_YORK_ZOOM,
    cameraDuration: 2.1,
    caption: "The line follows uranium metal from Electromet to Bliss & Laughlin for machining and straightening into rods."
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
    note: "This was the designated federal destination for radioactive waste from the regional uranium-production network.",
    routeKind: "context",
    route: [],
    panOnly: true,
    cameraZoom: WESTERN_NEW_YORK_ZOOM,
    cameraDuration: 1.8,
    caption: "LOOW marks where radioactive waste from the production network was supposed to be sent for federal storage and disposal."
  }
];

const stepById = Object.fromEntries(steps.map(step => [step.id, step]));
let activeId = null;
let routeTransitionTimer = null;
let popupTimer = null;
let selectionSource = "initial";
let detailBubble = null;

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

const activeRouteLayer = L.layerGroup().addTo(map);
const stepMarkers = {};

function westernNewYorkCameraPoint(point) {
  const projected = map.project(L.latLng(point), WESTERN_NEW_YORK_ZOOM);
  const markerOffset = map.getSize().x * WESTERN_NEW_YORK_MARKER_OFFSET;
  return map.unproject(projected.subtract([markerOffset, 0]), WESTERN_NEW_YORK_ZOOM);
}

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
  marker.bindTooltip(
    `<strong>${step.title}</strong><br><span>${step.location}</span>`,
    { direction: "top", offset: [0, -42], className: "facility-tooltip" }
  );
  marker.on("click", () => selectStep(step.id, { source: "marker" }));
  stepMarkers[step.id] = marker;
});

function renderStepper() {
  const stepper = document.getElementById("network-index");
  steps.forEach(step => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.nodeId = step.id;
    button.innerHTML = `<span>${step.number}</span><b>${step.shortTitle}</b>`;
    button.addEventListener("click", () => selectStep(step.id, { source: "journey" }));
    stepper.appendChild(button);
  });

  stepper.addEventListener("wheel", event => {
    if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
      stepper.scrollLeft += event.deltaY;
      event.preventDefault();
    }
  }, { passive: false });
}

function routeOptions(kind) {
  if (kind === "context") {
    return {
      color: "#9d9d9d",
      weight: 3,
      opacity: .95,
      dashArray: "3 8",
      className: "network-route-line is-active-route"
    };
  }
  return {
    color: "#285f86",
    weight: 4,
    opacity: .98,
    className: "network-route-line is-active-route"
  };
}

function midpoint(path) {
  return path[Math.floor(path.length / 2)];
}

function bearing(path) {
  const middle = Math.max(0, Math.floor(path.length / 2) - 1);
  const start = path[middle];
  const end = path[middle + 1] || path[path.length - 1];
  return Math.atan2(end[0] - start[0], end[1] - start[1]) * (180 / Math.PI) * -1;
}

function addArrow(path) {
  const icon = L.divIcon({
    className: "route-arrow-wrap",
    html: `<span class="route-arrow" style="transform:rotate(${bearing(path)}deg)">➜</span>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
  L.marker(midpoint(path), { icon, interactive: false }).addTo(activeRouteLayer);
}

function closeDetailBubble() {
  if (!detailBubble) return;
  map.removeLayer(detailBubble);
  detailBubble = null;
}

function openDetailBubble(point, className, content) {
  closeDetailBubble();
  const opensRight = map.getSize().x >= 900;
  detailBubble = L.tooltip({
    className: `detail-bubble ${className}`,
    direction: opensRight ? "right" : "top",
    offset: opensRight ? [24, 0] : [0, -34],
    permanent: true,
    interactive: true,
    opacity: 1
  })
    .setLatLng(point)
    .setContent(`<button type="button" class="detail-bubble-close" aria-label="Close details">×</button>${content}`)
    .addTo(map);

  window.requestAnimationFrame(() => {
    detailBubble?.getElement()?.querySelector(".detail-bubble-close")?.addEventListener("click", closeDetailBubble);
  });
}

function openStepPopup(step) {
  openDetailBubble(step.point, "number-history-popup", `
      <article class="number-popup-copy">
        <span>${step.number} · ${step.role} · ${step.date}</span>
        <h3>${step.title}</h3>
        <p class="number-popup-location">${step.location}</p>
        ${step.note ? `<p>${step.note}</p>` : ""}
      </article>
    `);
}

function drawRouteProgressively(polyline, duration = 3200) {
  window.requestAnimationFrame(() => {
    const path = polyline.getElement();
    if (!path) return;
    const length = path.getTotalLength();
    path.style.animation = "none";
    path.style.transition = "none";
    path.style.strokeDasharray = `${length} ${length}`;
    path.style.strokeDashoffset = String(length);
    path.getBoundingClientRect();
    path.style.transition = `stroke-dashoffset ${duration}ms linear`;
    path.style.strokeDashoffset = "0";
  });
}

function resetRouteProgress(polyline) {
  const path = polyline.getElement();
  if (!path) return;
  path.style.transition = "none";
  path.style.strokeDasharray = "";
  path.style.strokeDashoffset = "";
  path.style.animation = "";
}

function drawActiveRoute() {
  if (routeTransitionTimer) {
    window.clearTimeout(routeTransitionTimer);
    routeTransitionTimer = null;
  }
  if (popupTimer) {
    window.clearTimeout(popupTimer);
    popupTimer = null;
  }
  map.closePopup();
  closeDetailBubble();
  activeRouteLayer.clearLayers();
  if (!activeId) return;

  const step = stepById[activeId];
  const route = step.route;

  if (selectionSource === "marker") {
    map.stop();
    const cameraPoint = step.id === "shinkolobwe"
      ? step.cameraPoint || step.point
      : westernNewYorkCameraPoint(step.point);
    map.flyTo(cameraPoint, step.cameraZoom, {
      duration: 1.25,
      easeLinearity: .22
    });
    steps.forEach(item => {
      const marker = stepMarkers[item.id];
      const selected = item.id === activeId;
      marker.setOpacity(selected ? 1 : .32);
      marker.getElement()?.classList.toggle("is-active-marker", selected);
    });
    popupTimer = window.setTimeout(() => {
      if (activeId !== step.id) return;
      openStepPopup(step);
      popupTimer = null;
    }, 1650);
    return;
  }

  if (step.id === "shinkolobwe") {
    map.stop();
    map.flyTo(step.cameraPoint, step.cameraZoom, {
      duration: step.cameraDuration,
      easeLinearity: .22
    });
    steps.forEach(item => {
      const marker = stepMarkers[item.id];
      const selected = item.id === activeId;
      marker.setOpacity(selected ? 1 : .32);
      marker.getElement()?.classList.toggle("is-active-marker", selected);
    });
    if (selectionSource !== "initial") {
      popupTimer = window.setTimeout(() => {
        if (activeId !== step.id) return;
        openStepPopup(step);
        popupTimer = null;
      }, (step.cameraDuration * 1000) + 400);
    }
    return;
  }

  if (step.panOnly) {
    map.stop();
    map.flyTo(westernNewYorkCameraPoint(step.point), step.cameraZoom, {
      duration: step.id === "linde" ? 2.4 : step.cameraDuration,
      easeLinearity: .2
    });
    steps.forEach(item => {
      const marker = stepMarkers[item.id];
      const selected = item.id === activeId;
      marker.setOpacity(selected ? 1 : .32);
      marker.getElement()?.classList.toggle("is-active-marker", selected);
    });
    popupTimer = window.setTimeout(() => {
      if (activeId !== step.id) return;
      openStepPopup(step);
      popupTimer = null;
    }, step.id === "linde" ? 2850 : 2200);
    return;
  }

  const routeLine = L.polyline(route, routeOptions(step.routeKind)).addTo(activeRouteLayer);
  if (step.routeKind !== "context") addArrow(route);
  map.stop();
  map.fitBounds(L.latLngBounds(route), {
    padding: [90, 90],
    maxZoom: Math.max(10, step.cameraZoom - 1.5),
    animate: false
  });
  drawRouteProgressively(routeLine, 1200);
  routeTransitionTimer = window.setTimeout(() => {
    if (activeId !== step.id) return;
    map.stop();
    activeRouteLayer.clearLayers();
    map.flyTo(westernNewYorkCameraPoint(step.point), step.cameraZoom, {
      duration: 1.5,
      easeLinearity: .22
    });
    popupTimer = window.setTimeout(() => {
      if (activeId !== step.id) return;
      openStepPopup(step);
      popupTimer = null;
    }, 1700);
    routeTransitionTimer = null;
  }, 1350);

  steps.forEach(item => {
    const marker = stepMarkers[item.id];
    const selected = item.id === activeId;
    marker.setOpacity(selected ? 1 : .32);
    marker.getElement()?.classList.toggle("is-active-marker", selected);
  });
}

function selectStep(id, options = {}) {
  activeId = id;
  selectionSource = options.source || "journey";
  const step = stepById[id];
  const activeIndex = steps.findIndex(item => item.id === id);
  const currentCaption = step.caption;

  document.getElementById("discovery-card").hidden = true;
  document.getElementById("network-card").hidden = false;
  document.getElementById("node-kicker").textContent = `${step.number} · ${step.role}`;
  document.getElementById("node-date").textContent = step.date;
  document.getElementById("node-title").textContent = step.title;
  document.getElementById("node-location").textContent = step.location;
  document.getElementById("map-heading-title").textContent = `Step ${step.number} · ${step.shortTitle}`;
  document.getElementById("map-caption").textContent = currentCaption || "Only the current transfer is shown. Use Next to continue the route.";
  document.getElementById("step-count").textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(steps.length).padStart(2, "0")}`;

  const caption = document.getElementById("network-caption");
  caption.hidden = !currentCaption;
  caption.textContent = currentCaption || "";

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
  selectStep(steps[current <= 0 ? steps.length - 1 : current - 1].id, { source: "journey" });
});

document.getElementById("next-button").addEventListener("click", () => {
  const current = activeId ? steps.findIndex(step => step.id === activeId) : -1;
  selectStep(steps[current < 0 || current === steps.length - 1 ? 0 : current + 1].id, { source: "journey" });
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
selectStep("shinkolobwe", { source: "initial" });
window.setTimeout(() => map.invalidateSize(), 120);
