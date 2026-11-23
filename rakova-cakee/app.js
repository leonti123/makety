(() => {
  const $ = s => document.querySelector(s), $$ = s => [...document.querySelectorAll(s)];
  const D = window.RC;
  const esc = s => String(s).replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));
  const fmt = n => n.toLocaleString('ru-RU').replace(/ /g, ' ');

  /* burger */
  const top = $('.top'), bur = $('.burger');
  bur.addEventListener('click', () => { const o = top.classList.toggle('open'); bur.setAttribute('aria-expanded', o); });
  $$('.nav a').forEach(a => a.addEventListener('click', () => { top.classList.remove('open'); bur.setAttribute('aria-expanded', false); }));

  /* catalog */
  const grid = $('#grid');
  grid.innerHTML = D.items.map(it => `<button class="card" data-id="${it.id}" data-cat="${it.cat}">
    <span class="card-ph"><img src="${it.photos[0]}" alt="${esc(it.name)}" loading="lazy" width="600" height="750">${it.photos.length > 1 ? `<span class="card-n">${it.photos.length} фото</span>` : ''}</span>
    <span class="card-tx"><b>${esc(it.name)}</b><span class="card-note">${esc(it.note)}</span><span class="card-p">${esc(it.price)}</span></span></button>`).join('');
  $$('.catalog .tab').forEach(t => t.addEventListener('click', () => {
    $$('.catalog .tab').forEach(x => x.classList.toggle('on', x === t));
    $$('#grid .card').forEach(c => c.hidden = t.dataset.cat !== 'all' && c.dataset.cat !== t.dataset.cat);
  }));

  /* dialog */
  const dlg = $('#dlg');
  let cur = null;
  const show = (it, i) => {
    $('#dImg').src = it.photos[i]; $('#dImg').alt = it.name;
    $$('#dThumbs button').forEach((b, k) => b.classList.toggle('on', k === i));
  };
  grid.addEventListener('click', e => {
    const c = e.target.closest('.card'); if (!c) return;
    const it = D.items.find(x => x.id === c.dataset.id); cur = it;
    $('#dTitle').textContent = it.name; $('#dPrice').textContent = it.price; $('#dNote').textContent = it.note; $('#dDesc').textContent = it.desc;
    $('#dThumbs').innerHTML = it.photos.length > 1 ? it.photos.map((p, k) => `<button aria-label="Фото ${k + 1}"><img src="${p}" alt=""></button>`).join('') : '';
    $$('#dThumbs button').forEach((b, k) => b.addEventListener('click', () => show(it, k)));
    const tab = $('#dTab'); tab.innerHTML = it.tiers ? it.tiers.map(r => `<tr><td>${r[0]}</td><td>${r[1]}</td></tr>`).join('') : ''; tab.hidden = !it.tiers;
    show(it, 0); dlg.showModal();
  });
  $('#dX').addEventListener('click', () => dlg.close());
  dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });
  $('#dOrder').addEventListener('click', () => {
    dlg.close();
    const w = {wed: 'Свадебный торт', kids: 'Детский торт', fest: 'Торт на день рождения или юбилей'}[cur.cat] || 'Десерты или кенди-бар';
    $('#fWhat').value = w; $('#fCom').value = cur.name + (($('#fCom').value) ? '. ' + $('#fCom').value : '');
  });

  /* tier builder */
  const svg = $('#cake'), NS = 'http://www.w3.org/2000/svg';
  const st = {guests: 40, rate: 3600, kind: 'wed', kindName: 'Свадьба', c: '#FFFDF8', p: '#E2C49C', decor: 'Кремовый декор', dp: 3000};
  const tiersFor = kg => kg < 5 ? 1 : kg <= 8 ? 2 : kg <= 14 ? 3 : kg <= 20 ? 4 : kg <= 35 ? 5 : kg <= 45 ? 6 : 7;
  const word = n => n === 1 ? 'ярус' : n < 5 ? 'яруса' : 'ярусов';
  function draw(n) {
    const base = 345, maxH = 285, h = n === 1 ? 120 : Math.min(100, maxH / n), wB = n === 1 ? 220 : Math.min(310, 236 + n * 12), wT = n === 1 ? 220 : 104;
    const dark = st.c === '#B8193F';
    let s = `<circle cx="180" cy="200" r="168" fill="#FBE3E8"/><circle cx="180" cy="200" r="150" fill="none" stroke="#F3C1CD" stroke-width="2" stroke-dasharray="2 9" stroke-linecap="round"/><ellipse cx="180" cy="${base + 14}" rx="150" ry="13" fill="#E9D9C2"/><rect x="160" y="${base + 14}" width="40" height="14" fill="#D9C4A6"/><ellipse cx="180" cy="${base + 30}" rx="60" ry="7" fill="#D9C4A6"/>
      <ellipse cx="180" cy="${base + 6}" rx="${wB / 2 + 22}" ry="12" fill="#F4E9D8"/>`;
    let y = base, topW = wT;
    for (let i = 0; i < n; i++) {
      const w = n === 1 ? wB : wB - i * (wB - wT) / (n - 1), x = 180 - w / 2; y -= h; topW = w;
      const nb = Math.max(6, Math.round(w / 13)), bead = Array.from({length: nb}, (_, k) => `<circle cx="${x + 6 + k * (w - 12) / (nb - 1)}" cy="${y + h - 1}" r="4.2" fill="${st.p}"/>`).join('');
      const sw = Math.max(3, Math.round(w / 46)), sl = w / sw;
      let swag = `M${x} ${y + 12}`; for (let k = 0; k < sw; k++) swag += ` Q${x + sl * k + sl / 2} ${y + 12 + h * .38} ${x + sl * (k + 1)} ${y + 12}`;
      const pearls = Array.from({length: sw + 1}, (_, k) => `<circle cx="${x + sl * k}" cy="${y + 12}" r="3.2" fill="${dark ? '#F7D97A' : '#fff'}" stroke="${st.p}"/>`).join('');
      s += `<g class="tier"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="5" fill="${st.c}" stroke="${st.p}" stroke-width="1.2"/>
        <rect x="${x}" y="${y}" width="${w * .18}" height="${h}" rx="5" fill="#fff" opacity="${dark ? .12 : .35}"/>
        <ellipse cx="180" cy="${y}" rx="${w / 2}" ry="7" fill="${st.c}" stroke="${st.p}" stroke-width="1.2"/>
        <path d="${swag}" fill="none" stroke="${st.p}" stroke-width="3.2" stroke-linecap="round"/>${pearls}${bead}</g>`;
    }
    s += topDecor(180, y, topW);
    svg.innerHTML = s;
  }
  function topDecor(cx, y, w) {
    const d = st.decor;
    if (d === 'Ягоды') return Array.from({length: 9}, (_, k) => `<circle cx="${cx - w / 2 + 14 + (k % 5) * (w - 28) / 4 + (k > 4 ? (w - 28) / 8 : 0)}" cy="${y - 6 - (k > 4 ? 9 : 0)}" r="8" fill="${k % 3 ? '#C8102E' : '#3B3B7A'}"/>`).join('');
    if (d === 'Рисовые паруса') return `<path d="M${cx - 30} ${y} L${cx - 6} ${y - 70} L${cx + 4} ${y}Z" fill="#fff" stroke="#E2C9A6" opacity=".95"/><path d="M${cx - 4} ${y} L${cx + 26} ${y - 52} L${cx + 34} ${y}Z" fill="#F8D6DE" stroke="#E2B6C2"/><path d="M${cx - 48} ${y} L${cx - 34} ${y - 40} L${cx - 20} ${y}Z" fill="#FDF1C9" stroke="#E6C565"/>`;
    if (d === 'Вафельная бумага') return [[-28, -30, -25], [0, -46, 0], [26, -28, 25], [-10, -20, -60], [14, -18, 60]].map(([dx, dy, r]) => `<ellipse cx="${cx + dx}" cy="${y + dy / 1.4}" rx="12" ry="28" transform="rotate(${r} ${cx + dx} ${y + dy / 1.4})" fill="#fff" stroke="#E7D3C0" opacity=".95"/>`).join('');
    if (d === 'Сахарные цветы') return [[-24, -12, '#9E1638'], [8, -20, '#E0457B'], [30, -8, '#9E1638'], [-4, -4, '#F7D97A']].map(([dx, dy, c]) => `<g transform="translate(${cx + dx} ${y + dy})">${[0, 72, 144, 216, 288].map(a => `<ellipse rx="7" ry="12" transform="rotate(${a}) translate(0 -8)" fill="${c}"/>`).join('')}<circle r="5" fill="#F7D97A"/></g>`).join('') + `<path d="M${cx - 44} ${y - 2} q10 -16 22 -6" stroke="#4E7A3C" stroke-width="3" fill="none"/>`;
    return Array.from({length: 5}, (_, k) => `<g transform="translate(${cx - 36 + k * 18} ${y - 6})"><path d="M-8 4 Q0 -14 8 4Z" fill="#fff" stroke="${st.p}" stroke-width="1.5"/><circle cy="-8" r="3" fill="${st.p}"/></g>`).join('');
  }
  function calc() {
    const kg = Math.max(2, Math.ceil(st.guests * .15 * 2) / 2), n = tiersFor(kg), cake = Math.round(kg * st.rate);
    $('#gOut').textContent = st.guests;
    $('#rKg').textContent = String(kg).replace('.', ',') + ' кг';
    $('#rTier').textContent = n + ' ' + word(n);
    $('#rCake').textContent = fmt(cake) + ' ₽';
    $('#rDec').textContent = st.dp ? (st.decor === 'Ягоды' ? '1 000 ₽ + ягоды' : (st.decor === 'Вафельная бумага' ? 'от ' : '≈ ') + fmt(st.dp) + ' ₽') : 'по эскизу';
    $('#rSum').textContent = (st.dp ? '' : 'от ') + fmt(cake + st.dp) + ' ₽';
    draw(n);
    return {kg, n, sum: cake + st.dp};
  }
  $('#guests').addEventListener('input', e => { st.guests = +e.target.value; calc(); });
  $$('#kind button').forEach(b => b.addEventListener('click', () => { $$('#kind button').forEach(x => x.classList.toggle('on', x === b)); st.rate = +b.dataset.rate; st.kind = b.dataset.v; st.kindName = b.textContent; calc(); }));
  $$('#tone button').forEach(b => b.addEventListener('click', () => { $$('#tone button').forEach(x => x.classList.toggle('on', x === b)); st.c = b.dataset.c; st.p = b.dataset.p; st.tone = b.getAttribute('aria-label'); calc(); }));
  $$('#decor button').forEach(b => b.addEventListener('click', () => { $$('#decor button').forEach(x => x.classList.toggle('on', x === b)); st.decor = b.dataset.v; st.dp = +b.dataset.p; calc(); }));
  calc();
  $('#toOrder').addEventListener('click', () => {
    const r = calc();
    $('#fWhat').value = st.kind === 'wed' ? 'Свадебный торт' : st.kind === 'kids' ? 'Детский торт' : 'Торт на день рождения или юбилей';
    $('#fCom').value = `Расчёт с сайта: ${st.guests} гостей, ${String(r.kg).replace('.', ',')} кг, ${r.n} ${word(r.n)}, цвет ${(st.tone || 'Белый').toLowerCase()}, ${st.decor.toLowerCase()}, примерно ${fmt(r.sum)} ₽`;
  });
  $$('[data-what]').forEach(a => a.addEventListener('click', () => { $('#fWhat').value = a.dataset.what; }));

  /* fillings */
  $('#fgrid').innerHTML = D.fill.map(f => `<div class="fc"><img src="${f.img}" alt="Начинка ${esc(f.n)} в разрезе" loading="lazy" width="560" height="560"><div><b>${esc(f.n)}</b><span>${esc(f.d)}</span></div></div>`).join('');

  /* gallery */
  const gg = $('#ggrid'), more = $('#gmore');
  let gcat = 'all', limit = 12;
  const renderG = () => {
    const list = D.gal.filter(g => gcat === 'all' || g.c === gcat);
    gg.innerHTML = list.slice(0, limit).map(g => `<a href="${g.img}" target="_blank" rel="noopener"><img src="${g.img}" alt="Торт Юлии Раковой" loading="lazy" width="600" height="750"></a>`).join('');
    more.hidden = list.length <= limit;
  };
  $$('#gtabs .tab').forEach(t => t.addEventListener('click', () => { $$('#gtabs .tab').forEach(x => x.classList.toggle('on', x === t)); gcat = t.dataset.c; limit = 12; renderG(); }));
  more.addEventListener('click', () => { limit += 12; renderG(); });
  renderG();

  /* reviews */
  const R = [
    ['Эльвира Горбунова', '18 декабря 2024', 'Наше агентство часто заказывает у Юли свадебные торты, всегда всё вкусно и здорово, что Юля берётся за любой дизайн, воплотит любые задумки. Пробовала лично все начинки тортов, макарунсы, конфеты, мне впервые в жизни понравились шоколадные торты. В общем, торты Юли это любовь'],
    ['Татьяна Усанова', '17 декабря 2024', 'Заказывала у Юлии тортик на свадьбу, вкуснее торта я не ела. Он был очень красивым и безумно вкусным, некоторые гости даже спустя 2 месяца после свадьбы вспоминают и нахваливают торт. Однозначно рекомендую!'],
    ['Виктория Тишевская', '17 декабря 2024', 'С каждым годом любовь растёт к нежнейшим тортам Юлии. Это божественно. Если вы не знаете, какой корж, какую начинку выбрать, у Юлии можно приобрести дегустационные порции. Очень удобно подобрать тот самый торт для любого мероприятия.'],
    ['Лена Ельникова', '17 декабря 2024', 'Юля мастер своего дела, сколько разных дизайнов тортов, капкейков, пирожных было исполнено для меня, моих невест, и всегда всё очень вкусно. Все всегда в восторге. Желаю процветания, творческих и вкусовых успехов'],
    ['Алесечка Костюченко', '17 декабря 2024', 'Самые нежные, вкусные и красивые десерты в моей жизни. При этом они не слишком сладкие и довольно лёгкие. Рекомендую'],
    ['Юля Лемберская', '18 декабря 2024', 'Наивкуснейший тортик я получила на день рождения от Юли. Очень красивый торт! Уникальная начинка, утончённый вкус! Всем очень понравилось'],
    ['Григорий', '18 декабря 2024', 'Юлия лучшая в своём деле. Вкуснейшие торты, пирожные и подарочные конфеты, ел все её кулинарные изыски. А феерическое оформление тортов может увидеть каждый, это отдельный вид искусства. Очень ответственная и крутая.']
  ];
  $('#rgrid').innerHTML = R.map(r => `<article class="rv"><p>${esc(r[2])}</p><footer><b>${esc(r[0])}</b>, ${r[1]}</footer></article>`).join('');

  /* phone mask */
  const ph = $('#fPhone');
  ph.addEventListener('input', () => {
    let d = ph.value.replace(/\D/g, ''); if (!d) { ph.value = ''; return; }
    if (d[0] === '8') d = '7' + d.slice(1); if (d[0] !== '7') d = '7' + d; d = d.slice(0, 11);
    const p = [d.slice(1, 4), d.slice(4, 7), d.slice(7, 9), d.slice(9, 11)];
    ph.value = '+7' + (p[0] ? ` (${p[0]}` : '') + (p[0].length === 3 ? ')' : '') + (p[1] ? ` ${p[1]}` : '') + (p[2] ? `-${p[2]}` : '') + (p[3] ? `-${p[3]}` : '');
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
    const date = f.date.value ? new Date(f.date.value + 'T12:00').toLocaleDateString('ru-RU', {day: 'numeric', month: 'long'}) : 'не указана';
    const details = ['Макет rakova-cakee', `Что: ${f.what.value}`, `Дата: ${date}`, `Связь: ${f.via.value}`].join(', ');
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

  /* one reveal pass for section content */
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); } }), {threshold: .08});
    $$('.sec-head,.tiers-stage,.taste,.about-pic,.steps-l,.rev-head').forEach(el => { el.classList.add('rvl'); io.observe(el); });
  }
})();
