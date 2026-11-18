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
  $("#district-list").addEventListener("click", (event) => {
    const button = event.target.closest("button[data-district]");
    if (!button) return;
    const row = data.distribution.find((item) => item.name === button.dataset.district);
    const selected = button.getAttribute("aria-pressed") === "true";
    $("#district-list").querySelectorAll("button[data-district]").forEach((item) => {
      item.setAttribute("aria-pressed", String(!selected && item === button));
    });
    if (selected) {
      $("#shown-total").textContent = total;
      districtDetail.textContent = "已清除分區選取，顯示全部名單。點選任一大區可查看分區統計。";
      districtDetail.classList.remove("is-selected");
      return;
    }
    const share = ((row.count / total) * 100).toFixed(1);
    $("#shown-total").textContent = row.count;
    districtDetail.innerHTML = `<strong>${row.name}${row.grouped ? "（合併區）" : ""}</strong><span>${row.count} 位，占目前名單 ${share}%</span><span class="detail-hint">再次點選可清除選取</span>`;
    districtDetail.classList.add("is-selected");
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
