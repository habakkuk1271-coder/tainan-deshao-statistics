(() => {
  const mapNode = document.querySelector("#tainan-map");
  if (!mapNode || !window.L || !window.DESHAO_DATA) return;

  const data = window.DESHAO_DATA;
  const groups = data.groupAreas;
  const map = L.map(mapNode, { zoomControl: true, scrollWheelZoom: true, minZoom: 8, maxZoom: 18, preferCanvas: true });
  const status = document.querySelector("#map-status");
  const reset = document.querySelector("#map-reset");
  const fullTainan = L.latLngBounds([[22.86, 119.96], [23.44, 120.69]]);
  const colors = ["#62c5aa", "#66a8d4", "#e2bf69", "#f2a267", "#ed7968", "#aa8ce5", "#47a995", "#81b5df", "#dc83b0", "#c4a765", "#75b39d", "#e58d57", "#829ee1", "#d77a74", "#52b6c2", "#a2b95f", "#d480ad", "#aa91d3", "#46a49a"];
  let selectedId = "";
  let districtLayer;
  let villageLayer;
  let districtFeatures = [];
  let villageFeatures = [];

  const countFor = (id) => data.distribution.find((item) => item.name.startsWith(`${id} `))?.count ?? 0;
  const colorFor = (id) => colors[(Number(id) - 1) % colors.length];
  const groupName = (id) => `${id} 大區`;
  const normalize = (s) => String(s || "").replace(/^臺南市/, "").replace(/[　\s]/g, "").replace(/區$/, "").replace(/里$/, "").replace(/臺/g, "台").replace(/鹽/g, "塩");
  const districtName = (feature) => {
    const p = feature.properties || {};
    return p.TOWNNAME || p.TOWNID || p.name || p.NAME || "臺南市行政區";
  };
  const villageName = (feature) => feature.properties?.VILLNAME || "";
  const groupsForDistrict = (feature) => {
    const name = normalize(districtName(feature));
    return groups.filter((group) => group.districts.some((district) => normalize(district) === name));
  };
  const villageGroups = (feature) => {
    const town = normalize(districtName(feature));
    const village = normalize(villageName(feature));
    return groups.filter((group) => {
      if (!group.villages?.length) return false;
      if (!group.districts.some((district) => normalize(district) === town)) return false;
      return group.villages.some((entry) => {
        const [entryTown, entryVillage] = entry.split("|");
        return normalize(entryTown) === town && normalize(entryVillage) === village;
      });
    }).map((group) => group.id);
  };

  function setStatus(message, isError = false) {
    status.hidden = false;
    status.classList.toggle("is-error", isError);
    status.textContent = message;
  }

  function styleDistrict(feature) {
    const assigned = groupsForDistrict(feature);
    const active = selectedId && assigned.some((group) => group.id === selectedId);
    const group = groups.find((item) => item.id === selectedId);
    const entireDistrict = active && group && !group.villages?.length;
    return {
      color: active ? colorFor(selectedId) : "#819c93",
      weight: active ? 2.8 : 1.45,
      opacity: active ? 1 : 0.74,
      fillColor: entireDistrict ? colorFor(selectedId) : "#53736b",
      fillOpacity: entireDistrict ? 0.42 : 0.015
    };
  }

  function styleVillage(feature) {
    const active = selectedId && villageGroups(feature).includes(selectedId);
    return active
      ? { color: colorFor(selectedId), weight: 1.8, opacity: 1, fillColor: colorFor(selectedId), fillOpacity: 0.64 }
      : { color: "#819c93", weight: 0, opacity: 0, fillColor: "#000000", fillOpacity: 0 };
  }

  function refreshStyles() {
    districtLayer?.setStyle(styleDistrict);
    villageLayer?.eachLayer((layer) => {
      const active = selectedId && villageGroups(layer.feature).includes(selectedId);
      layer.options.interactive = Boolean(active);
      if (layer._path) layer._path.style.pointerEvents = active ? "auto" : "none";
      layer.setStyle(styleVillage(layer.feature));
    });
  }

  function makeGroupButtons(ids) {
    const box = document.createElement("div");
    box.className = "map-popup-groups";
    ids.forEach((id) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "map-popup-group";
      button.textContent = `${groupName(id)} · ${countFor(id)} 位`;
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        window.selectDeshaoGroup?.(id, true);
        map.closePopup();
      });
      box.append(button);
    });
    return box;
  }

  function bindGroupPopup(feature, layer, ids, titleText) {
    if (!ids.length) return;
    const title = document.createElement("strong");
    title.textContent = titleText;
    const content = document.createElement("div");
    content.className = "map-popup";
    content.append(title, makeGroupButtons(ids));
    layer.bindPopup(content, { maxWidth: 270 });
    layer.on("click", () => layer.openPopup());
  }

  function addDistrictPopup(feature, layer) {
    const ids = groupsForDistrict(feature).map((group) => group.id);
    bindGroupPopup(feature, layer, ids, districtName(feature));
  }

  function addVillagePopup(feature, layer) {
    bindGroupPopup(feature, layer, villageGroups(feature), `${districtName(feature)}・${villageName(feature)}`);
  }

  function selectGroupOnMap(id, fit = true) {
    selectedId = id || "";
    refreshStyles();
    map.closePopup();
    if (!selectedId) {
      if (fit) map.fitBounds(fullTainan, { padding: [28, 28] });
      return;
    }
    if (!fit) return;
    const group = groups.find((item) => item.id === selectedId);
    if (!group) return;
    const bounds = L.latLngBounds([]);
    const matches = group.villages?.length
      ? villageFeatures.filter((feature) => villageGroups(feature).includes(selectedId))
      : districtFeatures.filter((feature) => group.districts.some((name) => normalize(name) === normalize(districtName(feature))));
    matches.forEach((feature) => bounds.extend(L.geoJSON(feature).getBounds()));
    if (bounds.isValid()) map.fitBounds(bounds, { padding: [36, 36], maxZoom: matches.length === 1 ? 13 : 12 });
  }

  window.addEventListener("deshao:group-selected", (event) => selectGroupOnMap(event.detail?.id || "", event.detail?.fromMap !== true));
  window.resetDeshaoMap = () => {
    selectedId = "";
    refreshStyles();
    map.closePopup();
    map.fitBounds(fullTainan, { padding: [28, 28] });
  };
  map.fitBounds(fullTainan, { padding: [28, 28] });

  const districtQuery = new URLSearchParams({ where: "1=1", outFields: "TOWNID,TOWNCODE,TOWNNAME,TOWNENG", returnGeometry: "true", outSR: "4326", f: "geojson" });
  const districtSource = "https://services3.arcgis.com/pKves1c0n6gyoHMM/ArcGIS/rest/services/%E8%87%BA%E5%8D%97%E5%B8%82%E5%8D%80%E7%95%8C%E5%9C%96/FeatureServer/0/query?" + districtQuery.toString();
  const villageQuery = new URLSearchParams({ where: "1=1", outFields: "COUNTYNAME,TOWNNAME,VILLNAME,VILLCODE", returnGeometry: "true", outSR: "4326", f: "geojson" });
  const villageSource = "https://services2.arcgis.com/OuqldCWB2weQ4da0/ArcGIS/rest/services/%E5%8F%B0%E5%8D%97%E6%9D%91%E9%87%8C%E7%95%8C/FeatureServer/0/query?" + villageQuery.toString();

  Promise.all([
    fetch(districtSource, { mode: "cors" }).then((response) => { if (!response.ok) throw new Error(`行政區界服務回傳 ${response.status}`); return response.json(); }),
    fetch(villageSource, { mode: "cors" }).then((response) => { if (!response.ok) throw new Error(`里界服務回傳 ${response.status}`); return response.json(); })
  ])
    .then(([districtGeojson, villageGeojson]) => {
      if (districtGeojson?.type !== "FeatureCollection" || !Array.isArray(districtGeojson.features)) throw new Error("行政區界向量格式不正確");
      if (villageGeojson?.type !== "FeatureCollection" || !Array.isArray(villageGeojson.features)) throw new Error("里界向量格式不正確");
      districtFeatures = districtGeojson.features;
      villageFeatures = villageGeojson.features.filter((feature) => normalize(feature.properties?.COUNTYNAME) === normalize("臺南市"));
      districtLayer = L.geoJSON({ type: "FeatureCollection", features: districtFeatures }, { style: styleDistrict, onEachFeature: addDistrictPopup }).addTo(map);
      villageLayer = L.geoJSON({ type: "FeatureCollection", features: villageFeatures }, { style: styleVillage, onEachFeature: addVillagePopup }).addTo(map);
      const cityBounds = districtLayer.getBounds();
      if (cityBounds.isValid()) map.fitBounds(cityBounds, { padding: [34, 34] });
      refreshStyles();
      setStatus(`已載入 ${districtFeatures.length} 個行政區界及 ${villageFeatures.length} 個里界`, false);
      window.setTimeout(() => { status.hidden = true; }, 3300);
    })
    .catch((error) => {
      console.error("Unable to load Tainan administrative vectors:", error);
      setStatus("行政區或里界向量暫時無法載入。", true);
    });

  reset.addEventListener("click", () => { window.selectDeshaoGroup?.("", true); window.resetDeshaoMap?.(); });
})();
