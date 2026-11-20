(() => {
  const mapNode = document.querySelector("#tainan-map");
  if (!mapNode || !window.L) return;

  const map = L.map(mapNode, { zoomControl: true, scrollWheelZoom: true, minZoom: 8, maxZoom: 18 });
  const status = document.querySelector("#map-status");
  const selection = document.querySelector("#map-selection");
  const reset = document.querySelector("#map-reset");
  const districtDetail = document.querySelector("#district-detail");
  const shownTotal = document.querySelector("#shown-total");
  const roster = window.DESHAO_DATA;
  const groups = roster.groupAreas;
  const fullTainan = L.latLngBounds([[22.86, 119.96], [23.44, 120.69]]);
  const palette = ["#2a9d8f", "#457b9d", "#e9c46a", "#f4a261", "#e76f51", "#7b6dce", "#2f8f83", "#4c78a8", "#d45087", "#8c6d31", "#5b8e7d", "#da7b35", "#6f83c2", "#b85548", "#4493a6", "#87994a", "#bd6b9c", "#8e7dbd", "#3d7e75"];
  let selectedId = "";
  let districtLayer;
  let boundaryLayer;
  let districtFeatures = [];
  let boundaryFeatures = [];

  const groupNumber = (id) => Number.parseInt(id, 10) || 1;
  const groupColor = (id) => palette[(groupNumber(id) - 1) % palette.length];
  const groupName = (id) => `${id} 大區`;
  const groupCount = (id) => roster.distribution.find((item) => item.name.startsWith(id + " "))?.count ?? 0;
  const normalizeDistrict = (name) => String(name || "").replace(/^臺南市/, "").replace(/區$/, "");
  const displayDistrict = (feature) => {
    const p = feature.properties || {};
    return p.TOWNNAME || p.TOWNID || p.name || p.NAME || "臺南市行政區";
  };

  const setStatus = (message, isError = false) => {
    status.hidden = false;
    status.classList.toggle("is-error", isError);
    status.textContent = message;
  };

  const updateDetails = (id) => {
    if (!id) {
      shownTotal.textContent = roster.total;
      districtDetail.textContent = "選取右側大區，地圖會標出實際行政區與道路分界。";
      districtDetail.classList.remove("is-selected");
      selection.textContent = "點選大區或彩色分界道路，可查看該區名冊人數。拖曳、縮放瀏覽臺南。";
      return;
    }
    const group = groups.find((item) => item.id === id);
    const count = groupCount(id);
    const shared = group?.sharedWith?.length ? `；與${group.sharedWith.map(groupName).join("、")}範圍相同` : "";
    shownTotal.textContent = count;
    districtDetail.innerHTML = `<strong>${groupName(id)}：${count} 位</strong><span>${group?.range || ""}${shared}</span>`;
    districtDetail.classList.add("is-selected");
    selection.textContent = `${groupName(id)}｜${count} 位；彩色道路線依實際道路向量標示。`;
  };

  const adminStyle = (feature) => {
    const district = normalizeDistrict(displayDistrict(feature));
    const linked = groups.filter((group) => group.districts.some((name) => normalizeDistrict(name) === district));
    const selectedGroup = groups.find((group) => group.id === selectedId);
    const active = selectedGroup && selectedGroup.roads.length === 0 && linked.some((group) => group.id === selectedId);
    return {
      color: active ? groupColor(selectedId) : "#8e9a96",
      weight: active ? 2.7 : 0.9,
      opacity: active ? 0.95 : 0.5,
      fillColor: active ? groupColor(selectedId) : "#71847d",
      fillOpacity: active ? 0.24 : 0.035
    };
  };

  const roadStyle = (feature) => {
    const ids = feature.properties?.groups || [];
    const active = selectedId && ids.includes(selectedId);
    const color = active ? groupColor(selectedId) : groupColor(ids[0] || "01");
    return {
      color,
      weight: active ? 4.5 : selectedId ? 1.1 : 1.3,
      opacity: active ? 0.96 : selectedId ? 0.12 : 0.28,
      lineCap: "round",
      lineJoin: "round"
    };
  };

  const displayRoadPopup = (feature, layer) => {
    const p = feature.properties || {};
    const ids = p.groups || [];
    const title = document.createElement("strong");
    title.textContent = p.name || "實際道路分界";
    const subtitle = document.createElement("div");
    subtitle.textContent = p.kind === "waterway" ? "圖資中的河川線" : "OpenStreetMap 道路中心線";
    const list = document.createElement("div");
    list.className = "road-group-list";
    list.textContent = ids.map((id) => `${groupName(id)} ${groupCount(id)} 位`).join("　·　");
    const content = document.createElement("div");
    content.append(title, subtitle, list);
    layer.bindPopup(content, { maxWidth: 360 });
    layer.on("click", () => {
      if (ids.length === 1) window.selectDeshaoGroup?.(ids[0], true);
      map.closePopup();
      layer.openPopup();
    });
    layer.bindTooltip(p.name || "道路分界", { sticky: true, className: "road-tooltip" });
  };

  const selectGroupOnMap = (id, fit = true) => {
    selectedId = id || "";
    if (districtLayer) districtLayer.setStyle(adminStyle);
    if (boundaryLayer) boundaryLayer.setStyle(roadStyle);
    map.closePopup();
    updateDetails(selectedId);
    if (!selectedId) {
      if (fit) map.fitBounds(fullTainan, { padding: [28, 28] });
      return;
    }
    if (!fit) return;

    const roadMatches = boundaryFeatures.filter((feature) => (feature.properties?.groups || []).includes(selectedId));
    const districtNames = groups.find((item) => item.id === selectedId)?.districts || [];
    const bounds = L.latLngBounds([]);
    districtLayer?.eachLayer((layer) => {
      if (districtNames.some((name) => normalizeDistrict(name) === normalizeDistrict(displayDistrict(layer.feature)))) bounds.extend(layer.getBounds());
    });
    if (!bounds.isValid() && roadMatches.length) {
      roadMatches.forEach((feature) => {
        const layer = L.geoJSON(feature);
        bounds.extend(layer.getBounds());
      });
    }
    if (bounds.isValid()) map.fitBounds(bounds, { padding: [42, 42], maxZoom: 13.5 });
  };

  window.addEventListener("deshao:group-selected", (event) => {
    selectGroupOnMap(event.detail?.id || "", event.detail?.fromMap !== true);
  });
  window.resetDeshaoMap = () => {
    selectedId = "";
    if (districtLayer) districtLayer.setStyle(adminStyle);
    if (boundaryLayer) boundaryLayer.setStyle(roadStyle);
    map.closePopup();
    map.fitBounds(fullTainan, { padding: [28, 28] });
    updateDetails("");
  };

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap contributors</a>'
  }).addTo(map);
  map.fitBounds(fullTainan, { padding: [28, 28] });

  const districtQuery = new URLSearchParams({
    where: "1=1",
    outFields: "TOWNID,TOWNCODE,TOWNNAME,TOWNENG",
    returnGeometry: "true",
    outSR: "4326",
    f: "geojson"
  });
  const districtSource = "https://services3.arcgis.com/pKves1c0n6gyoHMM/ArcGIS/rest/services/%E8%87%BA%E5%8D%97%E5%B8%82%E5%8D%80%E7%95%8C%E5%9C%96/FeatureServer/0/query?" + districtQuery.toString();

  fetch(districtSource, { mode: "cors" })
    .then((response) => {
      if (!response.ok) throw new Error(`行政區界服務回傳 ${response.status}`);
      return response.json();
    })
    .then((geojson) => {
      if (!geojson || geojson.type !== "FeatureCollection" || !Array.isArray(geojson.features)) throw new Error("行政區向量格式不正確");
      districtFeatures = geojson.features;
      districtLayer = L.geoJSON(geojson, {
        style: adminStyle,
        onEachFeature(feature, layer) {
          const name = displayDistrict(feature);
          layer.bindTooltip(name, { sticky: true, className: "district-tooltip" });
          layer.on("click", () => {
            const district = normalizeDistrict(name);
            const linked = groups.filter((group) => group.districts.some((name) => normalizeDistrict(name) === district));
            const lines = linked.map((group) => `${groupName(group.id)}　${groupCount(group.id)} 位`).join("<br>");
            const title = document.createElement("strong");
            title.textContent = name;
            const note = document.createElement("div");
            note.textContent = linked.length ? "此行政區涵蓋下列大區範圍；人數是大區總數。" : "目前大區資料未列入此行政區。";
            const list = document.createElement("div");
            list.innerHTML = lines;
            const popup = document.createElement("div");
            popup.append(title, note, list);
            if (linked.length === 1) window.selectDeshaoGroup?.(linked[0].id, true);
            layer.bindPopup(popup).openPopup();
          });
        }
      }).addTo(map);
      setStatus(`行政區向量載入完成；已載入 ${geojson.features.length} 區`, false);
      window.setTimeout(() => { status.hidden = true; }, 2600);
    })
    .catch((error) => {
      console.error("Unable to load district vectors:", error);
      setStatus("行政區向量暫時無法載入；道路分界仍可使用。", true);
    });

  fetch("road-boundaries.geojson?v=20261120-road-map")
    .then((response) => {
      if (!response.ok) throw new Error(`道路向量回傳 ${response.status}`);
      return response.json();
    })
    .then((geojson) => {
      if (!geojson || geojson.type !== "FeatureCollection" || !Array.isArray(geojson.features)) throw new Error("道路向量格式不正確");
      boundaryFeatures = geojson.features;
      boundaryLayer = L.geoJSON(geojson, {
        style: roadStyle,
        onEachFeature: displayRoadPopup
      }).addTo(map);
      setStatus(`已載入 ${geojson.features.length.toLocaleString("zh-TW")} 段道路與河川向量`, false);
      window.setTimeout(() => { status.hidden = true; }, 3000);
    })
    .catch((error) => {
      console.error("Unable to load road boundary vectors:", error);
      setStatus("道路向量暫時無法載入，請重新整理頁面。", true);
    });

  reset.addEventListener("click", () => {
    window.selectDeshaoGroup?.("", true);
    window.resetDeshaoMap?.();
  });
})();
