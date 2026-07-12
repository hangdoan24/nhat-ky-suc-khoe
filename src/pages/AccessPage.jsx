import { useState } from "react"
import { saveFamilyCode } from "../utils/access"

export default function AccessPage({ onAccessGranted }) {
  const [code, setCode] = useState("")
  const [error, setError] = useState("")

  function handleSubmit(event) {
    event.preventDefault()

    const trimmed = code.trim()

    if (trimmed.length < 6) {
      setError("Mã gia đình nên có ít nhất 6 ký tự.")
      return
    }

    const familyCode = saveFamilyCode(trimmed)
    onAccessGranted(familyCode)
  }

  return (
    <section className="access-page">
      <div className="access-card">
        <p className="hero-kicker">Nhật ký sức khỏe</p>
        <h1>Nhập mã gia đình</h1>

        <p>
          Nhập cùng một mã trên các thiết bị trong gia đình để cùng xem và ghi dữ liệu.
        </p>

        <form className="form" onSubmit={handleSubmit}>
          <label>
            Mã gia đình
            <input
              type="password"
              value={code}
              onChange={(event) => setCode(event.target.value)}
              placeholder="Ví dụ: mama-2026..."
            />
          </label>

          {error && <p className="form-error">{error}</p>}

          <button className="primary-button" type="submit">
            Vào nhật ký
          </button>
        </form>
      </div>
    </section>
  )
}