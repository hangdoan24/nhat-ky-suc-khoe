export default function BottomNav({ current, onChange }) {
  const items = [
    { id: "today", label: "Hôm nay" },
    { id: "add", label: "Ghi mới" },
    { id: "history", label: "Lịch sử" },
    { id: "charts", label: "Biểu đồ" },
    { id: "report", label: "Báo cáo" }
  ]

  return (
    <nav className="bottom-nav">
      {items.map((item) => (
        <button
          key={item.id}
          className={current === item.id ? "active" : ""}
          onClick={() => onChange(item.id)}
        >
          {item.label}
        </button>
      ))}
    </nav>
  )
}