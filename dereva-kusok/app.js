(() => {
  const D = window.DK, $ = s => document.querySelector(s);
  const rub = n => n.toLocaleString('ru-RU').replace(/ | /g, ' ') + ' ₽';
  const esc = s => String(s).replace(/[&<>"]/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'}[c]));
  const chName = Object.fromEntries(D.chapters.map(c => [c.id, c.name]));
  /* priced first, keep the shop order inside */
  D.items.forEach((x, i) => x.o = i);
  const TOP = ['n33', 'n9', 'n60', 'n149', 'n28', 'n68', 'n8', 'n90', 'n210', 'n36', 'n5', 'n74'];
  const rank = x => { const t = TOP.indexOf(x.id); return t < 0 ? 99 : t; };
  D.items.sort((a, b) => (rank(a) - rank(b)) || (!a.price - !b.price) || a.o - b.o);

  const WOODS = [
    {id: 'pine', name: 'Сосна', tone: 'медовая, с сучками', c: '#E0B274', d: '#9A6A33', seed: 4, g: ['fractalNoise', '0.35 0.004', 3, -4, 2.3, .5], hard: 2, price: 2,
      txt: 'Тёплая и лёгкая, под маслом становится медовой, сучки дают живой рисунок. Самый доступный массив.',
      good: 'шкафы, прихожие, обувницы, детские кровати, дачная мебель'},
    {id: 'larch', name: 'Листвен\u00adница', tone: 'рыжеватая, смолистая', c: '#CC8C58', d: '#8A4E26', seed: 9, g: ['fractalNoise', '0.5 0.006', 3, -4, 2.3, .55], hard: 3, price: 3,
      txt: 'Смолистая и плотная, не боится влаги и перепадов температуры. Её берём туда, где мокро или холодно.',
      good: 'ванные и санузлы, подоконники, столешницы, крыльца и террасы'},
    {id: 'oak', name: 'Дуб', tone: 'золотистый, с крупным рисунком', c: '#B98A55', d: '#6E4A26', seed: 2, g: ['turbulence', '0.12 0.003', 3, -2.2, 1.2, .6], hard: 4, price: 5,
      txt: 'Тяжёлый, твёрдый, с выразительными волокнами. Под маслом темнеет до мёда, под морилкой уходит в «антик».',
      good: 'обеденные столы, лестницы, библиотеки, комоды, подоконники'},
    {id: 'beech', name: 'Бук', tone: 'светлый, ровный', c: '#DDB08A', d: '#A06E4A', seed: 7, g: ['fractalNoise', '0.9 0.01', 2, -5, 2.8, .4], hard: 4, price: 4,
      txt: 'Плотный и однородный, почти без сучков, с мелким рисунком и розоватым тоном. Держит нагрузку.',
      good: 'ножки и опоры столов, каркасы, детская мебель'},
    {id: 'mdf', name: 'МДФ, эмаль', tone: 'любой цвет по каталогу', c: '#6F8A86', d: '#566E6A', seed: 0, hard: 3, price: 3, flat: true,
      txt: 'Ровный цвет без рисунка дерева: от белого до глубокого синего и зелёного. Часто сочетаем с массивом в столешнице.',
      good: 'фасады кухонь и шкафов, современные интерьеры, замена старых фасадов'}
  ];
  const wc = Object.fromEntries(WOODS.map(w => [w.id, w]));
  const grain = w => w.flat
    ? `<svg viewBox="0 0 120 340" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="gm" x1="0" x2="1"><stop offset="0" stop-color="#7E9A95"/><stop offset=".5" stop-color="${w.c}"/><stop offset="1" stop-color="${w.d}"/></linearGradient></defs><rect width="120" height="340" fill="url(#gm)"/><rect x="12" y="14" width="96" height="312" rx="3" fill="none" stroke="#fff" stroke-opacity=".18" stroke-width="2"/></svg>`
    : `<svg viewBox="0 0 120 340" preserveAspectRatio="none" aria-hidden="true"><filter id="g${w.id}" x="0" y="0" width="100%" height="100%"><feTurbulence type="${w.g[0]}" baseFrequency="${w.g[1]}" numOctaves="${w.g[2]}" seed="${w.seed}"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 ${w.g[3]} ${w.g[4]}"/></filter><rect width="120" height="340" fill="${w.c}"/><rect width="120" height="340" fill="${w.d}" filter="url(#g${w.id})" opacity="${w.g[5]}"/></svg>`;

  /* catalog */
  const tabs = $('#tabs'), grid = $('#grid'), more = $('#more'), wf = $('#woodFilter');
  let cur = 'all', wood = null, shown = 12;
  tabs.innerHTML = `<button class="tab on" data-ch="all" role="tab" aria-selected="true">Все <small>${D.items.length}</small></button>` +
    D.chapters.map(c => `<button class="tab" data-ch="${c.id}" role="tab" aria-selected="false">${c.name} <small>${c.count}</small></button>`).join('');
  const list = () => D.items.filter(x => (cur === 'all' || x.ch === cur) && (!wood || x.w.includes(wood)));
  const tags = x => x.w.length ? `<div class="wtags">${x.w.slice(0, 2).map(k => `<span class="wtag" style="--c:${wc[k].c}">${k === 'mdf' ? 'эмаль' : wc[k].name.replace('\u00ad', '').toLowerCase()}</span>`).join('')}</div>` : '';
  function render() {
    const l = list();
    grid.innerHTML = l.slice(0, shown).map(x => `<article class="card" data-id="${x.id}" tabindex="0" role="button" aria-label="${esc(x.name)}">
      <div class="ph"><img src="${x.photos[0]}" alt="${esc(x.name)}" loading="lazy" width="600" height="750">${x.photos.length > 1 ? `<span class="n-ph">${x.photos.length} фото</span>` : ''}</div>
      <div class="bd"><h3>${esc(x.name)}</h3>${tags(x)}
      ${x.price ? `<p class="pr">${rub(x.price)}</p>` : '<p class="pr ask">Цена по вашим размерам</p>'}</div></article>`).join('');
    more.hidden = l.length <= shown;
    more.textContent = `Показать ещё (${l.length - shown})`;
    wf.hidden = !wood;
    if (wood) wf.innerHTML = `Показаны работы, где есть ${wood === 'mdf' ? 'МДФ или эмаль' : wc[wood].name.replace('\u00ad', '').toLowerCase()}: ${l.length}<button type="button" id="wfX">Показать все</button>`;
  }
  function setTab(id) {
    cur = id; shown = 12;
    tabs.querySelectorAll('.tab').forEach(t => { t.classList.toggle('on', t.dataset.ch === id); t.setAttribute('aria-selected', t.dataset.ch === id); });
    render();
  }
  tabs.addEventListener('click', e => { const t = e.target.closest('.tab'); if (t) setTab(t.dataset.ch); });
  wf.addEventListener('click', e => { if (e.target.id === 'wfX') { wood = null; shown = 12; render(); } });
  more.addEventListener('click', () => { shown += 12; render(); });
  grid.addEventListener('click', e => { const c = e.target.closest('.card'); if (c) openItem(c.dataset.id); });
  grid.addEventListener('keydown', e => { const c = e.target.closest('.card'); if (c && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openItem(c.dataset.id); } });
  render();

  /* woods */
  const samples = $('#samples'), card = $('#woodCard');
  samples.innerHTML = WOODS.map(w => `<button class="smp" role="tab" aria-selected="false" data-w="${w.id}"><span class="blk">${grain(w)}</span><b>${w.name}</b><small>${w.tone}</small></button>`).join('');
  const bars = n => `<i>${[1, 2, 3, 4, 5].map(k => `<s class="${k <= n ? 'f' : ''}"></s>`).join('')}</i>`;
  function pickWood(id) {
    const w = wc[id], works = D.items.filter(x => x.w.includes(id));
    samples.querySelectorAll('.smp').forEach(b => b.setAttribute('aria-selected', b.dataset.w === id));
    card.innerHTML = `<h3>${w.name}</h3><p>${w.txt}</p>
      <div class="meter"><span>Твёрдость</span>${bars(w.hard)}<span>Цена материала</span>${bars(w.price)}</div>
      <p class="good"><b>Что из неё делаем:</b> ${w.good}.</p>
      ${works.length ? `<div class="wthumbs">${works.slice(0, 4).map(x => `<button data-id="${x.id}" aria-label="${esc(x.name)}"><img src="${x.photos[0]}" alt="" loading="lazy"></button>`).join('')}</div>
      <button class="btn btn-oil" data-wood="${id}">Все работы: ${works.length}</button>` : ''}`;
  }
  samples.addEventListener('click', e => { const b = e.target.closest('.smp'); if (b) pickWood(b.dataset.w); });
  card.addEventListener('click', e => {
    const t = e.target.closest('[data-id]'); if (t) return openItem(t.dataset.id);
    const b = e.target.closest('[data-wood]');
    if (b) { wood = b.dataset.wood; cur = 'all'; setTab('all'); $('#catalog').scrollIntoView({behavior: 'smooth'}); }
  });
  pickWood('oak');

  /* dialog */
  const dlg = $('#dlg'), dIn = $('#dlgIn');
  function openItem(id) {
    const x = D.items.find(i => i.id === id); if (!x) return;
    dIn.innerHTML = `<div class="gal"><img id="dMain" src="${x.photos[0]}" alt="${esc(x.name)}">
      ${x.photos.length > 1 ? `<div class="thumbs">${x.photos.map((p, k) => `<button class="${k ? '' : 'on'}" data-src="${p}" aria-label="Фото ${k + 1}"><img src="${p}" alt=""></button>`).join('')}</div>` : ''}</div>
      <div><span class="d-ch">${chName[x.ch]}</span><h3>${esc(x.name)}</h3>
      ${x.price ? `<p class="d-price">${rub(x.price)}</p><p class="d-note">Цена за показанное исполнение. Ваш вариант посчитаем по размерам и материалам.</p>` : `<p class="d-price">Цена по вашим размерам</p><p class="d-note">Посчитаем после разговора и замера, это бесплатно.</p>`}
      <p class="d-desc">${esc(x.desc)}</p>
      <div class="d-btns"><a class="btn btn-oil" href="#order" data-pick="${esc(x.name)}">Хочу похожее</a><a class="btn btn-ghost" href="https://wa.me/79119770090?text=${encodeURIComponent('Здравствуйте! Интересует работа из каталога: ' + x.name)}" target="_blank" rel="noopener">Спросить в WhatsApp</a></div></div>`;
    dlg.showModal();
  }
  dIn.addEventListener('click', e => {
    const t = e.target.closest('.thumbs button');
    if (t) { $('#dMain').src = t.dataset.src; dIn.querySelectorAll('.thumbs button').forEach(b => b.classList.toggle('on', b === t)); }
  });
  $('#dlgX').onclick = () => dlg.close();
  dlg.addEventListener('click', e => { if (e.target === dlg) dlg.close(); });

  /* picks into the form */
  const sel = $('#fWhat'), setWrap = $('#fSetWrap');
  const syncSet = () => setWrap.hidden = sel.value !== 'Работа из каталога';
  sel.addEventListener('change', syncSet); syncSet();
  document.addEventListener('click', e => {
    const a = e.target.closest('[data-pick]'); if (!a) return;
    sel.value = 'Работа из каталога'; $('#fSet').value = a.dataset.pick; syncSet();
    if (dlg.open) dlg.close();
  });

  /* reviews */
  const revs = $('#revs'), moreRev = $('#moreRev');
  D.reviews.sort((a, b) => (b.t.length > 140) - (a.t.length > 140));
  let rShown = 6;
  function renderRev() {
    revs.innerHTML = D.reviews.slice(0, rShown).map(r => `<article class="rev ${r.t.length > 330 ? 'cut' : ''}">
      <h3><i>${esc(r.n.trim()[0])}</i>${esc(r.n)}</h3><p>${esc(r.t)}</p>
      ${r.t.length > 330 ? '<button class="rd">Читать полностью</button>' : ''}</article>`).join('');
    moreRev.hidden = rShown >= D.reviews.length;
    moreRev.textContent = `Ещё отзывы (${D.reviews.length - rShown})`;
  }
  revs.addEventListener('click', e => { const b = e.target.closest('.rd'); if (b) { b.parentNode.classList.remove('cut'); b.remove(); } });
  moreRev.onclick = () => { rShown += 9; renderRev(); };
  renderRev();

  /* menu */
  const menu = $('#menu'), burger = $('#burger');
  burger.onclick = () => { const o = menu.classList.toggle('open'); burger.setAttribute('aria-expanded', o); };
  menu.addEventListener('click', e => { if (e.target.tagName === 'A') menu.classList.remove('open'); });

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
    const details = ['Макет dereva-kusok', `Что: ${f.what.value}`, f.what.value === 'Работа из каталога' && f.set.value.trim() && `Работа: ${f.set.value.trim()}`, `Связь: ${f.via.value}`].filter(Boolean).join(', ');
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
