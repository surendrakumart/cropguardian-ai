// src/routes/api/weather.ts
// TanStack Start server route — OpenWeatherMap current + forecast + disease risk scoring
// Needs OPENWEATHER_API_KEY set in Vercel Environment Variables

import { createFileRoute } from '@tanstack/react-router'

// Simple disease-risk heuristic based on temp + humidity (fungal/bacterial growth favor warm+humid)
function computeDiseaseRisk(tempC: number, humidity: number, rainChance: number): {
  level: 'low' | 'medium' | 'high'
  reason: string
} {
  if (tempC >= 20 && tempC <= 30 && humidity >= 80) {
    return { level: 'high', reason: 'Warm and humid conditions favor fungal and bacterial spread.' }
  }
  if (humidity >= 70 && rainChance >= 50) {
    return { level: 'high', reason: 'High humidity with rain increases leaf wetness duration, raising infection risk.' }
  }
  if (humidity >= 60 || rainChance >= 40) {
    return { level: 'medium', reason: 'Moderate humidity — monitor for early signs of disease.' }
  }
  return { level: 'low', reason: 'Dry conditions are unfavorable for most crop diseases.' }
}

// Spray safety scoring based on wind + rain
function computeSpraySafety(windKph: number, rainChance: number): {
  status: 'safe' | 'caution' | 'unsafe'
  reason: string
} {
  if (windKph > 15) {
    return { status: 'unsafe', reason: `Wind gusting at ${Math.round(windKph)} km/h — above the 15 km/h drift threshold for fine droplets.` }
  }
  if (rainChance >= 40) {
    return { status: 'unsafe', reason: `${rainChance}% rain chance — spray may wash off before absorption.` }
  }
  if (windKph > 10 || rainChance >= 20) {
    return { status: 'caution', reason: 'Conditions are borderline — consider waiting for a calmer window.' }
  }
  return { status: 'safe', reason: 'Calm wind and low rain risk — good conditions to spray.' }
}

export const Route = createFileRoute('/api/weather')({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const url = new URL(request.url)
          const lat = url.searchParams.get('lat')
          const lng = url.searchParams.get('lng')
          const city = url.searchParams.get('city')

          const apiKey = process.env.OPENWEATHER_API_KEY

          let latitude: number
          let longitude: number

          if (city) {
            // Geocode city name to lat/lng first
            const geoRes = await fetch(
              `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${apiKey}`
            )
            const geoData = await geoRes.json()
            if (!geoData || geoData.length === 0) {
              return Response.json({ error: 'City not found. Try a different search.' }, { status: 400 })
            }
            latitude = geoData[0].lat
            longitude = geoData[0].lon
          } else {
            if (!lat || !lng || isNaN(Number(lat)) || isNaN(Number(lng))) {
              return Response.json({ error: 'Valid lat and lng are required.' }, { status: 400 })
            }
            latitude = Number(lat)
            longitude = Number(lng)
          }

          // Current weather
          const currentRes = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
          )
          if (!currentRes.ok) {
            return Response.json({ error: 'Weather data unavailable. Please try again.' }, { status: 502 })
          }
          const current = await currentRes.json()

          // 5-day / 3-hour forecast
          const forecastRes = await fetch(
            `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}`
          )
          if (!forecastRes.ok) {
            return Response.json({ error: 'Forecast data unavailable. Please try again.' }, { status: 502 })
          }
          const forecast = await forecastRes.json()

          // Reduce 3-hour forecast entries down to one entry per day (take midday reading)
          const dailyMap = new Map<string, any>()
          for (const entry of forecast.list) {
            const date = entry.dt_txt.split(' ')[0]
            const hour = entry.dt_txt.split(' ')[1]
            if (!dailyMap.has(date) || hour === '12:00:00') {
              dailyMap.set(date, entry)
            }
          }
          const dailyForecast = Array.from(dailyMap.values())
            .slice(0, 5)
            .map((entry: any) => {
              const tempC = entry.main.temp
              const humidity = entry.main.humidity
              const rainChance = Math.round((entry.pop || 0) * 100)
              const risk = computeDiseaseRisk(tempC, humidity, rainChance)
              return {
                date: entry.dt_txt.split(' ')[0],
                tempMax: Math.round(entry.main.temp_max),
                tempMin: Math.round(entry.main.temp_min),
                humidity,
                rainChance,
                condition: entry.weather[0]?.main || 'Clear',
                diseaseRisk: risk.level,
                diseaseRiskReason: risk.reason,
              }
            })

          const currentTemp = current.main.temp
          const currentHumidity = current.main.humidity
          const windKph = current.wind.speed * 3.6 // m/s to km/h
          const rainChance = dailyForecast[0]?.rainChance ?? 0

          const spraySafety = computeSpraySafety(windKph, rainChance)

          return Response.json({
            current: {
              tempC: Math.round(currentTemp),
              humidity: currentHumidity,
              windKph: Math.round(windKph),
              rainChance,
              condition: current.weather[0]?.main || 'Clear',
            },
            spraySafety,
            forecast: dailyForecast,
          })
        } catch (err) {
          console.error('Weather API error:', err)
          return Response.json({ error: 'Weather data unavailable. Please try again.' }, { status: 500 })
        }
      },
    },
  },
})

