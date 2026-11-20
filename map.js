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
  let districtFeatures = [];

  const countFor = (id) => data.distribution.find((item) => item.name.startsWith(`${id} `))?.count ?? 0;
  const colorFor = (id) => colors[(Number(id) - 1) % colors.length];
  const groupName = (id) => `${id} 大區`;
  const normalize = (s) => String(s || "").replace(/^臺南市/, "").replace(/區$/, "").replace(/[　\s]/g, "");
  const districtName = (feature) => {
    const p = feature.properties || {};
    return p.TOWNNAME || p.TOWNID || p.name || p.NAME || "臺南市行政區";
  };
  const groupsForDistrict = (feature) => {
    const name = normalize(districtName(feature));
    return groups.filter((group) => group.districts.some((district) => normalize(district) === name));
  };

  function setStatus(message, isError = false) {
    status.hidden = false;
    status.classList.toggle("is-error", isError);
    status.textContent = message;
  }

  function styleDistrict(feature) {
    const assigned = groupsForDistrict(feature);
    const active = selectedId && assigned.some((group) => group.id === selectedId);
    const selectedGroup = groups.find((group) => group.id === selectedId);
    // A named-road range is not a district polygon. Keep its administrative frame
    // visible as context without tinting the entire township as if it were the group.
    const exactDistrictArea = active && selectedGroup && selectedGroup.roads.length === 0;
    return {
      color: active ? colorFor(selectedId) : "#819c93",
      weight: active ? 3.6 : 1.7,
      opacity: active ? 1 : 0.78,
      fillColor: exactDistrictArea ? colorFor(selectedId) : "#53736b",
      fillOpacity: exactDistrictArea ? 0.44 : 0.025
    };
  }

  function makeGroupButtons(foundGroups) {
    const box = document.createElement("div");
    box.className = "map-popup-groups";
    foundGroups.forEach((group) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "map-popup-group";
      button.textContent = `${groupName(group.id)} · ${countFor(group.id)} 位`;
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        window.selectDeshaoGroup?.(group.id, true);
        map.closePopup();
      });
      box.append(button);
    });
    return box;
  }

  function addDistrictPopup(feature, layer) {
    const foundGroups = groupsForDistrict(feature);
    if (!foundGroups.length) return;
    const title = document.createElement("strong");
    title.textContent = districtName(feature);
    const content = document.createElement("div");
    content.className = "map-popup";
    content.append(title, makeGroupButtons(foundGroups));
    layer.bindPopup(content, { maxWidth: 270 });
    layer.on("click", () => layer.openPopup());
  }

  function selectGroupOnMap(id, fit = true) {
    selectedId = id || "";
    districtLayer?.setStyle(styleDistrict);
    map.closePopup();
    if (!selectedId) {
      if (fit) map.fitBounds(fullTainan, { padding: [28, 28] });
      return;
    }
    if (!fit) return;
    const group = groups.find((item) => item.id === selectedId);
    if (!group) return;
    const matches = districtFeatures.filter((feature) => group.districts.some((district) => normalize(district) === normalize(districtName(feature))));
    if (matches.length) {
      const bounds = L.latLngBounds([]);
      matches.forEach((feature) => bounds.extend(L.geoJSON(feature).getBounds()));
      if (bounds.isValid()) map.fitBounds(bounds, { padding: [48, 48], maxZoom: matches.length === 1 ? 12 : 10 });
    }
  }

  window.addEventListener("deshao:group-selected", (event) => selectGroupOnMap(event.detail?.id || "", event.detail?.fromMap !== true));
  window.resetDeshaoMap = () => {
    selectedId = "";
    districtLayer?.setStyle(styleDistrict);
    map.closePopup();
    map.fitBounds(fullTainan, { padding: [28, 28] });
  };
  map.fitBounds(fullTainan, { padding: [28, 28] });

  const districtQuery = new URLSearchParams({ where: "1=1", outFields: "TOWNID,TOWNCODE,TOWNNAME,TOWNENG", returnGeometry: "true", outSR: "4326", f: "geojson" });
  const districtSource = "https://services3.arcgis.com/pKves1c0n6gyoHMM/ArcGIS/rest/services/%E8%87%BA%E5%8D%97%E5%B8%82%E5%8D%80%E7%95%8C%E5%9C%96/FeatureServer/0/query?" + districtQuery.toString();
  fetch(districtSource, { mode: "cors" })
    .then((response) => { if (!response.ok) throw new Error(`行政區界服務回傳 ${response.status}`); return response.json(); })
    .then((geojson) => {
      if (!geojson || geojson.type !== "FeatureCollection" || !Array.isArray(geojson.features)) throw new Error("行政區向量格式不正確");
      districtFeatures = geojson.features.filter((feature) => groupsForDistrict(feature).length);
      districtLayer = L.geoJSON({ type: "FeatureCollection", features: districtFeatures }, { style: styleDistrict, onEachFeature: addDistrictPopup }).addTo(map);
      setStatus(`已載入 ${districtFeatures.length} 個行政區界線；道路分區線已移除`, false);
      window.setTimeout(() => { status.hidden = true; }, 3200);
    })
    .catch((error) => { console.error("Unable to load district vectors:", error); setStatus("行政區向量暫時無法載入。", true); });

  reset.addEventListener("click", () => { window.selectDeshaoGroup?.("", true); window.resetDeshaoMap?.(); });
})();
