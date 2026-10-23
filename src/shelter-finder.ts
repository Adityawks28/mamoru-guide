import { currentLang } from './lang';
import { loadShelters, type Hazard, type Shelter } from './shelter-data';
import { showToast } from './toast';

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

// Past this distance the nearest site in our list is not useful: the user is
// outside the cities the list covers.
const OUT_OF_AREA_KM = 10;

async function findNearest(lat: number, lng: number, count: number): Promise<ShelterWithDistance[]> {
  const { sites } = await loadShelters();
  return sites
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

// Site names and addresses come from GSI data, so escape them for innerHTML.
function esc(text: string): string {
  return text.replace(/[&<>"']/g, c => `&#${c.charCodeAt(0)};`);
}

// GSI hazard names: icon, English, Japanese, Indonesian.
const HAZARD_LABELS: Record<Hazard, [string, string, string, string]> = {
  earthquake: ['🏚️', 'Earthquake', '地震', 'Gempa'],
  tsunami: ['🌊', 'Tsunami', '津波', 'Tsunami'],
  fire: ['🔥', 'Large fire', '大きな火事', 'Kebakaran besar'],
  flood: ['💧', 'Flood', '洪水', 'Banjir'],
  inland: ['🌧️', 'Heavy rain flooding', '内水氾濫', 'Banjir hujan deras'],
  surge: ['🌀', 'Storm surge', '高潮', 'Gelombang badai'],
  landslide: ['⛰️', 'Landslide', '土砂災害', 'Tanah longsor'],
  volcano: ['🌋', 'Volcano', '火山', 'Gunung api'],
};
const HAZARD_ORDER = Object.keys(HAZARD_LABELS) as Hazard[];

function hazardBadge(h: Hazard): string {
  const [icon, en, ja, id] = HAZARD_LABELS[h];
  return `<span class="shelter-type-badge">${icon} <span data-lang="en">${en}</span><span data-lang="ja">${ja}</span><span data-lang="id">${id}</span></span>`;
}

function sourceNote(asOf: string): string {
  return `
    <p class="shelter-source">
      <span data-lang="en">Source: 国土地理院 (GSI) designated emergency evacuation sites, data from ${asOf}. Sites can change. Check the hazard map of your city too.</span>
      <span data-lang="ja">出典：国土地理院「指定緊急避難場所データ」（${asOf}のデータ）。避難場所は変わることがあります。住んでいる市のハザードマップも見てください。</span>
      <span data-lang="id">Sumber: 国土地理院 (GSI), data tempat evakuasi darurat resmi per ${asOf}. Tempat evakuasi bisa berubah. Periksa juga peta bahaya kota Anda.</span>
    </p>`;
}

const OUT_OF_AREA_HTML = `
  <div class="shelter-out-of-area">
    <p>
      <span data-lang="en">📍 You are outside the area of our list. The list covers Kobe, Ashiya, Nishinomiya, Amagasaki, Itami, Takarazuka, Akashi, and Osaka City. Find the evacuation sites near you on the official GSI hazard map:</span>
      <span data-lang="ja">📍 今いる場所は、このリストの範囲の外です。リストにあるのは、神戸市、芦屋市、西宮市、尼崎市、伊丹市、宝塚市、明石市、大阪市です。近くの避難場所は、国土地理院のハザードマップで探してください：</span>
      <span data-lang="id">📍 Anda berada di luar area daftar kami. Daftar ini mencakup Kobe, Ashiya, Nishinomiya, Amagasaki, Itami, Takarazuka, Akashi, dan Kota Osaka. Cari tempat evakuasi di dekat Anda di peta bahaya resmi GSI:</span>
    </p>
    <a href="https://disaportal.gsi.go.jp/maps/" target="_blank" rel="noopener noreferrer">重ねるハザードマップ (disaportal.gsi.go.jp)</a>
  </div>`;

// Hashes as published for Leaflet 1.9.4: the browser refuses a CDN copy that
// does not match, and CORS mode lets the service worker cache it.
export function loadLeaflet(): Promise<void> {
  if (leafletLoaded) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const css = document.createElement('link');
    css.rel = 'stylesheet';
    css.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    css.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
    css.crossOrigin = 'anonymous';
    document.head.appendChild(css);

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
    script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
    script.crossOrigin = 'anonymous';
    script.onload = () => { leafletLoaded = true; resolve(); };
    script.onerror = () => reject(new Error('Failed to load Leaflet'));
    document.head.appendChild(script);
  });
}

const LAST_LOC_KEY = 'mamoru-shelter-last-location';
const LAST_LOC_TTL_MS = 60 * 60 * 1000;

interface CachedLocation { lat: number; lng: number; ts: number }

function readCachedLocation(): CachedLocation | null {
  try {
    const raw = localStorage.getItem(LAST_LOC_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as CachedLocation;
    if (Date.now() - parsed.ts > LAST_LOC_TTL_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

function writeCachedLocation(lat: number, lng: number): void {
  try {
    localStorage.setItem(LAST_LOC_KEY, JSON.stringify({ lat, lng, ts: Date.now() }));
  } catch {
    // ignore quota errors
  }
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

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
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
  }).addTo(map).bindPopup(getLangText('You are here', '今いる場所', 'Posisi Anda'));

  // Shelter markers (red)
  nearest.forEach(s => {
    L.marker([s.lat, s.lng])
      .addTo(map)
      .bindPopup(`<strong>${esc(s.name)}</strong><br>${formatDistance(s.distance)} · ~${s.walkMinutes} min`);
  });

  // Fit bounds
  const bounds = [[lat, lng], ...nearest.map(s => [s.lat, s.lng])];
  map.fitBounds(bounds, { padding: [30, 30] });
}

function renderStatsBar(nearest: ShelterWithDistance[]): void {
  const bar = document.getElementById('shelterStatsBar');
  if (!bar || nearest.length === 0) return;
  const nearest1 = nearest[0];
  const avgWalk = Math.round(nearest.reduce((s, n) => s + n.walkMinutes, 0) / nearest.length);
  bar.innerHTML = `
    <div class="shelter-stat-chip">
      <div class="shelter-stat-chip-label"><span data-lang="en">FOUND</span><span data-lang="ja">見つかった数</span><span data-lang="id">DITEMUKAN</span></div>
      <div class="shelter-stat-chip-value">${nearest.length}</div>
    </div>
    <div class="shelter-stat-chip">
      <div class="shelter-stat-chip-label"><span data-lang="en">NEAREST</span><span data-lang="ja">一番近い</span><span data-lang="id">TERDEKAT</span></div>
      <div class="shelter-stat-chip-value">${formatDistance(nearest1.distance)}</div>
    </div>
    <div class="shelter-stat-chip">
      <div class="shelter-stat-chip-label"><span data-lang="en">AVERAGE WALK</span><span data-lang="ja">歩く時間（平均）</span><span data-lang="id">RATA-RATA JALAN KAKI</span></div>
      <div class="shelter-stat-chip-value">~${avgWalk}min</div>
    </div>`;
  reapplyLang();
}

async function renderShelterList(nearest: ShelterWithDistance[]): Promise<void> {
  const listEl = document.getElementById('shelterList');
  if (!listEl) return;
  const { asOf } = await loadShelters();

  listEl.innerHTML = nearest.map(s => `
    <div class="shelter-card">
      <div class="shelter-card-main">
        <div class="shelter-name">${esc(s.name)}</div>
        <div class="shelter-address">${esc(s.address)}</div>
        <div class="shelter-types">
          ${HAZARD_ORDER.filter(h => s.types.includes(h)).map(hazardBadge).join('')}
        </div>
      </div>
      <div class="shelter-distance-info">
        <div class="shelter-distance">${formatDistance(s.distance)}</div>
        <div class="shelter-walk">~${s.walkMinutes} min 🚶</div>
      </div>
    </div>
  `).join('') + sourceNote(asOf);
  reapplyLang();
}

function showManualFallback(): void {
  const container = document.getElementById('shelterContainer');
  if (!container) return;

  const cities = [
    { name: 'Kobe · Sannomiya', lat: 34.6901, lng: 135.1956 },
    { name: 'Kobe · Nada/Rokko', lat: 34.7140, lng: 135.2350 },
    { name: 'Kobe · Higashinada', lat: 34.7184, lng: 135.2620 },
    { name: 'Nishinomiya', lat: 34.7367, lng: 135.3410 },
    { name: 'Ashiya', lat: 34.7267, lng: 135.3050 },
    { name: 'Akashi', lat: 34.6430, lng: 134.9970 },
    { name: 'Osaka · Central', lat: 34.6873, lng: 135.5262 },
    { name: 'Amagasaki', lat: 34.7332, lng: 135.4080 },
  ];

  container.innerHTML = `
    <div class="shelter-fallback">
      <p class="shelter-fallback-msg">
        <span data-lang="en">📍 Location access denied. Choose your area from the list:</span>
        <span data-lang="ja">📍 位置情報の利用が拒否されました。リストからエリアを選んでください：</span>
        <span data-lang="id">📍 Akses lokasi ditolak. Pilih area Anda dari daftar:</span>
      </p>
      <select class="shelter-city-select" id="shelterCitySelect">
        <option value="">${getLangText('Choose your area', 'エリアを選んでください', 'Pilih area Anda')}</option>
        ${cities.map((c, i) => `<option value="${i}">${c.name}</option>`).join('')}
      </select>
    </div>
    <div id="shelterMap" class="shelter-map-container" style="display:none;"></div>
    <div id="shelterList" class="shelter-list"></div>
    <div class="shelter-stats-bar" id="shelterStatsBar"></div>
  `;
  reapplyLang();

  document.getElementById('shelterCitySelect')?.addEventListener('change', async (e) => {
    const idx = parseInt((e.target as HTMLSelectElement).value, 10);
    if (isNaN(idx)) return;
    const city = cities[idx];
    const nearest = await findNearest(city.lat, city.lng, 5);
    await renderShelterList(nearest);
    renderStatsBar(nearest);

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
      <span data-lang="ja">今いる場所を探しています...</span>
      <span data-lang="id">Mencari lokasi Anda...</span>
    </div>
  `;
  reapplyLang();
}

function reportGeolocationError(err: unknown): void {
  const code = (err as GeolocationPositionError | undefined)?.code;
  let msg = getLangText(
    'Could not get your location. Choose your area below.',
    '位置情報を取得できませんでした。下でエリアを選んでください。',
    'Lokasi Anda tidak bisa didapat. Pilih area di bawah.',
  );
  if (code === 1) {
    msg = getLangText(
      'Location permission denied. Choose your area below.',
      '位置情報の利用が拒否されました。下でエリアを選んでください。',
      'Izin lokasi ditolak. Pilih area Anda di bawah.',
    );
  } else if (code === 3) {
    msg = getLangText(
      'Finding your location took too long. Choose your area below.',
      '位置情報の取得に時間がかかりすぎました。下でエリアを選んでください。',
      'Waktu mencari lokasi habis. Pilih area Anda di bawah.',
    );
  } else if (code === 2) {
    msg = getLangText(
      'Your location is not available. Choose your area below.',
      '位置情報が使えません。下でエリアを選んでください。',
      'Lokasi Anda tidak tersedia. Pilih area Anda di bawah.',
    );
  }
  showToast(msg, 'error');
}

async function findShelters(useCached?: CachedLocation): Promise<void> {
  const findBtn = document.getElementById('shelterFindBtn') as HTMLButtonElement | null;
  if (findBtn) {
    findBtn.disabled = true;
    findBtn.setAttribute('aria-busy', 'true');
  }
  showLoading();

  try {
    let coords: { lat: number; lng: number };
    try {
      coords = useCached ?? await getUserLocation();
    } catch (geoErr) {
      reportGeolocationError(geoErr);
      showManualFallback();
      return;
    }
    const { lat, lng } = coords;
    if (!useCached) writeCachedLocation(lat, lng);
    const nearest = await findNearest(lat, lng, 5);

    const container = document.getElementById('shelterContainer');
    if (!container) return;
    if (!nearest.length || nearest[0].distance > OUT_OF_AREA_KM) {
      container.innerHTML = OUT_OF_AREA_HTML;
      reapplyLang();
      return;
    }

    container.innerHTML = `
      <div id="shelterMap" class="shelter-map-container"></div>
      <div class="shelter-result-header">
        <span data-lang="en">📍 ${nearest.length} nearest shelters</span>
        <span data-lang="ja">📍 近くの避難場所 ${nearest.length}か所</span>
        <span data-lang="id">📍 ${nearest.length} tempat perlindungan terdekat</span>
      </div>
      <div id="shelterList" class="shelter-list"></div>
      <div class="shelter-stats-bar" id="shelterStatsBar"></div>
    `;
    reapplyLang();

    await renderShelterList(nearest);
    renderStatsBar(nearest);

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
            <span data-lang="en">🗺️ The map is not available. Check your internet connection.</span>
            <span data-lang="ja">🗺️ 地図を表示できません。インターネットの接続を確認してください。</span>
            <span data-lang="id">🗺️ Peta tidak tersedia. Periksa koneksi internet.</span>
          </div>
        `;
        reapplyLang();
      }
    }
  } catch {
    showManualFallback();
  } finally {
    if (findBtn) {
      findBtn.disabled = false;
      findBtn.removeAttribute('aria-busy');
    }
  }
}

function renderCachedHint(): void {
  const hint = document.getElementById('shelterCachedHint');
  if (!hint) return;
  const cached = readCachedLocation();
  if (!cached) {
    hint.innerHTML = '';
    return;
  }
  const minsAgo = Math.max(1, Math.round((Date.now() - cached.ts) / 60000));
  hint.innerHTML = `
    <button type="button" class="shelter-cached-btn" id="shelterCachedBtn">
      <span data-lang="en">📍 Use last location (saved ${minsAgo} min ago)</span>
      <span data-lang="ja">📍 前回の位置を使う（${minsAgo}分前に保存）</span>
      <span data-lang="id">📍 Pakai lokasi terakhir (disimpan ${minsAgo} menit lalu)</span>
    </button>
  `;
  reapplyLang();
  document.getElementById('shelterCachedBtn')?.addEventListener('click', () => {
    findShelters(cached);
  });
}

export function initShelterFinder(): void {
  const findBtn = document.getElementById('shelterFindBtn');
  if (!findBtn) return;
  findBtn.addEventListener('click', () => findShelters());
  renderCachedHint();
}
