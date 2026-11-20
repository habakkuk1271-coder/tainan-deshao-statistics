/*
 * Display data for the 115-1 dashboard.
 * Names by group come from the 115-1 roster; village and household totals come from the 202610 distribution sheet.
 * Only names, aggregate statistics, and group assignments are included; contact details and roster identifiers are excluded.
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
  baptized: 55,
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
    { id: "01", districts: ["中西區"], villages: [], roads: [], parts: 1, range: "中西區全區" },
    { id: "02", districts: ["北區"], villages: [], roads: [], parts: 1, range: "北區全區" },
    { id: "03", districts: ["東區"], villages: ["東區|大學里", "東區|成大里", "東區|東門里", "東區|圍下里", "東區|中西里", "東區|東安里"], roads: [], parts: 1, range: "東區：大學里、成大里、東門里、圍下里、中西里、東安里" },
    { id: "04", districts: ["東區", "永康區", "仁德區"], villages: ["東區|後甲里", "東區|東聖里", "東區|南聖里", "東區|自強里", "東區|虎尾里", "東區|關聖里", "東區|文聖里", "東區|復興里", "東區|裕聖里", "永康區|勝利里", "永康區|中興里", "永康區|中華里", "永康區|成功里"], partialVillages: ["仁德區|仁德里北側"], roads: [], parts: 1, sharedWith: ["17"], range: "後甲里、東聖里、南聖里、自強里、虎尾里、關聖里、文聖里、復興里、裕聖里；永康區勝利里、中興里、中華里、成功里；仁德里北側" },
    { id: "05", districts: ["安平區"], villages: [], roads: [], parts: 1, range: "安平區全區" },
    { id: "06", districts: ["永康區"], villages: ["永康區|六合里", "永康區|大橋里", "永康區|西橋里", "永康區|東橋里", "永康區|安康里", "永康區|勝利里", "永康區|甲頂里", "永康區|尚頂里"], roads: [], parts: 1, range: "永康區：六合里、大橋里、西橋里、東橋里、安康里、勝利里、甲頂里、尚頂里" },
    { id: "07", districts: ["東區"], villages: ["東區|龍山里", "東區|德光里", "東區|崇學里", "東區|大福里", "東區|大德里", "東區|路東里", "東區|忠孝里", "東區|崇信里"], roads: [], parts: 1, range: "東區：龍山里、德光里、崇學里、大福里、大德里、路東里、忠孝里、崇信里" },
    { id: "08", districts: ["安南區"], villages: [], roads: [], parts: 1, range: "安南區全區" },
    { id: "09", districts: ["仁德區", "歸仁區", "關廟區", "龍崎區"], villages: [], roads: [], parts: 4, range: "仁德、歸仁、關廟、龍崎區全區" },
    { id: "10", districts: ["永康區"], villages: ["永康區|網寮里", "永康區|二王里", "永康區|五王里", "永康區|三合里", "永康區|埔園里", "永康區|正強里", "永康區|龍埔里", "永康區|南灣里", "永康區|崑山里", "永康區|復興里", "永康區|神洲里", "永康區|建國里", "永康區|復國里", "永康區|復華里", "永康區|光復里", "永康區|成功里", "永康區|中華里", "永康區|中興里", "永康區|永康里", "永康區|北灣里", "永康區|北興里", "永康區|新樹里", "永康區|西勢里", "永康區|王行里", "永康區|烏竹里", "永康區|大灣里", "永康區|東灣里", "永康區|西灣里", "永康區|龍潭里", "永康區|永明里"], roads: [], parts: 1, range: "永康區：網寮里、二王里、五王里、三合里、埔園里、正強里、龍埔里、南灣里、崑山里、復興里、神洲里、建國里、復國里、復華里、光復里、成功里、中華里、中興里、永康里、北灣里、北興里、新樹里、西勢里、王行里、烏竹里、大灣里、東灣里、西灣里、龍潭里、永明里" },
    { id: "11", districts: ["大內區", "新化區", "善化區", "新市區", "安定區", "山上區", "玉井區", "楠西區", "南化區", "左鎮區"], villages: [], roads: [], parts: 10, range: "大內、新化、善化、新市、安定、山上、玉井、楠西、南化、左鎮區全區" },
    { id: "12", districts: ["佳里區", "學甲區", "西港區", "七股區", "將軍區", "北門區"], villages: [], roads: [], parts: 6, range: "佳里、學甲、西港、七股、將軍、北門區全區" },
    { id: "13", districts: ["麻豆區", "下營區", "六甲區", "官田區"], villages: [], roads: [], parts: 4, range: "麻豆、下營、六甲、官田區全區" },
    { id: "14", districts: ["新營區", "鹽水區", "白河區", "柳營區", "後壁區", "東山區"], villages: [], roads: [], parts: 6, range: "新營、鹽水、白河、柳營、後壁、東山區全區" },
    { id: "15", districts: ["南區"], villages: [], roads: [], parts: 1, range: "南區全區" },
    { id: "16", districts: ["永康區"], villages: ["永康區|蔦松里", "永康區|三民里", "永康區|鹽行里", "永康區|鹽洲里", "永康區|鹽興里"], roads: [], parts: 1, range: "永康區：蔦松里、三民里、鹽行里、鹽洲里、鹽興里" },
    { id: "17", districts: ["東區", "永康區", "仁德區"], villages: ["東區|後甲里", "東區|東聖里", "東區|南聖里", "東區|自強里", "東區|虎尾里", "東區|關聖里", "東區|文聖里", "東區|復興里", "東區|裕聖里", "永康區|勝利里", "永康區|中興里", "永康區|中華里", "永康區|成功里"], partialVillages: ["仁德區|仁德里北側"], roads: [], parts: 1, sharedWith: ["04"], range: "與04大區相同範圍" },
    { id: "18", districts: ["東區"], villages: ["東區|東光里", "東區|東明里", "東區|莊敬里", "東區|小東里", "東區|新東里", "東區|富強里", "東區|富裕里", "東區|裕農里", "東區|崇善里", "東區|衛國里", "東區|泉南里", "東區|大同里"], roads: [], parts: 1, range: "東區：東光里、東明里、莊敬里、小東里、新東里、富強里、富裕里、裕農里、崇善里、衛國里、泉南里、大同里" },
    { id: "19", districts: ["東區"], villages: ["東區|崇善里", "東區|和平里", "東區|崇成里", "東區|崇文里", "東區|崇明里", "東區|崇德里", "東區|德高里", "東區|仁和里", "東區|大智里", "東區|東智里"], roads: [], parts: 1, range: "東區：崇善里、和平里、崇成里、崇文里、崇明里、崇德里、德高里、仁和里、大智里、東智里（嘉南藥理大學周邊暫不呈現）" }
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
  ],
  zoneStats: {
    "10": {
        "villages": 30,
        "households": 67900
    },
    "11": {
        "villages": 117,
        "households": 88022
    },
    "12": {
        "villages": 87,
        "households": 62918
    },
    "13": {
        "villages": 62,
        "households": 44767
    },
    "14": {
        "villages": 100,
        "households": 78774
    },
    "15": {
        "villages": 37,
        "households": 50601
    },
    "16": {
        "villages": 5,
        "households": 9470
    },
    "17": {
        "villages": 13,
        "households": 17223
    },
    "18": {
        "villages": 12,
        "households": 20052
    },
    "19": {
        "villages": 10,
        "households": 23522
    },
    "01": {
        "villages": 20,
        "households": 34496
    },
    "05": {
        "villages": 13,
        "households": 33292
    },
    "08": {
        "villages": 51,
        "households": 79569
    },
    "02": {
        "villages": 33,
        "households": 56175
    },
    "06": {
        "villages": 8,
        "households": 22603
    },
    "03": {
        "villages": 6,
        "households": 5821
    },
    "07": {
        "villages": 8,
        "households": 12963
    },
    "04": {
        "villages": 13,
        "households": 17223
    },
    "09": {
        "villages": 60,
        "households": 75276
    }
},
  namesByGroup: {
    "10": [
        "杜瑀潼",
        "于俊毅",
        "許晉豪",
        "吳勁億",
        "吳嫚娟",
        "賴姿聿",
        "蔡忠佑"
    ],
    "11": [
        "陳國豪",
        "林恩琦",
        "莊卉竹",
        "莊卉羽",
        "黃于睿",
        "黃詠華",
        "王晟加",
        "力世昕",
        "劉怡君",
        "劉祉岑",
        "董力銜",
        "楊智鈞",
        "劉仲勛",
        "力紹旻",
        "陳柏翰",
        "李銘勳",
        "黃思路",
        "陳俊諺",
        "陳奕蒼",
        "李鈺庭"
    ],
    "12": [
        "林妙欣",
        "林上揚",
        "潘姿君",
        "吳明信"
    ],
    "13": [
        "陳冠名",
        "蔡玉姿",
        "曾芷榆",
        "曾品宸",
        "張渼郁",
        "張渼翎",
        "謝成新",
        "謝信安",
        "謝迦南"
    ],
    "14": [
        "朱祐佑",
        "王柏升",
        "蔡承羿",
        "何家呁",
        "張芷綾",
        "何家瑩",
        "何芊妤",
        "何芃妤",
        "許允誠",
        "許允智",
        "廖慧今",
        "朱佑哲",
        "賴俞佑",
        "曾姿穎",
        "張欣柔"
    ],
    "15": [
        "力子安",
        "力子洋",
        "力子瑋",
        "楊千羲",
        "張維恩",
        "張元曨",
        "盧念華"
    ],
    "16": [
        "金曉瑜",
        "林子駖",
        "胡雅雯",
        "邵意庭",
        "邵唯恩",
        "李建民"
    ],
    "17": [
        "陳婉婷",
        "陳志杰"
    ],
    "18": [
        "魏銣彤",
        "張克誠",
        "張豪仁"
    ],
    "19": [
        "李玟豫",
        "葉姵筠",
        "葉姵涵"
    ],
    "02": [
        "李昀靜",
        "張沛琳",
        "蔣樹澤",
        "李家儀",
        "李家慧",
        "李冠樺",
        "蔣凱芯",
        "林新閎",
        "林宥妘"
    ],
    "09": [
        "黃弘睿",
        "方淳巧",
        "呂承恩",
        "邱品皓",
        "梁瑜芳",
        "梁准瑋",
        "邱梓玹",
        "李宜恩",
        "顏瑋澤",
        "王昱凱"
    ],
    "04": [
        "林采緹",
        "吳敏睿",
        "吳敏綺"
    ],
    "01": [
        "林台金",
        "楊祐誠",
        "楊閔媛",
        "林台茵",
        "李品翰"
    ],
    "08": [
        "黃惟銨",
        "吳丞惟"
    ],
    "06": [
        "柯星妤",
        "謝侑廷",
        "謝雨彤"
    ],
    "03": [
        "陳宥豪"
    ],
    "05": [
        "謝庭鈞"
    ],
    "07": []
}
};
