import { useState } from "react"
import TodayPage from "./pages/TodayPage"
import AddPage from "./pages/AddPage"
import HistoryPage from "./pages/HistoryPage"
import ChartsPage from "./pages/ChartsPage"
import ReportPage from "./pages/ReportPage"
import BottomNav from "./components/BottomNav"

export default function App() {
  const [page, setPage] = useState("today");

  return (
    <div className="app">
      <main className="content">
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