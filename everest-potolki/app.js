(() => {
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const D = window.DATA;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));

  /* menu */
  const burger = $('#burger'), nav = $('#nav');
  burger.addEventListener('click', () => {
    const o = nav.classList.toggle('open'); burger.setAttribute('aria-expanded', o);
  });
  nav.addEventListener('click', e => { if (e.target.closest('a')) { nav.classList.remove('open'); burger.setAttribute('aria-expanded', false); } });

  /* services */
  $('#svcGrid').innerHTML = D.services.map(s => `
    <button class="card" type="button" data-svc="${s.id}">
      <span class="card__img"><img src="${s.cover}" alt="${esc(s.title)}" loading="lazy"></span>
      <span class="card__b"><span class="card__t">${esc(s.title)}</span><span class="card__p">${esc(s.lead)}</span>
      <span class="card__price"><span>${esc(s.price)}</span><i>Подробнее</i></span></span>
    </button>`).join('');

  /* dialog */
  const dlg = $('#dlg'); let pics = [], cur = 0, ctx = null;
  const show = i => {
    cur = (i + pics.length) % pics.length;
    $('#dlgImg').src = pics[cur];
    $$('#dlgThumbs button').forEach((b, k) => b.setAttribute('aria-current', k === cur));
    const multi = pics.length > 1;
    $('#dlgPrev').hidden = $('#dlgNext').hidden = !multi; $('#dlgThumbs').hidden = !multi;
  };
  const open = o => {
    ctx = o; pics = o.photos;
    $('#dlgTitle').textContent = o.title;
    $('#dlgPlace').textContent = o.place || '';
    $('#dlgPrice').textContent = o.price || '';
    $('#dlgText').textContent = o.text;
    $('#dlgMore').textContent = o.more || '';
    $('#dlgImg').alt = o.title;
    $('#dlgThumbs').innerHTML = pics.map((p, k) => `<button type="button" aria-label="Фото ${k + 1}"><img src="${p}" alt="" loading="lazy"></button>`).join('');
    show(0); dlg.showModal(); dlg.querySelector('.dlg__info').scrollTop = 0; dlg.querySelector('.dlg__body').scrollTop = 0;
  };
  $('#dlgThumbs').addEventListener('click', e => { const b = e.target.closest('button'); if (b) show([...b.parentNode.children].indexOf(b)); });
  $('#dlgPrev').onclick = () => show(cur - 1); $('#dlgNext').onclick = () => show(cur + 1);
  $('#dlgX').onclick = () => dlg.close();
  dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') show(cur - 1); if (e.key === 'ArrowRight') show(cur + 1); });
  let tx = 0; const gal = $('.dlg__gal');
  gal.addEventListener('touchstart', e => tx = e.touches[0].clientX, {passive: true});
  gal.addEventListener('touchend', e => { const d = e.changedTouches[0].clientX - tx; if (Math.abs(d) > 50) show(cur + (d < 0 ? 1 : -1)); });
  $('#dlgOrder').addEventListener('click', () => { dlg.close(); if (ctx && ctx.what) setWhat(ctx.what); });

  const WHAT = {classic: 'Матовый или сатиновый потолок', shadow: 'Теневой профиль', float: 'Парящий потолок', lines: 'Световые линии', track: 'Магнитные треки', curtain: 'Скрытый карниз или ниша', bath: 'Потолок в ванной', house: 'Загородный дом'};
  const setWhat = v => { const sel = $('#form').elements.what; [...sel.options].forEach(o => { if (o.text === v) sel.value = v; }); };
  document.addEventListener('click', e => {
    const s = e.target.closest('[data-svc]');
    if (s) { const o = D.services.find(x => x.id === s.dataset.svc); open({title: o.title, text: o.lead, more: o.more, price: o.price, photos: o.photos, what: WHAT[o.id]}); }
    const w = e.target.closest('[data-work]');
    if (w) { const o = D.works.find(x => x.id === w.dataset.work); open({title: o.title, text: o.text, place: o.place, photos: o.photos, what: WHAT[o.tags[0]]}); }
  });

  /* works */
  const LABEL = {lines: 'световые линии', shadow: 'теневой профиль', float: 'парящий', track: 'треки', bath: 'ванная', house: 'дом', classic: 'классика'};
  let filter = 'all', shown = 12;
  const renderWorks = () => {
    const list = D.works.filter(w => filter === 'all' || w.tags.includes(filter));
    $('#worksGrid').innerHTML = list.slice(0, shown).map(w => `
      <button class="work" type="button" data-work="${w.id}">
        <img src="${w.cover}" alt="${esc(w.title)}" loading="lazy">
        <span class="work__n">${w.photos.length} фото</span>
        <span class="work__cap"><b>${esc(w.title)}</b><small>${esc(w.place)}, ${w.tags.map(t => LABEL[t]).join(', ')}</small></span>
      </button>`).join('');
    $('#moreBtn').parentNode.hidden = list.length <= shown;
  };
  $('#filters').addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    $$('#filters button').forEach(x => x.setAttribute('aria-pressed', x === b));
    filter = b.dataset.f; shown = 12; renderWorks();
  });
  $('#moreBtn').onclick = () => { shown += 12; renderWorks(); };
  renderWorks();

  /* light scenes room */
  const st = {edge: 'plain', lines: 'none', temp: '3000', spots: true, track: false, lamp: false, curtain: false};
  const NS = 'http://www.w3.org/2000/svg';
  const P = (u, v) => { const L = 230 * v, R = 800 - 230 * v; return [L + u * (R - L), 175 * v]; };
  const pt = a => a.map(n => n.toFixed(1)).join(',');
  const svg = $('#roomSvg');
  const draw = () => {
    const warm = st.temp === '3000', glow = warm ? '#FFD596' : '#EAF3FF', glowSoft = warm ? '255,205,140' : '220,235,255';
    let power = 0.12 + (st.spots ? .3 : 0) + (st.track ? .25 : 0) + (st.lamp ? .28 : 0) + (st.edge === 'float' ? .25 : 0) + (st.lines !== 'none' ? .38 : 0);
    power = Math.min(power, 1);
    const wallTop = warm ? `rgb(${Math.round(70 + 150 * power)},${Math.round(66 + 136 * power)},${Math.round(60 + 118 * power)})` : `rgb(${Math.round(66 + 146 * power)},${Math.round(72 + 152 * power)},${Math.round(80 + 158 * power)})`;
    const ceilC = warm ? `rgb(${Math.round(80 + 165 * power)},${Math.round(76 + 160 * power)},${Math.round(70 + 152 * power)})` : `rgb(${Math.round(78 + 165 * power)},${Math.round(84 + 166 * power)},${Math.round(92 + 163 * power)})`;
    let h = `<defs>
      <linearGradient id="gw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${wallTop}"/><stop offset="1" stop-color="#2a2f35"/></linearGradient>
      <linearGradient id="gwl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3b4249"/><stop offset="1" stop-color="${wallTop}"/></linearGradient>
      <linearGradient id="gwr" x1="1" y1="0" x2="0" y2="0"><stop offset="0" stop-color="#3b4249"/><stop offset="1" stop-color="${wallTop}"/></linearGradient>
      <linearGradient id="gf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a4a3c"/><stop offset="1" stop-color="#2b231c"/></linearGradient>
      <radialGradient id="gc" cx=".5" cy=".55" r=".7"><stop offset="0" stop-color="${ceilC}"/><stop offset="1" stop-color="#3d444b"/></radialGradient>
      <radialGradient id="spot"><stop offset="0" stop-color="#fff"/><stop offset=".25" stop-color="${glow}"/><stop offset="1" stop-color="rgba(${glowSoft},0)"/></radialGradient>
      <linearGradient id="cone" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="rgba(${glowSoft},.55)"/><stop offset="1" stop-color="rgba(${glowSoft},0)"/></linearGradient>
      <linearGradient id="wash" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="rgba(${glowSoft},.75)"/><stop offset="1" stop-color="rgba(${glowSoft},0)"/></linearGradient>
      <filter id="bl" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="6"/></filter>
      <filter id="bl2" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.2"/></filter>
    </defs>`;
    // walls, floor, ceiling
    h += `<polygon points="0,520 800,520 570,395 230,395" fill="url(#gf)"/>`;
    for (let i = 1; i < 9; i++) { const x0 = i * 100, x1 = 230 + (i * 100 / 800) * 340; h += `<line x1="${x0}" y1="520" x2="${x1.toFixed(1)}" y2="395" stroke="rgba(0,0,0,.18)" stroke-width="1"/>`; }
    h += `<polygon points="0,0 230,175 230,395 0,520" fill="url(#gwl)"/><polygon points="800,0 570,175 570,395 800,520" fill="url(#gwr)"/><polygon points="230,175 570,175 570,395 230,395" fill="url(#gw)"/>`;
    // window + night
    h += `<rect x="335" y="212" width="130" height="128" fill="#16283a" stroke="#c9ced3" stroke-width="4"/><line x1="400" y1="212" x2="400" y2="340" stroke="#c9ced3" stroke-width="3"/><circle cx="440" cy="236" r="7" fill="#e9eef5" opacity=".8"/>`;
    // sofa
    h += `<rect x="262" y="350" width="276" height="46" rx="8" fill="#5b6670"/><rect x="262" y="336" width="276" height="22" rx="8" fill="#6c7882"/>`;
    // curtains
    if (st.curtain) {
      const cur = x => { let d = `M${x},178`; for (let k = 0; k <= 6; k++) d += ` Q${x + k * 9 + 4},${200 + (k % 2) * 6} ${x + k * 9 + 9},178`; return `<path d="M${x},178 L${x},392 ${[...Array(7)].map((_, k) => `Q${x + k * 9 + 4.5},${397 + (k % 2 ? -4 : 4)} ${x + k * 9 + 9},392`).join(' ')} L${x + 63},178Z" fill="#cfc3b2" opacity=".95"/>` + [...Array(7)].map((_, k) => `<line x1="${x + k * 9 + 4}" y1="180" x2="${x + k * 9 + 4}" y2="392" stroke="rgba(0,0,0,.12)" stroke-width="2"/>`).join(''); };
      h += cur(275) + cur(462);
    }
    // wall wash for floating ceiling
    if (st.edge === 'float') {
      h += `<polygon points="230,175 570,175 570,250 230,250" fill="url(#wash)"/><polygon points="0,0 230,175 230,245 0,90" fill="url(#wash)" opacity=".8"/><polygon points="800,0 570,175 570,245 800,90" fill="url(#wash)" opacity=".8"/>`;
    }
    // ceiling
    h += `<polygon points="0,0 800,0 570,175 230,175" fill="url(#gc)"/>`;
    if (st.curtain) h += `<polygon points="${pt(P(0, .9))} ${pt(P(1, .9))} 570,175 230,175" fill="#1d2329"/>`;
    // edge
    const E = `M0,0 L230,175 L570,175 L800,0`;
    if (st.edge === 'plain') h += `<path d="${E}" fill="none" stroke="#e9ecee" stroke-width="5"/>`;
    if (st.edge === 'shadow') h += `<path d="${E}" fill="none" stroke="#0e1216" stroke-width="5"/>`;
    if (st.edge === 'float') h += `<path d="${E}" fill="none" stroke="${glow}" stroke-width="10" filter="url(#bl)"/><path d="${E}" fill="none" stroke="${glow}" stroke-width="3.5"/>`;
    // light lines
    const seg = (a, b) => `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}"/>`;
    let L = '';
    if (st.lines === 'straight') L = seg(P(.3, .08), P(.3, .88)) + seg(P(.7, .08), P(.7, .88));
    if (st.lines === 'frame') L = `<polygon points="${pt(P(.2, .15))} ${pt(P(.8, .15))} ${pt(P(.8, .86))} ${pt(P(.2, .86))}"/>`;
    if (st.lines === 'zig') L = seg(P(.22, .12), P(.62, .88)) + seg(P(.58, .14), P(.8, .36)) + seg(P(.2, .55), P(.38, .78)) + seg(P(.7, .62), P(.88, .62));
    if (L) h += `<g fill="none" stroke="${glow}" stroke-width="12" opacity=".7" filter="url(#bl)">${L}</g><g fill="none" stroke="#fff" stroke-width="4">${L}</g>`;
    // track
    if (st.track) {
      const a = P(.7, .1), b = P(.7, .82);
      h += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="#0c0f12" stroke-width="7"/>`;
      [.2, .42, .62, .78].forEach(v => { const p = P(.7, v), s = 1 - v * .55, w = 9 * s, hh = 18 * s;
        h += `<polygon points="${p[0] - w},${p[1] + hh} ${p[0] + w},${p[1] + hh} ${p[0] + 60 * s},${p[1] + 210 * s} ${p[0] - 60 * s},${p[1] + 210 * s}" fill="url(#cone)"/><rect x="${p[0] - w / 2}" y="${p[1]}" width="${w}" height="${hh}" rx="2" fill="#15191d"/>`; });
    }
    // spots
    if (st.spots) [[.25, .3], [.5, .3], [.75, .3], [.25, .72], [.5, .72], [.75, .72]].forEach(([u, v]) => {
      if (st.track && u === .75) return;
      const p = P(u, v), s = 1 - v * .55;
      h += `<ellipse cx="${p[0]}" cy="${p[1]}" rx="${30 * s}" ry="${14 * s}" fill="url(#spot)"/><ellipse cx="${p[0]}" cy="${p[1]}" rx="${7 * s}" ry="${3.4 * s}" fill="#fff"/>`;
    });
    // chandelier
    if (st.lamp) {
      const p = P(.5, .5), y2 = p[1] + 95;
      h += `<line x1="${p[0]}" y1="${p[1]}" x2="${p[0]}" y2="${y2}" stroke="#14181c" stroke-width="2"/><circle cx="${p[0]}" cy="${y2 + 10}" r="70" fill="url(#spot)" opacity=".7"/><path d="M${p[0] - 46},${y2} h92 l-16,22 h-60z" fill="#1a1f24"/><ellipse cx="${p[0]}" cy="${y2 + 22}" rx="30" ry="4" fill="${glow}"/>`;
    }
    svg.innerHTML = h;

    // caption + bill
    const edgeT = {plain: 'обычный профиль', shadow: 'теневой профиль EuroKRAAB', float: 'парящий профиль с подсветкой'}[st.edge];
    const linesT = {none: '', straight: 'две прямые световые линии', frame: 'световой контур', zig: 'световые линии под углом'}[st.lines];
    const items = ['Матовое полотно', edgeT[0].toUpperCase() + edgeT.slice(1)];
    if (linesT) items.push(linesT[0].toUpperCase() + linesT.slice(1));
    if (st.spots) items.push('Точечные светильники с закладными');
    if (st.track) items.push('Встроенный магнитный трек со светильниками');
    if (st.lamp) items.push('Закладная и установка люстры');
    if (st.curtain) items.push('Ниша со скрытым карнизом для штор');
    items.push(st.temp === '3000' ? 'Свет 3000K, тёплый' : 'Свет 4000K, нейтральный');
    $('#bill').innerHTML = items.map(i => `<li>${esc(i)}</li>`).join('');
    $('#roomCap').textContent = items.slice(0, -1).join(', ').toLowerCase().replace(/^./, c => c.toUpperCase()).replace('eurokraab', 'EuroKRAAB');
    st.items = items;
  };
  $$('.seg').forEach(g => g.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    g.querySelectorAll('button').forEach(x => x.setAttribute('aria-pressed', x === b));
    st[g.dataset.key] = b.dataset.v; draw();
  }));
  $$('.tg input').forEach(i => i.addEventListener('change', () => { st[i.dataset.key] = i.checked; draw(); }));
  draw();
  $('#sceneSend').addEventListener('click', () => {
    const f = $('#form').elements;
    f.comment.value = 'Хочу так: ' + st.items.join(', ').toLowerCase().replace('eurokraab', 'EuroKRAAB');
    setWhat(st.lines !== 'none' ? 'Световые линии' : st.edge === 'float' ? 'Парящий потолок' : st.edge === 'shadow' ? 'Теневой профиль' : st.track ? 'Магнитные треки' : 'Матовый или сатиновый потолок');
  });

  /* sticky mobile button */
  const fab = $('.fab'), order = $('#order');
  new IntersectionObserver(([e]) => fab.classList.toggle('hide', e.isIntersecting)).observe(order);

  /* phone mask */
  const ph = $('#form').elements.phone;
  ph.addEventListener('input', () => {
    let d = ph.value.replace(/\D/g, ''); if (!d) { ph.value = ''; return; }
    if (d[0] === '8') d = '7' + d.slice(1); if (d[0] !== '7') d = '7' + d; d = d.slice(0, 11);
    const m = d.match(/^7(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
    ph.value = '+7' + (m[1] ? ' ' + m[1] : '') + (m[2] ? ' ' + m[2] : '') + (m[3] ? '-' + m[3] : '') + (m[4] ? '-' + m[4] : '');
  });

  /* lead form (demo script, mockup) */
  const LEAD_URL = 'https://script.google.com/macros/s/AKfycby3_mdaCfx-Kv0MWD1RiwXnmTO47GtAS9zrH0WZsPcyeEGYHIRrXQjAU_EtMCfIypOW/exec';
  const form = $('#form'), err = $('#err'), btn = $('#submit');
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const f = form.elements;
    if (f.name.value.trim().length < 2) return err.textContent = 'Укажите имя';
    if (f.phone.value.replace(/\D/g, '').length !== 11) return err.textContent = 'Проверьте номер телефона';
    if (!f.consent.checked) return err.textContent = 'Отметьте согласие на обработку данных';
    err.textContent = ''; $('#fallback').hidden = true;
    const details = ['Макет everest-potolki', `Что: ${f.what.value}`, f.where.value.trim() && `Где: ${f.where.value.trim()}`, `Связь: ${f.via.value}`].filter(Boolean).join(', ');
    btn.disabled = true; btn.textContent = 'Отправляем...';
    let ok = false;
    try {
      const res = await fetch(LEAD_URL, {method: 'POST', headers: {'Content-Type': 'text/plain;charset=utf-8'}, signal: AbortSignal.timeout(20000),
        body: JSON.stringify({site: location.hostname, name: f.name.value.trim(), phone: f.phone.value, details, comment: f.comment.value.trim(), website: f.website.value})});
      ok = (await res.json()).ok === true;
    } catch (x) {}
    btn.disabled = false; btn.textContent = 'Отправить заявку';
    if (ok) { btn.hidden = true; $('#sent').hidden = false; } else $('#fallback').hidden = false;
  });
})();
