import { useState } from "react"
import TodayPage from "./pages/TodayPage"
import AddPage from "./pages/AddPage"
import HistoryPage from "./pages/HistoryPage"
import ChartsPage from "./pages/ChartsPage"
import ReportPage from "./pages/ReportPage"
import AccessPage from "./pages/AccessPage"
import BottomNav from "./components/BottomNav"
import { clearFamilyCode, getFamilyCode } from "./utils/access"

export default function App() {
  const [page, setPage] = useState("today")
  const [familyCode, setFamilyCode] = useState(getFamilyCode())

  function handleChangeFamilyCode() {
    const ok = window.confirm("Bạn có muốn đổi mã gia đình trên thiết bị này không?")

    if (!ok) return

    clearFamilyCode()
    setFamilyCode(null)
    setPage("today")
  }

  if (!familyCode) {
    return (
      <div className="app">
        <main className="content">
          <AccessPage onAccessGranted={setFamilyCode} />
        </main>
      </div>
    )
  }

  return (
    <div className="app">
      <main className="content">
        <button className="family-code-button no-print" onClick={handleChangeFamilyCode}>
          Đổi mã gia đình
        </button>

        {page === "today" && <TodayPage onAdd={() => setPage("add")} />}
        {page === "add" && <AddPage onSaved={() => setPage("today")} />}
        {page === "history" && <HistoryPage />}
        {page === "charts" && <ChartsPage />}
        {page === "report" && <ReportPage />}
      </main>

      <BottomNav current={page} onChange={setPage} />
    </div>
  )
}