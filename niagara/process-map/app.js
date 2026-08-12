/* global L */

const P = {
  shinkolobwe: [-11.055, 26.547],
  staten: [40.6402778, -74.1419444],
  seneca: [42.716, -76.889],
  linde: [42.97441030070138, -78.8930735242712],
  electromet: [43.08744037093125, -79.00690488493662],
  hooker: [43.07958422985608, -79.00831731578447],
  loow: [43.2235, -78.9565],
  landfill: [43.091907120818256, -78.99969074065574],
  river: [43.0905, -79.062]
};

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
    received: "Uranium-bearing rock from one of the richest known deposits in the world.",
    process: "Workers mined extremely high-grade pitchblende. The ore entered an international supply chain controlled by Union Minière du Haut-Katanga.",
    mainDestination: "Staten Island → Seneca Depot",
    mainDetail: "More than 1,000 tons crossed the Atlantic in steel drums and were held at the African Metals Corporation warehouse near the Bayonne Bridge. On November 2, 1942, the Army moved the drums to the Seneca Ordnance Depot for safekeeping. The story next enters Linde as part of Western New York’s processing network—not as a claim that every Staten Island drum went directly to Linde.",
    routeKind: "material",
    route: [P.shinkolobwe, [-7.5, 20], [-5.8, 13.2], [4, -12], [24, -43], [38, -68], P.staten],
    cameraPoint: [-10.45, 25.75],
    cameraZoom: 8.5,
    cameraDuration: 1.8,
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
    received: "African and American uranium ores entering the Manhattan Project supply network.",
    process: "Linde converted ore into black oxide, brown oxide, and uranium tetrafluoride—UF₄, known as “green salt.”",
    mainDestination: "Electromet, Niagara Falls",
    mainDetail: "Green salt moved onward for reduction into uranium metal.",
    routeKind: "material",
    route: [P.shinkolobwe, [-7.5, 20], [-5.8, 13.2], [4, -12], [24, -43], [38, -68], P.staten, [41.15, -74.72], [42.05, -75.72], P.seneca, [42.87, -77.61], P.linde],
    cameraZoom: 11,
    cameraDuration: 2.7,
    caption: "The camera follows the connected route from Shinkolobwe and settles at Linde. Staten Island and Seneca Depot remain part of the journey described in step 1.",
    wasteRoutes: [
      {
        id: "linde-loow",
        title: "LOOW / Niagara Falls Storage Site",
        location: "Lewiston, New York",
        point: P.loow,
        detail: "Radioactive residues and contaminated materials from Linde entered the federal storage and disposal system.",
        fromThere: "At LOOW, material was stored, repackaged, moved, buried, or disposed. Accounts later described gravel and fill leaving with workers for destinations that were never completely recorded.",
        path: [P.linde, [43.106, -78.91], P.loow]
      }
    ]
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
    received: "Uranium tetrafluoride—green salt—from Linde.",
    process: "Electromet used magnesium to reduce UF₄ into uranium metal. The reaction also produced uranium-bearing C-2 slag.",
    mainDestination: "Hooker Chemical",
    mainDetail: "C-2 slag still contained recoverable uranium, so it moved to Hooker for chemical treatment.",
    routeKind: "material",
    route: [P.linde, [43.021, -78.925], P.electromet],
    cameraZoom: 12.5,
    cameraDuration: 2.4,
    caption: "The line brings green salt from Linde to Electromet.",
    wasteRoutes: [
      {
        id: "electromet-loow",
        title: "LOOW / Niagara Falls Storage Site",
        location: "Lewiston, New York",
        point: P.loow,
        detail: "Radioactive waste from uranium-metal production moved north into the federal storage and disposal system.",
        fromThere: "LOOW became a site of storage, repackaging, transshipment, burial, and disposal. Some material later left the reservation with workers or private recipients.",
        path: [P.electromet, [43.151, -78.989], P.loow]
      },
      {
        id: "electromet-landfill",
        title: "Union Carbide company landfill",
        location: "Niagara Falls Boulevard, Niagara Falls",
        point: P.landfill,
        detail: "Industrial waste, slag, and contaminated material were also hauled to the company landfill.",
        fromThere: "Trucking records describe waste and slag moving through private carriers and contractors. Untreated slag could be sold or reused as inexpensive fill.",
        path: [P.electromet, [43.0902, -79.0037], P.landfill]
      }
    ]
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
    received: "Uranium-bearing C-2 slag generated by Electromet’s reduction process.",
    process: "Hooker treated the slag with hydrochloric acid to recover uranium. The recovery process produced another layer of solid and liquid residues.",
    mainDestination: "Linde",
    mainDetail: "Recovered uranium-bearing material returned to the refining network, closing the regional recovery loop.",
    routeKind: "material",
    route: [P.electromet, [43.0838, -79.0115], P.hooker],
    cameraZoom: 14,
    cameraDuration: 2.1,
    caption: "The line brings uranium-bearing C-2 slag from Electromet to Hooker for recovery.",
    wasteRoutes: [
      {
        id: "hooker-water",
        title: "Industrial drains and waterways",
        location: "Niagara Falls factory districts and the Niagara River",
        point: P.river,
        detail: "Liquid, chemically contaminated, and radioactive waste entered industrial disposal systems.",
        fromThere: "Sewers, storm drains, and industrial waterways carried contamination through another route—one that left no neat boundary around a factory or dump.",
        path: [P.hooker, [43.082, -79.025], P.river]
      }
    ]
  }
];

