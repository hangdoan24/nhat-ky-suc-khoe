import { useEffect, useState } from "react"
import { getRecords, saveRecord, deleteRecord } from "../utils/storage"
import MeasurementCard from "../components/MeasurementCard"
import MeasurementForm from "../components/MeasurementForm"
import StatusBox from "../components/StatusBox"
import { evaluateRecord } from "../utils/evaluation"

export default function HistoryPage() {
  const [items, setItems] = useState([])
  const [editingItem, setEditingItem] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)

  async function refreshItems() {
    const records = await getRecords()
    setItems(records)
    setLoading(false)
  }

  useEffect(() => {
    refreshItems()
  }, [])

  function handleEdit(item) {
    setEditingItem(item)
    setResult(null)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  async function handleSaveEdit(updatedRecord) {
    await saveRecord(updatedRecord)
    await refreshItems()
    setResult(evaluateRecord(updatedRecord))
    setEditingItem(null)
  }

  function handleCancelEdit() {
    setEditingItem(null)
    setResult(null)
  }

  async function handleDelete(id) {
    const ok = window.confirm("Bạn có muốn xóa lần ghi này không?")
    if (!ok) return

    const updated = await deleteRecord(id)
    setItems(updated)

    if (editingItem?.id === id) {
      setEditingItem(null)
    }
  }

  if (editingItem) {
    return (
      <section>
        <h1>Chỉnh sửa bản ghi</h1>

        <div className="card">
          <p>
            Đang chỉnh sửa: {editingItem.date} —{" "}
            {editingItem.session === "morning" ? "Buổi sáng" : "Buổi tối"}
          </p>
        </div>

        <MeasurementForm
          key={editingItem.id}
          session={editingItem.session}
          initialRecord={editingItem}
          onSubmit={handleSaveEdit}
          submitLabel="Lưu thay đổi"
        />

        <button className="secondary-button" onClick={handleCancelEdit}>
          Hủy chỉnh sửa
        </button>
      </section>
    )
  }

  return (
    <section>
      <h1>Lịch sử đã ghi</h1>

      {result && <StatusBox result={result} />}

      {loading && <p>Đang tải dữ liệu...</p>}

      {!loading && items.length === 0 && <p>Chưa có dữ liệu.</p>}

      {!loading &&
        items.map((item) => (
          <MeasurementCard
            key={item.id}
            item={item}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
    </section>
  )
}