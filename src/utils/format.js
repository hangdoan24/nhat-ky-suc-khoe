export const sessionLabels = {
  morning: "Buổi sáng",
  evening: "Buổi tối"
}

export const coughLabels = {
  none: "Không ho",
  mild: "Ho ít",
  strong: "Ho nhiều"
}

export const breathLabels = {
  none: "Không khó thở",
  mild: "Hơi khó thở",
  medium: "Khó thở vừa",
  strong: "Khó thở nhiều"
}

export const appetiteLabels = {
  normal: "Ăn tốt",
  low: "Ăn ít",
  none: "Chán ăn",
  nausea: "Buồn nôn"
}

export const stoolLabels = {
  normal: "Bình thường",
  constipation: "Táo bón",
  diarrhea: "Tiêu chảy",
  none: "Chưa đi"
}

export const sleepLabels = {
  good: "Ngủ tốt",
  ok: "Ngủ được",
  short: "Ngủ ít",
  difficult: "Khó ngủ",
  interrupted: "Thức giấc nhiều lần"
}

export const medicineLabels = {
  bloodPressure: "Thuốc huyết áp",
  cholesterol: "Thuốc mỡ máu",
  painkiller: "Thuốc giảm đau",
  stomach: "Thuốc dạ dày"
}

export function formatMedicines(medicines) {
  if (!medicines) return "Chưa ghi";

  const selected = [];

  if (medicines.bloodPressure) selected.push(medicineLabels.bloodPressure)
  if (medicines.cholesterol) selected.push(medicineLabels.cholesterol)
  if (medicines.painkiller) selected.push(medicineLabels.painkiller)
  if (medicines.stomach) selected.push(medicineLabels.stomach)
  if (medicines.other) selected.push(medicines.other)

  return selected.length > 0 ? selected.join(", ") : "Chưa ghi"
}