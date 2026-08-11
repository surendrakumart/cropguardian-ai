// Frontend helper functions — replace mock data callers with these helpers.
// TypeScript file kept minimal to match project's TypeScript usage.

export async function diagnoseImage(base64Image: string) {
  const res = await fetch('/api/diagnose', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ image: base64Image })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err?.error || 'Diagnosis request failed');
  }
  return res.json();
}

export async function fetchWeatherByCoords(lat: number, lng: number) {
  const res = await fetch(`/api/weather?lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err?.error || 'Weather request failed');
  }
  return res.json();
}

export async function fetchWeatherByCity(city: string) {
  const res = await fetch(`/api/weather?city=${encodeURIComponent(city)}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(err?.error || 'Weather request failed');
  }
  return res.json();
}
