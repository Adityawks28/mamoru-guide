import { currentLang } from './lang';
import { shelters, Shelter } from './shelter-data';

interface ShelterWithDistance extends Shelter {
  distance: number;
  walkMinutes: number;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const L: any;

let leafletLoaded = false;
let mapInstance: unknown = null;

function getLangText(en: string, ja: string, id: string): string {
  if (currentLang === 'ja') return ja;
  if (currentLang === 'id') return id;
  return en;
}

function reapplyLang(): void {
  document.body.classList.remove('lang-en', 'lang-ja', 'lang-id');
  document.body.classList.add('lang-' + currentLang);
}

function haversineDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function findNearest(lat: number, lng: number, count: number): ShelterWithDistance[] {
  return shelters
    .map(s => {
      const distance = haversineDistance(lat, lng, s.lat, s.lng);
      return { ...s, distance, walkMinutes: Math.ceil(distance / (4 / 60)) };
    })
    .sort((a, b) => a.distance - b.distance)
    .slice(0, count);
}

function formatDistance(km: number): string {
  return km < 1 ? `${Math.round(km * 1000)}m` : `${km.toFixed(1)}km`;
}

const typeIcons: Record<string, string> = {
  earthquake: '🏚️',
  flood: '🌊',
  tsunami: '🌊',
  fire: '🔥',
  landslide: '⛰️',
};

const typeLabels: Record<string, string> = {
  earthquake: 'Earthquake',
  flood: 'Flood',
  tsunami: 'Tsunami',
  fire: 'Fire',
  landslide: 'Landslide',
};

function loadLeaflet(): Promise<void> {
  if (leafletLoaded) return Promise.resolve();

  return new Promise((resolve, reject) => {
    // Load CSS
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(css);

    // Load JS
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.onload = () => { leafletLoaded = true; resolve(); };
    script.onerror = () => reject(new Error('Failed to load Leaflet'));
    document.head.appendChild(script);
  });
}

function getUserLocation(): Promise<{ lat: number; lng: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      pos => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      err => reject(err),
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
}

function renderMap(lat: number, lng: number, nearest: ShelterWithDistance[]): void {
  const mapEl = document.getElementById('shelterMap');
  if (!mapEl || typeof L === 'undefined') return;

  // Clean up previous map
  if (mapInstance) {
    (mapInstance as { remove(): void }).remove();
    mapInstance = null;
  }

  const map = L.map('shelterMap').setView([lat, lng], 14);
  mapInstance = map;

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 18,
  }).addTo(map);

  // User marker (blue)
  L.circleMarker([lat, lng], {
    radius: 10,
    fillColor: '#4cc9f0',
    color: '#fff',
    weight: 2,
    fillOpacity: 0.9,
  }).addTo(map).bindPopup(getLangText('You are here', 'あなたの位置', 'Posisi Anda'));

  // Shelter markers (red)
  nearest.forEach(s => {
    L.marker([s.lat, s.lng])
      .addTo(map)
      .bindPopup(`<strong>${s.name}</strong>${s.name_en ? `<br>${s.name_en}` : ''}<br>${formatDistance(s.distance)} · ~${s.walkMinutes} min`);
  });

  // Fit bounds
  const bounds = [[lat, lng], ...nearest.map(s => [s.lat, s.lng])];
  map.fitBounds(bounds, { padding: [30, 30] });
}

function renderShelterList(_lat: number, _lng: number, nearest: ShelterWithDistance[]): void {
  const listEl = document.getElementById('shelterList');
  if (!listEl) return;

  listEl.innerHTML = nearest.map(s => `
    <div class="shelter-card">
      <div class="shelter-card-main">
        <div class="shelter-name">${s.name}</div>
        ${s.name_en ? `<div class="shelter-name-en">${s.name_en}</div>` : ''}
        <div class="shelter-address">${s.address}</div>
        <div class="shelter-types">
          ${s.types.map(t => `<span class="shelter-type-badge" title="${typeLabels[t]}">${typeIcons[t]} ${typeLabels[t]}</span>`).join('')}
        </div>
      </div>
      <div class="shelter-distance-info">
        <div class="shelter-distance">${formatDistance(s.distance)}</div>
        <div class="shelter-walk">~${s.walkMinutes} min 🚶</div>
      </div>
    </div>
  `).join('');
}

