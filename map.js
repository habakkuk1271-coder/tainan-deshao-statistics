(() => {
  const mapNode = document.querySelector("#tainan-map");
  if (!mapNode || !window.L || !window.DESHAO_DATA) return;

  const data = window.DESHAO_DATA;
  const groups = data.groupAreas;
  const map = L.map(mapNode, { zoomControl: true, scrollWheelZoom: true, minZoom: 8, maxZoom: 18, preferCanvas: true });
  const status = document.querySelector("#map-status");
  const selection = document.querySelector("#map-selection");
  const reset = document.querySelector("#map-reset");
  const districtDetail = document.querySelector("#district-detail");
  const shownTotal = document.querySelector("#shown-total");
  const fullTainan = L.latLngBounds([[22.86, 119.96], [23.44, 120.69]]);
  const colors = ["#62c5aa", "#66a8d4", "#e2bf69", "#f2a267", "#ed7968", "#aa8ce5", "#47a995", "#81b5df", "#dc83b0", "#c4a765", "#75b39d", "#e58d57", "#829ee1", "#d77a74", "#52b6c2", "#a2b95f", "#d480ad", "#aa91d3", "#46a49a"];
  let selectedId = "";
  let districtLayer;
  let boundaryLayer;
  let districtFeatures = [];
  let boundaryFeatures = [];

  const countFor = (id) => data.distribution.find((item) => item.name.startsWith(`${id} `))?.count ?? 0;
  const colorFor = (id) => colors[(Number(id) - 1) % colors.length];
  const groupName = (id) => `${id} 大區`;
  const normalize = (s) => String(s || "").replace(/^臺南市/, "").replace(/區$/, "").replace(/[　\s]/g, "");
  const cleanRoadName = (s) => String(s || "").replace(/[一二三四五六七八九]段/g, "").replace(/臺/g, "台");
  const districtName = (f) => {
    const p = f.properties || {};
    return p.TOWNNAME || p.TOWNID || p.name || p.NAME || "臺南市行政區";
  };

  function setStatus(message, isError = false) {
    status.hidden = false;
    status.classList.toggle("is-error", isError);
    status.textContent = message;
  }

  function updateDetails(id) {
    if (!id) {
      shownTotal.textContent = data.total;
      districtDetail.textContent = "點選地圖上的大區範圍或右側名單查看人數。";
      districtDetail.classList.remove("is-selected");
      selection.textContent = "點選大區範圍查看名冊人數；拖曳或縮放瀏覽臺南。";
      return;
    }
    const group = groups.find((item) => item.id === id);
    const count = countFor(id);
    const shared = group?.sharedWith?.length ? `；與${group.sharedWith.map(groupName).join("、")}範圍相同` : "";
    shownTotal.textContent = count;
    districtDetail.innerHTML = `<strong>${groupName(id)}：${count} 位</strong><span>${group?.range || ""}${shared}</span>`;
    districtDetail.classList.add("is-selected");
    selection.textContent = `${groupName(id)}｜${count} 位`;
  }

  function adminGroupIds(feature) {
    const name = normalize(districtName(feature));
    return groups.filter((g) => !g.roads.length && g.districts.some((district) => normalize(district) === name)).map((g) => g.id);
  }

  function adminStyle(feature) {
    const ids = adminGroupIds(feature);
    const active = selectedId && ids.includes(selectedId);
    return {
      color: active ? colorFor(selectedId) : "#84a39a",
      weight: active ? 3.2 : selectedId ? 0 : 1.2,
      opacity: active ? 1 : selectedId ? 0 : 0.46,
      fillColor: active ? colorFor(selectedId) : "#53736b",
      fillOpacity: active ? 0.45 : selectedId ? 0 : 0.07
    };
  }

  function roadGroupIds(feature) {
    const p = feature.properties || {};
    const name = cleanRoadName(p.name);
    const ref = String(p.ref || "").split(/[;；]/).map((s) => s.trim());
    return groups.filter((g) => g.roads.some((road) => {
      const normalizedRoad = cleanRoadName(road);
      if (/^台\d+線$/.test(normalizedRoad)) return ref.includes(normalizedRoad.replace("台", "").replace("線", "")) || name.includes(normalizedRoad.replace("線", ""));
      if (normalizedRoad === "國道一號") return /國道一號|中山高速公路/.test(name) || ref.includes("1") && /高速公路/.test(name);
      if (normalizedRoad === "鹽水溪") return /鹽水溪/.test(name) && !/橋/.test(name);
      if (normalizedRoad === "許縣溪") return /許縣溪/.test(name) && !/橋/.test(name);
      if (normalizedRoad === "柴頭港溪") return /柴頭港溪/.test(name) && !/排水線/.test(name);
      return name === normalizedRoad || name.startsWith(normalizedRoad);
    })).map((g) => g.id);
  }

  function roadStyle(feature) {
    const active = selectedId && (feature.properties?.mapGroups || []).includes(selectedId);
    return {
      color: active ? colorFor(selectedId) : "#9fb0b5",
      weight: active ? 6 : selectedId ? 0.1 : 2,
      opacity: active ? 1 : selectedId ? 0 : 0.34,
      lineCap: "round",
      lineJoin: "round"
    };
  }

  function refreshMapStyles() {
    districtLayer?.eachLayer((layer) => {
      const active = !selectedId || adminGroupIds(layer.feature).includes(selectedId);
      layer.options.interactive = active;
      if (layer._path) layer._path.style.pointerEvents = active ? "auto" : "none";
      layer.setStyle(adminStyle(layer.feature));
    });
    boundaryLayer?.eachLayer((layer) => {
      const active = !selectedId || (layer.feature.properties?.mapGroups || []).includes(selectedId);
      layer.options.interactive = active;
      if (layer._path) layer._path.style.pointerEvents = active ? "auto" : "none";
      layer.setStyle(roadStyle(layer.feature));
    });
    hitLayer.eachLayer((layer) => {
      const active = !selectedId || (layer.options.mapGroups || []).includes(selectedId);
      layer.options.interactive = active;
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

  function addAdminPopup(feature, layer) {
    const ids = adminGroupIds(feature);
    if (!ids.length) return;
    const title = document.createElement("strong");
    title.textContent = districtName(feature);
    const content = document.createElement("div");
    content.className = "map-popup";
    content.append(title, makeGroupButtons(ids));
    layer.bindPopup(content, { maxWidth: 260 });
    layer.on("click", () => {
      if (ids.length === 1) window.selectDeshaoGroup?.(ids[0], true);
      layer.openPopup();
    });
  }

  function addRoadPopup(feature, layer) {
    const p = feature.properties || {};
    const ids = p.mapGroups || [];
    if (!ids.length) return;
    const title = document.createElement("strong");
    title.textContent = p.name || "大區界線";
    const content = document.createElement("div");
    content.className = "map-popup";
    content.append(title, makeGroupButtons(ids));
    layer.bindPopup(content, { maxWidth: 280 });
    layer.on("click", () => layer.openPopup());
    layer.bindTooltip(ids.map(groupName).join("、"), { sticky: true, className: "road-tooltip" });
    // A transparent, wide hit stroke makes thin road vectors usable on touch screens.
    const hit = L.polyline(feature.geometry.coordinates.map(([lng, lat]) => [lat, lng]), {
      color: "#fff", weight: 22, opacity: 0, interactive: true
    }).addTo(hitLayer);
    hit.options.mapGroups = ids;
    hit.on("click", (event) => {
      L.DomEvent.stopPropagation(event);
      layer.openPopup(event.latlng);
    });
  }

  function selectGroupOnMap(id, fit = true) {
    selectedId = id || "";
    refreshMapStyles();
    map.closePopup();
    updateDetails(selectedId);
    if (!selectedId) {
      if (fit) map.fitBounds(fullTainan, { padding: [28, 28] });
      return;
    }
    if (!fit) return;
    const bounds = L.latLngBounds([]);
    const matches = boundaryFeatures.filter((f) => (f.properties?.mapGroups || []).includes(selectedId));
    matches.forEach((feature) => bounds.extend(L.geoJSON(feature).getBounds()));
    const districts = groups.find((g) => g.id === selectedId)?.districts || [];
    districtLayer?.eachLayer((layer) => {
      if (districts.some((name) => normalize(name) === normalize(districtName(layer.feature)))) bounds.extend(layer.getBounds());
    });
    if (bounds.isValid()) map.fitBounds(bounds, { padding: [48, 48], maxZoom: 14 });
  }

  const hitLayer = L.layerGroup().addTo(map);
  window.addEventListener("deshao:group-selected", (event) => selectGroupOnMap(event.detail?.id || "", event.detail?.fromMap !== true));
  window.resetDeshaoMap = () => {
    selectedId = "";
    refreshMapStyles();
    map.closePopup();
    map.fitBounds(fullTainan, { padding: [28, 28] });
    updateDetails("");
  };
  map.fitBounds(fullTainan, { padding: [28, 28] });

  const districtQuery = new URLSearchParams({ where: "1=1", outFields: "TOWNID,TOWNCODE,TOWNNAME,TOWNENG", returnGeometry: "true", outSR: "4326", f: "geojson" });
  const districtSource = "https://services3.arcgis.com/pKves1c0n6gyoHMM/ArcGIS/rest/services/%E8%87%BA%E5%8D%97%E5%B8%82%E5%8D%80%E7%95%8C%E5%9C%96/FeatureServer/0/query?" + districtQuery.toString();
  fetch(districtSource, { mode: "cors" })
    .then((response) => { if (!response.ok) throw new Error(`行政區界服務回傳 ${response.status}`); return response.json(); })
    .then((geojson) => {
      if (!geojson || geojson.type !== "FeatureCollection" || !Array.isArray(geojson.features)) throw new Error("行政區向量格式不正確");
      districtFeatures = geojson.features.filter((feature) => adminGroupIds(feature).length);
      districtLayer = L.geoJSON({ type: "FeatureCollection", features: districtFeatures }, { style: adminStyle, onEachFeature: addAdminPopup }).addTo(map);
      setStatus(`已載入 ${districtFeatures.length} 個行政區大區範圍`, false);
      window.setTimeout(() => { status.hidden = true; }, 2600);
    })
    .catch((error) => { console.error("Unable to load district vectors:", error); setStatus("行政區向量暫時無法載入。", true); });

  fetch("road-boundaries.geojson?v=20261120-clean-areas")
    .then((response) => { if (!response.ok) throw new Error(`道路向量回傳 ${response.status}`); return response.json(); })
    .then((geojson) => {
      if (!geojson || geojson.type !== "FeatureCollection" || !Array.isArray(geojson.features)) throw new Error("道路向量格式不正確");
      boundaryFeatures = geojson.features.flatMap((feature) => {
        const p = feature.properties || {};
        const name = String(p.name || "");
        if (/巷|弄|橋/.test(name)) return [];
        const mapGroups = roadGroupIds(feature);
        if (!mapGroups.length) return [];
        return [{ ...feature, properties: { ...p, mapGroups } }];
      });
      boundaryLayer = L.geoJSON({ type: "FeatureCollection", features: boundaryFeatures }, { style: roadStyle, onEachFeature: addRoadPopup }).addTo(map);
      setStatus(`已整理 ${boundaryFeatures.length} 段道路與河川大區界線`, false);
      window.setTimeout(() => { status.hidden = true; }, 3000);
    })
    .catch((error) => { console.error("Unable to load road boundary vectors:", error); setStatus("道路向量暫時無法載入，請重新整理頁面。", true); });

  reset.addEventListener("click", () => { window.selectDeshaoGroup?.("", true); window.resetDeshaoMap?.(); });
})();
