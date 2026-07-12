import { useState } from "react"

function getCurrentDateTime() {
  const now = new Date()

  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")
  const hours = String(now.getHours()).padStart(2, "0")
  const minutes = String(now.getMinutes()).padStart(2, "0")

  return {
    date: `${year}-${month}-${day}`,
    time: `${hours}:${minutes}`
  }
}

function createInitialForm(session, initialRecord) {
  if (initialRecord) {
    return {
      date: initialRecord.date ?? "",
      time: initialRecord.time ?? "",
      session: initialRecord.session ?? session,

      temperature: initialRecord.temperature ?? "",
      systolic: initialRecord.systolic ?? "",
      diastolic: initialRecord.diastolic ?? "",
      pulse: initialRecord.pulse ?? "",
      spo2: initialRecord.spo2 ?? "",

      weight: initialRecord.weight ?? "",
      sleep: initialRecord.sleep ?? "ok",
      pain: initialRecord.pain ?? "0",

      cough: initialRecord.cough ?? "none",
      breath: initialRecord.breath ?? "none",
      appetite: initialRecord.appetite ?? "normal",
      stool: initialRecord.stool ?? "normal",

      medicines: {
        bloodPressure: initialRecord.medicines?.bloodPressure ?? false,
        cholesterol: initialRecord.medicines?.cholesterol ?? false,
        painkiller: initialRecord.medicines?.painkiller ?? false,
        stomach: initialRecord.medicines?.stomach ?? false,
        other: initialRecord.medicines?.other ?? ""
      },

      note: initialRecord.note ?? ""
    }
  }

  const currentDateTime = getCurrentDateTime()

  return {
    date: currentDateTime.date,
    time: currentDateTime.time,
    session,

    temperature: "",
    systolic: "",
    diastolic: "",
    pulse: "",
    spo2: "",

    weight: "",
    sleep: "ok",
    pain: "0",

    cough: "none",
    breath: "none",
    appetite: "normal",
    stool: "normal",

    medicines: {
      bloodPressure: false,
      cholesterol: false,
      painkiller: false,
      stomach: false,
      other: ""
    },

    note: ""
  }
}

