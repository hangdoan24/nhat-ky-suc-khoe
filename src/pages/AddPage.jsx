import { useState } from "react"
import MeasurementForm from "../components/MeasurementForm"
import StatusBox from "../components/StatusBox"
import { saveRecord } from "../utils/storage"
import { evaluateRecord } from "../utils/evaluation"

export default function AddPage({ onSaved }) {
  const [session, setSession] = useState(null)
  const [result, setResult] = useState(null)
  const [saved, setSaved] = useState(false)

  function handleSubmit(record) {
    saveRecord(record)
    setResult(evaluateRecord(record))
    setSaved(true)
  }

  function handleNewRecord() {
    setResult(null)
    setSaved(false)
    setSession(null)
  }

  if (!session) {
    return (
      <section>
        <h1>Ghi lần đo mới</h1>

        <div className="card">
          <p>Chọn buổi muốn ghi:</p>

          <button className="primary-button" onClick={() => setSession("morning")}>
            Buổi sáng
          </button>

          <button className="secondary-button" onClick={() => setSession("evening")}>
            Buổi tối
          </button>
        </div>
      </section>
    )
  }

  if (saved) {
    return (
      <section>
        <h1>Đã lưu</h1>

        <StatusBox result={result} />

        <div className="card">
          <p>Thông tin đã được lưu vào nhật ký.</p>

          <button className="primary-button" onClick={onSaved}>
            Quay về Hôm nay
          </button>

          <button className="secondary-button" onClick={handleNewRecord}>
            Ghi lần khác
          </button>
        </div>
      </section>
    )
  }

  return (
    <section>
      <h1>{session === "morning" ? "Ghi buổi sáng" : "Ghi buổi tối"}</h1>

      <MeasurementForm session={session} onSubmit={handleSubmit} />

      <button className="secondary-button" onClick={() => setSession(null)}>
        Chọn lại buổi
      </button>
    </section>
  )
}