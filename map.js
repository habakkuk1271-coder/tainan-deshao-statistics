(() => {
  const mapNode = document.querySelector("#tainan-map");
  if (!mapNode || !window.L) return;

  const map = L.map(mapNode, { zoomControl: true, scrollWheelZoom: true, minZoom: 8, maxZoom: 18 })
    .setView([23.16, 120.31], 9.65);

  const status = document.querySelector("#map-status");
  const selection = document.querySelector("#map-selection");
  const reset = document.querySelector("#map-reset");
  const fullTainan = L.latLngBounds([[22.88, 119.98], [23.42, 120.66]]);
  let districtLayer;
  let selectedFeature;

  const styleFor = (feature) => ({
    color: selectedFeature === feature ? "#f0b65f" : "#e7e7dc",
    weight: selectedFeature === feature ? 2.4 : 1.25,
    opacity: 0.95,
    fillColor: selectedFeature === feature ? "#d9983f" : "#687c62",
    fillOpacity: selectedFeature === feature ? 0.78 : 0.7
  });

  const displayDistrict = (feature) => {
    const p = feature.properties || {};
    return p.TOWNNAME || p.TOWNID || p.name || p.NAME || "臺南市行政區";
  };

  const query = new URLSearchParams({
    where: "1=1",
    outFields: "TOWNID,TOWNCODE,TOWNNAME,TOWNENG",
    returnGeometry: "true",
    outSR: "4326",
    f: "geojson"
  });
  const source = "https://services3.arcgis.com/pKves1c0n6gyoHMM/ArcGIS/rest/services/%E8%87%BA%E5%8D%97%E5%B8%82%E5%8D%80%E7%95%8C%E5%9C%96/FeatureServer/0/query?" + query.toString();

  fetch(source, { mode: "cors" })
    .then((response) => {
      if (!response.ok) throw new Error(`區界服務回傳 ${response.status}`);
      return response.json();
    })
    .then((geojson) => {
      if (!geojson || geojson.type !== "FeatureCollection" || !Array.isArray(geojson.features) || !geojson.features.length) {
        throw new Error("區界服務沒有回傳可用的向量圖徵");
      }
      districtLayer = L.geoJSON(geojson, {
        style: styleFor,
        onEachFeature(feature, layer) {
          const name = displayDistrict(feature);
          layer.bindTooltip(name, { sticky: true, direction: "top", className: "district-tooltip" });
          layer.on({
            mouseover() { if (selectedFeature !== feature) layer.setStyle({ weight: 1.9, fillOpacity: 0.84 }); },
            mouseout() { districtLayer.resetStyle(layer); },
            click() {
              selectedFeature = feature;
              districtLayer.setStyle(styleFor);
              const popup = document.createElement("div");
              const title = document.createElement("strong");
              const note = document.createElement("div");
              title.textContent = name;
              note.textContent = "此為臺南市行政區界。得少概況目前按召會大區彙總，未套配行政區人數。";
              popup.append(title, note);
              layer.bindPopup(popup).openPopup();
              selection.textContent = `${name}｜行政區範圍已選取。得少人數仍按召會大區統計。`;
            }
          });
        }
      }).addTo(map);
      map.fitBounds(districtLayer.getBounds(), { padding: [22, 22] });
      status.textContent = `已載入 ${geojson.features.length} 個行政區向量範圍`;
      window.setTimeout(() => { status.hidden = true; }, 2800);
    })
    .catch((error) => {
      status.classList.add("is-error");
      status.textContent = "行政區向量暫時無法載入；可點官方地籍圖台查看臺南地籍圖層。";
      console.error("Unable to load Tainan district vectors:", error);
    });

  reset.addEventListener("click", () => {
    selectedFeature = undefined;
    if (districtLayer) districtLayer.setStyle(styleFor);
    map.closePopup();
    map.fitBounds(fullTainan, { padding: [22, 22] });
    selection.textContent = "已回到臺南全市範圍；地圖點選行政區只顯示區名。";
  });
})();
