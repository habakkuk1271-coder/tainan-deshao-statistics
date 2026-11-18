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
    return `<div class="district-row">
      <span class="district-name">${row.name}</span>
      <span class="bar-track" aria-hidden="true"><span class="bar-fill" style="display:block;width:${width}%"></span></span>
      <span class="district-count">${label}</span>
    </div>`;
  }).join("");

  $("#history-chart").innerHTML = data.history.map((row, index) => {
    const height = (row.count / maxHistory) * 100;
    const latest = index === data.history.length - 1 ? " latest" : "";
    return `<div class="chart-column${latest}">
      <span class="chart-value">${row.count}</span>
      <span class="chart-bar-wrap"><span class="chart-bar" style="height:${height}%"></span></span>
      <span class="chart-period">${row.period}</span>
    </div>`;
  }).join("");
  $("#history-chart").setAttribute("aria-label", data.history.map((row) => `${row.period} ${row.count} 人`).join("、"));
  $("#history-table").innerHTML = data.history.map((row) => `<span>${row.period}<br>${row.count}</span>`).join("");
})();
