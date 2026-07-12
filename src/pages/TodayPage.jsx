import { getRecords } from "../utils/storage"
import { evaluateRecord } from "../utils/evaluation"
import {
  sessionLabels,
  sleepLabels,
  coughLabels,
  breathLabels,
  appetiteLabels,
  stoolLabels
} from "../utils/format"

function getTodayString() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

function getTodayRecords() {
  const today = getTodayString()

  return getRecords()
    .filter((item) => item.date === today)
    .sort((a, b) => {
      if (a.session === "morning" && b.session === "evening") return -1
      if (a.session === "evening" && b.session === "morning") return 1
      return a.time.localeCompare(b.time)
    })
}

function getSessionRecord(records, session) {
  return records.find((item) => item.session === session)
}

function formatBloodPressure(item) {
  if (!item.systolic && !item.diastolic) return "-"
  return `${item.systolic ?? "-"}/${item.diastolic ?? "-"}`
}

function getStatusClass(level) {
  if (level === "alert") return "summary-alert"
  if (level === "watch") return "summary-watch"
  return "summary-ok"
}

function TodaySessionSummary({ item, session }) {
  if (!item) {
    return (
      <article className="today-session-summary empty">
        <div className="session-summary-header">
          <div>
            <h3>{sessionLabels[session]}</h3>
            <p>Chưa ghi hôm nay</p>
          </div>

          <span className="summary-badge empty">Chưa có</span>
        </div>
      </article>
    )
  }

  const result = evaluateRecord(item)

  return (
    <article className="today-session-summary">
      <div className="session-summary-header">
        <div>
          <h3>{sessionLabels[item.session]}</h3>
          <p>Giờ ghi: {item.time}</p>
        </div>

        <span className={`summary-badge ${getStatusClass(result.level)}`}>
          {result.label}
        </span>
      </div>

      <div className="today-mini-grid">
        <div>
          <span>SpO₂</span>
          <strong>{item.spo2 ?? "-"}%</strong>
        </div>

        <div>
          <span>Huyết áp</span>
          <strong>{formatBloodPressure(item)}</strong>
        </div>

        <div>
          <span>Mạch</span>
          <strong>{item.pulse ?? "-"}</strong>
        </div>

        <div>
          <span>Nhiệt độ</span>
          <strong>{item.temperature ?? "-"}°C</strong>
        </div>

        {item.session === "morning" && (
          <div>
            <span>Cân nặng</span>
            <strong>{item.weight ?? "-"} kg</strong>
          </div>
        )}

        <div>
          <span>Đau</span>
          <strong>{item.pain ?? 0}/10</strong>
        </div>
      </div>

      <div className="today-condition-row">
        {item.sleep && <span>Ngủ: {sleepLabels[item.sleep]}</span>}
        <span>Ho: {coughLabels[item.cough]}</span>
        <span>Khó thở: {breathLabels[item.breath]}</span>
        <span>Ăn: {appetiteLabels[item.appetite]}</span>
        <span>Đi ngoài: {stoolLabels[item.stool]}</span>
      </div>

      {result.messages.length > 0 && (
        <div className="today-evaluation-text">
          {result.messages.slice(0, 2).map((message, index) => (
            <p key={index}>{message}</p>
          ))}
        </div>
      )}
    </article>
  )
}

export default function TodayPage({ onAdd }) {
  const records = getTodayRecords()
  const morning = getSessionRecord(records, "morning")
  const evening = getSessionRecord(records, "evening")

  return (
    <section>
      <div className="today-hero">
        <div className="family-photo-wrap">
          <img
            src="/nhat-ky-suc-khoe/family.jpeg"
            alt="Ảnh gia đình"
            className="family-photo"
            onError={(event) => {
              event.currentTarget.style.display = "none"
            }}
          />

          <div className="family-photo-placeholder">
            <span>♡</span>
          </div>
        </div>

        <div className="hero-text">
          <p className="hero-kicker">Nhật ký sức khỏe</p>
          <h1>Hôm nay mẹ Hồng thấy thế nào ạ?</h1>
          <p>
            Ghi lại từng ngày một chút để cả nhà dễ theo dõi và chăm sóc mẹ tốt hơn nhé.
          </p>
        </div>
      </div>

      <button className="primary-button today-main-button" onClick={onAdd}>
        Ghi số đo mới
      </button>

      <div className="today-section-title">
        <div>
          <p className="small-label">Hôm nay</p>
          <h2>{getTodayString()}</h2>
        </div>
      </div>

      <TodaySessionSummary item={morning} session="morning" />
      <TodaySessionSummary item={evening} session="evening" />
    </section>
  )
}