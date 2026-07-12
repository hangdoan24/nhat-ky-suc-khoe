const FAMILY_CODE_KEY = "nhatKySucKhoe.familyCode"

export function normalizeFamilyCode(code) {
  return code.trim().toLowerCase()
}

export function getFamilyCode() {
  return localStorage.getItem(FAMILY_CODE_KEY)
}

export function saveFamilyCode(code) {
  const normalized = normalizeFamilyCode(code)
  localStorage.setItem(FAMILY_CODE_KEY, normalized)
  return normalized
}

export function clearFamilyCode() {
  localStorage.removeItem(FAMILY_CODE_KEY)
}