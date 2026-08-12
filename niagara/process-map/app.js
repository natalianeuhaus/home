/* global L */

const P = {
  shinkolobwe: [-11.06804, 26.54193],
  staten: [40.6402778, -74.1419444],
  seneca: [42.716, -76.889],
  linde: [42.97441030070138, -78.8930735242712],
  electromet: [43.08744037093125, -79.00690488493662],
  hooker: [43.07958422985608, -79.00831731578447],
  loow: [43.2235, -78.9565],
  landfill: [43.091907120818256, -78.99969074065574],
  river: [43.0905, -79.062],
  ashland1: [42.993, -78.917],
  ashland2: [43.000, -78.916],
  seaway: [42.997, -78.915],
  tonawandaLandfill: [42.985, -78.901],
  bliss: [42.8368, -78.8529],
  guterl: [43.16948064711221, -78.6929769560219]
};

const SHINKOLOBWE_OVERVIEW = [-11.06492, 26.52854];
const LOOW_BEFORE_CONTAINMENT = {
  eyebrow: "Before containment",
  title: "Lake Ontario Storage Area · 1985",
  body: "This is the Lake Ontario Storage Area within the former Lake Ontario Ordnance Works reservation in 1985—before radioactive materials were consolidated into the interim waste containment structure built in 1986.",
  note: "U.S. Army Corps of Engineers footage records the silo, buildings, roads, and storage grounds that had received uranium-processing residues from Western New York since 1944."
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
    summary: "The journey begins with the extraction of exceptionally rich uranium ore at Shinkolobwe.",
    received: "Uranium-bearing rock from one of the richest known deposits in the world.",
    process: "Workers mined extremely high-grade pitchblende. The ore entered an international supply chain controlled by Union Minière du Haut-Katanga.",
    mainDestination: "Staten Island → Seneca Depot",
    mainDetail: "More than 1,000 tons crossed the Atlantic in steel drums and were held at the African Metals Corporation warehouse near the Bayonne Bridge. On November 2, 1942, the Army moved the drums to the Seneca Ordnance Depot for safekeeping. The story next enters Linde as part of Western New York’s processing network—not as a claim that every Staten Island drum went directly to Linde.",
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
    summary: "Linde refined uranium ore into oxides and uranium tetrafluoride—green salt.",
    received: "African and American uranium ores entering the Manhattan Project supply network.",
    process: "Linde converted ore into black oxide, brown oxide, and uranium tetrafluoride—UF₄, known as “green salt.”",
    mainDestination: "Electromet, Niagara Falls",
    mainDetail: "Green salt moved onward for reduction into uranium metal.",
    routeKind: "material",
    route: [],
    cameraPoint: [42.967, -78.935],
    cameraZoom: 12.25,
    cameraDuration: 2.7,
    caption: "The narrative now enters Western New York at Linde. Staten Island and Seneca Depot remain part of the journey described in step 1.",
    wasteRoutes: [
      {
        id: "linde-ashland-1",
        title: "Ashland 1 / Tonawanda North Unit 1",
        location: "Tonawanda, New York",
        point: P.ashland1,
        detail: "From 1944 to 1946, uranium-processing residues from Linde were taken to the former Haist property for disposal.",
        fromThere: "Later construction disturbed the buried material and moved contaminated soil onward to Ashland 2 and the Seaway landfill.",
        path: [P.linde, [42.986, -78.904], P.ashland1]
      },
      {
        id: "linde-ashland-2",
        title: "Ashland 2 / Tonawanda North Unit 2",
        location: "Tonawanda, New York",
        point: P.ashland2,
        detail: "Radioactive soil displaced from Ashland 1 was transported here during later industrial construction.",
        fromThere: "The FUSRAP cleanup also included affected portions of Rattlesnake Creek beside the property.",
        path: [P.linde, [42.987, -78.906], P.ashland2]
      },
      {
        id: "linde-seaway",
        title: "Seaway Industrial Park / Unit 3",
        location: "Tonawanda, New York",
        point: P.seaway,
        detail: "Linde residues that had first been placed at Ashland 1 were later relocated into areas of the Seaway landfill.",
        fromThere: "FUSRAP identified radioactive material across several Seaway disposal areas; engineered caps now limit exposure where waste remains.",
        path: [P.linde, [42.986, -78.905], P.seaway]
      },
      {
        id: "linde-tonawanda-landfill",
        title: "Tonawanda Landfill vicinity property",
        location: "Tonawanda, New York",
        point: P.tonawandaLandfill,
        detail: "Federal surveys found radioactive material in the landfill and mudflats similar to material at the Linde FUSRAP site.",
        fromThere: "DOE designated the landfill and mudflats as a vicinity property of Linde in 1992.",
        path: [P.linde, [42.981, -78.898], P.tonawandaLandfill]
      },
      {
        id: "linde-loow",
        title: "LOOW / Niagara Falls Storage Site",
        location: "Lewiston, New York",
        point: P.loow,
        detail: "Linde’s radioactive residues entered the federal storage system at LOOW.",
        fromThere: "The map opens the 1985 site history after arriving at the storage area.",
        path: [P.linde, [43.038, -78.874], [43.112, -78.884], [43.175, -78.918], P.loow]
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
    summary: "Electromet reduced green salt into uranium metal and uranium-bearing C-2 slag.",
    received: "Uranium tetrafluoride—green salt—from Linde.",
    process: "Electromet used magnesium to reduce UF₄ into uranium metal. The reaction also produced uranium-bearing C-2 slag.",
    mainDestination: "Hooker Chemical + rod fabrication",
    mainDetail: "Uranium-bearing C-2 slag moved to Hooker for chemical treatment, while uranium metal entered the rod-fabrication network, including Bliss & Laughlin.",
    routeKind: "material",
    route: [P.linde, [43.021, -78.925], P.electromet],
    cameraZoom: 14,
    cameraDuration: 2.4,
    caption: "The line brings green salt from Linde to Electromet.",
    wasteRoutes: [
      {
        id: "electromet-loow",
        title: "LOOW / Niagara Falls Storage Site",
        location: "Lewiston, New York",
        point: P.loow,
        detail: "Radioactive waste from uranium-metal production moved north to LOOW.",
        fromThere: "The map opens the 1985 site history after arriving at the storage area.",
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
    summary: "Hooker chemically treated Electromet’s C-2 slag to recover uranium.",
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
    summary: "Simonds heated and rolled uranium-metal billets into rods.",
    received: "Uranium-metal billets produced within the Atomic Energy Commission supply network.",
    process: "Simonds heated and rolled uranium billets into rods. Federal records document more than 25 million pounds of uranium metal handled here.",
    mainDestination: "Further machining and reactor-fuel fabrication",
    mainDetail: "The rolled rods continued through a multi-site fabrication network. Radioactive contamination also remained in buildings, soil, and groundwater, leading to FUSRAP cleanup.",
    routeKind: "material",
    route: [P.electromet, [43.1205, -78.875], P.guterl],
    cameraZoom: 14,
    cameraDuration: 2.1,
    caption: "Returning to the uranium metal produced at Electromet, the line follows the fabrication network to rod rolling at Simonds Saw and Steel in Lockport.",
    wasteRoutes: []
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
    summary: "Bliss & Laughlin machined and straightened uranium rods for the AEC network.",
    received: "Uranium metal sent from Electromet through the Atomic Energy Commission fabrication network.",
    process: "Bliss & Laughlin machined and straightened uranium rods to improve their diameter tolerance and prepared them for further weapons-production work.",
    mainDestination: "Further AEC fabrication",
    mainDetail: "Finished rods returned to the wider production network; radioactive turnings and waste cuttings were routed through the Lake Ontario Ordnance Works.",
    routeKind: "material",
    route: [P.electromet, [42.96, -78.92], P.bliss],
    cameraZoom: 14,
    cameraDuration: 2.1,
    caption: "The line follows uranium metal from Electromet to Bliss & Laughlin for machining and straightening into rods.",
    wasteRoutes: [
      {
        id: "bliss-loow",
        title: "Lake Ontario Ordnance Works",
        location: "Lewiston and Porter, New York",
        point: P.loow,
        detail: "Machining produced radioactive turnings and waste cuttings that were shipped to LOOW.",
        fromThere: "The map opens the 1985 site history after arriving at the storage area.",
        path: [P.bliss, [43.02, -78.88], P.loow]
      }
    ]
  },
  {
    id: "loow",
    number: "7",
    role: "Storage and disposal",
    date: "1944–1986",
    title: "Lake Ontario Ordnance Works",
    shortTitle: "LOOW",
    location: "Lewiston and Porter, New York",
    point: P.loow,
    summary: "LOOW received radioactive residues for storage, repackaging, burial, and disposal.",
    received: "Radioactive residues from Western New York’s uranium-processing and fabrication network.",
    process: "The reservation was used for storage, repackaging, transshipment, burial, and disposal.",
    mainDestination: "Interim waste containment structure",
    mainDetail: "In 1986, radioactive materials were consolidated into the interim containment structure.",
    routeKind: "material",
    route: [P.bliss, [43.02, -78.88], [43.11, -78.89], P.loow],
    cameraZoom: 14,
    cameraDuration: 1.8,
    popup: LOOW_BEFORE_CONTAINMENT,
    caption: "The map lands on the Lake Ontario Storage Area first; its 1985 history then opens from marker 7.",
    wasteRoutes: []
  }
];

const stepById = Object.fromEntries(steps.map(step => [step.id, step]));
let activeId = null;
let wasteOpen = false;
let selectedWasteId = null;
let routeTransitionTimer = null;
let popupTimer = null;
let selectionSource = "initial";

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

function addArrow(path, waste = false) {
  const icon = L.divIcon({
    className: `route-arrow-wrap${waste ? " is-waste" : ""}`,
    html: `<span class="route-arrow" style="transform:rotate(${bearing(path)}deg)">➜</span>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
  L.marker(midpoint(path), { icon, interactive: false }).addTo(activeRouteLayer);
}

function addWasteDestinationMarker(route, routeNumber) {
  const icon = L.divIcon({
    className: "waste-marker-wrap",
    html: `<span class="waste-marker">${routeNumber}</span>`,
    iconSize: [38, 38],
    iconAnchor: [19, 19]
  });
  const marker = L.marker(route.point, {
    icon,
    interactive: true,
    keyboard: true,
    title: route.title
  }).addTo(activeRouteLayer);

  marker.on("click", () => {
    if (popupTimer) window.clearTimeout(popupTimer);
    map.closePopup();
    map.stop();
    map.flyTo(route.point, route.focusZoom || 14, {
      duration: 1.25,
      easeLinearity: .22
    });
    popupTimer = window.setTimeout(() => {
      openWastePopup(route, routeNumber);
      popupTimer = null;
    }, 1650);
  });
  return marker;
}

function openHistoryPopup(point, copy) {
  L.popup({
    className: "loow-history-popup",
    maxWidth: 370,
    minWidth: 300,
    offset: [0, -16],
    autoPan: false
  })
    .setLatLng(point)
    .setContent(`<article class="loow-popup-copy"><span>${copy.eyebrow}</span><h3>${copy.title}</h3><p>${copy.body}</p><p>${copy.note}</p></article>`)
    .openOn(map);
}

function openStepPopup(step) {
  if (step.popup) {
    openHistoryPopup(step.point, step.popup);
    return;
  }

  L.popup({
    className: "number-history-popup",
    maxWidth: 390,
    minWidth: 310,
    offset: [0, -36],
    autoPan: false
  })
    .setLatLng(step.point)
    .setContent(`
      <article class="number-popup-copy">
        <span>${step.number} · ${step.role} · ${step.date}</span>
        <h3>${step.title}</h3>
        <p class="number-popup-location">${step.location}</p>
        <dl>
          <div><dt>What arrived</dt><dd>${step.received}</dd></div>
          <div><dt>What happened here</dt><dd>${step.process}</dd></div>
          <div><dt>What moved next</dt><dd><strong>${step.mainDestination}</strong>${step.mainDetail}</dd></div>
        </dl>
      </article>
    `)
    .openOn(map);
}

function openWastePopup(route, routeNumber) {
  L.popup({
    className: "number-history-popup waste-history-popup",
    maxWidth: 370,
    minWidth: 300,
    offset: [0, -16],
    autoPan: false
  })
    .setLatLng(route.point)
    .setContent(`
      <article class="number-popup-copy">
        <span>Waste route ${routeNumber}</span>
        <h3>${route.title}</h3>
        <p class="number-popup-location">${route.location}</p>
        <p>${route.detail}</p>
        <p>${route.fromThere}</p>
      </article>
    `)
    .openOn(map);
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
  activeRouteLayer.clearLayers();
  if (!activeId) return;

  const step = stepById[activeId];
  const wasteRoute = step.wasteRoutes?.find(route => route.id === selectedWasteId);
  const route = wasteRoute ? wasteRoute.path : step.route;

  if (!wasteRoute && selectionSource === "marker") {
    map.stop();
    map.flyTo(step.cameraPoint || step.point, step.cameraZoom, {
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

  if (!wasteRoute && step.id === "shinkolobwe") {
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

  if (!wasteRoute && step.id === "linde") {
    map.stop();
    map.flyTo(step.cameraPoint || step.point, step.cameraZoom, {
      duration: 2.4,
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
    }, 2850);
    return;
  }

  if (!wasteRoute && step.popup) {
    map.stop();
    map.flyTo(step.point, step.cameraZoom, {
      duration: step.cameraDuration,
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
    }, 2200);
    return;
  }

  const routeLine = L.polyline(route, routeOptions(step.routeKind, Boolean(wasteRoute))).addTo(activeRouteLayer);
  if (!(!wasteRoute && step.routeKind === "context")) addArrow(route, Boolean(wasteRoute));
  const wasteRouteNumber = wasteRoute ? step.wasteRoutes.findIndex(item => item.id === wasteRoute.id) + 1 : null;
  const wasteMarker = wasteRoute ? addWasteDestinationMarker(wasteRoute, wasteRouteNumber) : null;

  if (wasteRoute) {
    if (wasteRoute.focusZoom) {
      map.flyTo(wasteRoute.point, wasteRoute.focusZoom, {
        duration: 1.8,
        easeLinearity: .22
      });
    } else {
      map.flyToBounds(L.latLngBounds(route), {
        padding: [78, 78],
        maxZoom: 12.5,
        duration: 1.6
      });
    }
    if (wasteMarker) {
      popupTimer = window.setTimeout(() => {
        if (activeId !== step.id || selectedWasteId !== wasteRoute.id) return;
        openWastePopup(wasteRoute, wasteRouteNumber);
        popupTimer = null;
      }, 2100);
    }
  } else {
    map.stop();
    map.fitBounds(L.latLngBounds(route), {
      padding: [90, 90],
      maxZoom: Math.max(10, step.cameraZoom - 1.5),
      animate: false
    });
    drawRouteProgressively(routeLine, 1200);
    routeTransitionTimer = window.setTimeout(() => {
      if (activeId !== step.id || selectedWasteId) return;
      map.stop();
      activeRouteLayer.clearLayers();
      map.flyTo(step.cameraPoint || step.point, step.cameraZoom, {
        duration: 1.5,
        easeLinearity: .22
      });
      popupTimer = window.setTimeout(() => {
        if (activeId !== step.id || selectedWasteId) return;
        openStepPopup(step);
        popupTimer = null;
      }, 1700);
      routeTransitionTimer = null;
    }, 1350);
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

function selectStep(id, options = {}) {
  activeId = id;
  selectionSource = options.source || "journey";
  const step = stepById[id];
  wasteOpen = selectionSource === "marker" && Boolean(step.wasteRoutes?.length);
  selectedWasteId = null;
  const activeIndex = steps.findIndex(item => item.id === id);
  const markerCaption = step.id === "linde"
    ? "Linde processed uranium ore here. The FUSRAP sites below trace where its radioactive residues went."
    : step.wasteRoutes?.length
      ? "This marker opens the factory process. Open the waste section below to see where its residues went."
      : "This marker opens the documented factory process and the legacy that remained at this site.";
  const currentCaption = selectionSource === "marker" ? markerCaption : step.caption;

  document.getElementById("discovery-card").hidden = true;
  document.getElementById("network-card").hidden = false;
  document.getElementById("node-kicker").textContent = `${step.number} · ${step.role}`;
  document.getElementById("node-date").textContent = step.date;
  document.getElementById("node-title").textContent = step.title;
  document.getElementById("node-location").textContent = step.location;
  document.getElementById("node-summary").textContent = step.summary;
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
