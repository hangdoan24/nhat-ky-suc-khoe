export default function StatusBox({ result }) {
  if (!result) return null

  return (
    <div className={`status-box ${result.level}`}>
      <h3>{result.label}</h3>
      {result.messages.map((msg, index) => (
        <p key={index}>{msg}</p>
      ))}
      <p className="disclaimer">
        Đây là gợi ý theo dõi tại nhà, không thay thế hướng dẫn của bác sĩ.
      </p>
    </div>
  )
}