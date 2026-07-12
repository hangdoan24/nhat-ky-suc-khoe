import { useEffect, useState } from "react"
import { getRecords } from "../utils/storage"
import VitalChart from "../components/VitalChart"

const MORNING_COLOR = "#2563eb"
const EVENING_COLOR = "#dc2626"
const WEIGHT_COLOR = "#111827"

function formatDateLabel(dateString) {
  const [, month, day] = dateString.split("-")
  return `${day}.${month}`
}

function buildDailyChartData(records) {
  const byDate = {}

  records.forEach((item) => {
    if (!byDate[item.date]) {
      byDate[item.date] = {
        date: formatDateLabel(item.date),
        fullDate: item.date,

        spo2Morning: null,
        spo2Evening: null,

        systolicMorning: null,
        systolicEvening: null,

        diastolicMorning: null,
        diastolicEvening: null,

        pulseMorning: null,
        pulseEvening: null,

        temperatureMorning: null,
        temperatureEvening: null,

        painMorning: null,
        painEvening: null,

        weightMorning: null
      }
    }

    const target = byDate[item.date]

    if (item.session === "morning") {
      target.spo2Morning = item.spo2
      target.systolicMorning = item.systolic
      target.diastolicMorning = item.diastolic
      target.pulseMorning = item.pulse
      target.temperatureMorning = item.temperature
      target.painMorning = item.pain
      target.weightMorning = item.weight
    }

    if (item.session === "evening") {
      target.spo2Evening = item.spo2
      target.systolicEvening = item.systolic
      target.diastolicEvening = item.diastolic
      target.pulseEvening = item.pulse
      target.temperatureEvening = item.temperature
      target.painEvening = item.pain
    }
  })

  return Object.values(byDate).sort((a, b) => a.fullDate.localeCompare(b.fullDate))
}

function morningEveningSeries(morningKey, eveningKey) {
  return [
    {
      dataKey: morningKey,
      name: "Buổi sáng",
      color: MORNING_COLOR
    },
    {
      dataKey: eveningKey,
      name: "Buổi tối",
      color: EVENING_COLOR
    }
  ]
}

export default function ChartsPage() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadRecords() {
      const result = await getRecords()
      setRecords(result)
      setLoading(false)
    }

    loadRecords()
  }, [])

  const data = buildDailyChartData(records)

  const hasWeight = data.some(
    (item) => item.weightMorning !== null && item.weightMorning !== undefined
  )

  return (
    <section>
      <h1>Biểu đồ theo dõi</h1>

      {loading && <p>Đang tải dữ liệu...</p>}

      {!loading && data.length === 0 && <p>Chưa có dữ liệu để vẽ biểu đồ.</p>}

      {!loading && data.length > 0 && (
        <>
          {hasWeight && (
            <VitalChart
              title="Cân nặng"
              data={data}
              unit="kg"
              series={[
                {
                  dataKey: "weightMorning",
                  name: "Buổi sáng",
                  color: WEIGHT_COLOR
                }
              ]}
              yConfig={{
                step: 1,
                padding: 1,
                allowDecimals: true,
                baseDomain: [48, 58],
                defaultDomain: [48, 58]
              }}
            />
          )}

          <VitalChart
            title="Nhiệt độ"
            data={data}
            unit="°C"
            series={morningEveningSeries("temperatureMorning", "temperatureEvening")}
            yConfig={{
              step: 0.5,
              padding: 0.5,
              allowDecimals: true,
              baseDomain: [35.5, 40],
              minLimit: 34,
              maxLimit: 42,
              defaultDomain: [35.5, 40]
            }}
          />

          <VitalChart
            title="Huyết áp trên"
            data={data}
            unit="mmHg"
            series={morningEveningSeries("systolicMorning", "systolicEvening")}
            yConfig={{
              step: 10,
              padding: 10,
              baseDomain: [80, 180],
              minLimit: 60,
              maxLimit: 240,
              defaultDomain: [80, 180]
            }}
          />

          <VitalChart
            title="Huyết áp dưới"
            data={data}
            unit="mmHg"
            series={morningEveningSeries("diastolicMorning", "diastolicEvening")}
            yConfig={{
              step: 10,
              padding: 10,
              baseDomain: [50, 120],
              minLimit: 40,
              maxLimit: 160,
              defaultDomain: [50, 120]
            }}
          />

          <VitalChart
            title="Mạch"
            data={data}
            unit="lần/phút"
            series={morningEveningSeries("pulseMorning", "pulseEvening")}
            yConfig={{
              step: 10,
              padding: 10,
              baseDomain: [50, 130],
              minLimit: 30,
              maxLimit: 180,
              defaultDomain: [50, 130]
            }}
          />

          <VitalChart
            title="Oxy trong máu SpO₂"
            data={data}
            unit="%"
            series={morningEveningSeries("spo2Morning", "spo2Evening")}
            yConfig={{
              step: 2,
              padding: 2,
              baseDomain: [85, 100],
              minLimit: 70,
              maxLimit: 100,
              defaultDomain: [85, 100]
            }}
          />

          <VitalChart
            title="Mức đau"
            data={data}
            unit="/10"
            series={morningEveningSeries("painMorning", "painEvening")}
            yConfig={{
              fixedDomain: [0, 10],
              fixedTicks: [0, 2, 4, 6, 8, 10],
              defaultDomain: [0, 10]
            }}
          />
        </>
      )}
    </section>
  )
}