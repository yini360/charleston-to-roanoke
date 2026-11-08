/* Live conditions: Blue Ridge Parkway alerts (National Park Service API)
   and mountain forecasts (National Weather Service API).
   Both are called from the browser; results are cached for 30 minutes. */
(function () {
  // NPS API key from https://www.nps.gov/subjects/developer/get-started.htm
  // DEMO_KEY works but is rate-limited per visitor (about 30 requests an hour).
  const NPS_KEY = 'DEMO_KEY';
  const CACHE_MIN = 30;

  const places = [
    { name: 'Asheville', note: 'MP 382', lat: 35.595, lon: -82.551 },
    { name: 'Mount Mitchell', note: '6,684 ft', lat: 35.765, lon: -82.265 },
    { name: 'Blowing Rock', note: 'MP 291', lat: 36.135, lon: -81.678 },
    { name: 'Roanoke', note: 'MP 120', lat: 37.271, lon: -79.941 }
  ];

  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  function cacheGet(key) {
    try {
      const v = JSON.parse(localStorage.getItem(key));
      if (v && Date.now() - v.t < CACHE_MIN * 60000) return v;
    } catch (e) {}
    return null;
  }
  function cacheSet(key, data) {
    try { localStorage.setItem(key, JSON.stringify({ t: Date.now(), data })); } catch (e) {}
  }
  async function getJSON(url) {
    const r = await fetch(url, { headers: { Accept: 'application/geo+json, application/json' } });
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return r.json();
  }
  const timeAgo = t => {
    const m = Math.round((Date.now() - t) / 60000);
    return m < 1 ? 'just now' : m + ' min ago';
  };

  /* ---------- Parkway alerts ---------- */
  async function loadAlerts(force) {
    const el = document.getElementById('cond-alerts');
    const cached = !force && cacheGet('blri-alerts');
    let alerts, t;
    try {
      if (cached) { alerts = cached.data; t = cached.t; }
      else {
        const j = await getJSON('https://developer.nps.gov/api/v1/alerts?parkCode=blri&limit=50&api_key=' + NPS_KEY);
        alerts = (j.data || []).map(a => ({ title: a.title, category: a.category, text: a.description, url: a.url, date: a.lastIndexedDate }));
        t = Date.now();
        cacheSet('blri-alerts', alerts);
      }
    } catch (e) {
      el.innerHTML = '<p class="cond-err">Couldn\'t load park alerts right now. Check the <a href="https://www.nps.gov/blri/planyourvisit/conditions.htm" target="_blank" rel="noopener">NPS alerts page</a> instead.</p>';
      return;
    }
    const rank = { 'Park Closure': 0, Danger: 1, Caution: 2, Information: 3 };
    alerts.sort((a, b) => (rank[a.category] ?? 4) - (rank[b.category] ?? 4));
    el.innerHTML = (alerts.length
      ? '<ul class="alert-list">' + alerts.map(a => {
          const cls = a.category === 'Park Closure' ? 'closure' : a.category === 'Danger' ? 'danger' : a.category === 'Caution' ? 'caution' : 'info';
          return '<li class="alert ' + cls + '"><span class="alert-cat">' + esc(a.category || 'Alert') + '</span>' +
            '<strong>' + esc(a.title) + '</strong><p>' + esc(a.text) + '</p>' +
            (a.url ? '<a href="' + esc(a.url) + '" target="_blank" rel="noopener">Details ↗</a>' : '') + '</li>';
        }).join('') + '</ul>'
      : '<p class="cond-ok">No alerts posted for the Blue Ridge Parkway right now.</p>') +
      '<p class="cond-meta">From the National Park Service, updated ' + timeAgo(t) + '. Closures for weather are shown on the <a href="https://www.nps.gov/blri/planyourvisit/roadclosures.htm" target="_blank" rel="noopener">real-time road map</a>.</p>';
  }

  /* ---------- Weather ---------- */
  async function forecastFor(p) {
    const key = 'nws-' + p.lat + ',' + p.lon;
    const cached = cacheGet(key);
    if (cached) return cached;
    let fcUrl;
    try { fcUrl = localStorage.getItem(key + '-url'); } catch (e) {}
    if (!fcUrl) {
      const pt = await getJSON('https://api.weather.gov/points/' + p.lat + ',' + p.lon);
      fcUrl = pt.properties.forecast;
      try { localStorage.setItem(key + '-url', fcUrl); } catch (e) {}
    }
    const f = await getJSON(fcUrl);
    const periods = f.properties.periods.slice(0, 3).map(x => ({ name: x.name, temp: x.temperature, unit: x.temperatureUnit, short: x.shortForecast, wind: x.windSpeed + ' ' + x.windDirection, rain: x.probabilityOfPrecipitation && x.probabilityOfPrecipitation.value }));
    cacheSet(key, periods);
    return { t: Date.now(), data: periods };
  }

  async function loadWeather() {
    const el = document.getElementById('cond-weather');
    el.innerHTML = places.map((p, i) => '<div class="wx" id="wx-' + i + '"><div class="wx-head"><strong>' + p.name + '</strong><span>' + p.note + '</span></div><p class="cond-meta">Loading forecast…</p></div>').join('');
    await Promise.all(places.map(async (p, i) => {
      const box = document.getElementById('wx-' + i);
      try {
        const { data } = await forecastFor(p);
        box.innerHTML = '<div class="wx-head"><strong>' + p.name + '</strong><span>' + p.note + '</span></div>' +
          '<div class="wx-now"><b>' + data[0].temp + '°</b><span>' + esc(data[0].short) + '</span></div>' +
          '<div class="wx-meta">' + esc(data[0].name) + ' · wind ' + esc(data[0].wind) + (data[0].rain ? ' · ' + data[0].rain + '% rain' : '') + '</div>' +
          '<ul class="wx-next">' + data.slice(1).map(d => '<li><span>' + esc(d.name) + '</span><span>' + d.temp + '° · ' + esc(d.short) + '</span></li>').join('') + '</ul>';
        const freezing = data.some(d => d.unit === 'F' && d.temp <= 32);
        if (freezing) box.insertAdjacentHTML('beforeend', '<span class="tag season">At or below freezing</span>');
      } catch (e) {
        box.innerHTML = '<div class="wx-head"><strong>' + p.name + '</strong><span>' + p.note + '</span></div><p class="cond-err">Forecast unavailable. Try <a href="https://forecast.weather.gov/MapClick.php?lat=' + p.lat + '&lon=' + p.lon + '" target="_blank" rel="noopener">weather.gov</a>.</p>';
      }
    }));
  }

  document.getElementById('cond-refresh').addEventListener('click', () => {
    try { Object.keys(localStorage).filter(k => /^(blri-alerts|nws-[^]*\d)$/.test(k) && !k.endsWith('-url')).forEach(k => localStorage.removeItem(k)); } catch (e) {}
    loadAlerts(true);
    loadWeather();
  });

  loadAlerts(false);
  loadWeather();
})();
