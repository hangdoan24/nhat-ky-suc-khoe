const STORAGE_KEY = "nhatKySucKhoe.records"

export function getRecords() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveRecord(record) {
  const records = getRecords()

  const filtered = records.filter(
    (item) => !(item.date === record.date && item.session === record.session)
  )

  const updated = [record, ...filtered].sort((a, b) => {
    const aDate = `${a.date}T${a.time}`
    const bDate = `${b.date}T${b.time}`
    return bDate.localeCompare(aDate)
  })

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  return updated
}

export function deleteRecord(id) {
  const records = getRecords()
  const updated = records.filter((item) => item.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  return updated
}

export function clearRecords() {
  localStorage.removeItem(STORAGE_KEY)
}

export function exportBackupJson() {
  const records = getRecords()
  const backup = {
    app: "nhat-ky-suc-khoe",
    version: 1,
    exportedAt: new Date().toISOString(),
    records
  }

  const blob = new Blob([JSON.stringify(backup, null, 2)], {
    type: "application/json"
  })

  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  const today = new Date().toISOString().slice(0, 10)

  link.href = url
  link.download = `nhat-ky-suc-khoe-backup-${today}.json`
  link.click()

  URL.revokeObjectURL(url)
}

export function importBackupJson(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result)
        const records = Array.isArray(data) ? data : data.records

        if (!Array.isArray(records)) {
          reject(new Error("File backup không đúng định dạng."))
          return
        }

        localStorage.setItem(STORAGE_KEY, JSON.stringify(records))
        resolve(records)
      } catch {
        reject(new Error("Không đọc được file backup."))
      }
    }

    reader.onerror = () => {
      reject(new Error("Không đọc được file."))
    }

    reader.readAsText(file)
  })
}