export default function MeasurementForm({
  session,
  initialRecord = null,
  onSubmit,
  submitLabel = "Lưu lại"
}) {
  const [form, setForm] = useState(() => createInitialForm(session, initialRecord))
  const isMorning = form.session === "morning"

  function updateField(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value
    }))
  }

  function updateMedicine(field, value) {
    setForm((prev) => ({
      ...prev,
      medicines: {
        ...prev.medicines,
        [field]: value
      }
    }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    const record = {
      id: `${form.date}-${form.session}`,
      ...form,

      temperature: form.temperature !== "" ? Number(form.temperature) : null,
      systolic: form.systolic !== "" ? Number(form.systolic) : null,
      diastolic: form.diastolic !== "" ? Number(form.diastolic) : null,
      pulse: form.pulse !== "" ? Number(form.pulse) : null,
      spo2: form.spo2 !== "" ? Number(form.spo2) : null,
      weight: isMorning && form.weight !== "" ? Number(form.weight) : null,
      sleep: isMorning ? form.sleep : null,
      pain: form.pain !== "" ? Number(form.pain) : 0
    }

    onSubmit(record)
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <label>
        Ngày ghi
        <input
          type="date"
          value={form.date}
          onChange={(e) => updateField("date", e.target.value)}
        />
      </label>

      <label>
        Giờ ghi, có thể sửa nếu nhập bù
        <input
          type="text"
          value={form.time}
          onChange={(e) => updateField("time", e.target.value)}
          placeholder="Ví dụ: 08:30"
        />
      </label>

      <label>
        Buổi
        <select
          value={form.session}
          onChange={(e) => updateField("session", e.target.value)}
        >
          <option value="morning">Buổi sáng</option>
          <option value="evening">Buổi tối</option>
        </select>
      </label>

      <label>
        Nhiệt độ cơ thể °C
        <input
          type="number"
          step="0.1"
          inputMode="decimal"
          value={form.temperature}
          onChange={(e) => updateField("temperature", e.target.value)}
        />
      </label>

      <div className="row">
        <label>
          Huyết áp trên
          <input
            type="number"
            inputMode="numeric"
            value={form.systolic}
            onChange={(e) => updateField("systolic", e.target.value)}
          />
        </label>

        <label>
          Huyết áp dưới
          <input
            type="number"
            inputMode="numeric"
            value={form.diastolic}
            onChange={(e) => updateField("diastolic", e.target.value)}
          />
        </label>
      </div>

      <label>
        Mạch lần/phút
        <input
          type="number"
          inputMode="numeric"
          value={form.pulse}
          onChange={(e) => updateField("pulse", e.target.value)}
        />
      </label>

      <label>
        Oxy trong máu SpO₂ %
        <input
          type="number"
          inputMode="numeric"
          value={form.spo2}
          onChange={(e) => updateField("spo2", e.target.value)}
        />
      </label>

      {isMorning && (
        <label>
          Cân nặng kg
          <input
            type="number"
            step="0.1"
            inputMode="decimal"
            value={form.weight}
            onChange={(e) => updateField("weight", e.target.value)}
          />
        </label>
      )}

      {isMorning && (
        <label>
          Chất lượng giấc ngủ đêm qua
          <select
            value={form.sleep}
            onChange={(e) => updateField("sleep", e.target.value)}
          >
            <option value="good">Ngủ tốt</option>
            <option value="ok">Ngủ được</option>
            <option value="short">Ngủ ít</option>
            <option value="difficult">Khó ngủ</option>
            <option value="interrupted">Thức giấc nhiều lần</option>
          </select>
        </label>
      )}

      <label>
        Mức đau: {form.pain}/10
        <input
          type="range"
          min="0"
          max="10"
          value={form.pain}
          onChange={(e) => updateField("pain", e.target.value)}
        />
      </label>

      <label>
        Ho
        <select value={form.cough} onChange={(e) => updateField("cough", e.target.value)}>
          <option value="none">Không ho</option>
          <option value="mild">Ho ít</option>
          <option value="strong">Ho nhiều</option>
        </select>
      </label>

      <label>
        Khó thở
        <select value={form.breath} onChange={(e) => updateField("breath", e.target.value)}>
          <option value="none">Không khó thở</option>
          <option value="mild">Hơi khó thở</option>
          <option value="medium">Khó thở vừa</option>
          <option value="strong">Khó thở nhiều</option>
        </select>
      </label>

      <label>
        Ăn uống
        <select
          value={form.appetite}
          onChange={(e) => updateField("appetite", e.target.value)}
        >
          <option value="normal">Ăn tốt</option>
          <option value="low">Ăn ít</option>
          <option value="none">Chán ăn</option>
          <option value="nausea">Buồn nôn</option>
        </select>
      </label>

      <label>
        Đi ngoài
        <select value={form.stool} onChange={(e) => updateField("stool", e.target.value)}>
          <option value="normal">Bình thường</option>
          <option value="constipation">Táo bón</option>
          <option value="diarrhea">Tiêu chảy</option>
          <option value="none">Chưa đi</option>
        </select>
      </label>

      <fieldset className="medicine-box">
        <legend>Thuốc đã uống</legend>

        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={form.medicines.bloodPressure}
            onChange={(e) => updateMedicine("bloodPressure", e.target.checked)}
          />
          Thuốc huyết áp
        </label>

        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={form.medicines.cholesterol}
            onChange={(e) => updateMedicine("cholesterol", e.target.checked)}
          />
          Thuốc mỡ máu
        </label>

        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={form.medicines.painkiller}
            onChange={(e) => updateMedicine("painkiller", e.target.checked)}
          />
          Thuốc giảm đau
        </label>

        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={form.medicines.stomach}
            onChange={(e) => updateMedicine("stomach", e.target.checked)}
          />
          Thuốc dạ dày
        </label>

        <label>
          Thuốc khác / ghi chú thuốc
          <input
            type="text"
            value={form.medicines.other}
            onChange={(e) => updateMedicine("other", e.target.value)}
            placeholder="Nếu có"
          />
        </label>
      </fieldset>

      <label>
        Ghi chú thêm
        <textarea
          value={form.note}
          onChange={(e) => updateField("note", e.target.value)}
          placeholder="Ví dụ: ăn được, ngủ tốt, đi lại nhẹ..."
        />
      </label>

      <button className="primary-button" type="submit">
        {submitLabel}
      </button>
    </form>
  )
}