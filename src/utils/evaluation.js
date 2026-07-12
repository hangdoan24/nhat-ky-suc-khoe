export function evaluateRecord(data) {
  const messages = []
  let level = "ok"
  let label = "Ổn định"

  function setWatch() {
    if (level !== "alert") {
      level = "watch"
      label = "Nên theo dõi thêm"
    }
  }

  function setAlert() {
    level = "alert"
    label = "Cần chú ý"
  }

  const spo2 = Number(data.spo2)
  const temperature = Number(data.temperature)
  const systolic = Number(data.systolic)
  const diastolic = Number(data.diastolic)
  const pulse = Number(data.pulse)
  const pain = Number(data.pain)

  if (data.spo2 && spo2 <= 92) {
    setAlert()
    messages.push(
      "Chỉ số oxy thấp. Mẹ nghỉ ngơi, giữ tay ấm và đo lại ngay. Nếu kết quả vẫn thấp hoặc mẹ thấy khó thở, đau ngực, tím môi, lơ mơ hoặc mệt nhiều, nên gọi ngay cho con."
    )
  } else if (data.spo2 && spo2 <= 94) {
    setWatch()
    messages.push(
      "Chỉ số oxy hơi thấp. Mẹ nghỉ vài phút, giữ tay ấm rồi đo lại. Nếu vẫn 93–94% hoặc mẹ thấy khó thở hơn, nên gọi ngay cho con."
    )
  }

  if (data.temperature && temperature >= 38.3) {
    setAlert()
    messages.push(
      "Nhiệt độ đang cao. Sau phẫu thuật, nếu sốt từ khoảng 38.3°C trở lên, sốt không giảm, hoặc kèm rét run, khó thở, đau tăng, nên gọi ngay cho con."
    )
  } else if (data.temperature && temperature >= 38) {
    setWatch()
    messages.push("Nhiệt độ hơi cao. Nên theo dõi thêm trong ngày và đo lại.")
  }

  if (data.systolic && systolic >= 180) {
    setAlert()
    messages.push(
      "Huyết áp trên rất cao. Mẹ nghỉ yên và đo lại. Nếu vẫn rất cao hoặc có đau ngực, khó thở, đau đầu dữ dội, yếu liệt, nhìn mờ, lơ mơ hoặc khó nói, nên gọi cấp cứu."
    )
  } else if (data.systolic && systolic >= 140) {
    setWatch()
    messages.push("Huyết áp trên hơi cao. Mẹ nghỉ yên vài phút rồi đo lại.")
  }

  if (data.diastolic && diastolic >= 120) {
    setAlert()
    messages.push(
      "Huyết áp dưới rất cao. Mẹ nghỉ yên và đo lại. Nếu vẫn rất cao hoặc có triệu chứng bất thường, nên gọi ngay cho con."
    )
  } else if (data.diastolic && diastolic >= 90) {
    setWatch()
    messages.push("Huyết áp dưới hơi cao. Mẹ nghỉ yên vài phút rồi đo lại.")
  }

  if (data.pulse && pulse >= 131) {
    setAlert()
    messages.push(
      "Mạch rất nhanh. Mẹ nghỉ yên và đo lại. Nếu kèm khó thở, đau ngực, chóng mặt, ngất hoặc mệt nhiều, nên gọi ngay cho con."
    )
  } else if (data.pulse && pulse > 110) {
    setWatch()
    messages.push("Mạch hơi nhanh. Nên nghỉ ngơi và theo dõi thêm.")
  }

  if (data.breath === "strong") {
    setAlert()
    messages.push(
      "Mẹ đang khó thở nhiều. Nên báo người nhà ngay. Nếu không đỡ nhanh hoặc có đau ngực, tím môi, lơ mơ, nên gọi ngay cho con."
    )
  } else if (data.breath === "medium") {
    setWatch()
    messages.push(
      "Mẹ đang thấy khó thở. Nên ngồi nghỉ, thở chậm và gọi ngay cho con."
    )
  }

  if (data.pain && pain >= 8) {
    setAlert()
    messages.push(
      "Mẹ đang đau nhiều. Nếu đau không giảm theo hướng dẫn giảm đau hoặc đau tăng bất thường, nên gọi ngay cho con."
    )
  } else if (data.pain && pain >= 6) {
    setWatch()
    messages.push("Mẹ đau nhiều hơn. Nên nghỉ ngơi và theo dõi thêm.")
  }

  if (data.appetite === "none") {
    setAlert()
    messages.push(
      "Mẹ chán ăn/không ăn được. Nếu không uống/ăn được hoặc mệt nhiều, nên gọi ngay cho con."
    )
  } else if (data.appetite === "low" || data.appetite === "nausea") {
    setWatch()
    messages.push("Ăn uống hôm nay chưa tốt. Nên ghi chú thêm để theo dõi.")
  }

  if (data.stool === "diarrhea" || data.stool === "constipation") {
    setWatch()
    messages.push("Đi ngoài chưa bình thường. Nên theo dõi thêm.")
  }

  if (data.sleep === "short") {
    setWatch()
    messages.push("Đêm qua mẹ ngủ hơi ít. Nên để mẹ nghỉ thêm trong ngày.")
  }

  if (data.sleep === "difficult" || data.sleep === "interrupted") {
    setWatch()
    messages.push("Đêm qua mẹ ngủ chưa tốt. Nên theo dõi mức mệt trong ngày.")
  }

  if (messages.length === 0) {
    return {
      level: "ok",
      label: "Ổn định",
      messages: ["Các thông tin đã ghi hiện ổn định."]
    }
  }

  return {
    level,
    label,
    messages
  }
}