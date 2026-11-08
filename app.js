(function () {
  /* ---------- Masthead ridges ---------- */
  const ridgeSvg = document.getElementById('ridges');
  const layers = 5;
  let ridgeMarkup = '';
  for (let L = 0; L < layers; L++) {
    const base = 120 + L * 38;
    const amp = 46 - L * 5;
    const seed = L * 1.7 + 0.3;
    let d = 'M0 300 L0 ' + base;
    for (let x = 0; x <= 1200; x += 12) {
      const y = base
        - amp * Math.sin(x / 210 + seed) * 0.6
        - amp * Math.sin(x / 97 + seed * 2.3) * 0.3
        - amp * Math.sin(x / 41 + seed * 4.1) * 0.1;
      d += ' L' + x + ' ' + y.toFixed(1);
    }
    d += ' L1200 300 Z';
    ridgeMarkup += '<path d="' + d + '" fill="var(--ridge-' + (L + 1) + ')"/>';
  }
  ridgeSvg.innerHTML = ridgeMarkup;

  /* ---------- Helpers ---------- */
  const gmaps = q => 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(q);

  /* ---------- Map ---------- */
  const LON0 = -83.4, LAT1 = 37.6, K = 0.819, S = 150;
  const P = (lat, lon) => [((lon - LON0) * K * S), ((LAT1 - lat) * S)];
  const path = pts => pts.map((p, i) => (i ? 'L' : 'M') + P(p[0], p[1]).map(v => v.toFixed(1)).join(' ')).join(' ');

  const coast = [[31.8,-81.1],[32.03,-80.88],[32.25,-80.6],[32.5,-80.35],[32.65,-80.05],[32.77,-79.88],[32.95,-79.6],[33.15,-79.3],[33.45,-79.08],[33.7,-78.85],[33.86,-78.55],[34.05,-78.1]];
  const ocean = coast.concat([[34.05,-78.0],[31.8,-78.0]]);
  const scGa = [[34.98,-83.11],[34.6,-82.85],[34.1,-82.6],[33.6,-82.1],[33.3,-81.85],[32.9,-81.5],[32.5,-81.2],[32.03,-80.88]];
  const scNc = [[34.98,-83.11],[35.21,-82.75],[35.19,-82.3],[35.15,-81.8],[35.17,-81.04],[34.82,-80.8],[34.82,-80.56],[34.4,-79.6],[33.86,-78.55]];
  const ncTn = [[35.0,-84.3],[35.2,-84.0],[35.47,-83.5],[35.56,-83.1],[35.78,-82.9],[35.95,-82.6],[36.1,-82.2],[36.3,-81.95],[36.59,-81.68]];
  const vaNc = [[36.59,-81.68],[36.55,-80.5],[36.54,-79.0],[36.55,-77.9]];
  const vaTn = [[36.59,-81.68],[36.6,-83.7]];
  const ridge = [[34.85,-83.5],[35.1,-82.8],[35.25,-82.4],[35.6,-82.25],[35.85,-81.95],[36.1,-81.6],[36.35,-81.2],[36.6,-80.6],[36.85,-80.25],[37.2,-79.95],[37.7,-79.4]];

  const hwRoute = [[32.776,-79.931],[32.95,-80.08],[33.2,-80.45],[33.55,-80.75],[33.8,-80.95],[34.0,-81.035],[34.27,-81.62],[34.47,-81.88],[34.65,-82.13],[34.852,-82.394],[35.0,-82.42],[35.18,-82.45],[35.32,-82.46],[35.45,-82.53],[35.595,-82.551]];
  const brpRoute = [[35.595,-82.551],[35.62,-82.47],[35.699,-82.380],[35.73,-82.31],[35.765,-82.265],[35.80,-82.17],[35.849,-82.087],[35.90,-82.00],[35.955,-81.927],[36.02,-81.86],[36.087,-81.808],[36.12,-81.73],[36.135,-81.678],[36.22,-81.55],[36.30,-81.38],[36.430,-81.180],[36.52,-80.95],[36.58,-80.73],[36.65,-80.55],[36.749,-80.405],[36.818,-80.346],[36.93,-80.20],[37.08,-80.05],[37.20,-79.98],[37.271,-79.941]];

  const refCities = [
    { name: 'Columbia', lat: 34.0, lon: -81.035 },
    { name: 'Charlotte', lat: 35.227, lon: -80.843 },
    { name: 'Winston-Salem', lat: 36.10, lon: -80.24 },
    { name: 'Knoxville', lat: 35.96, lon: -83.92 }
  ];
  const stateLabels = [
    { t: 'SOUTH CAROLINA', lat: 33.25, lon: -81.75 },
    { t: 'NORTH CAROLINA', lat: 35.75, lon: -80.25 },
    { t: 'VIRGINIA', lat: 37.3, lon: -80.95 },
    { t: 'TENNESSEE', lat: 36.25, lon: -82.95 },
    { t: 'GEORGIA', lat: 33.4, lon: -82.95 }
  ];

  const mapSvg = document.getElementById('map');
  let m = '';
  m += '<rect x="0" y="0" width="577" height="780" fill="var(--land)"/>';
  m += '<path d="' + path(ocean) + ' Z" fill="var(--water)"/>';
  m += '<path d="' + path(coast) + '" fill="none" stroke="var(--border)" stroke-width="1"/>';
  m += '<path d="' + path(ridge) + '" fill="none" stroke="var(--ridge-2)" stroke-opacity=".55" stroke-width="58" stroke-linecap="round" stroke-linejoin="round"/>';
  m += '<path d="' + path(ridge) + '" fill="none" stroke="var(--ridge-3)" stroke-opacity=".45" stroke-width="22" stroke-linecap="round" stroke-linejoin="round"/>';
  // little peaks along the ridge
  for (let i = 0; i < ridge.length - 1; i++) {
    for (let t = 0.15; t < 1; t += 0.42) {
      const lat = ridge[i][0] + (ridge[i + 1][0] - ridge[i][0]) * t;
      const lon = ridge[i][1] + (ridge[i + 1][1] - ridge[i][1]) * t;
      const [x, y] = P(lat, lon);
      const ox = ((i * 7 + t * 13) % 3 - 1) * 12;
      m += '<path d="M' + (x + ox - 6).toFixed(1) + ' ' + (y + 18).toFixed(1) + ' l6 -9 l6 9 z" fill="var(--ridge-4)" opacity=".7"/>';
    }
  }
  [scGa, scNc, ncTn, vaNc, vaTn].forEach(b => {
    m += '<path d="' + path(b) + '" fill="none" stroke="var(--border)" stroke-width="1.2" stroke-dasharray="5 4"/>';
  });
  stateLabels.forEach(s => {
    const [x, y] = P(s.lat, s.lon);
    m += '<text x="' + x.toFixed(1) + '" y="' + y.toFixed(1) + '" text-anchor="middle" font-family="var(--mono)" font-size="11" letter-spacing="2.5" fill="var(--muted)" opacity=".85">' + s.t + '</text>';
  });
  const [ox, oy] = P(32.7, -78.95);
  m += '<text x="' + ox + '" y="' + oy + '" text-anchor="middle" font-family="var(--body)" font-style="italic" font-size="13" fill="var(--muted)">Atlantic</text>';
  const [bx, by] = P(36.45, -81.9);
  m += '<text x="' + bx + '" y="' + by + '" text-anchor="middle" transform="rotate(-38 ' + bx + ' ' + by + ')" font-family="var(--display)" font-size="15" font-weight="700" letter-spacing="3" fill="var(--ridge-5)" opacity=".8">BLUE RIDGE</text>';
  refCities.forEach(c => {
    const [x, y] = P(c.lat, c.lon);
    if (x < 0) return;
    m += '<circle cx="' + x + '" cy="' + y + '" r="2.5" fill="var(--muted)"/>';
    m += '<text x="' + (x + 6) + '" y="' + (y + 4) + '" font-family="var(--body)" font-size="12" fill="var(--muted)">' + c.name + '</text>';
  });
  m += '<path d="' + path(hwRoute) + '" fill="none" stroke="var(--surface)" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>';
  m += '<path d="' + path(hwRoute) + '" fill="none" stroke="var(--muted)" stroke-width="3" stroke-dasharray="7 5" stroke-linecap="round" stroke-linejoin="round"/>';
  m += '<path d="' + path(brpRoute) + '" fill="none" stroke="var(--surface)" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>';
  m += '<path d="' + path(brpRoute) + '" fill="none" stroke="var(--accent)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>';

  const labelSide = { chs: 'r', gvl: 'l', avl: 'l', crg: 'r', mit: 'r', lin: 'r', lcv: 'l', blr: 'r', dgh: 'r', mab: 'l', rkn: 'r', roa: 'r' };
  stops.forEach(s => {
    const [x, y] = P(s.lat, s.lon);
    const big = ['chs', 'avl', 'blr', 'roa'].includes(s.id);
    const side = labelSide[s.id];
    const tx = side === 'r' ? x + 12 : x - 12;
    const anchor = side === 'r' ? 'start' : 'end';
    m += '<g class="stop-dot" data-id="' + s.id + '" tabindex="0" role="button" aria-label="' + s.name + '">' +
      '<circle class="hit" cx="' + x + '" cy="' + y + '" r="16"/>' +
      '<circle class="pt" cx="' + x + '" cy="' + y + '" r="' + (big ? 6.5 : 5) + '" fill="' + (big ? 'var(--ink)' : 'var(--surface)') + '" stroke="' + (s.day === 1 && s.id !== 'avl' ? 'var(--muted)' : 'var(--accent-ink)') + '" stroke-width="2.5"/>' +
      '<text x="' + tx + '" y="' + (y + 4) + '" text-anchor="' + anchor + '" font-family="var(--display)" font-size="' + (big ? 17 : 14) + '" font-weight="' + (big ? 800 : 700) + '" fill="var(--ink)" paint-order="stroke" stroke="var(--land)" stroke-width="4" stroke-linejoin="round">' + s.name + '</text>' +
      '</g>';
  });
  // compass + scale
  const sc = 50 / 69 * S * K; // 50 miles at ~35°N
  m += '<g transform="translate(20 744)"><line x1="0" y1="0" x2="' + sc.toFixed(1) + '" y2="0" stroke="var(--ink)" stroke-width="2"/><line x1="0" y1="-4" x2="0" y2="4" stroke="var(--ink)" stroke-width="2"/><line x1="' + sc.toFixed(1) + '" y1="-4" x2="' + sc.toFixed(1) + '" y2="4" stroke="var(--ink)" stroke-width="2"/><text x="0" y="18" font-family="var(--mono)" font-size="11" fill="var(--ink)">50 mi</text></g>';
  m += '<g transform="translate(545 40)"><path d="M0 -16 L6 6 L0 2 L-6 6 Z" fill="var(--ink)"/><text x="0" y="22" text-anchor="middle" font-family="var(--mono)" font-size="11" font-weight="600" fill="var(--ink)">N</text></g>';
  mapSvg.innerHTML = m;

  const mpBadge = mp => (typeof mp === 'number')
    ? '<span class="mp" title="Blue Ridge Parkway milepost">MP ' + mp + '</span>'
    : (mp ? '<span class="mp off" title="Nearest highway">' + mp + '</span>' : '');

  const detail = document.getElementById('detail');
  let selIdx = 2;
  function select(id, focusMap) {
    selIdx = stops.findIndex(s => s.id === id);
    const s = stops[selIdx];
    mapSvg.querySelectorAll('.stop-dot').forEach(g => g.classList.toggle('sel', g.dataset.id === id));
    detail.innerHTML =
      '<div class="row"><span class="day-chip">Day ' + s.day + '</span>' + (s.mp ? mpBadge(s.mp) : '<span class="mp off">Off parkway</span>') + '</div>' +
      '<h3>' + s.name + ', ' + s.state + '</h3><p>' + s.note + '</p>' +
      '<div class="nav-btns"><button class="ghost" id="prev"' + (selIdx === 0 ? ' disabled' : '') + '>← Previous stop</button><button class="ghost" id="next"' + (selIdx === stops.length - 1 ? ' disabled' : '') + '>Next stop →</button></div>';
    document.getElementById('prev').onclick = () => selIdx > 0 && select(stops[selIdx - 1].id);
    document.getElementById('next').onclick = () => selIdx < stops.length - 1 && select(stops[selIdx + 1].id);
  }
  mapSvg.addEventListener('click', e => { const g = e.target.closest('.stop-dot'); if (g) select(g.dataset.id); });
  mapSvg.addEventListener('keydown', e => { const g = e.target.closest('.stop-dot'); if (g && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); select(g.dataset.id); } });

  const byId = Object.fromEntries(stops.map(s => [s.id, s]));
  document.getElementById('days').innerHTML = days.map(d =>
    '<div class="day"><div class="num">Day<b>' + d.n + '</b></div><div><h3>' + d.title + '</h3><div class="meta">' + d.meta + '</div><p>' + d.text + '</p><ul>' +
    d.stops.map(id => '<li><button data-id="' + id + '">' + byId[id].name + '</button></li>').join('') + '</ul></div></div>'
  ).join('');
  document.getElementById('days').addEventListener('click', e => { const b = e.target.closest('button[data-id]'); if (b) { select(b.dataset.id); detail.scrollIntoView({ block: 'nearest', behavior: 'smooth' }); } });
  select('avl');

  /* ---------- Cars ---------- */
  const money = n => '$' + Math.round(n).toLocaleString('en-US');
  document.getElementById('car-rows').innerHTML = cars.map(c =>
    '<tr' + (c[5] ? ' class="pick"' : '') + '><td><strong>' + c[0] + '</strong></td><td>' + c[1] + '</td><td>' + c[2] + (c[5] ? ' <span class="tag season">Midsize</span>' : '') + '</td>' +
    '<td class="r"><strong>' + money(c[3]) + '</strong></td><td class="small">' + c[4] + '</td></tr>'
  ).join('');

  const quoteSel = document.getElementById('c-quote');
  quoteSel.innerHTML = cars.map((c, i) => '<option value="' + i + '">' + money(c[3]) + ' · ' + c[0] + ' ' + c[1] + (c[5] ? ' (midsize)' : '') + '</option>').join('');
  quoteSel.value = '0';
  const ids = ['miles', 'mpg', 'gas'];
  function calc() {
    const v = Object.fromEntries(ids.map(k => [k, parseFloat(document.getElementById('c-' + k).value) || 0]));
    const q = cars[+quoteSel.value] || cars[0];
    const gallons = v.mpg > 0 ? v.miles / v.mpg : 0;
    const gas = gallons * v.gas;
    document.getElementById('calc-out').innerHTML =
      '<div><span>' + q[0] + ' ' + q[1] + ', 4 days</span><span>' + money(q[3]) + '</span></div>' +
      '<div><span>Gas (' + gallons.toFixed(1) + ' gal)</span><span>' + money(gas) + '</span></div>' +
      '<div class="total"><span>Total</span><span>' + money(q[3] + gas) + '</span></div>';
  }
  ids.forEach(k => document.getElementById('c-' + k).addEventListener('input', calc));
  quoteSel.addEventListener('change', calc);
  calc();

  /* ---------- Hotels ---------- */
  const priceStr = n => '<span>' + '$'.repeat(n) + '</span><span class="dim">' + '$'.repeat(4 - n) + '</span>';
  document.getElementById('hotel-list').innerHTML = hotels.map(g =>
    '<section class="stay"><div class="stay-head"><h3>' + g.where + '</h3><span class="when">' + g.when + '</span></div><div class="cards">' +
    g.list.map(h =>
      '<article class="card"><div class="top"><h4>' + h.name + '</h4><span class="price" aria-label="Price level ' + h.price + ' of 4">' + priceStr(h.price) + '</span></div>' +
      '<p>' + h.text + '</p><div class="tags">' + h.tags.map(t => '<span class="tag">' + t + '</span>').join('') +
      (h.season ? '<span class="tag season">' + h.season + '</span>' : '') + '</div>' +
      '<a class="link" href="' + gmaps(h.q) + '" target="_blank" rel="noopener">View on map ↗</a></article>'
    ).join('') + '</div></section>'
  ).join('');

  /* ---------- Things ---------- */
  let filter = 'all';
  const filtersEl = document.getElementById('filters');
  const fOpts = [['all', 'Everything']].concat(Object.entries(typeNames));
  filtersEl.innerHTML = fOpts.map(([k, l]) => '<button data-f="' + k + '" aria-pressed="' + (k === 'all') + '">' + l + '</button>').join('');
  filtersEl.addEventListener('click', e => {
    const b = e.target.closest('button[data-f]'); if (!b) return;
    filter = b.dataset.f;
    filtersEl.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b));
    renderThings();
  });
  const dayTitles = { 1: 'Day 1 · Charleston to Asheville', 2: 'Day 2 · Asheville to Blowing Rock', 3: 'Day 3 · Blowing Rock to Roanoke' };
  function renderThings() {
    let out = '', lastDay = 0;
    things.filter(t => filter === 'all' || t.type === filter).forEach(t => {
      if (t.day !== lastDay) { out += '<li class="day-divider" aria-hidden="false"><span>' + dayTitles[t.day] + '</span></li>'; lastDay = t.day; }
      out += '<li class="thing"><div class="pin">' + mpBadge(t.mp) + '</div><div class="body">' +
        '<div class="top"><h4>' + t.name + '</h4><span class="type ' + t.type + '">' + typeNames[t.type] + '</span></div>' +
        '<div class="where">' + t.where + '</div><p>' + t.text + '</p>' +
        '<div class="foot"><span><strong>Time:</strong> ' + t.time + '</span>' +
        (t.season ? '<span class="tag season">' + t.season + '</span>' : '') +
        '<a href="' + gmaps(t.q) + '" target="_blank" rel="noopener">Map ↗</a></div></div></li>';
    });
    document.getElementById('things-list').innerHTML = out;
  }
  renderThings();

  /* ---------- Routing ---------- */
  const views = ['map', 'cars', 'hotels', 'things'];
  function route() {
    const h = location.hash.replace('#', '');
    const v = views.includes(h) ? h : 'map';
    views.forEach(n => { document.getElementById('view-' + n).hidden = n !== v; });
    document.querySelectorAll('nav.tabs a').forEach(a => {
      if (a.dataset.view === v) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
    });
  }
  window.addEventListener('hashchange', () => { route(); const nav = document.querySelector('nav.tabs'); if (nav.getBoundingClientRect().top < 0 || window.scrollY > nav.offsetTop) window.scrollTo({ top: nav.offsetTop }); });
  route();
})();