const stepById = Object.fromEntries(steps.map(step => [step.id, step]));
let activeId = null;
let wasteOpen = false;
let selectedWasteId = null;
let routeTransitionTimer = null;

const map = L.map("map", {
  center: [20, -28],
  zoom: 2.4,
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
preloadSatellite(P.linde, 11);

const activeRouteLayer = L.layerGroup().addTo(map);
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
  marker.bindTooltip(
    `<strong>${step.title}</strong><br><span>${step.location}</span>`,
    { direction: "top", offset: [0, -42], className: "facility-tooltip" }
  );
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

function routeOptions(kind, waste = false) {
  if (waste) {
    return {
      color: "#e8d9b6",
      weight: 4,
      opacity: .98,
      dashArray: "8 7",
      className: "network-route-line is-active-route"
    };
  }
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
    color: "#440806",
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

function addArrow(path, waste = false) {
  const icon = L.divIcon({
    className: `route-arrow-wrap${waste ? " is-waste" : ""}`,
    html: `<span class="route-arrow" style="transform:rotate(${bearing(path)}deg)">➜</span>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
  L.marker(midpoint(path), { icon, interactive: false }).addTo(activeRouteLayer);
}

function addWasteDestinationMarker(route) {
  const icon = L.divIcon({
    className: "waste-marker-wrap",
    html: '<span class="waste-marker">W</span>',
    iconSize: [38, 38],
    iconAnchor: [19, 19]
  });
  L.marker(route.point, { icon, interactive: false }).addTo(activeRouteLayer);
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
  activeRouteLayer.clearLayers();
  if (!activeId) return;

  const step = stepById[activeId];
  const wasteRoute = step.wasteRoutes?.find(route => route.id === selectedWasteId);
  const route = wasteRoute ? wasteRoute.path : step.route;

  const routeLine = L.polyline(route, routeOptions(step.routeKind, Boolean(wasteRoute))).addTo(activeRouteLayer);
  if (!(!wasteRoute && step.routeKind === "context")) addArrow(route, Boolean(wasteRoute));
  if (wasteRoute) addWasteDestinationMarker(wasteRoute);

  if (wasteRoute) {
    map.flyToBounds(L.latLngBounds(route), {
      padding: [78, 78],
      maxZoom: 12.5,
      duration: 1.6
    });
  } else if (step.id === "linde") {
    map.stop();
    map.fitBounds(L.latLngBounds(route), {
      padding: [56, 56],
      maxZoom: 2.5,
      animate: false
    });
    drawRouteProgressively(routeLine);
    routeTransitionTimer = window.setTimeout(() => {
      if (activeId !== step.id || selectedWasteId) return;
      map.stop();
      map.setView(step.point, step.cameraZoom, { animate: false });
      window.requestAnimationFrame(() => resetRouteProgress(routeLine));
      routeTransitionTimer = null;
    }, 3550);
  } else {
    map.flyTo(step.cameraPoint || step.point, step.cameraZoom, {
      duration: step.cameraDuration,
      easeLinearity: .22
    });
  }

  steps.forEach(item => {
    const marker = stepMarkers[item.id];
    const selected = item.id === activeId;
    marker.setOpacity(selected ? 1 : .32);
    marker.getElement()?.classList.toggle("is-active-marker", selected);
  });
}

function renderWasteRoutes(step) {
  const explorer = document.getElementById("waste-explorer");
  const destinations = document.getElementById("waste-destinations");
  const list = document.getElementById("waste-list");
  const toggle = document.getElementById("waste-toggle");

  explorer.hidden = !step.wasteRoutes?.length;
  destinations.hidden = !wasteOpen;
  toggle.setAttribute("aria-expanded", String(wasteOpen));
  toggle.querySelector("i").textContent = wasteOpen ? "↑" : "↓";
  list.replaceChildren();

  if (!step.wasteRoutes) return;
  step.wasteRoutes.forEach((route, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `waste-destination${selectedWasteId === route.id ? " is-active" : ""}`;
    button.innerHTML = `<span>Waste route ${index + 1}</span><h3>${route.title}</h3><p>${route.detail}</p><small>${route.fromThere}</small>`;
    button.addEventListener("click", () => {
      selectedWasteId = route.id;
      renderWasteRoutes(step);
      document.getElementById("map-heading-title").textContent = `${step.shortTitle} waste → ${route.title}`;
      document.getElementById("map-caption").textContent = route.fromThere;
      drawActiveRoute();
    });
    list.appendChild(button);
  });
}

function selectStep(id) {
  activeId = id;
  wasteOpen = false;
  selectedWasteId = null;
  const step = stepById[id];
  const activeIndex = steps.findIndex(item => item.id === id);

  document.getElementById("discovery-card").hidden = true;
  document.getElementById("network-card").hidden = false;
  document.getElementById("node-kicker").textContent = `${step.number} · ${step.role}`;
  document.getElementById("node-date").textContent = step.date;
  document.getElementById("node-title").textContent = step.title;
  document.getElementById("node-location").textContent = step.location;
  document.getElementById("node-received").textContent = step.received;
  document.getElementById("node-process").textContent = step.process;
  document.getElementById("main-destination").textContent = step.mainDestination;
  document.getElementById("main-detail").textContent = step.mainDetail;
  document.getElementById("map-heading-title").textContent = `Step ${step.number} · ${step.shortTitle}`;
  document.getElementById("map-caption").textContent = step.caption || "Only the current transfer is shown. Use Next to continue the route.";
  document.getElementById("step-count").textContent = `${String(activeIndex + 1).padStart(2, "0")} / ${String(steps.length).padStart(2, "0")}`;

  const caption = document.getElementById("network-caption");
  caption.hidden = !step.caption;
  caption.textContent = step.caption || "";

  const next = document.getElementById("next-button");
  const isLast = activeIndex === steps.length - 1;
  next.innerHTML = `${isLast ? "Restart" : "Next"} <span aria-hidden="true">→</span>`;
  next.setAttribute("aria-label", isLast ? "Restart at the mine" : "Next step");

  document.querySelectorAll(".linear-stepper button").forEach(button => {
    const selected = button.dataset.nodeId === id;
    button.classList.toggle("is-active", selected);
    if (selected) {
      button.setAttribute("aria-current", "step");
      const stepper = document.getElementById("network-index");
      stepper.scrollTo({ left: Math.max(0, button.offsetLeft - 24), behavior: "smooth" });
    } else {
      button.removeAttribute("aria-current");
    }
  });

  renderWasteRoutes(step);
  drawActiveRoute();
}

document.getElementById("waste-toggle").addEventListener("click", () => {
  if (!activeId) return;
  wasteOpen = !wasteOpen;
  if (!wasteOpen) {
    selectedWasteId = null;
    const step = stepById[activeId];
    document.getElementById("map-heading-title").textContent = `Step ${step.number} · ${step.shortTitle}`;
    document.getElementById("map-caption").textContent = step.caption || "Only the current transfer is shown. Use Next to continue the route.";
    drawActiveRoute();
  }
  renderWasteRoutes(stepById[activeId]);
});

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
steps.forEach(step => stepMarkers[step.id].setOpacity(.78));
window.setTimeout(() => map.invalidateSize(), 120);
