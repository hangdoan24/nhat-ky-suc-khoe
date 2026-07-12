import {
  sessionLabels,
  coughLabels,
  breathLabels,
  appetiteLabels,
  stoolLabels,
  sleepLabels
} from "./format"

export function exportRecordsToCsv(records) {
  const headers = [
    "Ngày",
    "Giờ",
    "Buổi",
    "Nhiệt độ (°C)",
    "Huyết áp trên",
    "Huyết áp dưới",
    "Mạch",
    "SpO₂ (%)",
    "Cân nặng (kg)",
    "Chất lượng giấc ngủ",
    "Mức đau",
    "Ho",
    "Khó thở",
    "Ăn uống",
    "Đi ngoài",
    "Thuốc huyết áp",
    "Thuốc mỡ máu",
    "Thuốc giảm đau",
    "Thuốc dạ dày",
    "Thuốc khác",
    "Ghi chú"
  ]

  const rows = records.map((item) => [
    item.date,
    item.time,
    sessionLabels[item.session] ?? "",
    item.temperature ?? "",
    item.systolic ?? "",
    item.diastolic ?? "",
    item.pulse ?? "",
    item.spo2 ?? "",
    item.weight ?? "",
    sleepLabels[item.sleep] ?? "",
    item.pain ?? "",
    coughLabels[item.cough] ?? "",
    breathLabels[item.breath] ?? "",
    appetiteLabels[item.appetite] ?? "",
    stoolLabels[item.stool] ?? "",
    item.medicines?.bloodPressure ? "Có" : "",
    item.medicines?.cholesterol ? "Có" : "",
    item.medicines?.painkiller ? "Có" : "",
    item.medicines?.stomach ? "Có" : "",
    item.medicines?.other ?? "",
    item.note ?? ""
  ])

  const csvContent = [headers, ...rows]
    .map((row) =>
      row
        .map((cell) => `"${String(cell).replaceAll('"', '""')}"`)
        .join(";")
    )
    .join("\n")

  const blob = new Blob(["\uFEFF" + csvContent], {
    type: "text/csv;charset=utf-8;"
  })

  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")

  link.href = url
  link.download = "nhat-ky-suc-khoe.csv"
  link.click()

  URL.revokeObjectURL(url)
}