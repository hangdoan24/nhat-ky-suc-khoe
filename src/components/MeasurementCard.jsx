import {
  sessionLabels,
  coughLabels,
  breathLabels,
  appetiteLabels,
  stoolLabels,
  sleepLabels,
  formatMedicines
} from "../utils/format"

export default function MeasurementCard({ item, onEdit, onDelete }) {
  return (
    <article className="card">
      <h3>
        {item.date} — {sessionLabels[item.session]}
      </h3>

      <p>Giờ: {item.time}</p>
      <p>SpO₂: {item.spo2 ?? "-"}%</p>
      <p>Huyết áp: {item.systolic ?? "-"}/{item.diastolic ?? "-"} mmHg</p>
      <p>Mạch: {item.pulse ?? "-"} lần/phút</p>
      <p>Nhiệt độ: {item.temperature ?? "-"}°C</p>

      {item.weight !== null && item.weight !== undefined && (
        <p>Cân nặng: {item.weight} kg</p>
      )}

      {item.sleep && <p>Giấc ngủ: {sleepLabels[item.sleep]}</p>}

      <p>Mức đau: {item.pain ?? 0}/10</p>
      <p>Ho: {coughLabels[item.cough]}</p>
      <p>Khó thở: {breathLabels[item.breath]}</p>
      <p>Ăn uống: {appetiteLabels[item.appetite]}</p>
      <p>Đi ngoài: {stoolLabels[item.stool]}</p>
      <p>Thuốc: {formatMedicines(item.medicines)}</p>

      {item.note && <p>Ghi chú: {item.note}</p>}

      <button className="primary-button" onClick={() => onEdit(item)}>
        Chỉnh sửa
      </button>

      <button className="secondary-button" onClick={() => onDelete(item.id)}>
        Xóa
      </button>
    </article>
  )
}