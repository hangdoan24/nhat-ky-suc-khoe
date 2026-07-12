import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
  writeBatch
} from "firebase/firestore"
import { db } from "./firebase"
import { getFamilyCode } from "./access"

function getRecordsCollection() {
  const familyCode = getFamilyCode()

  if (!familyCode) {
    throw new Error("Chưa có mã gia đình.")
  }

  return collection(db, "families", familyCode, "records")
}

function getRecordDoc(id) {
  const familyCode = getFamilyCode()

  if (!familyCode) {
    throw new Error("Chưa có mã gia đình.")
  }

  return doc(db, "families", familyCode, "records", id)
}

function sortRecords(records) {
  return [...records].sort((a, b) => {
    const aDate = `${a.date}T${a.time}`
    const bDate = `${b.date}T${b.time}`
    return bDate.localeCompare(aDate)
  })
}

export async function getRecords() {
  try {
    const snapshot = await getDocs(getRecordsCollection())

    const records = snapshot.docs.map((item) => ({
      id: item.id,
      ...item.data()
    }))

    return sortRecords(records)
  } catch (error) {
    console.error(error)
    return []
  }
}

export async function saveRecord(record) {
  const id = `${record.date}-${record.session}`
  const recordToSave = {
    ...record,
    id
  }

  await setDoc(getRecordDoc(id), recordToSave)

  return getRecords()
}

export async function deleteRecord(id) {
  await deleteDoc(getRecordDoc(id))
  return getRecords()
}

export async function clearRecords() {
  const records = await getRecords()
  const batch = writeBatch(db)

  records.forEach((record) => {
    batch.delete(getRecordDoc(record.id))
  })

  await batch.commit()
}

export async function exportBackupJson() {
  const records = await getRecords()

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

    reader.onload = async () => {
      try {
        const data = JSON.parse(reader.result)
        const records = Array.isArray(data) ? data : data.records

        if (!Array.isArray(records)) {
          reject(new Error("File backup không đúng định dạng."))
          return
        }

        const batch = writeBatch(db)

        records.forEach((record) => {
          const id = record.id ?? `${record.date}-${record.session}`
          const recordToSave = {
            ...record,
            id
          }

          batch.set(getRecordDoc(id), recordToSave)
        })

        await batch.commit()

        const updatedRecords = await getRecords()
        resolve(updatedRecords)
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = () => {
      reject(new Error("Không đọc được file."))
    }

    reader.readAsText(file)
  })
}