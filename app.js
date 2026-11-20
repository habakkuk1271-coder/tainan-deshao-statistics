(() => {
  const data = window.DESHAO_DATA;
  const $ = (selector) => document.querySelector(selector);
  const total = data.total;
  const periodSum = data.history.reduce((sum, row) => sum + row.count, 0);
  const maxDistrict = Math.max(...data.distribution.map((row) => row.count));
  const maxHistory = Math.max(...data.history.map((row) => row.count));

  $("#source-stamp").textContent = `資料更新 ${data.sourceDate}`;
  $("#latest-period").textContent = data.latestPeriod;
  $("#current-total").textContent = total;
  $("#elementary-total").textContent = data.stageCounts.elementary;
  $("#secondary-total").textContent = data.stageCounts.secondary;
  $("#college-total").textContent = data.stageCounts.college;
  $("#baptized-total").textContent = data.baptized;
  $("#shown-total").textContent = total;
  $("#period-sum").textContent = `${periodSum} 人次`;

  $("#district-list").innerHTML = data.distribution.map((row) => {
    const width = Math.max(5, (row.count / maxDistrict) * 100);
    const label = row.grouped ? `${row.count} 位・合併呈現` : `${row.count}`;
    return `<button class="district-row" type="button" data-district="${row.name}" aria-pressed="false" aria-label="查看${row.name}，${row.count}位">
      <span class="district-name">${row.name}</span>
      <span class="bar-track" aria-hidden="true"><span class="bar-fill" style="display:block;width:${width}%"></span></span>
      <span class="district-count">${label}</span>
    </button>`;
  }).join("");

  const districtDetail = $("#district-detail");
  const escapeHtml = (value) => String(value).replace(/[&<>\"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;" })[char]);
  const selectGroups = (names, { fromMap = false, toggle = false } = {}) => {
    const rows = names.map((name) => data.distribution.find((item) => item.name === name)).filter(Boolean);
    if (!rows.length) return;
    const buttons = [...$("#district-list").querySelectorAll("button[data-district]")];
    const active = rows.length === 1 && buttons.some((button) => button.dataset.district === rows[0].name && button.getAttribute("aria-pressed") === "true");
    const clear = toggle && active;
    const selectedNames = clear ? [] : rows.map((row) => row.name);
    buttons.forEach((button) => button.setAttribute("aria-pressed", String(selectedNames.includes(button.dataset.district))));
    if (clear) {
      $("#shown-total").textContent = total;
      districtDetail.textContent = "已清除大區選取，顯示全市名單。";
      districtDetail.classList.remove("is-selected");
      window.dispatchEvent(new CustomEvent("deshao:group-selected", { detail: { ids: [], id: "", fromMap } }));
      return;
    }
    const count = rows.reduce((sum, row) => sum + row.count, 0);
    const share = total ? ((count / total) * 100).toFixed(1) : "0.0";
    $("#shown-total").textContent = count;
    const groupDetails = rows.map((row) => {
      const id = row.name.slice(0, 2);
      const stats = data.zoneStats?.[id];
      const names = data.namesByGroup?.[id] || [];
      const statsLine = stats ? `<span class="selected-group-meta">${stats.villages} 里・${Number(stats.households).toLocaleString("zh-TW")} 戶</span>` : "";
      const namesList = names.length
        ? `<div class="selected-name-area"><span class="selected-name-label">得少姓名（${names.length} 位）</span><ul class="selected-name-list">${names.map((name) => `<li>${escapeHtml(name)}</li>`).join("")}</ul></div>`
        : `<span class="selected-group-empty">目前名單無得少</span>`;
      return `<section class="selected-group"><h3 class="selected-group-title"><span>${escapeHtml(row.name)}${row.grouped ? "（合併區）" : ""}</span><small>${row.count} 位</small></h3>${statsLine}${namesList}</section>`;
    }).join("");
    districtDetail.innerHTML = `<strong>${rows.length > 1 ? "所選大區" : "大區資料"}</strong><span>${count} 位，占目前名單 ${share}%</span><div class="selected-groups">${groupDetails}</div><span class="detail-hint">再次點選可清除選取</span>`;
    districtDetail.classList.add("is-selected");
    const ids = rows.map((row) => row.name.slice(0, 2));
    window.dispatchEvent(new CustomEvent("deshao:group-selected", { detail: { ids, id: ids.length === 1 ? ids[0] : "", fromMap } }));
  };
  const selectGroup = (name, options = {}) => selectGroups([name], options);
  window.selectDeshaoGroups = (ids, fromMap = false) => {
    const names = [...new Set((Array.isArray(ids) ? ids : [ids]).map((id) => String(id).padStart(2, "0") + " 大區"))];
    if (!names.length) return window.selectDeshaoGroup?.("", fromMap);
    selectGroups(names, { fromMap });
  };
  window.selectDeshaoGroup = (id, fromMap = false) => {
    const name = /^\d{1,2}$/.test(String(id)) ? `${String(id).padStart(2, "0")} 大區` : id;
    if (!name) {
      $("#district-list").querySelectorAll("button[data-district]").forEach((button) => button.setAttribute("aria-pressed", "false"));
      $("#shown-total").textContent = total;
      districtDetail.textContent = "已回到全市名單；點選大區查看人數與行政區位置。";
      districtDetail.classList.remove("is-selected");
      window.dispatchEvent(new CustomEvent("deshao:group-selected", { detail: { ids: [], id: "", fromMap } }));
      return;
    }
    selectGroup(name, { fromMap });
  };
  $("#district-list").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-district]");
    if (button) selectGroup(button.dataset.district, { toggle: true });
  });

  $("#history-chart").innerHTML = data.history.map((row, index) => {
    const height = (row.count / maxHistory) * 100;
    const latest = index === data.history.length - 1 ? " latest" : "";
    return `<button class="chart-column${latest}" type="button" data-period="${row.period}" aria-pressed="false" aria-label="查看${row.period}，${row.count}人">
      <span class="chart-value">${row.count}</span>
      <span class="chart-bar-wrap"><span class="chart-bar" style="height:${height}%"></span></span>
      <span class="chart-period">${row.period}</span>
    </button>`;
  }).join("");
  $("#history-table").innerHTML = data.history.map((row) => `<button class="history-table-item" type="button" data-period="${row.period}" aria-pressed="false"><span>${row.period}</span><strong>${row.count}</strong></button>`).join("");
  const historyDetail = $("#history-detail");
  const selectPeriod = (period) => {
    const index = data.history.findIndex((item) => item.period === period);
    const row = data.history[index];
    const previous = data.history[index - 1];
    document.querySelectorAll("[data-period]").forEach((item) => {
      item.setAttribute("aria-pressed", String(item.dataset.period === period));
    });
    const comparison = previous
      ? `${row.count - previous.count > 0 ? "增加" : row.count - previous.count < 0 ? "減少" : "持平"} ${Math.abs(row.count - previous.count)} 人（相較 ${previous.period}）`
      : "這是目前資料中的第一期，沒有前一期可供比較。";
    historyDetail.innerHTML = `<strong>${row.period}：${row.count} 人</strong><span>${comparison}</span>`;
    historyDetail.classList.add("is-selected");
  };
  [$("#history-chart"), $("#history-table")].forEach((container) => {
    container.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-period]");
      if (button) selectPeriod(button.dataset.period);
    });
  });
})();
