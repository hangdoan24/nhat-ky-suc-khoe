import { useEffect, useRef, useState } from "react"
import {
  getRecords,
  exportBackupJson,
  importBackupJson
} from "../utils/storage"
import { exportRecordsToCsv } from "../utils/exportCsv"
import {
  sessionLabels,
  sleepLabels,
  coughLabels,
  breathLabels,
  appetiteLabels,
  stoolLabels,
  formatMedicines
} from "../utils/format"

function getSessionOrder(session) {
  if (session === "morning") return 1
  if (session === "evening") return 2
  return 99
}

function sortRecords(records) {
  return [...records].sort((a, b) => {
    const dateCompare = a.date.localeCompare(b.date)

    if (dateCompare !== 0) {
      return dateCompare
    }

    const sessionCompare = getSessionOrder(a.session) - getSessionOrder(b.session)

    if (sessionCompare !== 0) {
      return sessionCompare
    }

    return a.time.localeCompare(b.time)
  })
}

function formatBloodPressure(item) {
  if (!item.systolic && !item.diastolic) return "-"
  return `${item.systolic ?? "-"}/${item.diastolic ?? "-"}`
}

export default function ReportPage() {
  const [records, setRecords] = useState([])
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const fileInputRef = useRef(null)

  async function loadRecords() {
    const result = await getRecords()
    setRecords(sortRecords(result))
    setLoading(false)
  }

  useEffect(() => {
    loadRecords()
  }, [])

  function handlePrint() {
    window.print()
  }

  function handleImportClick() {
    fileInputRef.current.click()
  }

  async function handleImportFile(event) {
    const file = event.target.files[0]

    if (!file) return

    try {
      const importedRecords = await importBackupJson(file)
      setRecords(sortRecords(importedRecords))
      setMessage("Đã nhập dữ liệu backup lên nhật ký chung thành công.")
      event.target.value = ""
    } catch (error) {
      setMessage(error.message)
    }
  }

  return (
    <section>
      <h1 className="no-print">Báo cáo</h1>

      <div className="card no-print">
        <p>
          Dữ liệu đang được lưu trong nhật ký chung của gia đình. Có thể xuất báo cáo
          hoặc backup khi cần.
        </p>

        {message && <p>{message}</p>}
        {loading && <p>Đang tải dữ liệu...</p>}

        <button
          className="primary-button"
          onClick={() => exportRecordsToCsv(records)}
          disabled={records.length === 0}
        >
          Xuất file CSV
        </button>

        <button
          className="secondary-button"
          onClick={exportBackupJson}
          disabled={records.length === 0}
        >
          Xuất backup JSON
        </button>

        <button className="secondary-button" onClick={handleImportClick}>
          Nhập backup JSON
        </button>

        <input
          ref={fileInputRef}
          className="hidden-file-input"
          type="file"
          accept=".json,application/json"
          onChange={handleImportFile}
        />

        <button
          className="secondary-button"
          onClick={handlePrint}
          disabled={records.length === 0}
        >
          In báo cáo
        </button>
      </div>

      <div className="print-area">
        <div className="report-header">
          <h2>Nhật ký sức khỏe</h2>
          <p>Số lần ghi: {records.length}</p>
          <p>Ngày xuất báo cáo: {new Date().toLocaleDateString("vi-VN")}</p>
        </div>

        {!loading && records.length === 0 && <p>Chưa có dữ liệu.</p>}

        {records.length > 0 && (
          <table className="report-table">
            <thead>
              <tr>
                <th>Ngày</th>
                <th>Buổi</th>
                <th>Giờ</th>
                <th>SpO₂</th>
                <th>HA</th>
                <th>Mạch</th>
                <th>Nhiệt độ</th>
                <th>Cân nặng</th>
                <th>Giấc ngủ</th>
                <th>Đau</th>
                <th>Ho</th>
                <th>Khó thở</th>
                <th>Ăn uống</th>
                <th>Đi ngoài</th>
                <th>Thuốc</th>
                <th>Ghi chú</th>
              </tr>
            </thead>

            <tbody>
              {records.map((item) => (
                <tr key={item.id}>
                  <td>{item.date}</td>
                  <td>{sessionLabels[item.session] ?? "-"}</td>
                  <td>{item.time ?? "-"}</td>
                  <td>{item.spo2 ?? "-"}</td>
                  <td>{formatBloodPressure(item)}</td>
                  <td>{item.pulse ?? "-"}</td>
                  <td>{item.temperature ?? "-"}</td>
                  <td>{item.weight ?? "-"}</td>
                  <td>{sleepLabels[item.sleep] ?? "-"}</td>
                  <td>{item.pain ?? "-"}</td>
                  <td>{coughLabels[item.cough] ?? "-"}</td>
                  <td>{breathLabels[item.breath] ?? "-"}</td>
                  <td>{appetiteLabels[item.appetite] ?? "-"}</td>
                  <td>{stoolLabels[item.stool] ?? "-"}</td>
                  <td>{formatMedicines(item.medicines)}</td>
                  <td>{item.note ?? ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </section>
  )
}