function showManualFallback(): void {
  const container = document.getElementById('shelterContainer');
  if (!container) return;

  const cities = [
    { name: 'Kobe - Sannomiya', lat: 34.6901, lng: 135.1956 },
    { name: 'Kobe - Nada/Rokko', lat: 34.7140, lng: 135.2350 },
    { name: 'Kobe - Higashinada', lat: 34.7184, lng: 135.2620 },
    { name: 'Nishinomiya', lat: 34.7367, lng: 135.3410 },
    { name: 'Ashiya', lat: 34.7267, lng: 135.3050 },
    { name: 'Akashi', lat: 34.6430, lng: 134.9970 },
    { name: 'Osaka - Central', lat: 34.6873, lng: 135.5262 },
    { name: 'Amagasaki', lat: 34.7332, lng: 135.4080 },
  ];

  container.innerHTML = `
    <div class="shelter-fallback">
      <p class="shelter-fallback-msg">
        <span data-lang="en">📍 Location access denied. Select your area manually:</span>
        <span data-lang="ja">📍 位置情報が拒否されました。手動でエリアを選択：</span>
        <span data-lang="id">📍 Akses lokasi ditolak. Pilih area Anda secara manual:</span>
      </p>
      <select class="shelter-city-select" id="shelterCitySelect">
        <option value="">-- ${getLangText('Select area', 'エリアを選択', 'Pilih area')} --</option>
        ${cities.map((c, i) => `<option value="${i}">${c.name}</option>`).join('')}
      </select>
    </div>
    <div id="shelterMap" class="shelter-map-container" style="display:none;"></div>
    <div id="shelterList" class="shelter-list"></div>
  `;
  reapplyLang();

  document.getElementById('shelterCitySelect')?.addEventListener('change', async (e) => {
    const idx = parseInt((e.target as HTMLSelectElement).value, 10);
    if (isNaN(idx)) return;
    const city = cities[idx];
    const nearest = findNearest(city.lat, city.lng, 5);
    renderShelterList(city.lat, city.lng, nearest);

    try {
      await loadLeaflet();
      const mapEl = document.getElementById('shelterMap');
      if (mapEl) mapEl.style.display = 'block';
      renderMap(city.lat, city.lng, nearest);
    } catch {
      // Map unavailable — list still works
    }
  });
}

function showLoading(): void {
  const container = document.getElementById('shelterContainer');
  if (!container) return;
  container.innerHTML = `
    <div class="shelter-loading">
      <div class="shelter-loading-spinner"></div>
      <span data-lang="en">Finding your location...</span>
      <span data-lang="ja">位置を検索中...</span>
      <span data-lang="id">Mencari lokasi Anda...</span>
    </div>
  `;
  reapplyLang();
}

async function findShelters(): Promise<void> {
  showLoading();

  try {
    const { lat, lng } = await getUserLocation();
    const nearest = findNearest(lat, lng, 5);

    const container = document.getElementById('shelterContainer');
    if (!container) return;

    container.innerHTML = `
      <div id="shelterMap" class="shelter-map-container"></div>
      <div class="shelter-result-header">
        <span data-lang="en">📍 ${nearest.length} nearest shelters</span>
        <span data-lang="ja">📍 最寄りの避難所 ${nearest.length}件</span>
        <span data-lang="id">📍 ${nearest.length} tempat perlindungan terdekat</span>
      </div>
      <div id="shelterList" class="shelter-list"></div>
    `;
    reapplyLang();

    renderShelterList(lat, lng, nearest);

    // Load map (non-blocking)
    try {
      await loadLeaflet();
      renderMap(lat, lng, nearest);
    } catch {
      const mapEl = document.getElementById('shelterMap');
      if (mapEl) {
        mapEl.classList.add('offline');
        mapEl.innerHTML = `
          <div class="shelter-map-offline">
            <span data-lang="en">🗺️ Map unavailable — check your connection</span>
            <span data-lang="ja">🗺️ 地図が利用できません — 接続を確認</span>
            <span data-lang="id">🗺️ Peta tidak tersedia — periksa koneksi</span>
          </div>
        `;
        reapplyLang();
      }
    }
  } catch {
    showManualFallback();
  }
}

export function initShelterFinder(): void {
  const findBtn = document.getElementById('shelterFindBtn');
  if (!findBtn) return;
  findBtn.addEventListener('click', findShelters);
}
