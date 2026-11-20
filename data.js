/*
 * Aggregated display data only.
 * Source: Google Sheet「台南得榮少年總名單（重要）」, tab 115-1總名單
 * refreshed from the workbook's latest summary on 2026-10-20.
 * No names, contact information, identifiers, or row-level records are stored here.
 */
window.DESHAO_DATA = {
  sourceDate: "2026-10-20",
  latestPeriod: "115-1",
  total: 110,
  stageCounts: {
    elementary: 18,
    secondary: 81,
    college: 11
  },
  baptized: 56,
  distribution: [
    { name: "11 大區", count: 20 },
    { name: "14 大區", count: 15 },
    { name: "09 大區", count: 10 },
    { name: "02 大區", count: 9 },
    { name: "13 大區", count: 9 },
    { name: "10 大區", count: 7 },
    { name: "15 大區", count: 7 },
    { name: "16 大區", count: 6 },
    { name: "01 大區", count: 5 },
    { name: "12 大區", count: 4 },
    { name: "06 大區", count: 3 },
    { name: "19 大區", count: 3 },
    { name: "18 大區", count: 3 },
    { name: "04 大區", count: 3 },
    { name: "08 大區", count: 2 },
    { name: "17 大區", count: 2 },
    { name: "03 大區", count: 1 },
    { name: "05 大區", count: 1 },
    { name: "07 大區", count: 0 }
  ],
  groupAreas: [
    { id: "01", districts: ["中西區"], roads: [], parts: 1, range: "臺南市中西區" },
    { id: "02", districts: ["北區"], roads: [], parts: 1, range: "臺南市北區" },
    { id: "03", districts: ["東區"], roads: ["中華路", "開元路", "小東路", "前鋒路", "林森路", "東門路"], parts: 2, range: "中華路、開元路、小東路、前鋒路之間；小東路、前鋒路、林森路、東門路之間" },
    { id: "04", districts: ["東區"], roads: ["中華東路", "小東路", "復興路", "裕義路", "東門路三段"], parts: 1, sharedWith: ["17"], range: "中華東路、小東路／復興路、裕義路、東門路三段之間" },
    { id: "05", districts: ["安平區"], roads: [], parts: 1, range: "臺南市安平區" },
    { id: "06", districts: ["永康區"], roads: ["柴頭港溪", "中正南路", "中正北路", "中山南路", "中山北路", "正南三路"], parts: 1, range: "柴頭港溪以東、中正南北路以南、中山南路以北、正南三路以西" },
    { id: "07", districts: ["東區"], roads: ["東門路", "林森路", "大同路", "中華東路"], parts: 1, range: "東門路、林森路、大同路、中華東路之間" },
    { id: "08", districts: ["安南區"], roads: [], parts: 1, range: "臺南市安南區" },
    { id: "09", districts: ["仁德區", "歸仁區", "關廟區", "龍崎區"], roads: [], parts: 4, range: "仁德、歸仁、關廟、龍崎區" },
    { id: "10", districts: ["永康區"], roads: ["中華路", "中山南路", "中山北路", "復興路", "崑大路", "永大路三段", "中正南路", "中正北路", "台39線", "台1線", "許縣溪"], parts: 2, range: "中華路、中山南北路、復興路／崑大路、台39線高鐵下台南段道路之間；中山南北路以北、永大路三段以東、台1線以南、許縣溪之間" },
    { id: "11", districts: ["新市區", "新化區", "善化區", "安定區", "玉井區"], roads: [], parts: 5, range: "新市、新化、善化、安定、玉井區" },
    { id: "12", districts: ["佳里區", "七股區", "學甲區", "西港區"], roads: [], parts: 4, range: "佳里、七股、學甲、西港區" },
    { id: "13", districts: ["麻豆區", "官田區", "下營區", "六甲區"], roads: [], parts: 4, range: "麻豆、官田、下營、六甲區" },
    { id: "14", districts: ["新營區", "鹽水區", "柳營區", "白河區"], roads: [], parts: 4, range: "新營、鹽水、柳營、白河區" },
    { id: "15", districts: ["南區"], roads: [], parts: 1, range: "臺南市南區" },
    { id: "16", districts: ["永康區"], roads: ["正南三路", "鹽水溪", "中正二街", "國道一號", "中正南路", "中正北路", "永大路三段"], parts: 2, range: "正南三路以東、鹽水溪旁河堤道路以南、中正二街以北、國道一號以西；國道一號以東、中正南北路以北、永大路三段以西" },
    { id: "17", districts: ["東區"], roads: ["中華東路", "小東路", "復興路", "裕義路", "東門路三段"], parts: 1, sharedWith: ["04"], range: "與04大區相同範圍" },
    { id: "18", districts: ["東區"], roads: ["中華東路", "小東路", "林森路", "東門路", "大同路一段"], parts: 2, range: "中華東路、小東路、林森路、東門路之間；林森路、東門路、大同路一段圍成的三角形" },
    { id: "19", districts: ["東區", "仁德區"], roads: ["中華東路", "東門路", "自由路", "大同路二段", "台1線", "台86線"], parts: 2, range: "中華東路、東門路、自由路、台1線大同路二段至台86線之間；嘉南藥理大學周邊" }
  ],
  carePointDistribution: [
    { district: "永康", count: 16, groups: [{ name: "16 大區", count: 6 }, { name: "10 大區", count: 7 }, { name: "06 大區", count: 3 }] },
    { district: "北區", count: 9, groups: [{ name: "02 大區", count: 9 }] },
    { district: "南區", count: 7, groups: [{ name: "15 大區", count: 7 }] },
    { district: "白河", count: 6, groups: [{ name: "14 大區", count: 6 }] },
    { district: "官田", count: 5, groups: [{ name: "13 大區", count: 5 }] },
    { district: "下營", count: 4, groups: [{ name: "13 大區", count: 4 }] },
    { district: "新化", count: 4, groups: [{ name: "11 大區", count: 4 }] },
    { district: "善化", count: 1, groups: [{ name: "11 大區", count: 1 }] },
    { district: "安定", count: 9, groups: [{ name: "11 大區", count: 9 }] },
    { district: "歸仁", count: 6, groups: [{ name: "09 大區", count: 6 }] },
    { district: "仁德", count: 4, groups: [{ name: "09 大區", count: 4 }] },
    { district: "東區", count: 12, groups: [{ name: "04 大區", count: 3 }, { name: "19 大區", count: 3 }, { name: "18 大區", count: 3 }, { name: "03 大區", count: 1 }, { name: "17 大區", count: 2 }] },
    { district: "中西區", count: 5, groups: [{ name: "01 大區", count: 5 }] },
    { district: "安南", count: 2, groups: [{ name: "08 大區", count: 2 }] },
    { district: "鹽水", count: 5, groups: [{ name: "14 大區", count: 5 }] },
    { district: "新市", count: 6, groups: [{ name: "11 大區", count: 6 }] },
    { district: "佳里", count: 4, groups: [{ name: "12 大區", count: 4 }] },
    { district: "新營", count: 3, groups: [{ name: "14 大區", count: 3 }] },
    { district: "安平", count: 1, groups: [{ name: "05 大區", count: 1 }] },
    { district: "柳營", count: 1, groups: [{ name: "14 大區", count: 1 }] }
  ],
  history: [
    { period: "111-1", count: 66 },
    { period: "111-2", count: 114 },
    { period: "112-1", count: 194 },
    { period: "112-2", count: 203 },
    { period: "113-1", count: 153 },
    { period: "113-2", count: 134 },
    { period: "114-1", count: 118 },
    { period: "114-2", count: 114 },
    { period: "115-1", count: 110 }
  ]
};
