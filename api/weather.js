/**
 * Serverless function: /api/weather
 * - Query parameters:
 *     ?lat=...&lng=...
 *     OR
 *     ?city=cityname
 * - Uses OpenWeatherMap (process.env.OPENWEATHER_API_KEY)
 * - Returns JSON with `current` and `outlook[]` (3-5 day aggregated forecast)
 */

export default async function handler(req, res) {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'Server misconfiguration: missing OPENWEATHER_API_KEY.' });
    }

    const { lat, lng, city } = req.query || {};

    let latNum, lngNum;
    if (city) {
      const geoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(city)}&limit=1&appid=${apiKey}`;
      const geoResp = await fetch(geoUrl);
      if (!geoResp.ok) {
        return res.status(502).json({ error: 'Geocoding failed.' });
      }
      const geoJson = await geoResp.json();
      if (!Array.isArray(geoJson) || geoJson.length === 0) {
        return res.status(404).json({ error: 'City not found.' });
      }
      latNum = Number(geoJson[0].lat);
      lngNum = Number(geoJson[0].lon);
    } else {
      if (!lat || !lng) {
        return res.status(400).json({ error: 'Missing lat and lng query parameters or provide city= fallback.' });
      }
      latNum = Number(lat);
      lngNum = Number(lng);
    }

    if (Number.isNaN(latNum) || Number.isNaN(lngNum)) {
      return res.status(400).json({ error: 'Invalid lat or lng values.' });
    }

    // Current weather
    const currentUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latNum}&lon=${lngNum}&units=metric&appid=${apiKey}`;
    const currentResp = await fetch(currentUrl);
    if (!currentResp.ok) {
      return res.status(502).json({ error: 'Failed to fetch current weather.' });
    }
    const currentJson = await currentResp.json();

    // 5-day forecast (3-hour steps)
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latNum}&lon=${lngNum}&units=metric&appid=${apiKey}`;
    const forecastResp = await fetch(forecastUrl);
    if (!forecastResp.ok) {
      return res.status(502).json({ error: 'Failed to fetch weather forecast.' });
    }
    const forecastJson = await forecastResp.json();

    // Aggregate forecast into daily outlook
    const outlookMap = new Map();
    const list = Array.isArray(forecastJson.list) ? forecastJson.list : [];
    for (const item of list) {
      const date = item.dt_txt ? item.dt_txt.split(' ')[0] : null;
      if (!date) continue;
      const entry = outlookMap.get(date) || { temps: [], pops: [], desc: [] };
      if (item.main && typeof item.main.temp === 'number') entry.temps.push(item.main.temp);
      if (typeof item.pop === 'number') entry.pops.push(item.pop);
      if (Array.isArray(item.weather) && item.weather[0]) entry.desc.push(item.weather[0].description);
      outlookMap.set(date, entry);
    }

    const outlook = Array.from(outlookMap.entries())
      .slice(0, 5)
      .map(([date, info]) => {
        const temps = info.temps.length ? info.temps : [currentJson.main?.temp].filter(Boolean);
        const temp_min = temps.length ? Math.round(Math.min(...temps) * 10) / 10 : null;
        const temp_max = temps.length ? Math.round(Math.max(...temps) * 10) / 10 : null;
        const precip_chance = info.pops.length ? Math.round((info.pops.reduce((a, b) => a + b, 0) / info.pops.length) * 100) : 0;
        const description = info.desc.length ? info.desc[0] : currentJson.weather?.[0]?.description || '';
        return { date, temp_min, temp_max, precip_chance, description };
      });

    const result = {
      current: {
        temp: currentJson.main?.temp,
        humidity: currentJson.main?.humidity,
        wind_speed: currentJson.wind?.speed,
        wind_deg: currentJson.wind?.deg,
        weather_main: currentJson.weather?.[0]?.main,
        weather_desc: currentJson.weather?.[0]?.description
      },
      outlook
    };

    return res.status(200).json(result);
  } catch (err) {
    console.error('Weather API error:', err);
    return res.status(500).json({ error: 'Weather lookup failed, please try again.' });
  }
}
