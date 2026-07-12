import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from "recharts"

function getValues(data, series) {
  return data
    .flatMap((row) => series.map((item) => row[item.dataKey]))
    .filter((value) => value !== null && value !== undefined && !Number.isNaN(value))
}

function roundDown(value, step) {
  return Math.floor(value / step) * step
}

function roundUp(value, step) {
  return Math.ceil(value / step) * step
}

function buildTicks(min, max, step) {
  const ticks = []

  for (let value = min; value <= max; value += step) {
    ticks.push(Number(value.toFixed(1)))
  }

  return ticks
}

function calculateYAxis(data, series, config) {
  if (config.fixedDomain) {
    return {
      domain: config.fixedDomain,
      ticks: config.fixedTicks,
      allowDecimals: config.allowDecimals ?? false
    }
  }

  const values = getValues(data, series)

  const baseDomain = config.baseDomain ?? config.defaultDomain
  let min = baseDomain[0]
  let max = baseDomain[1]

  if (values.length > 0) {
    const dataMin = Math.min(...values)
    const dataMax = Math.max(...values)

    if (dataMin < min) {
      min = roundDown(dataMin - config.padding, config.step)
    }

    if (dataMax > max) {
      max = roundUp(dataMax + config.padding, config.step)
    }
  }

  if (config.minLimit !== undefined) {
    min = Math.max(min, config.minLimit)
  }

  if (config.maxLimit !== undefined) {
    max = Math.min(max, config.maxLimit)
  }

  return {
    domain: [min, max],
    ticks: buildTicks(min, max, config.step),
    allowDecimals: config.allowDecimals ?? false
  }
}

export default function VitalChart({ title, data, series, unit, yConfig }) {
  const yAxis = calculateYAxis(data, series, yConfig)

  return (
    <div className="card chart-card">
      <h2>{title}</h2>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 10, right: 18, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis
            domain={yAxis.domain}
            ticks={yAxis.ticks}
            interval={0}
            allowDecimals={yAxis.allowDecimals}
            width={50}
            tick={{ fontSize: 12 }}
          />
          <Tooltip formatter={(value) => `${value} ${unit}`} />
          <Legend />

          {series.map((item) => (
            <Line
              key={item.dataKey}
              type="monotone"
              dataKey={item.dataKey}
              name={item.name}
              stroke={item.color}
              strokeWidth={2.5}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
              connectNulls={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}